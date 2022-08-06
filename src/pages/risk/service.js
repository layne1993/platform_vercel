/*
 * @Author: your name
 * @Date: 2021-06-24 10:06:57
 * @LastEditTime: 2021-08-18 17:57:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vip-manager\src\pages\risk\service.js
 */
import request from '@/utils/rest';
import {downloadFile} from '@/utils/utils';

export async function queryRiskList(params) {
    return request.postJSON('/riskRecord/list', params);
}

export async function createNewRiskQuestionnaire(params) {
    return request.postJSON('/riskRecord/createAdd', params);
}

export async function detailRiskQuestionnaire(params) {
    return request.get('/riskRecord/detail', params);
}

export async function getAllCustomerArr() {
    return request.get('/customer/getAllList');
}

export async function getRiskQuestionnaireTemList(params) {
    return request.postJSON('/riskAsk/list', params);
}

export async function editRiskQuestionnaire(params) {
    return request.put('/riskRecord/edit', params);
}

export async function queryVersionNumber(params) {
    return request.get('/riskAsk/versionNumber', params);
}

export async function createRiskAsk(params) {
    return request.postJSON('/riskAsk/insert', params);
}

export async function queryRiskLevel(params) {
    return request.get('/riskAsk/riskLevel', params);
}

export async function queryRiskAskDetail(params) {
    return request.get('/riskAsk/detail', params);
}

export async function updateRiskAsk(params) {
    return request.put('/riskAsk/update', params);
}

export async function deleteFile(params) {
    return request.get('/attachments/deleteFile', params);
}

export async function queryQuestionnaires(params) {
    return request.get('/riskAsk/queryQuestionnaires', params);
}

export async function checkRiskStarRating(params) {
    return request.postJSON('/riskAsk/checkRiskStarRating', params);
}

export async function riskAskSettingDetail(params) {
    return request.get('/riskAskSetting/detail', params);
}

export async function riskAskSettingUpdate(params) {
    return request.postJSON('/riskAskSetting/update', params);
}

export async function copySave(params) {
    return request.postJSON('/riskAsk/copySave', params);
}
// 查询基协投资者账号自动导出
export async function investorSuitableList(params) {
    return request.postJSON('/customer/investorSuitableList', params);
}

