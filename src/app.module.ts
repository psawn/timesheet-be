import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { DepartmentModule } from './modules/department/department.module';
import { UserModule } from './modules/user-management/user/user.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    SharedModule,
    AuthModule,
    UserModule,
    DepartmentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
