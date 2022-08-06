"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 8:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(9);
const utils_1 = __webpack_require__(10);
const redisStore = __webpack_require__(14);
const auth_module_1 = __webpack_require__(15);
const core_1 = __webpack_require__(5);
const jwt_auth_guard_1 = __webpack_require__(47);
const transform_interceptor_1 = __webpack_require__(48);
const user_module_1 = __webpack_require__(19);
const goods_module_1 = __webpack_require__(69);
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            common_1.CacheModule.register({
                isGlobal: true,
                store: redisStore,
                host: (0, utils_1.getConfig)('REDIS_CONFIG').host,
                port: (0, utils_1.getConfig)('REDIS_CONFIG').port,
                auth_pass: (0, utils_1.getConfig)('REDIS_CONFIG').auth,
                db: (0, utils_1.getConfig)('REDIS_CONFIG').db,
            }),
            config_1.ConfigModule.forRoot({
                ignoreEnvFile: true,
                isGlobal: true,
                load: [utils_1.getConfig],
            }),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            goods_module_1.GoodsModule,
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: transform_interceptor_1.TransformInterceptor,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GoodsListWithPaginationDto = void 0;
const swagger_1 = __webpack_require__(29);
class GoodsListWithPaginationDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GoodsListWithPaginationDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GoodsListWithPaginationDto.prototype, "pageNum", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GoodsListWithPaginationDto.prototype, "pageSize", void 0);
exports.GoodsListWithPaginationDto = GoodsListWithPaginationDto;


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Goods = void 0;
const typeorm_1 = __webpack_require__(23);
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
], Goods.prototype, "iamge", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Goods.prototype, "description", void 0);
Goods = __decorate([
    (0, typeorm_1.Entity)('goods')
], Goods);
exports.Goods = Goods;


/***/ }),

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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GoodsController = void 0;
const common_1 = __webpack_require__(4);
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
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '商品列表（分页）' }),
    (0, common_1.Get)('/list/pagination'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof goods_dto_1.GoodsListWithPaginationDto !== "undefined" && goods_dto_1.GoodsListWithPaginationDto) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], GoodsController.prototype, "getListWithPagination", null);
GoodsController = __decorate([
    (0, swagger_1.ApiTags)('商品'),
    (0, common_1.Controller)('goods'),
    __metadata("design:paramtypes", [typeof (_b = typeof goods_service_1.GoodsService !== "undefined" && goods_service_1.GoodsService) === "function" ? _b : Object])
], GoodsController);
exports.GoodsController = GoodsController;


/***/ }),

/***/ 69:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GoodsModule = void 0;
const common_1 = __webpack_require__(4);
const goods_service_1 = __webpack_require__(70);
const goods_controller_1 = __webpack_require__(71);
const database_module_1 = __webpack_require__(35);
const goods_providers_1 = __webpack_require__(73);
let GoodsModule = class GoodsModule {
};
GoodsModule = __decorate([
    (0, common_1.Module)({
        controllers: [goods_controller_1.GoodsController],
        providers: [...goods_providers_1.GoodsProviders, goods_service_1.GoodsService],
        imports: [(0, common_1.forwardRef)(() => database_module_1.DatabaseModule)],
        exports: [goods_service_1.GoodsService],
    })
], GoodsModule);
exports.GoodsModule = GoodsModule;


/***/ }),

/***/ 73:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GoodsProviders = void 0;
const goods_mysql_entity_1 = __webpack_require__(74);
exports.GoodsProviders = [
    {
        provide: 'GOODS_REPOSITORY',
        useFactory: (AppDataSource) => AppDataSource.getRepository(goods_mysql_entity_1.Goods),
        inject: ['MYSQL_DATA_SOURCE'],
    },
];


/***/ }),

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
let GoodsService = class GoodsService {
    constructor(goodsRepository) {
        this.goodsRepository = goodsRepository;
    }
    async paginate(searchParams, page) {
        const queryBuilder = this.goodsRepository.createQueryBuilder('goods');
        queryBuilder.orderBy('user.updateTime', 'DESC');
        if ((0, class_validator_1.isNotEmpty)(searchParams.name)) {
            queryBuilder.orWhere('goods.name LIKE :name', {
                name: `%${searchParams.name}%`,
            });
        }
        return (0, nestjs_typeorm_paginate_1.paginate)(queryBuilder, (0, helper_1.getPaginationOptions)(page));
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
/******/ 	__webpack_require__.h = () => ("b592a66f48444905499b")
/******/ })();
/******/ 
/******/ }
;