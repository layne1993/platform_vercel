/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var __resourceQuery = "?100";
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __resourceQuery */
if (true) {
	var hotPollInterval = +__resourceQuery.slice(1) || 0;
	var log = __webpack_require__(1);

	var checkForUpdate = function checkForUpdate(fromUpdate) {
		if (module.hot.status() === "idle") {
			module.hot
				.check(true)
				.then(function (updatedModules) {
					if (!updatedModules) {
						if (fromUpdate) log("info", "[HMR] Update applied.");
						return;
					}
					__webpack_require__(2)(updatedModules, updatedModules);
					checkForUpdate(true);
				})
				.catch(function (err) {
					var status = module.hot.status();
					if (["abort", "fail"].indexOf(status) >= 0) {
						log("warning", "[HMR] Cannot apply update.");
						log("warning", "[HMR] " + log.formatError(err));
						log("warning", "[HMR] You need to restart the application!");
					} else {
						log("warning", "[HMR] Update failed: " + log.formatError(err));
					}
				});
		}
	};
	setInterval(checkForUpdate, hotPollInterval);
} else {}


/***/ }),
/* 1 */
/***/ ((module) => {

var logLevel = "info";

function dummy() {}

function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

function logGroup(logFn) {
	return function (level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

module.exports = function (level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

/* eslint-disable node/no-unsupported-features/node-builtins */
var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;
/* eslint-enable node/no-unsupported-features/node-builtins */

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

module.exports.setLogLevel = function (level) {
	logLevel = level;
};

module.exports.formatError = function (err) {
	var message = err.message;
	var stack = err.stack;
	if (!stack) {
		return message;
	} else if (stack.indexOf(message) < 0) {
		return message + "\n" + stack;
	} else {
		return stack;
	}
};


/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function (updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function (moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__(1);

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function (moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function (moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function (moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				'[HMR] Consider using the optimization.moduleIds: "named" for module names.'
			);
	}
};


/***/ }),
/* 3 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(4);
const core_1 = __webpack_require__(5);
const platform_fastify_1 = __webpack_require__(6);
const fastify_1 = __webpack_require__(7);
const app_module_1 = __webpack_require__(8);
const base_exception_filter_1 = __webpack_require__(51);
const http_exception_filter_1 = __webpack_require__(52);
const logger_1 = __webpack_require__(53);
const doc_1 = __webpack_require__(64);
const cookieParser = __webpack_require__(66);
const cookie_1 = __webpack_require__(67);
const catchError_1 = __webpack_require__(68);
(0, catchError_1.catchError)();
async function bootstrap() {
    const fastifyInstance = (0, fastify_1.default)({
        logger: logger_1.FastifyLogger,
    });
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter(fastifyInstance));
    app.register(cookie_1.default, {
        secret: 'my-secret',
    });
    app.useGlobalFilters(new base_exception_filter_1.AllExceptionsFilter(), new http_exception_filter_1.HttpExceptionFilter());
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.enableVersioning({
        type: common_1.VersioningType.URI,
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    (0, doc_1.generateDocument)(app);
    await app.listen(3000);
    if (true) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();


/***/ }),
/* 4 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/common");

/***/ }),
/* 5 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core");

/***/ }),
/* 6 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/platform-fastify");

/***/ }),
/* 7 */
/***/ ((module) => {

"use strict";
module.exports = require("fastify");

/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
/* 9 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/config");

/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getConfig = exports.getEnv = void 0;
const yaml_1 = __webpack_require__(11);
const path = __webpack_require__(12);
const fs = __webpack_require__(13);
const getEnv = () => {
    return process.env.RUNNING_ENV;
};
exports.getEnv = getEnv;
const getConfig = (type) => {
    const environment = (0, exports.getEnv)();
    const yamlPath = path.join(process.cwd(), `./config/.${environment}.yaml`);
    const file = fs.readFileSync(yamlPath, 'utf8');
    const config = (0, yaml_1.parse)(file);
    if (type) {
        return config[type];
    }
    return config;
};
exports.getConfig = getConfig;


/***/ }),
/* 11 */
/***/ ((module) => {

"use strict";
module.exports = require("yaml");

/***/ }),
/* 12 */
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),
/* 13 */
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),
/* 14 */
/***/ ((module) => {

"use strict";
module.exports = require("cache-manager-redis-store");

/***/ }),
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const axios_1 = __webpack_require__(16);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(9);
const jwt_1 = __webpack_require__(17);
const passport_1 = __webpack_require__(18);
const user_module_1 = __webpack_require__(19);
const auth_controller_1 = __webpack_require__(40);
const auth_service_1 = __webpack_require__(41);
const constants_1 = __webpack_require__(34);
const jwt_strategy_1 = __webpack_require__(43);
const local_strategy_1 = __webpack_require__(45);
const jwtModule = jwt_1.JwtModule.registerAsync({
    inject: [config_1.ConfigService],
    useFactory: async () => {
        return {
            secret: constants_1.jwtConstants.secret,
            signOptions: { expiresIn: constants_1.jwtConstants.expiresIn },
        };
    },
});
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            user_module_1.UserModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwtModule,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, local_strategy_1.LocalStrategy],
        exports: [jwtModule, auth_service_1.AuthService],
    })
], AuthModule);
exports.AuthModule = AuthModule;


/***/ }),
/* 16 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/axios");

/***/ }),
/* 17 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/jwt");

/***/ }),
/* 18 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/passport");

/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserModule = void 0;
const common_1 = __webpack_require__(4);
const user_service_1 = __webpack_require__(20);
const user_controller_1 = __webpack_require__(28);
const database_module_1 = __webpack_require__(35);
const user_providers_1 = __webpack_require__(39);
let UserModule = class UserModule {
};
UserModule = __decorate([
    (0, common_1.Module)({
        controllers: [user_controller_1.UserController],
        providers: [...user_providers_1.UserProviders, user_service_1.UserService],
        imports: [(0, common_1.forwardRef)(() => database_module_1.DatabaseModule)],
        exports: [user_service_1.UserService],
    })
], UserModule);
exports.UserModule = UserModule;


/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
    async updateUser(updateUserDto) {
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
    async removeUser(id) {
        const existUser = await this.userRepository.findOne({ where: { id } });
        if (!existUser) {
            throw new business_exception_1.BusinessException(`未找到 ID 为 ${id} 的用户`);
        }
        return await this.userRepository.remove(existUser);
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


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BusinessException = void 0;
const common_1 = __webpack_require__(4);
const business_error_codes_1 = __webpack_require__(22);
class BusinessException extends common_1.HttpException {
    constructor(err) {
        if (typeof err === 'string') {
            err = {
                code: business_error_codes_1.BUSINESS_ERROR_CODE.COMMON,
                message: err,
            };
        }
        super(err, common_1.HttpStatus.OK);
    }
    static throwForbidden() {
        throw new BusinessException({
            code: business_error_codes_1.BUSINESS_ERROR_CODE.ACCESS_FORBIDDEN,
            message: '抱歉哦，您无此权限！',
        });
    }
    static throwPermissionDisabled() {
        throw new BusinessException({
            code: business_error_codes_1.BUSINESS_ERROR_CODE.PERMISSION_DISABLED,
            message: '权限已禁用',
        });
    }
    static throwUserDisabled() {
        throw new BusinessException({
            code: business_error_codes_1.BUSINESS_ERROR_CODE.USER_DISABLED,
            message: '用户已冻结',
        });
    }
}
exports.BusinessException = BusinessException;


/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BUSINESS_ERROR_CODE = void 0;
exports.BUSINESS_ERROR_CODE = {
    COMMON: 10001,
    TOKEN_INVALID: 10002,
    ACCESS_FORBIDDEN: 10003,
    PERMISSION_DISABLED: 10003,
    USER_DISABLED: 10004,
};


/***/ }),
/* 23 */
/***/ ((module) => {

"use strict";
module.exports = require("typeorm");

/***/ }),
/* 24 */
/***/ ((module) => {

"use strict";
module.exports = require("class-validator");

/***/ }),
/* 25 */
/***/ ((module) => {

"use strict";
module.exports = require("nestjs-typeorm-paginate");

/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getPaginationOptions = exports.CustomPaginationMeta = void 0;
const constants_1 = __webpack_require__(27);
class CustomPaginationMeta {
    constructor(pageSize, totalCounts, totalPages, currentPage) {
        this.pageSize = pageSize;
        this.totalCounts = totalCounts;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
    }
}
exports.CustomPaginationMeta = CustomPaginationMeta;
const getPaginationOptions = (page = {
    currentPage: constants_1.defaultPaginationParams.currentPage,
    pageSize: constants_1.defaultPaginationParams.pageSize,
}) => {
    const limit = page.pageSize > constants_1.MAX_PAGE_SIZE ? constants_1.MAX_PAGE_SIZE : page.pageSize;
    const options = {
        page: page.currentPage,
        limit,
        metaTransformer: (meta) => {
            return new CustomPaginationMeta(meta.itemCount, meta.totalItems, meta.totalPages, meta.currentPage);
        },
    };
    return options;
};
exports.getPaginationOptions = getPaginationOptions;


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.defaultPaginationParams = exports.MAX_PAGE_SIZE = void 0;
exports.MAX_PAGE_SIZE = 100;
exports.defaultPaginationParams = {
    currentPage: 1,
    pageSize: 10,
};


/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserController = void 0;
const common_1 = __webpack_require__(4);
const user_service_1 = __webpack_require__(20);
const swagger_1 = __webpack_require__(29);
const user_dto_1 = __webpack_require__(30);
const constants_1 = __webpack_require__(34);
const passport_1 = __webpack_require__(18);
const business_exception_1 = __webpack_require__(21);
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
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
    async getUserDetailById(id, req) {
        if (req.user.role === 0) {
            throw new business_exception_1.BusinessException('权限不足');
        }
        return this.userService.getUserById(id);
    }
    async deleteUserById(id, req) {
        if (req.user.role === 0) {
            throw new business_exception_1.BusinessException('权限不足');
        }
        return this.userService.removeUser(id);
    }
    async deleteAdminById(id, req) {
        if (req.user.role !== 2) {
            throw new business_exception_1.BusinessException('权限不足');
        }
        return this.userService.removeUser(id);
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
    (0, swagger_1.ApiOperation)({ summary: '查看单个用户' }),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserDetailById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '删除用户' }),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUserById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '删除管理员' }),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)('/admin/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteAdminById", null);
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
    __metadata("design:paramtypes", [typeof (_g = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _g : Object])
], UserController);
exports.UserController = UserController;


/***/ }),
/* 29 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/swagger");

/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserVipDto = exports.UserStatusDto = exports.UserListWithPaginationDto = exports.UpdateUserDto = exports.CreateUserDto = exports.RegisterDto = void 0;
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
    __metadata("design:type", typeof (_a = typeof user_mysql_entity_1.ROLE_TYPE !== "undefined" && user_mysql_entity_1.ROLE_TYPE) === "function" ? _a : Object)
], CreateUserDto.prototype, "role", void 0);
exports.CreateUserDto = CreateUserDto;
class UpdateUserDto extends (0, swagger_1.PartialType)(RegisterDto) {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_b = typeof user_mysql_entity_1.STATUS_TYPE !== "undefined" && user_mysql_entity_1.STATUS_TYPE) === "function" ? _b : Object)
], UpdateUserDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_c = typeof user_mysql_entity_1.VIP_TYPE !== "undefined" && user_mysql_entity_1.VIP_TYPE) === "function" ? _c : Object)
], UpdateUserDto.prototype, "isVip", void 0);
exports.UpdateUserDto = UpdateUserDto;
class UserListWithPaginationDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserListWithPaginationDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: user_mysql_entity_1.VIP_TYPE }),
    __metadata("design:type", Number)
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
class UserStatusDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserStatusDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ enum: user_mysql_entity_1.STATUS_TYPE }),
    __metadata("design:type", Number)
], UserStatusDto.prototype, "status", void 0);
exports.UserStatusDto = UserStatusDto;
class UserVipDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserVipDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ enum: user_mysql_entity_1.VIP_TYPE }),
    __metadata("design:type", Number)
], UserVipDto.prototype, "isVip", void 0);
exports.UserVipDto = UserVipDto;


/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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


/***/ }),
/* 32 */
/***/ ((module) => {

"use strict";
module.exports = require("bcrypt");

/***/ }),
/* 33 */
/***/ ((module) => {

"use strict";
module.exports = require("class-transformer");

/***/ }),
/* 34 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Public = exports.IS_PUBLIC_KEY = exports.jwtConstants = void 0;
const common_1 = __webpack_require__(4);
exports.jwtConstants = {
    secret: 'yx-yyds',
    expiresIn: '4h',
};
exports.IS_PUBLIC_KEY = 'isPublic';
const Public = () => (0, common_1.SetMetadata)(exports.IS_PUBLIC_KEY, true);
exports.Public = Public;


/***/ }),
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseModule = void 0;
const common_1 = __webpack_require__(4);
const database_providers_1 = __webpack_require__(36);
let DatabaseModule = class DatabaseModule {
};
DatabaseModule = __decorate([
    (0, common_1.Module)({
        providers: [...database_providers_1.DatabaseProviders],
        exports: [...database_providers_1.DatabaseProviders],
    })
], DatabaseModule);
exports.DatabaseModule = DatabaseModule;


/***/ }),
/* 36 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseProviders = void 0;
const typeorm_1 = __webpack_require__(23);
const naming_strategies_1 = __webpack_require__(37);
const user_mysql_entity_1 = __webpack_require__(31);
const utils_1 = __webpack_require__(10);
const goods_mysql_entity_1 = __webpack_require__(74);
const { MYSQL_CONFIG } = (0, utils_1.getConfig)();
const MYSQL_DATABASE_CONFIG = Object.assign(Object.assign({}, MYSQL_CONFIG), { NamedNodeMap: new naming_strategies_1.NamingStrategy(), entities: [user_mysql_entity_1.User, goods_mysql_entity_1.Goods] });
const MYSQL_DATA_SOURCE = new typeorm_1.DataSource(MYSQL_DATABASE_CONFIG);
exports.DatabaseProviders = [
    {
        provide: 'MYSQL_DATA_SOURCE',
        useFactory: async () => {
            if (!MYSQL_DATA_SOURCE.isInitialized)
                await MYSQL_DATA_SOURCE.initialize();
            return MYSQL_DATA_SOURCE;
        },
    },
];


/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NamingStrategy = void 0;
const typeorm_1 = __webpack_require__(23);
const StringUtils_1 = __webpack_require__(38);
class NamingStrategy extends typeorm_1.DefaultNamingStrategy {
    tableName(className, customName) {
        return customName ? customName : (0, StringUtils_1.snakeCase)(className);
    }
    columnName(propertyName, customName, embeddedPrefixes) {
        return ((0, StringUtils_1.snakeCase)(embeddedPrefixes.concat('').join('_')) +
            (customName ? customName : (0, StringUtils_1.snakeCase)(propertyName)));
    }
    relationName(propertyName) {
        return (0, StringUtils_1.snakeCase)(propertyName);
    }
    joinColumnName(relationName, referencedColumnName) {
        return (0, StringUtils_1.snakeCase)(relationName + '_' + referencedColumnName);
    }
    joinTableName(firstTableName, secondTableName, firstPropertyName) {
        return (0, StringUtils_1.snakeCase)(`${firstTableName}_${firstPropertyName.replace(/\./gi, '_')}_${secondTableName}`);
    }
    joinTableColumnName(tableName, propertyName, columnName) {
        return (0, StringUtils_1.snakeCase)(tableName + '_' + (columnName ? columnName : propertyName));
    }
    classTableInheritanceParentColumnName(parentTableName, parentTableIdPropertyName) {
        return (0, StringUtils_1.snakeCase)(parentTableName + '_' + parentTableIdPropertyName);
    }
    eagerJoinRelationAlias(alias, propertyPath) {
        return alias + '__' + propertyPath.replace('.', '_');
    }
}
exports.NamingStrategy = NamingStrategy;


/***/ }),
/* 38 */
/***/ ((module) => {

"use strict";
module.exports = require("typeorm/util/StringUtils");

/***/ }),
/* 39 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserProviders = void 0;
const user_mysql_entity_1 = __webpack_require__(31);
exports.UserProviders = [
    {
        provide: 'USER_REPOSITORY',
        useFactory: (AppDataSource) => AppDataSource.getRepository(user_mysql_entity_1.User),
        inject: ['MYSQL_DATA_SOURCE'],
    },
];


/***/ }),
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(4);
const passport_1 = __webpack_require__(18);
const swagger_1 = __webpack_require__(29);
const auth_service_1 = __webpack_require__(41);
const constants_1 = __webpack_require__(34);
const login_dto_1 = __webpack_require__(42);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(user, req) {
        return await this.authService.login(req.user);
    }
    async getTokenInfo(req) {
        return req.user;
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '用户登录' }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('local')),
    (0, constants_1.Public)(),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof login_dto_1.LoginDto !== "undefined" && login_dto_1.LoginDto) === "function" ? _a : Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: '获取当前登录人信息',
        description: '解密 token 包含的信息',
    }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('/token/info'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getTokenInfo", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)('用户校验'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_b = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _b : Object])
], AuthController);
exports.AuthController = AuthController;


/***/ }),
/* 41 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(4);
const axios_1 = __webpack_require__(16);
const jwt_1 = __webpack_require__(17);
const user_service_1 = __webpack_require__(20);
let AuthService = class AuthService {
    constructor(jwtService, userService, httpService) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.httpService = httpService;
    }
    async login(user) {
        const access_token = await this.jwtService.sign({
            id: user.id,
            username: user.username,
            mobile: user.mobile,
            departmentId: user.departmentId,
        });
        return { access_token };
    }
    async loginWithWechat(code) { }
    async getUser(user) {
        return await this.userService.getUserById(user.id);
    }
    async getUserByName(username) {
        return await this.userService.getUserByName(username);
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, typeof (_b = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _b : Object, typeof (_c = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _c : Object])
], AuthService);
exports.AuthService = AuthService;


/***/ }),
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginDto = void 0;
const swagger_1 = __webpack_require__(29);
const class_validator_1 = __webpack_require__(24);
class LoginDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: '用户名' }),
    (0, class_validator_1.IsNotEmpty)({ message: '请输入用户名' }),
    __metadata("design:type", String)
], LoginDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '密码' }),
    (0, class_validator_1.IsNotEmpty)({ message: '请输入密码' }),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
exports.LoginDto = LoginDto;


/***/ }),
/* 43 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const passport_1 = __webpack_require__(18);
const passport_jwt_1 = __webpack_require__(44);
const business_exception_1 = __webpack_require__(21);
const constants_1 = __webpack_require__(34);
const auth_service_1 = __webpack_require__(41);
const common_1 = __webpack_require__(4);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(authService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: constants_1.jwtConstants.secret,
        });
        this.authService = authService;
    }
    async validate(user) {
        const existUser = await this.authService.getUser(user);
        if (!existUser) {
            throw new business_exception_1.BusinessException('token不正确');
        }
        return existUser;
    }
};
JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], JwtStrategy);
exports.JwtStrategy = JwtStrategy;


/***/ }),
/* 44 */
/***/ ((module) => {

"use strict";
module.exports = require("passport-jwt");

/***/ }),
/* 45 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalStrategy = void 0;
const passport_1 = __webpack_require__(18);
const passport_local_1 = __webpack_require__(46);
const business_exception_1 = __webpack_require__(21);
const bcrypt_1 = __webpack_require__(32);
const auth_service_1 = __webpack_require__(41);
const common_1 = __webpack_require__(4);
let LocalStrategy = class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    constructor(authService) {
        super({
            usernameField: 'username',
            passwordField: 'password',
        });
        this.authService = authService;
    }
    async validate(username, password) {
        const user = await this.authService.getUserByName(username);
        if (!user) {
            throw new business_exception_1.BusinessException('用户名不正确！');
        }
        if (!(0, bcrypt_1.compareSync)(password, user.password)) {
            throw new business_exception_1.BusinessException('密码错误！');
        }
        return user;
    }
};
LocalStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], LocalStrategy);
exports.LocalStrategy = LocalStrategy;


/***/ }),
/* 46 */
/***/ ((module) => {

"use strict";
module.exports = require("passport-local");

/***/ }),
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(4);
const core_1 = __webpack_require__(5);
const passport_1 = __webpack_require__(18);
const business_error_codes_1 = __webpack_require__(22);
const business_exception_1 = __webpack_require__(21);
const constants_1 = __webpack_require__(34);
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(reflector) {
        super();
        this.reflector = reflector;
    }
    canActivate(context) {
        const loginAuth = this.reflector.getAllAndOverride(constants_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (loginAuth) {
            return true;
        }
        return super.canActivate(context);
    }
    getRequest(context) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        return request;
    }
    handleRequest(err, user) {
        if (err || !user) {
            throw (err ||
                new business_exception_1.BusinessException({
                    code: business_error_codes_1.BUSINESS_ERROR_CODE.TOKEN_INVALID,
                    message: '身份验证失败',
                }));
        }
        return user;
    }
};
JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], JwtAuthGuard);
exports.JwtAuthGuard = JwtAuthGuard;


/***/ }),
/* 48 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransformInterceptor = void 0;
const common_1 = __webpack_require__(4);
const operators_1 = __webpack_require__(49);
const core_1 = __webpack_require__(5);
const constants_1 = __webpack_require__(50);
let TransformInterceptor = class TransformInterceptor {
    constructor(reflector) {
        this.reflector = reflector;
    }
    intercept(context, next) {
        const IS_STREAM = this.reflector.getAllAndOverride(constants_1.IS_STREAM_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (IS_STREAM)
            return next.handle().pipe();
        return next.handle().pipe((0, operators_1.map)((data) => ({
            data,
            code: 200,
            extra: {},
            message: '请求成功',
            flag: true,
        })));
    }
};
TransformInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], TransformInterceptor);
exports.TransformInterceptor = TransformInterceptor;


/***/ }),
/* 49 */
/***/ ((module) => {

"use strict";
module.exports = require("rxjs/operators");

/***/ }),
/* 50 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IsStream = exports.IS_STREAM_KEY = void 0;
const common_1 = __webpack_require__(4);
exports.IS_STREAM_KEY = 'isStream';
const IsStream = () => (0, common_1.SetMetadata)(exports.IS_STREAM_KEY, true);
exports.IsStream = IsStream;


/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AllExceptionsFilter = void 0;
const common_1 = __webpack_require__(4);
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        request.log.error(exception);
        response.status(common_1.HttpStatus.SERVICE_UNAVAILABLE).send({
            status: common_1.HttpStatus.SERVICE_UNAVAILABLE,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: new common_1.ServiceUnavailableException().getResponse(),
        });
    }
};
AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
exports.AllExceptionsFilter = AllExceptionsFilter;


/***/ }),
/* 52 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpExceptionFilter = void 0;
const common_1 = __webpack_require__(4);
const business_exception_1 = __webpack_require__(21);
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        request.log.error(exception);
        if (exception instanceof business_exception_1.BusinessException) {
            const error = exception.getResponse();
            response.status(common_1.HttpStatus.OK).send({
                data: null,
                code: error['code'],
                extra: {},
                message: error['message'],
                flag: false,
            });
            return;
        }
        response.status(status).send({
            status: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exception.getResponse(),
        });
    }
};
HttpExceptionFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], HttpExceptionFilter);
exports.HttpExceptionFilter = HttpExceptionFilter;


/***/ }),
/* 53 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FastifyLogger = void 0;
const path_1 = __webpack_require__(12);
const logger_1 = __webpack_require__(54);
const logOptions = {
    console: process.env.NODE_ENV !== 'production',
    level: 'info',
    serializers: {
        req: (req) => {
            return {
                method: req.method,
                url: req.url,
            };
        },
    },
    fileName: (0, path_1.join)(process.cwd(), 'logs/platform.log'),
    maxBufferLength: 4096,
    flushInterval: 1000,
    logRotator: {
        byHour: true,
        byDay: false,
        hourDelimiter: '_',
    },
};
exports.FastifyLogger = (0, logger_1.fastLogger)(logOptions);


/***/ }),
/* 54 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fastLogger = void 0;
const path_1 = __webpack_require__(12);
const fileStream_1 = __webpack_require__(55);
const logStream_1 = __webpack_require__(58);
const multiStream = (__webpack_require__(63).multistream);
function asReqValue(req) {
    if (req.raw) {
        req = req.raw;
    }
    let device_id, tt_webid;
    if (req.headers.cookie) {
        device_id = req.headers.cookie.match(/device_id=([^;&^\s]+)/);
        tt_webid = req.headers.cookie.match(/tt_webid=([^;&^\s]+)/);
    }
    device_id && (device_id = device_id[1]);
    tt_webid && (tt_webid = tt_webid[1]);
    return {
        id: req.id,
        method: req.method,
        url: req.url,
        remoteAddress: req.connection ? req.connection.remoteAddress : '',
        remotePort: req.connection ? req.connection.remotePort : '',
        device_id,
        tt_webid,
    };
}
const reqIdGenFactory = () => {
    const maxInt = 2147483647;
    let nextReqId = 0;
    return (req) => {
        return (req.headers['X-TT-logId'] ||
            req.headers['x-tt-logId'] ||
            (nextReqId = (nextReqId + 1) & maxInt));
    };
};
const fastLogger = (opt) => {
    const reOpt = Object.assign({ console: !process.env.NODE_ENV || process.env.NODE_ENV === 'development', level: 'info', fileName: (0, path_1.join)(process.cwd(), 'logs/fastify.log'), genReqId: reqIdGenFactory(), serializers: {
            req: asReqValue,
        }, formatOpts: {
            lowres: true,
        } }, opt);
    const allStreams = [
        {
            stream: new fileStream_1.FileStream(reOpt).trans,
        },
    ];
    if (reOpt.console) {
        allStreams.push({
            stream: new logStream_1.LogStream().trans,
        });
    }
    reOpt.stream = multiStream(allStreams);
    return reOpt;
};
exports.fastLogger = fastLogger;


/***/ }),
/* 55 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileStream = void 0;
const path_1 = __webpack_require__(12);
const fs_1 = __webpack_require__(13);
const assert = __webpack_require__(56);
const mkdirp = __webpack_require__(57);
const logStream_1 = __webpack_require__(58);
const defaultOptions = {
    maxBufferLength: 4096,
    flushInterval: 1000,
    logRotator: {
        byHour: true,
        byDay: false,
        hourDelimiter: '_',
    },
};
const onError = (err) => {
    console.error('%s ERROR %s [chair-logger:buffer_write_stream] %s: %s\n%s', new Date().toString(), process.pid, err.name, err.message, err.stack);
};
const fileExists = async (srcPath) => {
    return new Promise((resolve) => {
        (0, fs_1.stat)(srcPath, (err, stats) => {
            if (!err && stats.isFile()) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        });
    });
};
const fileRename = async (oldPath, newPath) => {
    return new Promise((resolve) => {
        (0, fs_1.rename)(oldPath, newPath, (e) => {
            resolve(e ? false : true);
        });
    });
};
class FileStream extends logStream_1.LogStream {
    constructor(options) {
        super(options);
        this.options = {};
        this._stream = null;
        this._timer = null;
        this._bufSize = 0;
        this._buf = [];
        this.lastPlusName = '';
        this._RotateTimer = null;
        assert(options.fileName, 'should pass options.fileName');
        this.options = Object.assign({}, defaultOptions, options);
        this._stream = null;
        this._timer = null;
        this._bufSize = 0;
        this._buf = [];
        this.lastPlusName = this._getPlusName();
        this.reload();
        this._RotateTimer = this._createRotateInterval();
    }
    log(data) {
        data = this.format(this.jsonParse(data));
        if (data)
            this._write(data + '\n');
    }
    reload() {
        this.close();
        this._stream = this._createStream();
        this._timer = this._createInterval();
    }
    reloadStream() {
        this._closeStream();
        this._stream = this._createStream();
    }
    close() {
        this._closeInterval();
        if (this._buf && this._buf.length > 0) {
            this.flush();
        }
        this._closeStream();
    }
    end() {
        console.log('transport.end() is deprecated, use transport.close()');
        this.close();
    }
    _write(buf) {
        this._bufSize += buf.length;
        this._buf.push(buf);
        if (this._buf.length > this.options.maxBufferLength) {
            this.flush();
        }
    }
    _createStream() {
        mkdirp.sync((0, path_1.dirname)(this.options.fileName));
        const stream = (0, fs_1.createWriteStream)(this.options.fileName, { flags: 'a' });
        stream.on('error', onError);
        return stream;
    }
    _closeStream() {
        if (this._stream) {
            this._stream.end();
            this._stream.removeListener('error', onError);
            this._stream = null;
        }
    }
    flush() {
        if (this._buf.length > 0) {
            this._stream.write(this._buf.join(''));
            this._buf = [];
            this._bufSize = 0;
        }
    }
    _createInterval() {
        return setInterval(() => {
            this.flush();
        }, this.options.flushInterval);
    }
    _closeInterval() {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
    }
    _createRotateInterval() {
        return setInterval(() => {
            this._checkRotate();
        }, 1000);
    }
    _checkRotate() {
        const plusName = this._getPlusName();
        if (plusName === this.lastPlusName) {
            return;
        }
        this.lastPlusName = plusName;
        this.renameOrDelete(this.options.fileName, this.options.fileName + plusName)
            .then(() => {
            this.reloadStream();
        })
            .catch((e) => {
            console.log(e);
            this.reloadStream();
        });
    }
    _getPlusName() {
        let plusName;
        const date = new Date();
        if (this.options.logRotator.byHour) {
            plusName = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}${this.options.logRotator.hourDelimiter}${date.getHours()}`;
        }
        else {
            plusName = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        }
        return `.${plusName}`;
    }
    async renameOrDelete(srcPath, targetPath) {
        if (srcPath === targetPath) {
            return;
        }
        const srcExists = await fileExists(srcPath);
        if (!srcExists) {
            return;
        }
        const targetExists = await fileExists(targetPath);
        if (targetExists) {
            console.log(`targetFile ${targetPath} exists!!!`);
            return;
        }
        await fileRename(srcPath, targetPath);
    }
}
exports.FileStream = FileStream;


/***/ }),
/* 56 */
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),
/* 57 */
/***/ ((module) => {

"use strict";
module.exports = require("mkdirp");

/***/ }),
/* 58 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogStream = void 0;
const chalk = __webpack_require__(59);
const dayjs = __webpack_require__(60);
const split = __webpack_require__(61);
const JSONparse = __webpack_require__(62);
const levels = {
    [60]: 'Fatal',
    [50]: 'Error',
    [40]: 'Warn',
    [30]: 'Info',
    [20]: 'Debug',
    [10]: 'Trace',
};
const colors = {
    [60]: 'magenta',
    [50]: 'red',
    [40]: 'yellow',
    [30]: 'blue',
    [20]: 'white',
    [10]: 'white',
};
class LogStream {
    constructor(opt) {
        this.trans = split((data) => {
            this.log(data);
        });
        if ((opt === null || opt === void 0 ? void 0 : opt.format) && typeof opt.format === 'function') {
            this.customFormat = opt.format;
        }
    }
    log(data) {
        data = this.jsonParse(data);
        const level = data.level;
        data = this.format(data);
        console.log(chalk[colors[level]](data));
    }
    jsonParse(data) {
        return JSONparse(data).value;
    }
    format(data) {
        var _a, _b;
        if (this.customFormat) {
            return this.customFormat(data);
        }
        const Level = levels[data.level];
        const DateTime = dayjs(data.time).format('YYYY-MM-DD HH:mm:ss.SSS A');
        const logId = data.reqId || '_logId_';
        let reqInfo = '[-]';
        if (data.req) {
            reqInfo = `[${data.req.remoteAddress || ''} - ${data.req.method} - ${data.req.url}]`;
        }
        if (data.res) {
            reqInfo = JSON.stringify(data.res);
        }
        if (((_a = data === null || data === void 0 ? void 0 : data.req) === null || _a === void 0 ? void 0 : _a.url) && ((_b = data === null || data === void 0 ? void 0 : data.req) === null || _b === void 0 ? void 0 : _b.url.indexOf('/api/doc')) !== -1) {
            return null;
        }
        return `${Level} | ${DateTime} | ${logId} | ${reqInfo} | ${data.stack || data.msg}`;
    }
}
exports.LogStream = LogStream;


/***/ }),
/* 59 */
/***/ ((module) => {

"use strict";
module.exports = require("chalk");

/***/ }),
/* 60 */
/***/ ((module) => {

"use strict";
module.exports = require("dayjs");

/***/ }),
/* 61 */
/***/ ((module) => {

"use strict";
module.exports = require("split2");

/***/ }),
/* 62 */
/***/ ((module) => {

"use strict";
module.exports = require("fast-json-parse");

/***/ }),
/* 63 */
/***/ ((module) => {

"use strict";
module.exports = require("pino-multi-stream");

/***/ }),
/* 64 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateDocument = void 0;
const swagger_1 = __webpack_require__(29);
const packageConfig = __webpack_require__(65);
const generateDocument = (app) => {
    const options = new swagger_1.DocumentBuilder()
        .setTitle(packageConfig.name)
        .setDescription(packageConfig.description)
        .setVersion(packageConfig.version)
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('/swagger-ui.html', app, document);
};
exports.generateDocument = generateDocument;


/***/ }),
/* 65 */
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"plateform","version":"0.0.1","description":"后端管理系统项目——nest","author":"","private":true,"license":"UNLICENSED","scripts":{"prebuild":"rimraf dist","build":"nest build","format":"prettier --write \\"src/**/*.ts\\" \\"test/**/*.ts\\"","start":"nest start","start:dev":"cross-env RUNNING_ENV=dev nest start --watch","start:hotdev":"cross-env RUNNING_ENV=dev nest build --webpack --webpackPath webpack-hmr.config.js --watch","start:debug":"cross-env RUNNING_ENV=dev nest start --debug --watch","start:prod":"cross-env RUNNING_ENV=prod node dist/main","lint":"eslint \\"{src,apps,libs,test}/**/*.ts\\" --fix","test":"cross-env RUNNING_ENV=test jest","test:watch":"jest --watch","test:cov":"jest --coverage","test:debug":"node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand","test:e2e":"jest --config ./test/jest-e2e.json"},"dependencies":{"@fastify/cookie":"^7.2.0","@fastify/static":"^6.4.0","@nestjs/axios":"^0.1.0","@nestjs/common":"^8.0.0","@nestjs/config":"^2.2.0","@nestjs/core":"9.0.1","@nestjs/jwt":"^9.0.0","@nestjs/microservices":"^9.0.4","@nestjs/mongoose":"^9.2.0","@nestjs/passport":"^9.0.0","@nestjs/platform-express":"^8.0.0","@nestjs/platform-fastify":"9.0.1","@nestjs/swagger":"^6.0.3","@nestjs/typeorm":"^9.0.0","bcrypt":"^5.0.1","cache-manager":"^4.1.0","cache-manager-redis-store":"^2.0.0","chalk":"4.1.2","class-transformer":"^0.5.1","class-validator":"^0.13.2","cookie-parser":"^1.4.6","dayjs":"^1.11.3","fast-json-parse":"^1.0.3","fastify":"^4.2.1","fs-extra":"^10.1.0","lodash":"^4.17.21","mkdirp":"^1.0.4","mongoose":"^6.4.5","mysql2":"^2.3.3","nestjs-typeorm-paginate":"^4.0.1","passport":"^0.6.0","passport-custom":"^1.1.1","passport-jwt":"^4.0.0","passport-local":"^1.0.0","pino-multi-stream":"^6.0.0","redis":"^4.2.0","reflect-metadata":"^0.1.13","rimraf":"^3.0.2","rxjs":"^7.2.0","split2":"^4.1.0","typeorm":"^0.3.7","yaml":"^2.1.1"},"devDependencies":{"@nestjs/cli":"^8.0.0","@nestjs/schematics":"^8.0.0","@nestjs/testing":"^8.0.0","@types/bcrypt":"^5.0.0","@types/cache-manager":"^4.0.1","@types/express":"^4.17.13","@types/jest":"27.5.0","@types/node":"^16.0.0","@types/passport":"^1.0.9","@types/passport-local":"^1.0.34","@types/supertest":"^2.0.11","@typescript-eslint/eslint-plugin":"^5.0.0","@typescript-eslint/parser":"^5.0.0","cross-env":"^7.0.3","eslint":"^8.0.1","eslint-config-prettier":"^8.3.0","eslint-plugin-prettier":"^4.0.0","jest":"28.0.3","prettier":"^2.3.2","run-script-webpack-plugin":"^0.1.1","source-map-support":"^0.5.20","supertest":"^6.1.3","ts-jest":"28.0.1","ts-loader":"^9.2.3","ts-node":"^10.0.0","tsconfig-paths":"4.0.0","typescript":"^4.3.5","webpack":"^5.73.0","webpack-node-externals":"^3.0.0"},"jest":{"moduleFileExtensions":["js","json","ts"],"rootDir":"src","testRegex":".*\\\\.spec\\\\.ts$","transform":{"^.+\\\\.(t|j)s$":"ts-jest"},"collectCoverageFrom":["**/*.(t|j)s"],"coverageDirectory":"../coverage","testEnvironment":"node"}}');

/***/ }),
/* 66 */
/***/ ((module) => {

"use strict";
module.exports = require("cookie-parser");

/***/ }),
/* 67 */
/***/ ((module) => {

"use strict";
module.exports = require("@fastify/cookie");

/***/ }),
/* 68 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.catchError = void 0;
const catchError = () => {
    process.on('unhandledRejection', (reason, p) => {
        console.log('Promise: ', p, 'Reason: ', reason);
    });
};
exports.catchError = catchError;


/***/ }),
/* 69 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
/* 70 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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


/***/ }),
/* 71 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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


/***/ }),
/* 72 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
/* 73 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

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
/* 74 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("main." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("6bc6afd709fbe049cef6")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises = 0;
/******/ 		var blockingPromisesWaiting = [];
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		// eslint-disable-next-line no-unused-vars
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId) {
/******/ 				return trackBlockingPromise(require.e(chunkId));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results);
/******/ 		}
/******/ 		
/******/ 		function unblock() {
/******/ 			if (--blockingPromises === 0) {
/******/ 				setStatus("ready").then(function () {
/******/ 					if (blockingPromises === 0) {
/******/ 						var list = blockingPromisesWaiting;
/******/ 						blockingPromisesWaiting = [];
/******/ 						for (var i = 0; i < list.length; i++) {
/******/ 							list[i]();
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 				/* fallthrough */
/******/ 				case "prepare":
/******/ 					blockingPromises++;
/******/ 					promise.then(unblock, unblock);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises === 0) return fn();
/******/ 			return new Promise(function (resolve) {
/******/ 				blockingPromisesWaiting.push(function () {
/******/ 					resolve(fn());
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							},
/******/ 							[])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								} else {
/******/ 									return setStatus("ready").then(function () {
/******/ 										return updatedModules;
/******/ 									});
/******/ 								}
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error(
/******/ 						"apply() is only allowed in ready status (state: " +
/******/ 							currentStatus +
/******/ 							")"
/******/ 					);
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = __webpack_require__.hmrS_require = __webpack_require__.hmrS_require || {
/******/ 			0: 1
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no chunk install function needed
/******/ 		
/******/ 		// no chunk loading
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			var update = require("./" + __webpack_require__.hu(chunkId));
/******/ 			var updatedModules = update.modules;
/******/ 			var runtime = update.runtime;
/******/ 			for(var moduleId in updatedModules) {
/******/ 				if(__webpack_require__.o(updatedModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = updatedModules[moduleId];
/******/ 					if(updatedModulesList) updatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 		}
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.requireHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.require = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.require = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				} else {
/******/ 					currentUpdateChunks[chunkId] = false;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.requireHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						!currentUpdateChunks[chunkId]
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = function() {
/******/ 			return Promise.resolve().then(function() {
/******/ 				return require("./" + __webpack_require__.hmrF());
/******/ 			})['catch'](function(err) { if(err.code !== 'MODULE_NOT_FOUND') throw err; });
/******/ 		}
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__(0);
/******/ 	var __webpack_exports__ = __webpack_require__(3);
/******/ 	
/******/ })()
;