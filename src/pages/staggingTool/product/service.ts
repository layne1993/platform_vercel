import request from '@/utils/rest';

/**
 * @description 配售对象信息维护--获取列表
 * @param params
 * @returns
 */
export async function getInfoList(params) {
    return request.postJSON('/staggingnewApplyProduct/getProductCapitalList', params);
}
// 获取出资方自动更新状态
export async function getLpRefreshStatus(params) {
    return request.get('/staggingnew/lp/getLpRefreshStatus', params);
}
// 更新出资方数据自动开关
export async function updateLpRefreshStatus(params) {
    return request.postJSON('/staggingnew/lp/updateLpRefreshStatus', params);
}

