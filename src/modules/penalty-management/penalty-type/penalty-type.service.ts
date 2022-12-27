import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import {
  CreatePenaltyTypeDto,
  FilterPenaltyTypeDto,
  UpdatePenaltyTypeDto,
} from './dto';
import { PenaltyTypeRepository } from './penalty-type.repository';

@Injectable()
export class PenaltyTypeService {
  constructor(private readonly penaltyTypeRepository: PenaltyTypeRepository) {}

  async getAll(filterPenaltyTypeDto: FilterPenaltyTypeDto) {
    return await this.penaltyTypeRepository.findAll(filterPenaltyTypeDto);
  }

  async createPenaltyType(
    user: AuthUserDto,
    createPenaltyTypeDto: CreatePenaltyTypeDto,
  ) {
    const existPolicyType = await this.penaltyTypeRepository.findOne({
      where: { code: createPenaltyTypeDto.code },
    });

    if (existPolicyType) {
      throw new BadRequestException('Penalty type already exists');
    }

    return await this.penaltyTypeRepository.createPenaltyType(
      user,
      createPenaltyTypeDto,
    );
  }

  async updatePenaltyType(
    user: AuthUserDto,
    code: string,
    updatePenaltyTypeDto: UpdatePenaltyTypeDto,
  ) {
    const existPolicyType = await this.penaltyTypeRepository.findOne({
      where: { code },
    });

    if (!existPolicyType) {
      throw new NotFoundException('Penalty type is not found');
    }

    return await this.penaltyTypeRepository.updatePenaltyType(
      user,
      code,
      updatePenaltyTypeDto,
    );
  }
}
