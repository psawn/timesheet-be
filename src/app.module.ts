import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/typeorm.config';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), SharedModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
