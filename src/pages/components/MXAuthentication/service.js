/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-10-30 14:02:19
 * @LastEditTime: 2021-05-28 17:31:40
 */
import request from '@/utils/rest';

// 查询实名信息列表
export async function realNameList(params) {
    return request.postJSON('/realNameInfo/list', params);
}

// 查询实名信息详情
export async function realDetail(params) {
    return request.get('/realNameInfo/detail', params);
}

// 实名信息审核
export async function realNameAudit(params) {
    return request.postJSON('/realNameInfo/audit', params);
}

// 获取实名信息配置
export async function getRealnameSetting(params) {
    return request.get('/realnameSetting/getSetting', params);
}

// 修改实名信息配置
export async function createOrUpdate(params) {
    return request.postMultipart('/realnameSetting/createOrUpdate', params);
}


// 更新用户信息
export async function updateCustomerInfo(params) {
    return request.postJSON('/customer/update', params);
}

// 获取风险测评--列表
export async function riskRecordList(params) {
    return request.postJSON('/riskRecord/list', params);
}


// 风险测评--新建
export async function riskRecordCreate(params) {
    return request.postJSON('/riskRecord/create', params);
}


// 风险测评--详情
export async function riskRecordDetail(params) {
    return request.get('/riskRecord/detail', params);
}

// 风险测评--编辑
export async function riskRecordEdit(params) {
    return request.put('/riskRecord/edit', params);
}


// 风险测评--批量下载
export async function batchDownload(params) {
    return request.get('/riskRecord/download', params);
}


