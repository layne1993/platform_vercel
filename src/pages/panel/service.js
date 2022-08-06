/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-04-01 09:56:23
 * @LastEditTime: 2021-07-26 15:52:09
 */
import request from '@/utils/rest';

export async function queryProjectNotice(params) {
    return request.post('/api/project/notice', params);
}
export async function queryActivities(params) {
    return request.post('/api/activities', params);
}
export async function fakeChartData(params) {
    return request.post('/api/fake_chart_data', params);
}
// export async function queryCurrent() {
//   return request.post('/api/currenInfo');
// }
//  面板 产品签约次数统计
export async function queryProductSignData(params) {
    return request.get('/pannel/queryProductSignData', params);
    // return request.get('/api/queryProductSignData', params);
}
//  面板 合格投资者认定数据统计
export async function queryIdentifyData(params) {
    return request.get('/pannel/queryIdentifyData', params);
    // return request.get('/api/queryIdentifyData', params);
}
//  面板 待处理流程列表数据
export async function queryFlowList(params) {
    return request.get('/pannel/queryFlowList', params);
    // return request.get('/api/queryFlowList', params);
}
//  面板 头部信息
export async function queryHeadInfo(params) {
    return request.get('/pannel/queryHeadInfo', params);
    // return request.get('/api/queryHeadInfo', params);
}

// 获取绝对路径前半段
export async function queryServer(params) {
    return request.get('/attachment/queryServer', params);
}

// 更新投资者版本
export async function Refresh(params) {
    return request.get('/pannel/refresh', params);
}



// 待处理流程-查询
export async function queryList(params) {
    return request.postJSON('/panel/pendingProcesses', params);
}

// 待处理流程-查询
export async function queryNoticeList(params) {
    return request.postJSON('/panel/getNotification', params);
}

// 交易统计-查询
export async function queryTradeTimes(params) {
    return request.postJSON('/panel/getTradeTimes', params);
}

// 提醒日历-查询
export async function queryReminders(params) {
    return request.postJSON('/panel/reminders', params);
}

// 提醒日历-查询
export async function queryDataStatistics(params) {
    return request.postJSON('/panel/dataStatistics', params);
}

// 查询产品预约是否需要审核
export async function queryIsNeedAudit(params) {
    return request.get('/productSetting/default/detail', params);
}


// 流程通知
export async function pendingProcessesAndNotification(params) {
    return request.get('/panel/pendingProcessesAndNotification', params);
}

// 已读
export async function isReadTrue(params) {
    return request.postJSON('/panel/isReadTrue', params);
}

// 新增自定义提醒
export async function addRemind(params) {
    return request.postJSON('/panel/addRemind', params);
}

// 自定义提醒删除
export async function deleteRemind(params) {
    return request.get('/panel/deleteRemind', params);
}
