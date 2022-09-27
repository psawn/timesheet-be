import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { CreateLeaveBenefitDto } from './dto';
import { LeaveBenefitRepository } from './leave-benefit.repository';

@Injectable()
export class LeaveBenefitService {
  constructor(
    private readonly leaveBenefitRepository: LeaveBenefitRepository,
  ) {}

  async createBenefit(
    user: AuthUserDto,
    createLeaveBenefitDto: CreateLeaveBenefitDto,
  ) {
    const { code } = createLeaveBenefitDto;

    const existBenefit = await this.leaveBenefitRepository.findOne({
      where: { code },
    });

    if (existBenefit) {
      throw new BadRequestException('Benefit already exists');
    }

    const benefit = this.leaveBenefitRepository.create({
      ...createLeaveBenefitDto,
      createdBy: user.code,
    });

    return await benefit.save();
  }
}
