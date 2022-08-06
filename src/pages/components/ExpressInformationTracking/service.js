/*
 * @Author: your name
 * @Date: 2021-06-28 15:54:46
 * @LastEditTime: 2021-06-28 15:55:29
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \vip-manager\src\pages\components\ExpressInformationTracking\service.js
 */
import request from '@/utils/rest';

export async function queryList(params) {
    return request.postJSON('/expressDocument/getExpressDocumentList', params);
}

// 查询快递跟踪详情
export async function getExpressDocumentDetail(params) {
    return request.get('/expressDocument/getExpressDocumentDetail', params);
}

// 创建和修改快递信息
export async  function saveExpressDocument(params) {
    return request.postJSON('/expressDocument/saveExpressDocument', params);
}

// 删除快递
export async function deleteExpressDocumentBatch(params) {
    return request.postForm('/expressDocument/deleteExpressDocumentBatch', params);
}

// 请求网盘
export async function querySelectNetWorkFile(params) {
    return request.postJSON('/shareNetworkFile/searchByName1', params );
}

// 自动识别快递公司
export async function autoTrackingCompany(params) {
    return request.get('/expressDocument/autoTrackingCompany', params);
}

// 查询快递节点
export async function queryTrackingMessage(params) {
    return request.postJSON('/expressDocument/queryTrackingMessage', params);
}



