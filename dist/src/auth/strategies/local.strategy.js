"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_local_1 = require("passport-local");
const business_exception_1 = require("../../common/exceptions/business.exception");
const bcrypt_1 = require("bcrypt");
class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    constructor(userServies) {
        super({
            usernameField: 'username',
            passwordField: 'password',
        });
        this.userServies = userServies;
    }
    async validate(username, password) {
        const user = await this.userServies.getUserByName(username);
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
//# sourceMappingURL=local.strategy.js.map