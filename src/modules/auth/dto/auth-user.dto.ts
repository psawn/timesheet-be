import { RoleCodeEnum } from 'src/common/constants/role.enum';

export class AuthUserDto {
  public readonly id: string;
  public readonly code: string;
  public readonly roles: RoleCodeEnum[];
  public readonly department: string;
}
