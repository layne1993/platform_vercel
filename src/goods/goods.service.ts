import { Inject, Injectable } from '@nestjs/common';
import { isNotEmpty } from 'class-validator';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Goods } from './entities/goods.mysql.entity';
import { getPaginationOptions } from 'src/helper';
import {
  CreateGoodsDto,
  GoodsListWithPaginationDto,
  UpdateGoodsDto,
} from './dto/goods.dto';
import { BusinessException } from 'src/common/exceptions/business.exception';

@Injectable()
export class GoodsService {
  constructor(
    @Inject('GOODS_REPOSITORY')
    private goodsRepository: Repository<Goods>,
  ) {}

  // 获取产品列表（分页）
  async paginate(
    searchParams: GoodsListWithPaginationDto,
    page: PaginationParams,
  ): Promise<Pagination<Goods, CustomPaginationMeta>> {
    const queryBuilder = this.goodsRepository.createQueryBuilder('goods');
    queryBuilder.orderBy('goods.updateTime', 'DESC');
    if (isNotEmpty(searchParams.name)) {
      queryBuilder.orWhere('goods.name LIKE :name', {
        name: `%${searchParams.name}%`,
      });
    }
    if (isNotEmpty(searchParams.status)) {
      queryBuilder.orWhere('status=:status', { status: searchParams.status });
    }
    return paginate<Goods, CustomPaginationMeta>(
      queryBuilder,
      getPaginationOptions(page),
    );
  }

  // 新增商品
  async createGoods(createGoodsDto: CreateGoodsDto) {
    const newGoods: Goods = this.goodsRepository.create(createGoodsDto);
    return await this.goodsRepository.save(newGoods);
  }

  // 获取商品详情
  async getGoodsById(id: string) {
    const existGoods = await this.goodsRepository.findOne({
      where: { id },
    });
    const { count } = existGoods;
    const newGood: Goods = this.goodsRepository.merge(existGoods, {
      count: count + 1,
    });
    await this.goodsRepository.save(newGood);
    return existGoods;
  }

  // 编辑商品信息
  async updateGoods(updateGoodsDto: UpdateGoodsDto) {
    const { id } = updateGoodsDto;

    const existGoods = await this.goodsRepository.findOne({
      where: { id },
    });
    if (!existGoods) {
      throw new BusinessException(`未找到 ID 为 ${id} 的商品`);
    }

    const newGood: Goods = this.goodsRepository.merge(
      existGoods,
      updateGoodsDto,
    );
    await this.goodsRepository.save(newGood);
    return true;
  }
}
