/*
 * @description:
 * @Author: tangsc
 * @Date: 2020-11-19 16:10:58
 */
import axios from '@/utils/rest';

// 分红列表-查询
export async function getDividendsList(params) {
    return axios.postJSON('/dividend/list', params);
}

// 分红-删除
export async function deleteDividends(params) {
    return axios.postJSON('/dividend/delete', params);
}

// 分红-新建
export async function createDividends(params) {
    return axios.postJSON('/dividend/create', params);
}


// 分红-详情
export async function dividendsDetail(params) {
    return axios.get('/dividend/detail', params);
}


// 分红-编辑
export async function dividendsEdit(params) {
    return axios.put('/dividend/edit', params);
}


// 分红-批量导出
export async function dividendsexport(params) {
    return axios.put('/dividend/export', params);
}

// 分红-顶部统计
export async function dividendStatistics(params) {
    return axios.postJSON('/dividend/statistics', params);
}


// 分红-批量上传
export async function dividendUpload(params) {
    return axios.postForm('/dividend/import', params);
}


// 客户列表
export async function queryByCustomerList(params) {
    return axios.postJSON('/customer/queryByCustomerName', params);
}

// 产品列表
export async function queryByProductList(params) {
    return axios.postJSON('/product/queryByProductName', params);
}

// 产品分红统计

export async function statisticsList(params) {
    return axios.postJSON('/dividend/statisticsList', params);
}

