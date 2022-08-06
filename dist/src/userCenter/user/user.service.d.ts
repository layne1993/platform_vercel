import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
import { User } from './entities/user.mysql.entity';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    register(createUserDto: CreateUserDto): Promise<User>;
    profile(id: any): Promise<User>;
    getUserByName(username: any): Promise<User>;
}
