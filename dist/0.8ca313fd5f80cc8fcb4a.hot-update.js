"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 43:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalStrategy = void 0;
const passport_1 = __webpack_require__(18);
const passport_local_1 = __webpack_require__(44);
const business_exception_1 = __webpack_require__(26);
const bcrypt_1 = __webpack_require__(22);
class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    constructor(authService) {
        super({
            usernameField: 'username',
            passwordField: 'password',
        });
        this.authService = authService;
    }
    async validate(username, password) {
        console.info('test', this.authService, 'fdfdf');
        const user = await this.authService.getUserByName(username);
        if (!user) {
            throw new business_exception_1.BusinessException('用户名不正确！');
        }
        if (!(0, bcrypt_1.compareSync)(password, user.password)) {
            throw new business_exception_1.BusinessException('密码错误！');
        }
        return user;
    }
}
exports.LocalStrategy = LocalStrategy;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("7519a96eab76ce5cf5f6")
/******/ })();
/******/ 
/******/ }
;