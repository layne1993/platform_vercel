import request from '@/utils/rest';

/**
 * 获取管理人列表
 * @param params
 * @returns
 */
export function getManagerList(params = {}) {
    return request.postJSON('/staggingnewRelatedParty/getPageList', params);
}

/**
 * 创建管理人
 * @param params
 * @returns
 */
export function createManager(params = {}) {
    return request.postJSON('/staggingnewRelatedParty/addParty', params);
}

/**
 * 编辑管理人
 * @param params
 * @returns
 */
export function updateManager(params = {}) {
    return request.postJSON('/staggingnewRelatedParty/updateParty', params);
}

/**
 * 删除管理人
 * @param params
 * @returns
 */
export function deleteManager(params = { id: '' }) {
    return request.postJSON(`/staggingnewRelatedParty/deleteParty?id=${params.id}`, {});
}
