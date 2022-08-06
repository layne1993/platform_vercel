import { HttpException } from '@nestjs/common';
declare type BusinessError = {
    code: number;
    message: string;
};
export declare class BusinessException extends HttpException {
    constructor(err: BusinessError | string);
    static throwForbidden(): void;
    static throwPermissionDisabled(): void;
    static throwUserDisabled(): void;
}
export {};
