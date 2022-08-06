import request from '@/utils/rest';

/**
 * @description 根据产品Id获取出资方列表
 * @param params
 * @returns
 */
export async function getInvestorByPid(params) {
    return request.postJSON('/staggingnew/lp/query', params);
}

/**
 * @description 股票管理-获取单个标的信息
 * @param params
 * @returns
 */
export async function staggingFind(params) {
    return request.get('/stock/find', params);
}
