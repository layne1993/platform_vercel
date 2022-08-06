/*
 * @Author: your name
 * @Date: 2021-07-26 09:16:35
 * @LastEditTime: 2021-07-26 14:52:03
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \vip-manager\src\pages\customMetrics\components\QueryForm\service.js
 */
import request from '@/utils/rest';

export async function queryProductist(params) {
    return request.postJSON('/product/queryByProductName', params);
}

export async function queryTempList(params) {
    return request.postJSON('/productTarget/template/list', params);
}

export async function queryStandardArr() {
    return request.get('/productTarget/benchmark/list');
}
