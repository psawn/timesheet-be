import { Injectable, NotFoundException } from '@nestjs/common';
import { calculateBenefit } from 'src/helpers/calculate-benefit.helper';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { LeaveBenefit } from 'src/modules/benefit-management/leave-benefit/leave-benefit.entity';
import { LeaveBenefitRepository } from 'src/modules/benefit-management/leave-benefit/leave-benefit.repository';
import { UserLeaveBenefitRepository } from 'src/modules/benefit-management/user-leave-benefit/user-leave-benefit.repository';
import { FilterUsersDto, UpdateUserDto } from './dto';
import { UserRepository } from './user.repository';
import { GenWorktimeStgRepository } from 'src/modules/worktime-management/general-worktime-setting/general-worktime-setting.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly leaveBenefitRepository: LeaveBenefitRepository,
    private readonly userLeaveBenefitRepository: UserLeaveBenefitRepository,
    private readonly genWorktimeStgRepository: GenWorktimeStgRepository,
  ) {}

  async getAll(filterUsersDto: FilterUsersDto) {
    const users = await this.userRepository.getAll(filterUsersDto);

    if (!users) {
      throw new NotFoundException();
    }

    return users;
  }

  async findOneByConditions(conditions: any) {
    return await this.userRepository.findOneByConditions(conditions);
  }

  async update(user: AuthUserDto, code: string, updateUserDto: UpdateUserDto) {
    const { leaveBenefitCode, worktimeCode } = updateUserDto;
    const existUser = await this.userRepository.findOne({
      where: { code },
    });

    if (!existUser) {
      throw new NotFoundException('User not found');
    }

    const data = { ...updateUserDto, id: existUser.id, updatedBy: user.code };

    if (leaveBenefitCode) {
      const existBenefit = await this.leaveBenefitRepository.findOne({
        where: { code: leaveBenefitCode },
      });

      if (!existBenefit) {
        throw new NotFoundException('Benefit not found');
      }

      await this.updateUserBenefit(user.code, existBenefit);
    }

    if (worktimeCode) {
      const worktime = await this.genWorktimeStgRepository.findOne({
        where: { code: worktimeCode },
      });

      if (!worktime) {
        throw new NotFoundException('Worktime not found');
      }
    }

    return await this.userRepository.update(data);
  }

  async updateUserBenefit(userCode: string, benefit: LeaveBenefit) {
    const year = new Date().getUTCFullYear();
    const existUserBenefit = await this.userLeaveBenefitRepository.findOne({
      where: { userCode, year },
    });

    if (!existUserBenefit) {
      const userBenefit = this.userLeaveBenefitRepository.create({
        userCode,
        year,
        remainingDay: calculateBenefit(benefit.standardLeave),
        standardLeave: benefit.standardLeave,
      });

      return await userBenefit.save();
    }

    const differentDays =
      benefit.standardLeave - existUserBenefit.standardLeave;

    existUserBenefit.remainingDay =
      differentDays > 0
        ? existUserBenefit.remainingDay + differentDays
        : existUserBenefit.remainingDay;
    existUserBenefit.standardLeave = benefit.standardLeave;

    return await existUserBenefit.save();
  }
}
