import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/userCenter/user/user.service';
export declare class AuthService {
    private jwtService;
    private userService;
    private httpService;
    constructor(jwtService: JwtService, userService: UserService, httpService: HttpService);
    login(user: Payload): Promise<{
        access_token: string;
    }>;
    loginWithWechat(code: any): Promise<void>;
    getUser(user: Payload): Promise<import("../userCenter/user/entities/user.mysql.entity").User>;
}
