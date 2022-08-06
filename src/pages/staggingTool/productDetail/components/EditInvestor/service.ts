import request from '@/utils/rest';

/**
 * @description 打新申请-创建打新申请
 * @param params
 * @returns
 */
export async function staggingCreate(params) {
    return request.postJSON('/stagging/apply/create', params);
}

/**
 * @description 股票管理-获取单个标的信息
 * @param params
 * @returns
 */
export async function staggingFind(params) {
    return request.get('/stock/find', params);
}
