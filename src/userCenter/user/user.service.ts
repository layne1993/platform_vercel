import { Inject, Injectable } from '@nestjs/common';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { Repository } from 'typeorm';
import { isNotEmpty } from 'class-validator';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import {
  CreateUserDto,
  RegisterDto,
  UpdateUserDto,
  UserListWithPaginationDto,
} from './dto/user.dto';
import { User } from './entities/user.mysql.entity';
import { getPaginationOptions } from 'src/helper';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  // 注册
  async register(registerDto: RegisterDto) {
    const { username, mobile } = registerDto;

    const existUser = await this.userRepository.findOne({
      where: { username },
    });

    if (existUser) {
      throw new BusinessException('用户名已存在');
    }

    const existPhone = await this.userRepository.findOne({
      where: { mobile },
    });

    if (existPhone) {
      throw new BusinessException('手机号已存在');
    }

    const newUser: User = this.userRepository.create(registerDto);
    await this.userRepository.save(newUser);
    return await this.userRepository.findOne({ where: { username } });
  }

  // 创建用户
  async createUser(createUserDto: CreateUserDto) {
    const { username, mobile } = createUserDto;

    const existUser = await this.userRepository.findOne({
      where: { username },
    });

    if (existUser) {
      throw new BusinessException('用户名已存在');
    }

    const existPhone = await this.userRepository.findOne({
      where: { mobile },
    });

    if (existPhone) {
      throw new BusinessException('手机号已存在');
    }

    createUserDto.role = 1;

    const newUser: User = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return await this.userRepository.findOne({ where: { username } });
  }

  // 编辑用户信息
  async updateUser(updateUserDto: UpdateUserDto) {
    const { id } = updateUserDto;

    const existUser = await this.userRepository.findOne({
      where: { id },
    });
    if (!existUser) {
      throw new BusinessException(`未找到 ID 为 ${id} 的用户`);
    }

    const newUser: User = this.userRepository.merge(existUser, updateUserDto);
    await this.userRepository.save(newUser);
    return true;
  }

  // 删除用户
  async removeUser(id: string) {
    const existUser = await this.userRepository.findOne({ where: { id } });
    if (!existUser) {
      throw new BusinessException(`未找到 ID 为 ${id} 的用户`);
    }
    return await this.userRepository.remove(existUser);
  }

  // 通过id获取用户信息
  async getUserById(id: string) {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  // 通过用户名获取用户信息
  async getUserByName(username: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username=:username', { username })
      .getOne();
  }

  // 获取用户列表（分页）
  async paginate(
    searchParams: UserListWithPaginationDto,
    page: PaginationParams,
  ): Promise<Pagination<User, CustomPaginationMeta>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.orderBy('user.updateTime', 'DESC');
    queryBuilder.where('role=:role', { role: searchParams.role });
    if (isNotEmpty(searchParams.username)) {
      queryBuilder.orWhere('user.username LIKE :name', {
        name: `%${searchParams.username}%`,
      });
    }
    if (isNotEmpty(searchParams.isVip)) {
      queryBuilder.orWhere('user.username LIKE :name', {
        name: `%${searchParams.isVip}%`,
      });
    }
    return paginate<User, CustomPaginationMeta>(
      queryBuilder,
      getPaginationOptions(page),
    );
  }
}
