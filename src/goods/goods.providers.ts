import { Goods } from './entities/goods.mysql.entity';

export const GoodsProviders = [
  {
    provide: 'GOODS_REPOSITORY',
    useFactory: (AppDataSource) => AppDataSource.getRepository(Goods),
    inject: ['MYSQL_DATA_SOURCE'],
  },
];
