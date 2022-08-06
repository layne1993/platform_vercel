import { MongoRepository } from 'typeorm';
import { User } from './entities/user.mysql.entity';
export declare class UserService {
    private userRepository;
    constructor(userRepository: MongoRepository<User>);
    findAll(): string;
}
