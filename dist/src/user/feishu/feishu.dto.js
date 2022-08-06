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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeishuMessageDto = exports.FeishuUserInfoDto = exports.GetUserTokenDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const message_1 = require("src/helper/feishu/message");
class GetUserTokenDto {
}
exports.GetUserTokenDto = GetUserTokenDto;
class FeishuUserInfoDto {
}
exports.FeishuUserInfoDto = FeishuUserInfoDto;
class FeishuMessageDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(message_1.RECEIVE_TYPE),
    (0, swagger_1.ApiProperty)({ example: 'email', enum: message_1.RECEIVE_TYPE }),
    __metadata("design:type", typeof (_a = typeof message_1.RECEIVE_TYPE !== "undefined" && message_1.RECEIVE_TYPE) === "function" ? _a : Object)
], FeishuMessageDto.prototype, "receive_id_type", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ example: '907917427@qq.com' }),
    __metadata("design:type", String)
], FeishuMessageDto.prototype, "receive_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ example: '{"text":" test content"}' }),
    __metadata("design:type", String)
], FeishuMessageDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(message_1.MSG_TYPE),
    (0, swagger_1.ApiProperty)({ example: 'text', enum: message_1.MSG_TYPE }),
    __metadata("design:type", Object)
], FeishuMessageDto.prototype, "msg_type", void 0);
exports.FeishuMessageDto = FeishuMessageDto;
//# sourceMappingURL=feishu.dto.js.map