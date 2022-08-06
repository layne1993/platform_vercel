import request from '@/utils/rest';

/**
 * 获取承销商列表
 * @param params
 * @returns
 */
export function getUnderwriterList(params = {}) {
    return request.postJSON('/underwriterCompany/getPageList', params);
}

/**
 * 编辑承销商用户名密码
 * @param params
 * @returns
 */
export function updateUnderwriter(params = {}) {
    return request.postJSON('/underwriterCompany/updateParty', params);
}
