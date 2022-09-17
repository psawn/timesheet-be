import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterUsersDto, UpdateUserDto } from 'src/modules/users/dto/user.dto';
import { UsersRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findByConditions(filterUsersDto: FilterUsersDto) {
    const users = await this.usersRepository.findByConditions(filterUsersDto);

    if (!users) {
      throw new NotFoundException();
    }

    return users;
  }

  async findOneByConditions(conditions: any) {
    return await this.usersRepository.findOneByConditions(conditions);
  }

  async update(request: any, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneByConditions({
      where: {
        id: request.user.id,
      },
    });
    const data = { ...updateUserDto, id: user.id };
    return await this.usersRepository.update(data);
  }

  async findOneWithRoles(conditions: any) {
    return await this.usersRepository.findOneWithRoles(conditions);
  }
}
