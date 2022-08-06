import { AuthService } from '../auth.service';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(user: Payload): Promise<import("../../userCenter/user/entities/user.mysql.entity").User>;
}
export {};
