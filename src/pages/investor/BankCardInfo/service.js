/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-09 15:56:38
 * @LastEditTime: 2021-03-04 14:27:33
 */
import request from '@/utils/rest';

// 获取银行卡list
export async function bankList(params) {
    return request.postJSON('/customerBank/queryCustomerBankList', params);
}


// 冻结
export async function freeze(params) {
    return request.postJSON('/customerBank/frozenBankCard', params);
}


// 创建/更新银行卡
export async function createOrUpdateCustomerBank(params) {
    return request.postJSON('/customerBank/createOrUpdateCustomerBank', params);
}

// 查询银行客户信息
export async function findCustomer(params) {
    return request.get('/customerBank/findCustomer', params);
}



// 查询银行卡信息
export async function queryBank(params) {
    return request.get('/customerBank/findByCustomerBankId', params);
}


// 查询关联产品信息列表
export async function findCustomerBankProduct(params) {
    return request.get('/customerBank/findCustomerBankProduct', params);
}


// 保存关联产品信息
export async function saveCustomerBankProduct(params) {
    return request.postJSON('/customerBank/saveCustomerBankProduct', params);
}

// 查看产品名称
export async function queryByProductName(params) {
    return request.postJSON('/product/queryByProductName', params);
}

// 关联产品信息-变更记录
export async function viewChangeHistory(params) {
    return request.postJSON('/customerBank/viewChangeHistory', params);
}

// 删除银行卡
export async function deleteCustomerBank(params) {
    return request.ax_delete(`/customerBank/deleteCustomerBank/${params}`);
}
