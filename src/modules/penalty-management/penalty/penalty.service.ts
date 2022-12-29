import { Injectable } from '@nestjs/common';
import { PenaltyGroupEnum } from 'src/common/constants/penalty-group.enum';
import { RoleCodeEnum } from 'src/common/constants/role.enum';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { TimecheckRepository } from 'src/modules/timecheck/timecheck.repository';
import { TimelogRepository } from 'src/modules/timelog/timelog.repository';
import { Between } from 'typeorm';
import { PenaltyTypeRepository } from '../penalty-type/penalty-type.repository';
import { FilterPenaltiesDto, ScanDto } from './dto';
import { PenaltyRepository } from './penalty.repository';

@Injectable()
export class PenaltyService {
  constructor(
    private readonly penaltyRepository: PenaltyRepository,
    private readonly penaltyTypeRepository: PenaltyTypeRepository,
    private readonly timecheckRepository: TimecheckRepository,
    private readonly timelogRepository: TimelogRepository,
  ) {}

  async getAll(user: AuthUserDto, filterPenaltiesDto: FilterPenaltiesDto) {
    const roleCondition = await this.getPenaltiesConditionByRole(user);

    return await this.penaltyRepository.getAll(
      roleCondition,
      filterPenaltiesDto,
    );
  }

  async scan(scanDto: ScanDto) {
    const { penaltyGroup, startDate, endDate } = scanDto;

    const penaltyType = await this.penaltyTypeRepository.findOne({
      where: { group: penaltyGroup, isActive: true },
    });

    if (!penaltyType) {
      return;
    }

    if (penaltyGroup == PenaltyGroupEnum.MISSING_TIME_CHECK) {
      await this.handleScanTimecheck(startDate, endDate);
    }

    if (penaltyGroup == PenaltyGroupEnum.MISSING_LOG_WORK) {
      //
    }

    console.log('penaltyType', penaltyType);

    console.log(penaltyType);
  }

  private async getPenaltiesConditionByRole(user: AuthUserDto) {
    let permissions = [];
    const params = {};

    permissions.push('penalty.userCode = :userCode');
    params['userCode'] = user.code;

    if (user.roles.includes(RoleCodeEnum.ADMIN)) {
      permissions = null;
    }

    const roleCondition = permissions
      ? {
          condtions: permissions.join(' OR '),
          params,
        }
      : null;

    return roleCondition;
  }

  async handleScanTimecheck(startDate: Date, endDate: Date) {
    const timechecks = await this.timecheckRepository.find({
      where: {
        checkDate: Between(startDate, endDate),
      },
    });

    for (const timecheck of timechecks) {
      if (timecheck.isDayOff) {
        continue;
      }

      if (timecheck.isLeaveBenefit) {
        continue;
      }

      if (timecheck.missCheckIn || timecheck.missCheckOut) {
        console.log(timecheck);
      }
    }
  }

  async handleScanTimelog() {
    const timelogs = await this.timelogRepository.find();
  }
}
