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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeishuController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const constants_1 = require("../../auth/constants");
const feishu_dto_1 = require("./feishu.dto");
const feishu_service_1 = require("./feishu.service");
let FeishuController = class FeishuController {
    constructor(feishuService) {
        this.feishuService = feishuService;
    }
    sendMessage(params) {
        const { receive_id_type } = params, rest = __rest(params, ["receive_id_type"]);
        return this.feishuService.sendMessage(receive_id_type, rest);
    }
    getUserToken(params) {
        const { code } = params;
        return this.feishuService.getUserToken(code);
    }
};
__decorate([
    (0, constants_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: '消息推送',
    }),
    (0, common_1.Post)('sendMessage'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [feishu_dto_1.FeishuMessageDto]),
    __metadata("design:returntype", void 0)
], FeishuController.prototype, "sendMessage", null);
__decorate([
    (0, constants_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: '获取用户凭证',
    }),
    (0, common_1.Post)('getUserToken'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [feishu_dto_1.GetUserTokenDto]),
    __metadata("design:returntype", void 0)
], FeishuController.prototype, "getUserToken", null);
FeishuController = __decorate([
    (0, swagger_1.ApiTags)('飞书'),
    (0, common_1.Controller)('feishu'),
    __metadata("design:paramtypes", [feishu_service_1.FeishuService])
], FeishuController);
exports.FeishuController = FeishuController;
//# sourceMappingURL=feishu.controller.js.map