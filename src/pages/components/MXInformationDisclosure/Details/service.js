/*
 * @description:
 * @Author: tangsc
 * @Date: 2021-01-21 10:09:34
 */

import axios from '@/utils/rest';

// 产品信披日-新建
export async function addDisclosureDay(params) {
    return axios.postJSON('/disclosureDay/create', params);
}

// 产品信披日-编辑
export async function editDisclosureDay(params) {
    return axios.put('/disclosureDay/edit', params);
}

// 产品信披日-查询详情
export async function queryDetails(params) {
    return axios.get('/disclosureDay/detail', params);
}
