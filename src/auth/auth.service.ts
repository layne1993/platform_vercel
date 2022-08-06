import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/userCenter/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private httpService: HttpService,
  ) {}

  // jwt 登录
  async login(user: Payload) {
    const access_token = await this.jwtService.sign({
      id: user.id,
      username: user.username,
      mobile: user.mobile,
      departmentId: user.departmentId,
    });
    return { access_token };
  }

  // 微信登录
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async loginWithWechat(code) {}

  // 通过id获取用户
  async getUser(user: Payload) {
    return await this.userService.getUserById(user.id);
  }

  // 通过用户名获取用户
  async getUserByName(username: string) {
    return await this.userService.getUserByName(username);
  }
}
