/*
 * @description: 签约流程
 * @Author: tangsc,hucc
 * @Date: 2020-11-19 17:16:26
 */
import request from '@/utils/rest';

// 认申赎流程管理列表
export async function querySignFlowAll(params) {
    return request.postJSON('/manager/signFlowController/querySignFlowAll', params);
}


// 签约流程-修改签约流程有效性
export async function updateSignFlow(params) {
    return request.ax_delete(`/manager/signFlowController/updateSignFlow/${params}`);
}


// 产品列表-查询
export async function getProductList(params) {
    return request.postJSON('/product/queryByProductName', params);
}

// 客户列表-查询
export async function getCustomerList(params) {
    return request.postJSON('/customer/queryByCustomerName', params);
}

// 创建或更新线下签约
export async function createOrUpdateSignFlowOffline(params) {
    return request.postJSON('/manager/signFlowOffline/createOrUpdateSignFlowOffline', params);
}

// 获取线下签约
export async function getSignFlowOffline(params) {
    return request.get('/manager/signFlowOffline/getSignFlowOffline', params);
}

// 获取当前客户名下的银行卡号
export async function queryBank(params) {
    return request.post('/customerBank/queryBank', params);
}

// 开放日查询
export async function getNewProductDay(params) {
    return request.postJSON('/productDay/getNewProductDay', params);
}

// 开放日信息保存
export async function updateSignOpenDay(params) {
    return request.postJSON('/productDay/updateSignOpenDay', params);
}


// 获取通知的信息
export async function getCustomerByCustomerId(params) {
    return request.get('/manager/signFlowOffline/getCustomerByCustomerId', params);
}

// 获取所有管理端用户
export async function selectAllUser(params) {
    return request.get('/manager/managerUser/selectAllUser', params);
}




