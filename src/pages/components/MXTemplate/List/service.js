/*
 * @description:
 * @Author: tangsc
 * @Date: 2020-11-19 11:18:43
 */
import request from '@/utils/rest';

// 模板列表查询
export async function getTemplateList(params) {
    return request.postJSON('/product/document/page', params);
}

// 废除或恢复
export async function abolishOrRecovery(params) {
    return request.postJSON('/product/document/abolishOrRecovery', params);
}

// 协议警示
export async function getProtocolAlert(params) {
    return request.get('/product/document/protocolAlert', params);
}

// 手动同步模板协议
export async function queryDocumentInfo(params) {
    return request.get('/manager/productDocumentToSimu/queryDocumentInfo', params);
}
