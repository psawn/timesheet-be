import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './user.controller';
import { User } from './user.entity';
import { UsersRepository } from './user.repository';
import { UsersService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersRepository, UsersService],
  exports: [],
})
export class UserModule {}
