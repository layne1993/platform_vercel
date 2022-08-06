"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 15:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
const user_module_1 = __webpack_require__(24);
const auth_controller_1 = __webpack_require__(37);
const auth_service_1 = __webpack_require__(38);
const constants_1 = __webpack_require__(39);
const jwt_strategy_1 = __webpack_require__(41);
const local_strategy_1 = __webpack_require__(43);
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
        imports: [axios_1.HttpModule, user_module_1.UserModule, passport_1.PassportModule, jwtModule],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, local_strategy_1.LocalStrategy],
        exports: [jwtModule, auth_service_1.AuthService],
    })
], AuthModule);
exports.AuthModule = AuthModule;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("b6d18055522df954ae29")
/******/ })();
/******/ 
/******/ }
;