/*
 * @description:
 * @Author: tangsc
 * @Date: 2020-11-24 10:07:50
 */
import axios from '@/utils/rest';

// 查询
export async function getProductApply(params) {
    return axios.postJSON('/productApply/query', params);
}

// 新增
export async function addProductApply(params) {
    return axios.postJSON('/productApply/create', params);
}

// 删除
export async function deleteApply(params) {
    return axios.postJSON('/productApply/delete', params);
}

// 审核
export async function auditProductApply(params) {
    return axios.postJSON('/productApply/audit', params);
}