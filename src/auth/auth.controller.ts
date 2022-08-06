import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './constants';
import { LoginDto } from './dto/login.dto';

@ApiTags('用户校验')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '用户登录' })
  @UseGuards(AuthGuard('local'))
  @Public()
  @Post('login')
  async login(@Body() user: LoginDto, @Req() req) {
    return await this.authService.login(req.user);
  }

  @ApiOperation({
    summary: '获取当前登录人信息',
    description: '解密 token 包含的信息',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/token/info')
  async getTokenInfo(@Req() req) {
    return req.user;
  }
}
