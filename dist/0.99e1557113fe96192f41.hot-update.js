"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 30:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserListWithPaginationDto = exports.CreateUserDto = exports.RegisterDto = void 0;
const swagger_1 = __webpack_require__(29);
const class_validator_1 = __webpack_require__(24);
const user_mysql_entity_1 = __webpack_require__(31);
class RegisterDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.MaxLength)(10),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "nickName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUrl)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "avatar", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsMobilePhone)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "mobile", void 0);
exports.RegisterDto = RegisterDto;
class CreateUserDto extends (0, swagger_1.OmitType)(RegisterDto, ['avatar']) {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof user_mysql_entity_1.RoleStatus !== "undefined" && user_mysql_entity_1.RoleStatus) === "function" ? _a : Object)
], CreateUserDto.prototype, "role", void 0);
exports.CreateUserDto = CreateUserDto;
class UserListWithPaginationDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserListWithPaginationDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: user_mysql_entity_1.VIP_TYPE }),
    __metadata("design:type", typeof (_b = typeof user_mysql_entity_1.VIP_TYPE !== "undefined" && user_mysql_entity_1.VIP_TYPE) === "function" ? _b : Object)
], UserListWithPaginationDto.prototype, "isVip", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UserListWithPaginationDto.prototype, "pageNum", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UserListWithPaginationDto.prototype, "pageSize", void 0);
exports.UserListWithPaginationDto = UserListWithPaginationDto;


/***/ }),

/***/ 31:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.User = exports.VIP_TYPE = exports.RoleStatus = exports.UserStatus = void 0;
const typeorm_1 = __webpack_require__(23);
const bcrypt = __webpack_require__(32);
const class_transformer_1 = __webpack_require__(33);
const common_1 = __webpack_require__(4);
var UserStatus;
(function (UserStatus) {
    UserStatus[UserStatus["disabled"] = 0] = "disabled";
    UserStatus[UserStatus["enabled"] = 1] = "enabled";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
var RoleStatus;
(function (RoleStatus) {
    RoleStatus[RoleStatus["simple"] = 0] = "simple";
    RoleStatus[RoleStatus["admin"] = 1] = "admin";
    RoleStatus[RoleStatus["sAdmin"] = 2] = "sAdmin";
})(RoleStatus = exports.RoleStatus || (exports.RoleStatus = {}));
var VIP_TYPE;
(function (VIP_TYPE) {
    VIP_TYPE[VIP_TYPE["level0"] = 0] = "level0";
    VIP_TYPE[VIP_TYPE["level1"] = 1] = "level1";
})(VIP_TYPE = exports.VIP_TYPE || (exports.VIP_TYPE = {}));
let User = class User {
    async encryptPwd() {
        if (this.password) {
            try {
                this.password = await bcrypt.hashSync(this.password, 10);
            }
            catch (e) {
                console.log(e);
                throw new common_1.InternalServerErrorException();
            }
        }
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10 }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, default: null }),
    __metadata("design:type", String)
], User.prototype, "nickName", void 0);
__decorate([
    (0, typeorm_1.Column)({ select: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "mobile", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.Column)({ default: null }),
    __metadata("design:type", String)
], User.prototype, "openid", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: UserStatus.enabled }),
    __metadata("design:type", Number)
], User.prototype, "status", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.Column)({ default: VIP_TYPE.level0 }),
    __metadata("design:type", Number)
], User.prototype, "isVip", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: RoleStatus.simple }),
    __metadata("design:type", Number)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'create_time',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], User.prototype, "createTime", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'update_time',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], User.prototype, "updateTime", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], User.prototype, "encryptPwd", null);
User = __decorate([
    (0, typeorm_1.Entity)('user')
], User);
exports.User = User;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("d78bfa9a672302f41c26")
/******/ })();
/******/ 
/******/ }
;