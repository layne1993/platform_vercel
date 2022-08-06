import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/userCenter/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

const jwtModule = JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: async () => {
    return {
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    };
  },
});

@Module({
  imports: [
    HttpModule,
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    jwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [jwtModule, AuthService],
})
export class AuthModule {}
