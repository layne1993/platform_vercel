import { DataSource } from 'typeorm';
import { NamingStrategy } from './naming.strategies';
import { User } from 'src/userCenter/user/entities/user.mysql.entity';
import { getConfig } from 'src/utils';
import { Goods } from 'src/goods/entities/goods.mysql.entity';

// 设置数据库类型
const { MYSQL_CONFIG } = getConfig();

// 静态文件处理与 webpack hmr 热更新冲突
const MYSQL_DATABASE_CONFIG = {
  ...MYSQL_CONFIG,
  NamedNodeMap: new NamingStrategy(),
  entities: [User, Goods],
};

const MYSQL_DATA_SOURCE = new DataSource(MYSQL_DATABASE_CONFIG);

// 数据库注入
export const DatabaseProviders = [
  {
    provide: 'MYSQL_DATA_SOURCE',
    useFactory: async () => {
      if (!MYSQL_DATA_SOURCE.isInitialized)
        await MYSQL_DATA_SOURCE.initialize();
      return MYSQL_DATA_SOURCE;
    },
  },
];
