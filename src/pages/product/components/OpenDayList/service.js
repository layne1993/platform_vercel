/*
 * @Author: your name
 * @Date: 2021-06-24 10:06:57
 * @LastEditTime: 2021-07-06 11:02:14
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \vip-manager\src\pages\product\components\OpenDayList\service.js
 */
import axios from '@/utils/rest';

// 产品开放日列表-查询
export async function getOpenDayList(params) {
    return axios.postJSON('/productDay/list', params);
}

// 产品开放日详情-查询
export async function getOpenDayDetails(params) {
    return axios.get('/productDay/detail', params);
}

// 产品开放日-新建
export async function createOpenDay(params) {
    return axios.postJSON('/productDay/create', params);
}

// 产品开放日-编辑
export async function editOpenDay(params) {
    return axios.put('/productDay/edit', params);
}

// 产品开放日-删除
export async function deleteOpenDay(params) {
    return axios.ax_delete('/productDay/delete', params);
}
