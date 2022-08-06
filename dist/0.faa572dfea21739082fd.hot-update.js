"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 28:
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
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserController = void 0;
const common_1 = __webpack_require__(4);
const user_service_1 = __webpack_require__(20);
const config_1 = __webpack_require__(9);
const swagger_1 = __webpack_require__(29);
const user_dto_1 = __webpack_require__(30);
const constants_1 = __webpack_require__(34);
const passport_1 = __webpack_require__(18);
const business_exception_1 = __webpack_require__(21);
let UserController = class UserController {
    constructor(userService, configService) {
        this.userService = userService;
        this.configService = configService;
    }
    register(registerDto) {
        return this.userService.register(registerDto);
    }
    async getListWithPagination(query, req) {
        if (req.user.role === 0) {
            throw new business_exception_1.BusinessException('权限不足');
        }
        const page = {
            currentPage: query.pageNum,
            pageSize: query.pageSize,
        };
        query.role = 0;
        return this.userService.paginate(query, page);
    }
    async changeStatus(userStatusDto, req) {
        if (req.user.role === 0) {
            throw new business_exception_1.BusinessException('权限不足');
        }
        return this.userService.updateUser(userStatusDto);
    }
    async activateVip(userVipDto, req) {
        if (req.user.role === 0) {
            throw new business_exception_1.BusinessException('权限不足');
        }
        return this.userService.updateUser(userVipDto);
    }
    createUser(createUserDto, req) {
        if (req.user.role !== 2) {
            throw new business_exception_1.BusinessException('仅超级管理员可以创建用户');
        }
        return this.userService.createUser(createUserDto);
    }
    async getAdminListWithPagination(query, req) {
        if (req.user.role !== 2) {
            throw new business_exception_1.BusinessException('权限不足');
        }
        const page = {
            currentPage: query.pageNum,
            pageSize: query.pageSize,
        };
        query.role = 1;
        return this.userService.paginate(query, page);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '注册用户' }),
    (0, constants_1.Public)(),
    (0, common_1.Post)('/register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof user_dto_1.RegisterDto !== "undefined" && user_dto_1.RegisterDto) === "function" ? _a : Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "register", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '用户列表（分页）' }),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('/list/pagination'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof user_dto_1.UserListWithPaginationDto !== "undefined" && user_dto_1.UserListWithPaginationDto) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getListWithPagination", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '启用/禁用用户' }),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('/changeStatus'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof user_dto_1.UserStatusDto !== "undefined" && user_dto_1.UserStatusDto) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changeStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '激活vip' }),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('/activateVip'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof user_dto_1.UserVipDto !== "undefined" && user_dto_1.UserVipDto) === "function" ? _d : Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "activateVip", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '创建用户(后管) ' }),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('/createUser'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof user_dto_1.CreateUserDto !== "undefined" && user_dto_1.CreateUserDto) === "function" ? _e : Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "createUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '管理员列表（分页）' }),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('/adminList/pagination'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof user_dto_1.UserListWithPaginationDto !== "undefined" && user_dto_1.UserListWithPaginationDto) === "function" ? _f : Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAdminListWithPagination", null);
UserController = __decorate([
    (0, swagger_1.ApiTags)('用户'),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [typeof (_g = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _g : Object, typeof (_h = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _h : Object])
], UserController);
exports.UserController = UserController;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("2301e4c3afdb8e44289c")
/******/ })();
/******/ 
/******/ }
;