import { FeishuMessageDto, GetUserTokenDto } from './feishu.dto';
import { FeishuService } from './feishu.service';
export declare class FeishuController {
    private readonly feishuService;
    constructor(feishuService: FeishuService);
    sendMessage(params: FeishuMessageDto): Promise<any>;
    getUserToken(params: GetUserTokenDto): Promise<any>;
}
