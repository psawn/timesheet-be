import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager } from 'typeorm';
import { GeneralWorktime } from './general-worktime.entity';

@Injectable()
export class GenWorktimeRepository extends TypeORMRepository<GeneralWorktime> {
  constructor(manager: EntityManager) {
    super(GeneralWorktime, manager);
  }

  async getWorktime(worktimeCode: string) {
    return await this.find({
      where: { worktimeCode, isDayOff: true },
      select: ['dayOfWeek'],
    });
  }
}
