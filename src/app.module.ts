import { Module } from '@nestjs/common';
import { DataBaseModule } from './database/database.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { typeOrmConfig } from './database/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { DepartmentModule } from './modules/department/department.module';
import { PolicyApproverModule } from './modules/policy-management/policy-approver/policy-approver.module';
import { PolicyModule } from './modules/policy-management/policy/policy.module';
import { ProjectModule } from './modules/project-management/project/project.module';
import { RequestModule } from './modules/request-management/request/request.module';
import { UserModule } from './modules/user-management/user/user.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    // TypeOrmModule.forRoot(typeOrmConfig),
    DataBaseModule,
    SharedModule,
    AuthModule,
    UserModule,
    DepartmentModule,
    ProjectModule,
    PolicyModule,
    PolicyApproverModule,
    RequestModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
