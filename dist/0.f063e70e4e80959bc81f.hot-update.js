"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 20:
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
exports.UserService = void 0;
const common_1 = __webpack_require__(4);
const business_exception_1 = __webpack_require__(21);
const typeorm_1 = __webpack_require__(23);
const class_validator_1 = __webpack_require__(24);
const nestjs_typeorm_paginate_1 = __webpack_require__(25);
const helper_1 = __webpack_require__(26);
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async register(registerDto) {
        const { username, mobile } = registerDto;
        const existUser = await this.userRepository.findOne({
            where: { username },
        });
        if (existUser) {
            throw new business_exception_1.BusinessException('用户名已存在');
        }
        const existPhone = await this.userRepository.findOne({
            where: { mobile },
        });
        if (existPhone) {
            throw new business_exception_1.BusinessException('手机号已存在');
        }
        const newUser = this.userRepository.create(registerDto);
        await this.userRepository.save(newUser);
        return await this.userRepository.findOne({ where: { username } });
    }
    async createUser(createUserDto) {
        const { username, mobile } = createUserDto;
        const existUser = await this.userRepository.findOne({
            where: { username },
        });
        if (existUser) {
            throw new business_exception_1.BusinessException('用户名已存在');
        }
        const existPhone = await this.userRepository.findOne({
            where: { mobile },
        });
        if (existPhone) {
            throw new business_exception_1.BusinessException('手机号已存在');
        }
        createUserDto.role = 1;
        const newUser = this.userRepository.create(createUserDto);
        await this.userRepository.save(newUser);
        return await this.userRepository.findOne({ where: { username } });
    }
    async updateUserStatus(updateUserDto) {
        const { id } = updateUserDto;
        const existUser = await this.userRepository.findOne({
            where: { id },
        });
        if (!existUser) {
            throw new business_exception_1.BusinessException(`未找到 ID 为 ${id} 的用户`);
        }
        const newUser = this.userRepository.merge(existUser, updateUserDto);
        await this.userRepository.save(newUser);
        return true;
    }
    async updateUserVip(userVipDto) {
        const { id } = userVipDto;
        const existUser = await this.userRepository.findOne({
            where: { id },
        });
        if (!existUser) {
            throw new business_exception_1.BusinessException(`未找到 ID 为 ${id} 的用户`);
        }
        const newUser = this.userRepository.merge(existUser, userVipDto);
        await this.userRepository.save(newUser);
        return true;
    }
    async getUserById(id) {
        return await this.userRepository.findOne({
            where: { id },
        });
    }
    async getUserByName(username) {
        return await this.userRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.username=:username', { username })
            .getOne();
    }
    async paginate(searchParams, page) {
        const queryBuilder = this.userRepository.createQueryBuilder('user');
        queryBuilder.orderBy('user.updateTime', 'DESC');
        queryBuilder.where('role=:role', { role: searchParams.role });
        if ((0, class_validator_1.isNotEmpty)(searchParams.username)) {
            queryBuilder.orWhere('user.username LIKE :name', {
                name: `%${searchParams.username}%`,
            });
        }
        if ((0, class_validator_1.isNotEmpty)(searchParams.isVip)) {
            queryBuilder.orWhere('user.username LIKE :name', {
                name: `%${searchParams.isVip}%`,
            });
        }
        return (0, nestjs_typeorm_paginate_1.paginate)(queryBuilder, (0, helper_1.getPaginationOptions)(page));
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('USER_REPOSITORY')),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _a : Object])
], UserService);
exports.UserService = UserService;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("8715a220051a872abe87")
/******/ })();
/******/ 
/******/ }
;