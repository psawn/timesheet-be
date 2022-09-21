import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { PolicyTypeRepository } from '../policy-type/policy-type.repository';
import { CreatePolicyDto, FilterPoliciesDto } from './dto';
import { PolicyRepository } from './policy.repository';

@Injectable()
export class PolicyService {
  constructor(
    private readonly policyRepository: PolicyRepository,
    private readonly policyTypeRepository: PolicyTypeRepository,
  ) {}

  async getAll(filterPoliciesDto: FilterPoliciesDto) {
    return await this.policyRepository.getAll(filterPoliciesDto);
  }

  async createPolicy(user: AuthUserDto, createPolicyDto: CreatePolicyDto) {
    const existPolicy = await this.policyRepository.findOne({
      where: { code: createPolicyDto.code },
    });

    if (existPolicy) {
      throw new BadRequestException('Policy already exists');
    }

    const existPolicyType = await this.policyTypeRepository.findOne({
      where: { code: createPolicyDto.typeCode },
    });

    if (!existPolicyType) {
      throw new NotFoundException('Policy type not found');
    }

    return await this.policyRepository.createPolicy(user, createPolicyDto);
  }
}
