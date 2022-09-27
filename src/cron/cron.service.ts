import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LeaveBenefit } from 'src/modules/benefit-management/leave-benefit/leave-benefit.entity';
import { UserLeaveBenefitRepository } from 'src/modules/benefit-management/user-leave-benefit/user-leave-benefit.repository';
import { UserRepository } from 'src/modules/user-management/user/user.repository';

@Injectable()
export class CronService {
  constructor(
    private readonly userLeaveBenefitRepository: UserLeaveBenefitRepository,
    private readonly userRepository: UserRepository,
  ) {}

  @Cron('0 0 1 1 *')
  async updateUserBenefit() {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndMapOne(
        'user.benefit',
        LeaveBenefit,
        'benefit',
        'user.leaveBenefitCode = benefit.code',
      )
      .where('user.leaveBenefitCode IS NOT NULL');

    const result = await query.getMany();

    const userBenefits = this.userLeaveBenefitRepository.create(
      result.map((item) => {
        return {
          userCode: item.code,
          remainingDay: item['benefit'].standardLeave,
          standardLeave: item['benefit'].standardLeave,
          year: new Date().getUTCFullYear(),
        };
      }),
    );

    await this.userLeaveBenefitRepository.save(userBenefits);
  }
}
