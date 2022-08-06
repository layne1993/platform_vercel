import {
  Controller,
  Post,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
  Req,
  UseGuards,
  Get,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  RegisterDto,
  CreateUserDto,
  UserListWithPaginationDto,
  UserStatusDto,
  UserVipDto,
} from './dto/user.dto';
import { Public } from 'src/auth/constants';
import { AuthGuard } from '@nestjs/passport';
import { BusinessException } from 'src/common/exceptions/business.exception';

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '注册用户' })
  @Public()
  @Post('/register')
  register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto);
  }

  @ApiOperation({ summary: '用户列表（分页）' })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard('jwt'))
  @Get('/list/pagination')
  async getListWithPagination(
    @Query() query: UserListWithPaginationDto,
    @Req() req,
  ) {
    if (req.user.role === 0) {
      throw new BusinessException('权限不足');
    }
    const page = {
      currentPage: query.pageNum,
      pageSize: query.pageSize,
    };

    // 搜索用户
    query.role = 0;
    return this.userService.paginate(query, page);
  }

  @ApiOperation({ summary: '查看单个用户' })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async getUserDetailById(@Param('id') id: string, @Req() req) {
    if (req.user.role === 0) {
      throw new BusinessException('权限不足');
    }
    return this.userService.getUserById(id);
  }

  @ApiOperation({ summary: '删除用户' })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async deleteUserById(@Param('id') id: string, @Req() req) {
    if (req.user.role === 0) {
      throw new BusinessException('权限不足');
    }
    return this.userService.removeUser(id);
  }

  @ApiOperation({ summary: '删除管理员' })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard('jwt'))
  @Delete('/admin/:id')
  async deleteAdminById(@Param('id') id: string, @Req() req) {
    if (req.user.role !== 2) {
      throw new BusinessException('权限不足');
    }
    return this.userService.removeUser(id);
  }

  @ApiOperation({ summary: '启用/禁用用户' })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard('jwt'))
  @Post('/changeStatus')
  async changeStatus(@Body() userStatusDto: UserStatusDto, @Req() req) {
    if (req.user.role === 0) {
      throw new BusinessException('权限不足');
    }
    return this.userService.updateUser(userStatusDto);
  }

  @ApiOperation({ summary: '激活vip' })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard('jwt'))
  @Post('/activateVip')
  async activateVip(@Body() userVipDto: UserVipDto, @Req() req) {
    if (req.user.role === 0) {
      throw new BusinessException('权限不足');
    }
    return this.userService.updateUser(userVipDto);
  }

  @ApiOperation({ summary: '创建用户(后管) ' })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard('jwt'))
  @Post('/createUser')
  createUser(@Body() createUserDto: CreateUserDto, @Req() req) {
    if (req.user.role !== 2) {
      throw new BusinessException('仅超级管理员可以创建用户');
    }
    return this.userService.createUser(createUserDto);
  }

  @ApiOperation({ summary: '管理员列表（分页）' })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard('jwt'))
  @Get('/adminList/pagination')
  async getAdminListWithPagination(
    @Query() query: UserListWithPaginationDto,
    @Req() req,
  ) {
    if (req.user.role !== 2) {
      throw new BusinessException('权限不足');
    }
    const page = {
      currentPage: query.pageNum,
      pageSize: query.pageSize,
    };

    // 管理员
    query.role = 1;
    return this.userService.paginate(query, page);
  }
}
