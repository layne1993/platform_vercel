import { SetMetadata } from '@nestjs/common';

export const jwtConstants = {
  secret: 'yx-yyds', // 秘钥，不对外公开。
  expiresIn: '4h', // 时效时长
};

export const IS_PUBLIC_KEY = 'isPublic';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
