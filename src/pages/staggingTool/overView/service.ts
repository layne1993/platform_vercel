import request from '@/utils/rest';

/**
 * 获取IPO日历信息
 * @param params
 */
export function getIPOCalendarData(params) {
    return request.postJSON('/stager/querylistIPO', params);
}

/**
 * 搜索标的
 * @param params
 */
export function getStockByKeyword(params) {
    return request.get('/stager/queryListBySecuCodeOrSecurityAbbr', params);
}

/**
 * 获取当天的待办事项
 * @param params
 */
export function getCurrentTodoList(params) {
    return request.get('/stager/getPendingList', params);
}

/**
 * 创建待办事项
 * @param params
 */
export function submitTodoInfo(params) {
    return request.postJSON('/stager/addPendingInfo', params);
}

/**
 * 更新待办为已处理
 * @param params
 */
export function updateTodoStatus(params) {
    return request.postJSON(`/stager/handlePendingInfo?id=${params.id}`, {});
}
