"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeishuService = void 0;
const common_1 = require("@nestjs/common");
const auth_1 = require("src/helper/feishu/auth");
const config_1 = require("@nestjs/config");
const business_exception_1 = require("../../common/exceptions/business.exception");
const message_1 = require("src/helper/feishu/message");
const business_error_codes_1 = require("../../common/exceptions/business.error.codes");
let FeishuService = class FeishuService {
    constructor(cacheManager, configService) {
        this.cacheManager = cacheManager;
        this.configService = configService;
        this.APP_TOKEN_CACHE_KEY = this.configService.get('APP_TOKEN_CACHE_KEY');
    }
    async getAppToken() {
        let appToken;
        appToken = await this.cacheManager.get(this.APP_TOKEN_CACHE_KEY);
        if (!appToken) {
            const response = await (0, auth_1.getAppToken)();
            if (response.code === 0) {
                appToken = response.app_access_token;
                this.cacheManager.set(this.APP_TOKEN_CACHE_KEY, appToken, {
                    ttl: response.expire - 60,
                });
            }
            else {
                throw new business_exception_1.BusinessException('飞书调用异常');
            }
        }
        return appToken;
    }
    async sendMessage(receive_id_type, params) {
        const app_token = await this.getAppToken();
        return (0, message_1.message)(receive_id_type, params, app_token);
    }
    async getUserToken(code) {
        const app_token = await this.getAppToken();
        const getUserTokenDto = {
            code,
            app_token,
        };
        const res = await (0, auth_1.getUserToken)(getUserTokenDto);
        if (res.code !== 0) {
            throw new business_exception_1.BusinessException(res.msg);
        }
        return res.data;
    }
    async setUserCacheToken(tokenInfo) {
        const { refresh_token, access_token, user_id, expires_in, refresh_expires_in, } = tokenInfo;
        await this.cacheManager.set(`feishu_user_token__${user_id}`, access_token, {
            ttl: expires_in - 60,
        });
        await this.cacheManager.set(`feishu_user_token__${user_id}`, refresh_token, {
            ttl: refresh_expires_in - 60,
        });
    }
    async getUserTokenByRefreshToken(refreshToken) {
        return await (0, auth_1.refreshUserToken)({
            refreshToken,
            app_token: await this.getAppToken(),
        });
    }
    async getCachedUserToken(userId) {
        let userToken = await this.cacheManager.get(`feishu_user_token__${userId}`);
        if (!userToken) {
            const refreshToken = await this.cacheManager.get(`feishu_user_token__${userId}`);
            if (!refreshToken) {
                throw new business_exception_1.BusinessException({
                    code: business_error_codes_1.BUSINESS_ERROR_CODE.TOKEN_INVALID,
                    message: 'token 已失效',
                });
            }
            const userTokenInfo = await this.getUserTokenByRefreshToken(refreshToken);
            await this.setUserCacheToken(userTokenInfo);
            userToken = userTokenInfo.access_token;
        }
        return userToken;
    }
};
FeishuService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, config_1.ConfigService])
], FeishuService);
exports.FeishuService = FeishuService;
//# sourceMappingURL=feishu.service.js.map