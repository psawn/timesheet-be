import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { hashPassword } from 'src/helpers/encrypt.helper';
import { FilterUsersDto } from './dto/user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersRepository extends TypeORMRepository<User> {
  async findByConditions(filterUsersDto: FilterUsersDto) {
    const { page, limit, email } = filterUsersDto;
    const query = User.createQueryBuilder('users');

    query.select([
      'users.id',
      'users.email',
      'users.phone',
      'users.created_at',
      'users.updated_at',
      'users.deleted_at',
    ]);

    if (email) {
      query.andWhere('users.email = :email', { email });
    }

    return this.paginate({ page, limit }, query);
  }

  async signUp(signUpDto: any) {
    signUpDto.password = await hashPassword(signUpDto.password);
    return await User.save(signUpDto);
  }

  async findOneByConditions(conditions: any): Promise<User> {
    return await User.findOne(conditions);
  }

  async update(data: any) {
    return await User.save(data);
  }
}
