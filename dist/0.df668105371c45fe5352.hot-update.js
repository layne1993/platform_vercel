"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 72:
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateGoodsDto = exports.CreateGoodsDto = exports.GoodsStatusDto = exports.GoodsListWithPaginationDto = void 0;
const swagger_1 = __webpack_require__(29);
const class_validator_1 = __webpack_require__(24);
const goods_mysql_entity_1 = __webpack_require__(74);
class GoodsListWithPaginationDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GoodsListWithPaginationDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: goods_mysql_entity_1.STATUS_TYPE }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GoodsListWithPaginationDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GoodsListWithPaginationDto.prototype, "pageNum", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GoodsListWithPaginationDto.prototype, "pageSize", void 0);
exports.GoodsListWithPaginationDto = GoodsListWithPaginationDto;
class GoodsStatusDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GoodsStatusDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ enum: goods_mysql_entity_1.STATUS_TYPE }),
    __metadata("design:type", Number)
], GoodsStatusDto.prototype, "status", void 0);
exports.GoodsStatusDto = GoodsStatusDto;
class CreateGoodsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGoodsDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGoodsDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateGoodsDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateGoodsDto.prototype, "details", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof goods_mysql_entity_1.STATUS_TYPE !== "undefined" && goods_mysql_entity_1.STATUS_TYPE) === "function" ? _a : Object)
], CreateGoodsDto.prototype, "status", void 0);
exports.CreateGoodsDto = CreateGoodsDto;
class UpdateGoodsDto extends (0, swagger_1.PartialType)(CreateGoodsDto) {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateGoodsDto.prototype, "id", void 0);
exports.UpdateGoodsDto = UpdateGoodsDto;


/***/ }),

/***/ 74:
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
exports.Goods = exports.STATUS_TYPE = void 0;
const typeorm_1 = __webpack_require__(23);
var STATUS_TYPE;
(function (STATUS_TYPE) {
    STATUS_TYPE[STATUS_TYPE["disabled"] = 0] = "disabled";
    STATUS_TYPE[STATUS_TYPE["enabled"] = 1] = "enabled";
})(STATUS_TYPE = exports.STATUS_TYPE || (exports.STATUS_TYPE = {}));
let Goods = class Goods {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Goods.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Goods.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Goods.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Goods.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Goods.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Goods.prototype, "count", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'pay_count' }),
    __metadata("design:type", Number)
], Goods.prototype, "payCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: STATUS_TYPE.enabled }),
    __metadata("design:type", Number)
], Goods.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Goods.prototype, "details", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'create_time',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Goods.prototype, "createTime", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'update_time',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Goods.prototype, "updateTime", void 0);
Goods = __decorate([
    (0, typeorm_1.Entity)('goods')
], Goods);
exports.Goods = Goods;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("60589187397df11e3daa")
/******/ })();
/******/ 
/******/ }
;