import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/user.dto';
export declare class UserController {
    private readonly userService;
    private readonly configService;
    constructor(userService: UserService, configService: ConfigService);
    register(createUserDto: CreateUserDto): Promise<import("./entities/user.mysql.entity").User>;
}
