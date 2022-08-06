import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  ROLE_TYPE,
  STATUS_TYPE,
  VIP_TYPE,
} from '../entities/user.mysql.entity';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(10)
  @ApiProperty()
  username: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiProperty()
  nickName?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  @ApiProperty()
  avatar: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty()
  email?: string;

  @IsNotEmpty()
  @IsMobilePhone()
  @ApiProperty()
  mobile: string;
}

export class CreateUserDto extends OmitType(RegisterDto, ['avatar'] as const) {
  @IsOptional()
  role: ROLE_TYPE;
}

export class UpdateUserDto extends PartialType(RegisterDto) {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  status?: STATUS_TYPE;

  @IsOptional()
  isVip?: VIP_TYPE;
}

export class UserListWithPaginationDto {
  @ApiProperty()
  username?: string;

  @ApiProperty({ enum: VIP_TYPE })
  isVip?: number;

  @ApiProperty()
  pageNum: number;

  @ApiProperty()
  pageSize: number;

  role?: ROLE_TYPE;
}

export class UserStatusDto {
  @IsNotEmpty()
  @ApiProperty()
  id: string;

  @IsNotEmpty()
  @ApiProperty({ enum: STATUS_TYPE })
  status: number;
}

export class UserVipDto {
  @IsNotEmpty()
  @ApiProperty()
  id: string;

  @IsNotEmpty()
  @ApiProperty({ enum: VIP_TYPE })
  isVip: number;
}
