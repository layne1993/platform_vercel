import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
export declare class FeishuService {
    private cacheManager;
    private configService;
    private APP_TOKEN_CACHE_KEY;
    constructor(cacheManager: Cache, configService: ConfigService);
    getAppToken(): Promise<string>;
    sendMessage(receive_id_type: any, params: any): Promise<any>;
    getUserToken(code: string): Promise<any>;
    setUserCacheToken(tokenInfo: any): Promise<void>;
    getUserTokenByRefreshToken(refreshToken: string): Promise<any>;
    getCachedUserToken(userId: string): Promise<string>;
}
