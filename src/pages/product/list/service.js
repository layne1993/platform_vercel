/*
 * @Author: your name
 * @Date: 2021-06-24 10:06:57
 * @LastEditTime: 2021-07-29 16:14:24
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \vip-manager\src\pages\product\list\service.js
 */
import axios from '@/utils/rest';

// 产品文件列表-查询
export async function getProductList(params) {
    return axios.postJSON('/product/list', params);
}

// 产品信息详情-查询
export async function getProductDetails(params) {
    return axios.get('/product/detail', params);
}

// 产品信息-新建
export async function createProduct(params) {
    return axios.post('/product/create', params);
}

// 产品信息-编辑
export async function editProduct(params) {
    return axios.put('/product/edit', params);
}

// 产品信息-删除
export async function deleteProduct(params) {
    return axios.ax_delete('/product/delete', params);
}

// 产品信息-导出
export async function exportProduct(params) {
    return axios.get('/product/export', params);
}

// 产品信息-顶部统计
export async function queryStatistics(params) {
    return axios.postJSON('/product/statistics', params);
}

// 产品信息-顺序调整
export async function resetOrderRule(params) {
    return axios.postJSON('/product/resetOrderRule', params);
}

// 同步新备案的产品
export async function syncFundInfo(params) {
    return axios.get('/product/syncFundInfo', params);
}

// 份额拆分-保存
export async function spiltShareValue(params) {
    return axios.postJSON('/product/spiltShareValue', params);
}
// 份额拆分-回显
export async function getSubFund(params) {
    return axios.get('/product/getSubFund', params);
}
// 查询母产品
export async function queryByProductName(params) {
    return axios.postJSON('/product/queryByProductName', params);
}
