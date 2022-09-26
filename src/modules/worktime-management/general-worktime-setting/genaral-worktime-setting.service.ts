import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { EntityManager, Not } from 'typeorm';
import { GeneralWorktime } from '../general-worktime/general-worktime.entity';
import {
  CreateGenWorktimeStgDto,
  FilterGenWorktimeStgDto,
  UpdateGenWorktimeStgDto,
} from './dto';
import { GenWorktimeStgRepository } from './general-worktime-setting.repository';
import { GeneralWorktimeSetting } from './general-worktime-setting.entity';

@Injectable()
export class GenWorktimeStgService {
  constructor(
    private readonly genWorktimeStgRepository: GenWorktimeStgRepository,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async createWorktime(
    user: AuthUserDto,
    createGenWorktimeStgDto: CreateGenWorktimeStgDto,
  ) {
    const { code, name, worktimes } = createGenWorktimeStgDto;

    const existWorktimeStg = await this.genWorktimeStgRepository.findOne({
      where: { code },
    });

    if (existWorktimeStg) {
      throw new BadRequestException('Worktime setting already exists');
    }

    return await this.entityManager.transaction(async (transaction) => {
      const worktimeStg = transaction.create(GeneralWorktimeSetting, {
        code,
        name,
        createdBy: user.code,
      });

      await worktimeStg.save();

      if (worktimes.length) {
        const worktimeData = transaction.create(
          GeneralWorktime,
          worktimes.map((worktime) => {
            return {
              ...worktime,
              workTimeCode: worktimeStg.code,
            };
          }),
        );

        await transaction.save(GeneralWorktime, worktimeData);
      }

      return worktimeStg;
    });
  }

  async updateWorktime(
    user: AuthUserDto,
    code: string,
    updateGenWorktimeStgDto: UpdateGenWorktimeStgDto,
  ) {
    const { name, isActive, isDefault, worktimes } = updateGenWorktimeStgDto;

    const existWorktimeStg = await this.genWorktimeStgRepository.findOne({
      where: { code },
    });

    if (!existWorktimeStg) {
      throw new BadRequestException('Worktime setting already exists');
    }

    return await this.entityManager.transaction(async (transaction) => {
      transaction.update(
        GeneralWorktimeSetting,
        { code },
        { name, isActive, isDefault, updatedBy: user.code },
      );

      if (isDefault) {
        transaction.update(
          GeneralWorktimeSetting,
          { code: Not(code) },
          { isDefault: false, updatedBy: user.code },
        );
      }

      if (worktimes && worktimes.length) {
        await transaction.delete(GeneralWorktime, { workTimeCode: code });

        const worktimeData = transaction.create(
          GeneralWorktime,
          worktimes.map((worktime) => {
            return {
              ...worktime,
              workTimeCode: code,
            };
          }),
        );

        await transaction.save(GeneralWorktime, worktimeData);
      }
    });
  }

  async getAll(filterGenWorktimeStgDto: FilterGenWorktimeStgDto) {
    return await this.genWorktimeStgRepository.getAll(filterGenWorktimeStgDto);
  }

  async getAllActive(filterGenWorktimeStgDto: FilterGenWorktimeStgDto) {
    const condition = { isActive: true };
    return await this.genWorktimeStgRepository.getAll(
      filterGenWorktimeStgDto,
      condition,
    );
  }
}
