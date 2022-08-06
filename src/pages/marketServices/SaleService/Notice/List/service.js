/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-01-26 16:14:43
 * @LastEditTime: 2021-05-12 10:54:37
 */
import request from '@/utils/rest';
import { getCookie } from '@/utils/utils';

// const companyCode = getCookie('companyCode') || '';
// const userCode = getCookie('userCode') || '';

const companyCode = getCookie('companyCode');
const userId = getCookie('managerUserId');

// 获取服务营销通知 微信推送列表
export async function getWechatNoticeList(params) {
    // return request.post('/api/getWechatNoticeList', { ...params, companyCode });
    return request.post('/marketing/getWechatNoticeList', { ...params, companyCode, userId});
}
// 获取服务营销通知 短信列表
export async function getMessageNoticeList(params) {
    return request.get('/marketing/getMessageNoticeList', { ...params, companyCode, userId});
}
// 获取服务营销通知 邮件列表
export async function getEMailNoticeList(params) {
    return request.get('/marketing/getEMailNoticeList', { ...params, companyCode, userId});
}
// 批量删除列表
export async function deleteMarketingNoticeList(params) {
    return request.get('/marketing/deleteMarketingNoticeList', { ...params, companyCode, userId});
}
// 查询邮箱配置信息
export async function getEmailSetting(params) {
    return request.get('/marketing/getEmailSetting', { ...params, companyCode, userId});
}
// 保存邮箱配置信息
export async function saveEmailSetting(params) {
    return request.postJSON('/marketing/saveEmailSetting', { ...params, companyCode, userId});
}

// 获取模板列表
export async function templateList(params) {
    return request.get('/marketing/getMarketingServiceTempList', { ...params, companyCode, userId});
}


// 查询营销短信邮件发送明细列表
export async function getMarketingSendDetailList(params) {
    return request.postJSON('/marketing/getMarketingSendDetailList', { ...params});
}

// 重发营销服务通知
export async function resendMarketingNotice(params) {
    return request.get('/marketing/resendMarketingNotice', { ...params});
}
