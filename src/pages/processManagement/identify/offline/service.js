/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-14 13:16:42
 * @LastEditTime: 2021-05-14 18:04:35
 */
import request from '@/utils/rest';

// 认定流程信息
export async function getDetail(params) {
    return request.get('/identify/flow/getDetail', params);
}

// 保存合格投资者材料--线下认定
export async function saveIdentifyOffline(params) {
    return request.postJSON('/identify/flow/saveOfflineMaterials', params);
}

// 审核--线下认定
export async function saveAudit(params) {
    return request.postJSON('/identify/flow/saveAudit', params);
}


// 获取投资者list
export async function getInvestorList(params) {
    return request.postJSON('/customer/queryByCustomerName', params);
}


// 节点完成时间和操作人--线下认定
export async function queryProcessByFlowId(params) {
    return request.get('/manager/flowProcess/queryProcessByFlowId', params);
}
