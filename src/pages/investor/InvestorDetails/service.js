/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-10-30 14:02:19
 * @LastEditTime: 2021-02-25 15:52:15
 */
import request from '@/utils/rest';

// 查询客户信息
export async function queryCustomerInfo(params) {
    return request.postForm('/customer/findByCustomerId', params);
}

// 下拉获取客户经理账号
export async function getManagers(params) {
    return request.postForm('/customer/getManagers', params);
}

// 创建保存用户信息
export async function createCustomerInfo(params) {
    return request.postMultipart('/customer/create', params);
}

// 上传身份证照片
export async function uploadIdentifyCard(params) {
    return request.postMultipart('/customer/uploadIdentifyCard', params);
}

// 获取销售商列表
export async function getAgencies(params) {
    return request.postForm('/customer/getAgencies', params);
}


// 更新用户信息
export async function updateCustomerInfo(params) {
    return request.postMultipart('/customer/update', params);
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


// 获取客户详情红点
export async function getCustomerNoticeStatistics(params) {
    return request.get('/customer/getCustomerNoticeStatistics', params);
}

