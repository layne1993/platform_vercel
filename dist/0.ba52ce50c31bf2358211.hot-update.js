"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

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
exports.User = exports.VIP_TYPE = exports.ROLE_TYPE = exports.STATUS_TYPE = void 0;
const typeorm_1 = __webpack_require__(23);
const bcrypt = __webpack_require__(32);
const class_transformer_1 = __webpack_require__(33);
const common_1 = __webpack_require__(4);
var STATUS_TYPE;
(function (STATUS_TYPE) {
    STATUS_TYPE[STATUS_TYPE["disabled"] = 0] = "disabled";
    STATUS_TYPE[STATUS_TYPE["enabled"] = 1] = "enabled";
})(STATUS_TYPE = exports.STATUS_TYPE || (exports.STATUS_TYPE = {}));
var ROLE_TYPE;
(function (ROLE_TYPE) {
    ROLE_TYPE[ROLE_TYPE["simple"] = 0] = "simple";
    ROLE_TYPE[ROLE_TYPE["admin"] = 1] = "admin";
    ROLE_TYPE[ROLE_TYPE["sAdmin"] = 2] = "sAdmin";
})(ROLE_TYPE = exports.ROLE_TYPE || (exports.ROLE_TYPE = {}));
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
    (0, typeorm_1.Column)({ default: STATUS_TYPE.enabled }),
    __metadata("design:type", Number)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: VIP_TYPE.level0 }),
    __metadata("design:type", Number)
], User.prototype, "isVip", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: ROLE_TYPE.simple }),
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
/******/ 	__webpack_require__.h = () => ("5d5c9ed62a2848ef99c6")
/******/ })();
/******/ 
/******/ }
;