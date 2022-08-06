/*
 * @Author: your name
 * @Date: 2021-06-24 10:06:57
 * @LastEditTime: 2021-07-06 17:43:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vip-manager\src\pages\product\netValueDetails\service.js
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
    return axios.deleteForm('/net/batchDelete', params);
}
