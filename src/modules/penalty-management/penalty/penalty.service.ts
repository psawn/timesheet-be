import { Injectable } from '@nestjs/common';
import { RoleCodeEnum } from 'src/common/constants/role.enum';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { PenaltyTypeRepository } from '../penalty-type/penalty-type.repository';
import { FilterPenaltiesDto, ScanDto } from './dto';
import { PenaltyRepository } from './penalty.repository';

@Injectable()
export class PenaltyService {
  constructor(
    private readonly penaltyRepository: PenaltyRepository,
    private readonly penaltyTypeRepository: PenaltyTypeRepository,
  ) {}

  async getAll(user: AuthUserDto, filterPenaltiesDto: FilterPenaltiesDto) {
    const roleCondition = await this.getPenaltiesConditionByRole(user);

    return await this.penaltyRepository.getAll(
      roleCondition,
      filterPenaltiesDto,
    );
  }

  async scan(scanDto: ScanDto) {
    const { penaltyGroup, startDate, endDate } = scanDto;

    const penaltyType = await this.penaltyTypeRepository.findOne({
      where: { group: penaltyGroup, isActive: true },
    });

    if (!penaltyType) {
      return;
    }

    console.log(penaltyType);
  }

  private async getPenaltiesConditionByRole(user: AuthUserDto) {
    let permissions = [];
    const params = {};

    permissions.push('penalty.userCode = :userCode');
    params['userCode'] = user.code;

    if (user.roles.includes(RoleCodeEnum.ADMIN)) {
      permissions = null;
    }

    const roleCondition = permissions
      ? {
          condtions: permissions.join(' OR '),
          params,
        }
      : null;

    return roleCondition;
  }
}
