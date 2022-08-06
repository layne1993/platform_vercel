"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 37:
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
exports.AuthController = void 0;
const common_1 = __webpack_require__(4);
const passport_1 = __webpack_require__(18);
const swagger_1 = __webpack_require__(29);
const auth_service_1 = __webpack_require__(38);
const constants_1 = __webpack_require__(39);
const login_dto_1 = __webpack_require__(40);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(user, req) {
        console.log(user, req, 'user');
        return await this.authService.login(req.user);
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
AuthController = __decorate([
    (0, swagger_1.ApiTags)('验证'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_b = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _b : Object])
], AuthController);
exports.AuthController = AuthController;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("8d51e83a8ca1b7ca4807")
/******/ })();
/******/ 
/******/ }
;