import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager } from 'typeorm';
import { UserRole } from './user-role.entity';

@Injectable()
export class UserRoleRepository extends TypeORMRepository<UserRole> {
  constructor(manager: EntityManager) {
    super(UserRole, manager);
  }
}
