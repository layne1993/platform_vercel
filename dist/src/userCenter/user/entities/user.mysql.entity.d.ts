export declare enum UserStatus {
    disabled = 0,
    enabled = 1
}
export declare class User {
    id: string;
    username: string;
    nickName?: string;
    password: string;
    avatarUrl: string;
    avatarThumb?: string;
    avatarBig?: string;
    avatarMiddle?: string;
    email?: string;
    mobile: string;
    departmentName?: string;
    departmentId?: string;
    status?: UserStatus;
    createTime: Date;
    updateTime: Date;
    encryptPwd(): Promise<void>;
}
