import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
export declare class UserController {
    private readonly userService;
    private readonly configService;
    constructor(userService: UserService, configService: ConfigService);
    getTestName(): any;
    findAll(): string;
}
