/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-14 13:16:42
 * @LastEditTime: 2021-08-04 11:28:13
 */
import request from '@/utils/rest';

// 客户列表
export async function customerData(params) {
    return request.postJSON('/customer/query', params);
}

// 删除
export async function deleteBatch(params) {
    return request.postJSON('/customer/deleteBatch', params);
}
// 获取数据统计
export async function statistics(params) {
    return request.postJSON('/customer/statistics', params);
}

// 客户账号 禁用/启用
export async function setForbidden(params) {
    return request.postForm('/customer/setForbidden', params);
}


// 查询所有客户经理
export async function selectAllAccountManager(params) {
    return request.get('/manager/managerUser/selectAllAccountManager', params);
}

// 获取重置密码的表单信息
export async function getResetPasswordFormData(params) {
    return request.get('/customer/getResetPasswordFormData', params);
}


// 重置密码
export async function resetPassword(params) {
    return request.postJSON('/customer/resetPassword', params);
}

export async function setIsVIP(params) {
    return request.get('/customer/setIsVIP', params);
}
