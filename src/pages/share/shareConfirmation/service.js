/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-06 13:23:07
 * @LastEditTime: 2020-12-22 14:11:13
 */
import request from '@/utils/rest';

// 查询份额确认书模板
export async function getListData(params) {
    return request.postJSON('/confirmFileConfig/list', params);
}

// 份额确认书创建
export async function create(params) {
    return request.postJSON('/confirmFileConfig/create', params);
}

// 份额确认书详情
export async function detail(params) {
    return request.get('/confirmFileConfig/detail', params);
}

// 匹配模板
export async function matchProduct(params) {
    return request.post('/product/deleteProduct', params);
}

// 编辑
export async function edit(params) {
    return request.put('/confirmFileConfig/edit', params);
}



// 查询产品产品列表
export async function productList(params) {
    return request.postJSON('/product/queryByProductName', params);
}


// 获取管理端用户
export async function getManagerUser(params) {
    return request.get('/manager/managerUser/selectAllUser', params);
}


