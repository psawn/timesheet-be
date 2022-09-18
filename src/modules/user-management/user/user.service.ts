import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterUsersDto, UpdateUserDto } from './dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByConditions(filterUsersDto: FilterUsersDto) {
    const users = await this.userRepository.findByConditions(filterUsersDto);

    if (!users) {
      throw new NotFoundException();
    }

    return users;
  }

  async findOneByConditions(conditions: any) {
    return await this.userRepository.findOneByConditions(conditions);
  }

  async update(request: any, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneByConditions({
      where: {
        id: request.user.id,
      },
    });
    const data = { ...updateUserDto, id: user.id };
    return await this.userRepository.update(data);
  }

  async findOneWithRoles(conditions: any) {
    return await this.userRepository.findOneWithRoles(conditions);
  }
}
