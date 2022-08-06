/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-14 13:16:42
 * @LastEditTime: 2021-03-03 16:22:10
 */
import request from '@/utils/rest';

// 审核
export async function saveAudit(params) {
    return request.postJSON('/manager/RedemptionSignFlow/saveSecondManageCheck', params);
}

// 查询流程每一步完成的时间和操作者
export async function getProcessList(params) {
    return request.get('/manager/flowProcess/queryProcessByFlowId', params);
}

// 查询流程信息
export async function querySignFlowInfo(params) {
    return request.get('/manager/signFlowController/querySignFlowInfo', params);
}

