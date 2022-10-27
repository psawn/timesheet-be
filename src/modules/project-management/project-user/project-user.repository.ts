import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager, In } from 'typeorm';
import { Project } from '../project/project.entity';
import { ProjectUser } from './project-user.entity';

@Injectable()
export class ProjectUserRepository extends TypeORMRepository<ProjectUser> {
  constructor(manager: EntityManager) {
    super(ProjectUser, manager);
  }

  async addUsers(projectCode: string, userCodes: string[]) {
    const data = this.create(
      userCodes.map((userCode) => {
        return {
          projectCode,
          userCode,
        };
      }),
    );

    await this.insert(data);
  }

  async deleteUsers(projectCode: string, userCodes: string[]) {
    await this.update(
      { projectCode, userCode: In(userCodes) },
      { isActive: false },
    );
  }
}
