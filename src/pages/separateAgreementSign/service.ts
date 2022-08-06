/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-03-29 09:48:57
 * @LastEditTime: 2021-03-30 13:18:44
 */

import request from '@/utils/rest';

/**
 * @description 查询listData
 * @param params
 * @returns
 */
export async function listData(params) {
    return request.postJSON('/separateAgreement/list', params);
}

/**
 * @description 修改协议状态 (终止)
 * @param params
 * @returns
 */
export async function agreementEdit(params) {
    return request.postJSON('/separateAgreement/edit', params);
}
/**
 * @description 查询productList
 * @param params
 * @returns
 */
export async function productList(params) {
    return request.postJSON('/product/document/SeparateList', params);
}

// 获取产品
export async function queryByProductName(params) {
    return request.postJSON('/product/queryByProductName', params);
}


/**
 * @description 查询customerList
 * @param params
 * @returns
 */
export async function customerList(params) {
    return request.postJSON('/manager/DoubleRecordAlone/getDoubleRecordCustomer', params);
}


// 新建单独签署
export async function newSeparateSign(params) {
    return request.postJSON('/separateAgreement/insert', params);
}


// 客户下拉list
export async function selectListCustomer(params) {
    return request.get('/customer/getAllList', params);
}
