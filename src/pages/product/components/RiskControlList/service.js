/*
 * @description: 风控列表
 * @Author: tangsc
 * @Date: 2020-11-24 10:07:50
 */
import axios from '@/utils/rest';

// 查询
export async function getRiskControlInfo(params) {
    return axios.postJSON('/riskControlInfo/query', params);
}

// 删除
export async function deleteRiskControlInfo(params) {
    return axios.post('/riskControlInfo/delete', params);
}