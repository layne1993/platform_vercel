"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 70:
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GoodsService = void 0;
const common_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(24);
const nestjs_typeorm_paginate_1 = __webpack_require__(25);
const typeorm_1 = __webpack_require__(23);
const helper_1 = __webpack_require__(26);
const business_exception_1 = __webpack_require__(21);
let GoodsService = class GoodsService {
    constructor(goodsRepository) {
        this.goodsRepository = goodsRepository;
    }
    async paginate(searchParams, page) {
        const queryBuilder = this.goodsRepository.createQueryBuilder('goods');
        queryBuilder.orderBy('goods.updateTime', 'DESC');
        if ((0, class_validator_1.isNotEmpty)(searchParams.name)) {
            queryBuilder.orWhere('goods.name LIKE :name', {
                name: `%${searchParams.name}%`,
            });
        }
        if ((0, class_validator_1.isNotEmpty)(searchParams.status)) {
            queryBuilder.orWhere('status=:status', { status: searchParams.status });
        }
        return (0, nestjs_typeorm_paginate_1.paginate)(queryBuilder, (0, helper_1.getPaginationOptions)(page));
    }
    async createGoods(createGoodsDto) {
        const newGoods = this.goodsRepository.create(createGoodsDto);
        return await this.goodsRepository.save(newGoods);
    }
    async getGoodsById(id) {
        const existGoods = await this.goodsRepository.findOne({
            where: { id },
        });
        const { count } = existGoods;
        const newGood = this.goodsRepository.merge(existGoods, {
            count: count + 1,
        });
        await this.goodsRepository.save(newGood);
        return existGoods;
    }
    async updateGoods(updateGoodsDto) {
        const { id } = updateGoodsDto;
        const existGoods = await this.goodsRepository.findOne({
            where: { id },
        });
        if (!existGoods) {
            throw new business_exception_1.BusinessException(`未找到 ID 为 ${id} 的商品`);
        }
        const newGood = this.goodsRepository.merge(existGoods, updateGoodsDto);
        await this.goodsRepository.save(newGood);
        return true;
    }
};
GoodsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('GOODS_REPOSITORY')),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _a : Object])
], GoodsService);
exports.GoodsService = GoodsService;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("6bc6afd709fbe049cef6")
/******/ })();
/******/ 
/******/ }
;