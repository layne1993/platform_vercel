/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-10-30 14:02:19
 * @LastEditTime: 2021-01-05 15:23:48
 */
import request from '@/utils/rest';

// export async function getTemplateList(params) {
//   return request.post('/api/getdetailList1', params);
// }
// 查询所有产品-(不分页)
export async function getAllProduct(params) {
    return request.postJSON('/product/queryByProductName', params);
}

// 查询所有用户
export async function getAllCustomer(params) {
    return request.get('/customer/getAllCustomer', params);
}

// 查询客户经理  ->账号列表

export async function AllUser(params) {
    return request.postJSON('/account/findAllUser', params);
    // return request.postJSON('/api/findAllUser', params);
}


// 查询权限

export async function quireMenuByRoleId(params) {
    return request.get('/manager/auth/currentUser/list', params);
    // return request.postJSON('/api/findAllUser', params);
}




