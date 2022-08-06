/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-14 13:16:42
 * @LastEditTime: 2021-05-18 10:18:46
 */
import request from '@/utils/rest';

// 认定流程信息
export async function getDetail(params) {
    return request.get('/identify/flow/getDetail', params);
}

// 保存合格投资者材料--线上认定
export async function saveAudit(params) {
    return request.postJSON('/identify/flow/saveAudit', params);
}


// 节点完成时间和操作人--线上认定
export async function queryProcessByFlowId(params) {
    return request.get('/manager/flowProcess/queryProcessByFlowId', params);
}

// 合格投资者认定流程查询节点文本配置
export async function selectIdentifyFlowText(params) {
    return request.postForm('/identifyFlowDynamicAllocationText/selectIdentifyFlowText', params);
}
