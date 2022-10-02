import { IsNotEmpty } from 'class-validator';

export class Test {
  @IsNotEmpty()
  worktimeCode: string;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  endDate: Date;
}
