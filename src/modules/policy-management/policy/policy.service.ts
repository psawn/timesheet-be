import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { getApprover } from 'src/helpers/get-approver.helper';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { UserRepository } from 'src/modules/user-management/user/user.repository';
import { PolicyTypeRepository } from '../policy-type/policy-type.repository';
import { CreatePolicyDto, FilterPoliciesDto, UpdatePolicyDto } from './dto';
import { PolicyRepository } from './policy.repository';

@Injectable()
export class PolicyService {
  constructor(
    private readonly policyRepository: PolicyRepository,
    private readonly policyTypeRepository: PolicyTypeRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getAll(filterPoliciesDto: FilterPoliciesDto) {
    return await this.policyRepository.getAll(filterPoliciesDto);
  }

  async get(code: string) {
    return await this.policyRepository.get(code);
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

  async updatePolicy(
    user: AuthUserDto,
    code: string,
    updatePolicyDto: UpdatePolicyDto,
  ) {
    const existPolicy = await this.policyRepository.findOne({
      where: { code },
    });

    if (!existPolicy) {
      throw new NotFoundException('Policy not found');
    }

    if (updatePolicyDto.typeCode) {
      const existPolicyType = await this.policyTypeRepository.findOne({
        where: { code: updatePolicyDto.typeCode },
      });

      if (!existPolicyType) {
        throw new NotFoundException('Policy type not found');
      }
    }

    await this.policyRepository.updatePolicy(user, code, updatePolicyDto);
  }

  async getApprover(user: AuthUserDto, code: string) {
    const policy = await this.policyRepository.getPolicyWithApprover(
      code,
      user.managerCode,
      user.department,
    );
    return getApprover(policy);
  }
}
