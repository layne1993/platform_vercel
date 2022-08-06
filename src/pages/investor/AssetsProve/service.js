/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-09 15:56:38
 * @LastEditTime: 2021-05-22 16:10:01
 */
import request from '@/utils/rest';

// 查询资产证明-列表
export async function listData(params) {
    return request.postJSON('/assetProve/query', params);
}

// 审核
export async function check(params) {
    return request.postJSON('/assetProve/check', params);
}

// 新建前查询列表
export async function queryHolders(params) {
    return request.postJSON('/assetProve/queryHolders', params);
}

// 查询持有产品列表
export async function holdingProducts(params) {
    return request.postJSON('/assetProve/holdingProducts', params);
}

// 新建
export async function create(params) {
    return request.postJSON('/assetProve/create', params);
}

// 删除
export async function deleteAssetProve(params) {
    return request.post('/assetProve/delete', params);
}

// 查询产品配置
export async function queryProductSetting(params) {
    return request.get('/productSetting/default/detail', params);
}

