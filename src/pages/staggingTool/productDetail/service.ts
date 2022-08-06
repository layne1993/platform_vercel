import request from '@/utils/rest';

/**
 * @description 根据产品Id获取出资方列表
 * @param params
 * @returns
 */
export function getInvestorByPid(data, params = { }) {
    return request.post(`/staggingnew/lp/query?productId=${data}`, params);
}
/**
 * @description 配售对象-获取打新所需基本信息
 * @param params
 * @returns
 */
export function getStaggingProductBaseInfo(data, params) {
    return request.getBasicInfo(`/stager/getStaggingProductBaseInfo?id=${data}`, params);
}
/**
 * @description 配售对象-保存打新所需基本信息
 * @param params
 * @returns
 */
export function saveStaggingProductBaseInfo(params) {
    return request.postJSON('/stager/saveStaggingProductBaseInfo', params);
}

/**
 * 获取子层级出资方列表
 * @param params
 * @returns
 */
export function getSubInvestorList(params) {
    return request.postJSON('/staggingnew/lp/level/queryLpList', params);
}

/**
 * 更新出资方的是否自有资金字段
 * @param params
 * @returns
 */
export function updatePrivateMoney(params) {
    return request.postJSON('/staggingnew/lp/privateMoney', params);
}

/**
 * 获取出资方的证件类型
 * @param params
 */
export function getCardTypeList(params) {
    return request.postJSON('/staggingnew/lp/cardType', params);
}

/**
 * 获取出资方的资金类型
 * @param params
 * @returns
 */
export function getAmountTypeList(params) {
    return request.postJSON('/staggingnew/lp/investAmountType', params);
}

/**
 * 获取出资方的资金类型
 * @param params
 * @returns
 */
export function getJoinTypeList(params) {
    return request.postJSON('/staggingnew/lp/lpInvestType', params);
}

/**
 * 新建出资方
 */
export function createInvestorLevel(params) {
    return request.postJSON('/staggingnew/lp/level/create', params);
}

/**
 * 编辑出资方
 * @param params
 */
export function editInvestorLevel(params) {
    return request.postJSON('/staggingnew/lp/level/edit', params);
}

/**
 * 删除出资方
 * @param params
 * @returns
 */
export function deleteInvestorLvel(params) {
    return request.postJSON('/staggingnew/lp/level/delete', params);
}

/**
 * 出资方基本信息表全量导入
 * @param params
 * @returns
 */
export function allImport(params) {
    return request.postMultipart('/staggingnew/allImport', params);
}
