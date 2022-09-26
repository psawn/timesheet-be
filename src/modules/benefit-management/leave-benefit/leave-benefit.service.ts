import { Injectable } from '@nestjs/common';
import { LeaveBenefitRepository } from './leave-benefit.repository';

@Injectable()
export class LeaveBenefitService {
  constructor(
    private readonly leaveBenefitRepository: LeaveBenefitRepository,
  ) {}
}
