import { Strategy } from 'passport-local';
import { UserService } from 'src/userCenter/user/user.service';
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private readonly userServies;
    constructor(userServies: UserService);
    validate(username: string, password: string): Promise<import("../../userCenter/user/entities/user.mysql.entity").User>;
}
export {};
