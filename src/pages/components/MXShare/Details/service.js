/*
 * @description:
 * @Author: tangsc
 * @Date: 2020-11-23 16:03:59
 */
import request from '@/utils/rest';

// 新建
export async function addShare(params) {
    return request.postJSON('/shareRecord/create', params);
}

// 编辑
export async function editShare(params) {
    return request.postJSON('/shareRecord/update', params);
}

// 客户列表
export async function queryByCustomerName(params) {
    return request.postJSON('/customer/queryByCustomerName', params);
}

// 份额详情
export async function queryDetails(params) {
    return request.postForm('/shareRecord/queryById', params);
}
