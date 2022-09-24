import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/modules/user-management/user/user.repository';
import { PolicyTypeRepository } from '../policy-type/policy-type.repository';
import { PolicyController } from './policy.controller';
import { Policy } from './policy.entity';
import { PolicyRepository } from './policy.repository';
import { PolicyService } from './policy.service';

@Module({
  imports: [TypeOrmModule.forFeature([Policy])],
  controllers: [PolicyController],
  providers: [
    PolicyRepository,
    PolicyService,
    PolicyTypeRepository,
    UserRepository,
  ],
  exports: [],
})
export class PolicyModule {}
