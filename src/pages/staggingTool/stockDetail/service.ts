import request from '@/utils/rest';

/**
 * 查询可以参与打新的产品列表
 * @param params
 * @returns
 */
export function getCanApplyProductList(params) {
    return request.post('/stager/queryParticipateSecuCode', params);
}

/**
 * 参与打新并生成文件
 * @param params
 * @returns
 */
export function addProductsMaterials(params) {
    return request.postJSON('/staggingnew/addProductsMaterials', params);
}

/**
 * 查询标的详情
 * @param params
 * @returns
 */
export function getStockInfoById(params) {
    return request.postJSON('/stager/selectCodeInformationList', params);
}

/**
 * 完成当前的IPO步骤
 * @param params
 * @returns
 */
export function finishCurrentIPOStep(params) {
    return request.postJSON('/staggingnew/apply/nextstep', params);
}

/**
 * 获取标的IPO详情
 * @param params
 * @returns
 */
export function getStockIPOStepDetail(params) {
    return request.postJSON('/staggingnew/apply/stepdetail', params);
}

/**
 * 查询参与打新的产品列表
 * @param params
 * @returns
 */
export function getApplyProductList(params) {
    return request.postJSON('/staggingnewApplyProduct/getPageList', params);
}

/**
 * 查询所有参与打新的产品列表
 * @param params
 * @returns
 */
export function getAllApplyProductList(params) {
    return request.postJSON('/staggingnewApplyProduct/getList', params);
}

/**
 * 获取材料包分包压缩包（承诺函，关联方等4种）
 * @param params
 * @returns
 */
export function getStaggingMaterials(params) {
    return request.postJSON('/staggingnew/apply/getMaterials', params);
}

/**
 * 获取标的的打新状态
 * @param params
 */
export function queryApplyBySecuCode(params) {
    return request.get('/stager/queryApplyBySecuCode', params);
}

/**
 * 重新生成打新资料包
 * @param params
 * @returns
 */
export function reGenAllAttachments(params) {
    return request.postJSON('/staggingnew/resetAllAttachments', params);
}
