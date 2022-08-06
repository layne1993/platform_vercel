/*
 * @description:
 * @Author: tangsc
 * @Date: 2021-01-21 09:44:08
 */
import axios from '@/utils/rest';

// 产品信披日-查询
export async function queryDisclosureDay(params) {
    return axios.postJSON('/disclosureDay/list', params);
}

// 产品信披日-删除
export async function deleteDisclosureDay(params) {
    return axios.ax_delete('/disclosureDay/delete', params);
}

// 产品信披日-编辑
export async function editDisclosureDay(params) {
    return axios.put('/disclosureDay/edit', params);
}