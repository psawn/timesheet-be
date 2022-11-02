import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsIn, IsNotEmpty, IsUUID } from 'class-validator';
import { StatusRequestEnum } from 'src/common/constants/status-request.enum';

export class ChangeOtRequestStatus {
  @IsNotEmpty()
  @IsIn([StatusRequestEnum.APPROVED, StatusRequestEnum.REJECTED])
  @ApiProperty({
    description: 'Status',
    example: StatusRequestEnum.APPROVED,
  })
  status: string;

  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  @ApiProperty({
    description: 'Request ids',
    example: [
      '6f0023d8-6429-4593-a474-d27bb06ab972',
      '6beec578-2bb4-4e5d-b550-cdd6ca2046f3',
    ],
  })
  otRequestIds: string[];
}
