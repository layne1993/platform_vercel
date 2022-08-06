import { PassportStrategy } from '@nestjs/passport';
import { StrategyOptions, Strategy, ExtractJwt } from 'passport-jwt';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { jwtConstants } from '../constants';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    } as StrategyOptions);
  }

  async validate(user: Payload) {
    const existUser = await this.authService.getUser(user);
    if (!existUser) {
      throw new BusinessException('token不正确');
    }
    return existUser;
  }
}
