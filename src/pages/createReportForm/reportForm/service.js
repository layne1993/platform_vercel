/*
 * @description:
 * @Author: tangsc
 * @Date: 2021-03-29 10:01:47
 */
import axios from '@/utils/rest';

// 产品列表-查询
export async function getProductList(params) {
    return axios.postJSON('/product/list', params);
}

// 自定报表数据查询
export async function queryCustomReport(params) {
    return axios.postJSON('/report/queryCustomReport', params);
}

// 自定报表走势图查询
export async function queryTrendChart(params) {
    return axios.postJSON('/report/queryTrendChart', params);
}

// 保存模板
export async function createTemplate(params) {
    return axios.postJSON('/report/create', params);
}

// 根据产品id查询模板
export async function queryByProductId(params) {
    return axios.get('/report/queryByProductId', params);
}

// 根据产品id查询相关数据
export async function getReportData(params) {
    return axios.postJSON('/report/getReportData', params);
}

// 删除模板
export async function deleteTemplate(params) {
    return axios.get('/report/delete', params);
}

// 编辑模板
export async function updateTemplate(params) {
    return axios.postJSON('/report/update', params);
}


