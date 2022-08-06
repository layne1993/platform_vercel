import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateGoodsDto,
  GoodsListWithPaginationDto,
  GoodsStatusDto,
} from './dto/goods.dto';
import { GoodsService } from './goods.service';

@ApiTags('商品')
@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @ApiOperation({ summary: '商品列表（分页）' })
  @UseGuards(AuthGuard('jwt'))
  @Get('/list/pagination')
  async getListWithPagination(@Query() query: GoodsListWithPaginationDto) {
    const page = {
      currentPage: query.pageNum,
      pageSize: query.pageSize,
    };

    return this.goodsService.paginate(query, page);
  }

  @ApiOperation({ summary: '新增商品' })
  @UseGuards(AuthGuard('jwt'))
  @Post('/create')
  createGoods(@Body() createGoodsDto: CreateGoodsDto) {
    return this.goodsService.createGoods(createGoodsDto);
  }

  @ApiOperation({ summary: '商品详情' })
  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async getGoodsDetailById(@Param('id') id: string) {
    return this.goodsService.getGoodsById(id);
  }

  @ApiOperation({ summary: '启用/禁用商品' })
  @UseGuards(AuthGuard('jwt'))
  @Post('/changeStatus')
  async changeStatus(@Body() goodsStatusDto: GoodsStatusDto) {
    return this.goodsService.updateGoods(goodsStatusDto);
  }
}
