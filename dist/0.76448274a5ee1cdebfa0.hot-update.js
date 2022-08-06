"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 71:
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GoodsController = void 0;
const common_1 = __webpack_require__(4);
const passport_1 = __webpack_require__(18);
const swagger_1 = __webpack_require__(29);
const goods_dto_1 = __webpack_require__(72);
const goods_service_1 = __webpack_require__(70);
let GoodsController = class GoodsController {
    constructor(goodsService) {
        this.goodsService = goodsService;
    }
    async getListWithPagination(query) {
        const page = {
            currentPage: query.pageNum,
            pageSize: query.pageSize,
        };
        return this.goodsService.paginate(query, page);
    }
    createGoods(createGoodsDto) {
        return this.goodsService.createGoods(createGoodsDto);
    }
    async getGoodsDetailById(id) {
        return this.goodsService.getGoodsById(id);
    }
    async changeStatus(goodsStatusDto) {
        return this.goodsService.updateGoods(goodsStatusDto);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '商品列表（分页）' }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('/list/pagination'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof goods_dto_1.GoodsListWithPaginationDto !== "undefined" && goods_dto_1.GoodsListWithPaginationDto) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], GoodsController.prototype, "getListWithPagination", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '新增商品' }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('/create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof goods_dto_1.CreateGoodsDto !== "undefined" && goods_dto_1.CreateGoodsDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], GoodsController.prototype, "createGoods", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '商品详情' }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GoodsController.prototype, "getGoodsDetailById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '启用/禁用商品' }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('/changeStatus'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof goods_dto_1.GoodsStatusDto !== "undefined" && goods_dto_1.GoodsStatusDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], GoodsController.prototype, "changeStatus", null);
GoodsController = __decorate([
    (0, swagger_1.ApiTags)('商品'),
    (0, common_1.Controller)('goods'),
    __metadata("design:paramtypes", [typeof (_d = typeof goods_service_1.GoodsService !== "undefined" && goods_service_1.GoodsService) === "function" ? _d : Object])
], GoodsController);
exports.GoodsController = GoodsController;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("b48c4c4ad71e118adc83")
/******/ })();
/******/ 
/******/ }
;