import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { LeaveBenefitService } from './leave-benefit.service';

@Auth()
@ApiTags('LeaveBenefit')
@Controller('leave-benefits')
export class LeaveBenefitController {
  constructor(private readonly leaveBenefitService: LeaveBenefitService) {}
}
