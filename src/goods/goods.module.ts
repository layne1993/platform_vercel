import { Module, forwardRef } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { GoodsController } from './goods.controller';
import { DatabaseModule } from 'src/common/database/database.module';
import { GoodsProviders } from './goods.providers';

@Module({
  controllers: [GoodsController],
  providers: [...GoodsProviders, GoodsService],
  imports: [forwardRef(() => DatabaseModule)],
  exports: [GoodsService],
})
export class GoodsModule {}
