/*
 * @Author: your name
 * @Date: 2021-06-24 10:06:57
 * @LastEditTime: 2021-07-28 13:44:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vip-manager\src\pages\product\components\NetValueList\service.js
 */

import axios from '@/utils/rest';

// 产品净值列表-查询
export async function getNetValueList(params) {
    return axios.postJSON('/net/list', params);
}

// 产品净值详情-查询
export async function getNetValueDetails(params) {
    return axios.get('/net/detail', params);
}

// 产品净值-新建
export async function createNetValue(params) {
    return axios.postJSON('/net/create', params);
}

// 产品净值-编辑
export async function editNetValue(params) {
    return axios.put('/net/edit', params);
}

// 产品净值-删除
export async function deleteNetValue(params) {
    return axios.postJSON('/net/batchDelete', params);
}

// 产品净值-刷新开放日
export async function refreshProductOpenDay(params) {
    return axios.get('/productDay/refreshProductOpenDay', params);
}

// 批量维护
export async function batchMaintain(params) {
    return axios.postJSON('/net/batchMaintain', params);
}
