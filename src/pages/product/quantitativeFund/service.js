/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-05-10 17:00:49
 * @LastEditTime: 2021-11-09 10:31:16
 */
import request from '@/utils/rest';


// 获取量化管理人公司信息
export async function getQuantitativeCompanyInfo(params) {
    return request.get('/manager/fundPerformanceReport/getCompany');
}

// 保存量化管理人公司信息
export async function saveQuantitativeCompanyInfo(params) {
    return request.postJSON('/manager/fundPerformanceReport/saveCompany', params);
}

// 获取产品信息列表
export async function getProductList(params){
    return request.postJSON('/manager/fundPerformanceReport/getProductList',params)
}

export async function uploadManagedData(params){
    return request.postForm('/manager/fundPerformanceReport/uploadManagedData',params)
}
// 修改产品信息
export async function saveEquityRunReport(params){
    return request.postJSON('/manager/fundPerformanceReport/saveEquityRunReport',params)
}


