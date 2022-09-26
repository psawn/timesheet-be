import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneralWorktimeSetting } from './general-worktime-setting.entity';
import { GenWorktimeStgService } from './genaral-worktime-setting.service';
import { GenWorktimeStgRepository } from './general-worktime-setting.repository';
import { GenWorktimeStgController } from './general-worktime-setting.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GeneralWorktimeSetting])],
  controllers: [GenWorktimeStgController],
  providers: [GenWorktimeStgService, GenWorktimeStgRepository],
  exports: [],
})
export class GenWorktimeStgModule {}
