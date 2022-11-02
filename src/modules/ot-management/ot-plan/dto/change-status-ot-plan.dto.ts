import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { StatusRequestEnum } from 'src/common/constants/status-request.enum';

export class ChangeStatusOtPlanDto {
  @ArrayNotEmpty()
  @IsArray()
  @IsUUID('all', { each: true })
  @ApiProperty({
    description: 'Ot plan ids',
    example: [
      '6f0023d8-6429-4593-a474-d27bb06ab972',
      '6beec578-2bb4-4e5d-b550-cdd6ca2046f3',
    ],
  })
  otPlanIds: string[];

  @IsNotEmpty()
  @IsIn([StatusRequestEnum.APPROVED, StatusRequestEnum.REJECTED])
  @ApiProperty({
    description: 'Status',
    example: StatusRequestEnum.APPROVED,
  })
  status: string;
}
