import { Injectable, NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectEntityManager } from '@nestjs/typeorm';
import { get } from 'lodash';
import * as moment from 'moment';
import { calculateDiffMin } from 'src/helpers/calculate-diff-minute.helper';
import { EntityManager, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { HolidayBenefitRepository } from '../benefit-management/holiday-benefit/holiday-benefit.repository';
import { RemoteWorkingRepository } from '../request-management/remote-working/remote-working.repository';
import { UserRepository } from '../user-management/user/user.repository';
import { GenWorktimeRepository } from '../worktime-management/general-worktime/general-worktime.repository';
import { CheckInDto, FilterTimecheckDto } from './dto';
import { ExcelTimecheckDto } from './dto/excel-timecheck.dto';
import { Timecheck } from './timecheck.entity';
import { TimecheckRepository } from './timecheck.repository';
import * as excel from 'exceljs';
import { toDay } from 'src/helpers/to-date.helper';

@Injectable()
export class TimecheckService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly timecheckRepository: TimecheckRepository,
    private readonly userRepository: UserRepository,
    private readonly remoteWorkingRepository: RemoteWorkingRepository,
    private readonly genWorktimeRepository: GenWorktimeRepository,
    private readonly holidayBenefitRepository: HolidayBenefitRepository,
  ) {}

  async getAll(filterTimecheckDto: FilterTimecheckDto) {
    return await this.userRepository.getTimechecks(filterTimecheckDto);
  }

  async getMyTimecheck(
    user: AuthUserDto,
    filterTimecheckDto: FilterTimecheckDto,
  ) {
    const conditions = { code: user.code };
    return await this.userRepository.getTimechecks(
      filterTimecheckDto,
      conditions,
    );
  }

  async checkIn(user: AuthUserDto, checkInDto: CheckInDto) {
    const current = new Date();
    const checkDate = new Date(
      moment(current)
        .subtract(checkInDto.timezone, 'hours')
        .format('YYYY-MM-DD'),
    );
    const checktime = moment(current)
      .subtract(checkInDto.timezone, 'hours')
      .format('HH:mm:ss');

    const canRemoteCheckIn = await this.remoteWorkingRepository.count({
      where: {
        startDate: LessThanOrEqual(checkDate),
        endDate: MoreThanOrEqual(checkDate),
        userCode: user.code,
      },
    });

    if (!canRemoteCheckIn) {
      throw new BadRequestException(`Don't have permission to check in`);
    }

    const worktime = await this.userRepository.getUserWorktime(
      user.code,
      checkDate,
    );

    const worktimCheckIn = get(
      worktime,
      'worktimeStg.worktime.checkInTime',
      null,
    );
    const worktimeCheckOut = get(
      worktime,
      'worktimeStg.worktime.checkOutTime',
      null,
    );
    const isDayOff = get(worktime, 'worktimeStg.worktime.isDayOff', false);

    if (!worktimCheckIn || !worktimeCheckOut) {
      throw new NotFoundException('Worktime not found');
    }

    return await this.entityManager.transaction(async (transaction) => {
      const existTimecheck = await transaction.findOne(Timecheck, {
        where: { userCode: user.code, checkDate },
      });

      if (existTimecheck) {
        if (existTimecheck.checkInTime) {
          const diffChecktimeInMin = calculateDiffMin(
            worktimeCheckOut,
            checktime,
          );
          const worktime =
            calculateDiffMin(checktime, existTimecheck.checkInTime) / 60;

          existTimecheck.checkOutTime = checktime;
          existTimecheck.missCheckOutMin = diffChecktimeInMin;
          existTimecheck.missCheckOut = diffChecktimeInMin > 0 ? true : false;
          existTimecheck.workHour = +worktime.toFixed(1);
        } else {
          const diffChecktimeInMin = calculateDiffMin(
            checktime,
            worktimCheckIn,
          );

          existTimecheck.checkInTime = checktime;
          existTimecheck.missCheckInMin = diffChecktimeInMin;
          existTimecheck.missCheckIn = diffChecktimeInMin > 0 ? true : false;
        }

        existTimecheck.timezone = checkInDto.timezone;
        existTimecheck.isDayOff = isDayOff;
        return await transaction.save(Timecheck, existTimecheck);
      } else {
        const timecheck = transaction.create(Timecheck, {
          userCode: user.code,
          username: user.name,
          timezone: checkInDto.timezone,
          checkDate,
          checkInTime: checktime,
          isDayOff,
        });

        return await transaction.save(Timecheck, timecheck);
      }
    });
  }

  async getTotalWorkingDays(excelTimecheckDto: ExcelTimecheckDto) {
    const dayOffs = await this.genWorktimeRepository.getWorktime(
      excelTimecheckDto.worktimeCode,
    );

    const dayOffArr = dayOffs.map((dayOff) => {
      return dayOff.dayOfWeek;
    });

    const holidays = await this.holidayBenefitRepository.getHolidays(
      excelTimecheckDto.startDate,
      excelTimecheckDto.endDate,
    );

    const startDate = new Date(excelTimecheckDto.startDate);
    const endDate = new Date(excelTimecheckDto.endDate);

    let count = 0;
    const curDate = new Date(startDate.getTime());

    while (curDate <= endDate) {
      const dayOfWeek = curDate.getDay();

      if (!dayOffArr.includes(dayOfWeek)) {
        count++;
        holidays.map((holiday) => {
          const isHoliday = moment(curDate).isBetween(
            moment(holiday.startDate),
            moment(holiday.endDate),
            null,
            '[]',
          );

          if (isHoliday) {
            count--;
          }
        });
      }

      curDate.setDate(curDate.getDate() + 1);
    }

    return count;
  }

  async getDataExport(excelTimecheckDto: ExcelTimecheckDto) {
    const { worktimeCode, startDate, endDate } = excelTimecheckDto;
    const conditions = { worktimeCode };

    const filterTimecheckDto: FilterTimecheckDto = {
      startDate,
      endDate,
      getAll: true,
    };
    const totalWorkingDays = await this.getTotalWorkingDays(excelTimecheckDto);
    const { items } = await this.userRepository.getTimechecks(
      filterTimecheckDto,
      conditions,
    );

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('timecheck');
    const columns = [
      { header: 'User name', key: 'user', style: { numFmt: '@' } },
    ];
    const curDate = new Date(startDate);
    const toDate = new Date(endDate);
    const firstRow = { user: '' };

    while (curDate <= toDate) {
      const day = toDay(curDate);
      firstRow[`${curDate.getDate().toString()}`] = day;
      columns.push({
        header: curDate.getDate().toString(),
        key: curDate.getDate().toString(),
        style: { numFmt: '@' },
      });
      curDate.setDate(curDate.getDate() + 1);
    }

    columns.push(
      ...[
        {
          header: 'Working Days',
          key: 'workingDays',
          style: { numFmt: '@' },
        },
        {
          header: 'Total Working Days',
          key: 'totalWorkingDays',
          style: { numFmt: '@' },
        },
        {
          header: 'Working Hours',
          key: 'workingHours',
          style: { numFmt: '@' },
        },
        {
          header: 'Total Working Hours',
          key: 'totalWorkingHours',
          style: { numFmt: '@' },
        },
      ],
    );

    worksheet.columns = columns;
    worksheet.addRow(firstRow).commit();
    worksheet.mergeCells('A1:A2');
    worksheet.mergeCells('AG1:AG2');
    worksheet.mergeCells('AH1:AH2');
    worksheet.mergeCells('AI1:AI2');
    worksheet.mergeCells('AJ1:AJ2');

    let rowIndex = 1;
    for (rowIndex; rowIndex <= worksheet.rowCount; rowIndex++) {
      worksheet.getRow(rowIndex).alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };
    }

    items.map((item) => {
      const objRow = {
        user: item.name,
      };
      const timechecks = get(item, 'timechecks', []);
      let workingHours = 0;
      timechecks.map((timecheck) => {
        let worktime = 0;

        if (timecheck.isLeaveBenefit) {
          worktime = timecheck.leaveHour;
        } else {
          if (!timecheck.isDayOff) {
            worktime =
              timecheck.workHour >= process.env.DEFAULT_WORK_HOUR
                ? process.env.DEFAULT_WORK_HOUR
                : timecheck.workHour;
          }
        }

        workingHours += worktime;
        objRow[`${new Date(timecheck.checkDate).getDate()}`] = worktime;
      });
      objRow['workingDays'] = workingHours / +process.env.DEFAULT_WORK_HOUR;
      objRow['totalWorkingDays'] = totalWorkingDays;
      objRow['workingHours'] = workingHours;
      objRow['totalWorkingHours'] =
        totalWorkingDays * +process.env.DEFAULT_WORK_HOUR;
      worksheet.addRow(objRow).commit();
    });

    return workbook;
  }
}
