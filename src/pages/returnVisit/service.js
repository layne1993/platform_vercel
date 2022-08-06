/*
 * @description:
 * @Author: tangsc
 * @Date: 2021-02-05 09:49:40
 */
import request from '@/utils/rest';

// 回访单列表
export async function getNetValueDetails(params) {
    return request.postJSON('/returnSingle/list', params);
}

// 查询产品产品列表
export async function getProductAllList() {
    return request.get('/product/getAllList');
}

// 查询客户信息列表
export async function getUserList() {
    return request.get('/customer/getAllList');
}

// 新增回访单
export async function createSingle(params) {
    return request.postJSON('/returnSingle/insert', params);
}

// 删除回访单
export async function delets(params) {
    return request.get('/returnSingle/delets', params);
}


// 获取回访模板列表
export async function getTemplateList(params) {
    return request.postJSON('/eviewTemplate/list', params);
}

// 获取最新版本号
export async function queryVersionNumber(params) {
    return request.get('/eviewTemplate/VersionNumber', params);
}
