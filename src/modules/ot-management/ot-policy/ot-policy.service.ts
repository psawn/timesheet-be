import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { CreateOtPolicyDto, FilterOtPolicyDto, UpdateOtPolicyDto } from './dto';
import { OtPolicyRepository } from './ot-policy.repository';

@Injectable()
export class OtPolicyService {
  constructor(private readonly otPolicyRepository: OtPolicyRepository) {}

  async getAll(filterOtPolicyDto: FilterOtPolicyDto) {
    return await this.otPolicyRepository.getAll(filterOtPolicyDto);
  }

  async createOtPolicy(
    user: AuthUserDto,
    createOtPolicyDto: CreateOtPolicyDto,
  ) {
    const { code } = createOtPolicyDto;

    const existOtPolicy = await this.otPolicyRepository.findOne({
      where: { code },
    });

    if (existOtPolicy) {
      throw new BadRequestException('Ot policy already exists');
    }

    const otPolicy = this.otPolicyRepository.create({
      ...createOtPolicyDto,
      createdBy: user.code,
    });

    return await this.otPolicyRepository.save(otPolicy);
  }

  async updateOtPolicy(
    user: AuthUserDto,
    code: string,
    updateOtPolicyDto: UpdateOtPolicyDto,
  ) {
    const existOtPolicy = await this.otPolicyRepository.findOne({
      where: { code },
    });

    if (!existOtPolicy) {
      throw new NotFoundException('Ot policy not found');
    }

    return await this.otPolicyRepository.update(
      { code },
      {
        ...updateOtPolicyDto,
        updatedBy: user.code,
      },
    );
  }
}
