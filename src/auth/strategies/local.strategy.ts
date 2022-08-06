import { PassportStrategy } from '@nestjs/passport';
import { IStrategyOptions, Strategy } from 'passport-local';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { compareSync } from 'bcrypt';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  async validate(username: string, password: string) {
    // 因为密码是加密后的，没办法直接对比用户名密码，只能先根据用户名查出用户，再比对密码
    const user = await this.authService.getUserByName(username);

    if (!user) {
      throw new BusinessException('用户名不正确！');
    }

    if (!compareSync(password, user.password)) {
      throw new BusinessException('密码错误！');
    }

    return user;
  }
}
