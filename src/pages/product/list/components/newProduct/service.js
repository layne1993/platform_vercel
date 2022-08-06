/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-07-28 14:39:15
 * @LastEditTime: 2021-07-29 10:05:12
 */
import axios from '@/utils/rest';

// 同步新备案的产品
export async function syncFundInfo(params) {
    return axios.get('/product/syncFundInfo', params);
}

// 产品信息-批量新建
export async function createBatch(params) {
    return axios.postJSON_original('/product/createBatch', params);
}


// 获取投资者list
export async function getInvestorList(params) {
    return axios.postJSON('/customer/queryByCustomerName', params);
}

// 产品信息-查询托管公司列表
export async function queryCompanyList(params) {
    return axios.postJSON('/product/trusteeshipCompany/list', params);
}
