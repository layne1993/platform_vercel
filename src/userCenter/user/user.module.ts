import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/common/database/database.module';
import { UserProviders } from './user.providers';

@Module({
  controllers: [UserController],
  providers: [...UserProviders, UserService],
  imports: [forwardRef(() => DatabaseModule)],
  exports: [UserService],
})
export class UserModule {}
