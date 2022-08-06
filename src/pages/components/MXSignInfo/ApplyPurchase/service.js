/*
 * @Author: your name
 * @Date: 2021-07-29 18:42:59
 * @LastEditTime: 2021-09-15 09:58:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vip-manager\src\pages\components\MXSignInfo\ApplyPurchase\service.js
 */
import request from '@/utils/rest';

// 审核
export async function saveAudit(params) {
    return request.postJSON('/manager/secondSignFlow/saveSecondManageCheck', params);
}

// 查询流程每一步完成的时间和操作者
export async function getProcessList(params) {
    return request.get('/manager/flowProcess/queryProcessByFlowId', params);
}

// 查询流程信息
export async function querySignFlowInfo(params) {
    return request.get('/manager/signFlowController/querySignFlowInfo', params);
}
// 获取绝对路径前半段
export async function queryServer(params) {
    return request.get('/attachment/queryServer', params);
}

export async function saveSecondReviewCheck(params) {
    return request.postJSON('/manager/secondSignFlow/saveSecondReviewCheck', params);
}


