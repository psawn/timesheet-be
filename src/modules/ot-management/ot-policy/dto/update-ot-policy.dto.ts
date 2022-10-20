import {
  IsOptional,
  IsNumber,
  IsString,
  Max,
  Min,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOtPolicyDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Name',
    example: 'OT Policy 1',
  })
  name: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  @ApiProperty({
    description: 'Ot working point',
    example: 1.5,
  })
  otWorkingPoint: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Is active',
    example: false,
  })
  isActive: boolean;
}
