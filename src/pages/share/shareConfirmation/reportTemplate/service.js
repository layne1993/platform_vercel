/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-06 13:23:07
 * @LastEditTime: 2020-12-22 14:11:13
 */
import request from '@/utils/rest';

// 自动生成模板-查询全部
export async function getTemplate(params) {
    return request.get('/confirmTemplateSetting/selectAll', params);
}

// 份额确认书创建
export async function update(params) {
    return request.postJSON('/confirmTemplateSetting/update', params);
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


