import { MSG_TYPE, RECEIVE_TYPE } from 'src/helper/feishu/message';
export declare class GetUserTokenDto {
    code: string;
    app_token: string;
}
export declare class FeishuUserInfoDto {
    accessToken?: string;
    email: string;
    avatarUrl: string;
    avatarThumb: string;
    avatarBig: string;
    avatarMiddle: string;
    mobile: string;
    enName: string;
    name: string;
    feishuUserId: string;
    feishuUnionId: string;
}
export declare class FeishuMessageDto {
    receive_id_type: RECEIVE_TYPE;
    receive_id?: string;
    content?: string;
    msg_type?: keyof MSG_TYPE;
}
