import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { STATUS_TYPE } from '../entities/goods.mysql.entity';

export class GoodsListWithPaginationDto {
  @ApiProperty()
  @IsOptional()
  name?: string;

  @ApiProperty({ enum: STATUS_TYPE })
  @IsOptional()
  status?: number;

  @ApiProperty()
  pageNum: number;

  @ApiProperty()
  pageSize: number;
}

export class GoodsStatusDto {
  @IsNotEmpty()
  @ApiProperty()
  id: string;

  @IsNotEmpty()
  @ApiProperty({ enum: STATUS_TYPE })
  status: number;
}

export class CreateGoodsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  details: string;

  @ApiProperty()
  @IsOptional()
  status?: STATUS_TYPE;
}

export class UpdateGoodsDto extends PartialType(CreateGoodsDto) {
  @IsNotEmpty()
  id: string;
}
