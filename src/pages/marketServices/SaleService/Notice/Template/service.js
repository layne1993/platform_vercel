/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-01-18 14:58:41
 * @LastEditTime: 2021-03-26 18:26:33
 */
import request from '@/utils/rest';
import { getCookie } from '@/utils/utils';

const companyCode = getCookie('companyCode');
const userId = getCookie('managerUserId');

// 本地mock接口
// export async function fetchServiceInfo(params) {
//   return request.post('/api/getMarketingServiceInfo', params);
// }
// 获取获取单一模板（通知）详情
export async function getMarketingServiceInfo(params) {
    return request.get('/marketing/getMarketingServiceInfo', { ...params, companyCode, userId });
}
// 创建/更新模板（通知）接口
export async function updateMarketingServiceInfo(params) {
    return request.postJSON('/marketing/updateMarketingServiceInfo', params);
}
// 获取营销服务对象
export async function getHistoryHolderList(params) {
    return request.postJSON('/customer/getHistoryHolderList', params);
}
// 获取safeToken
export async function setCheckSession(params) {
    return request.get('/setting/setCheckSessionForChat', params);
}
// 获取产品列表
export async function queryProductTypes(params) {
    return request.get('/customer/queryProductTypes', params);
}
// 获取风险等级列表
export async function queryRiskStyleCount(params) {
    return request.get('/customer/queryRiskStyleCount', params);
}
// // 获取oss上传图片配置
// export async function getOSSConfig(params) {
//   return request.post(`/oss/loadCSPOIOssStsMsg`, params);
// }
// 上传邮件附件
export async function uploadEmailAttachment(params) {
    return request.post('/attachment/uploadFile', params);
}

// 查询邮箱配置信息
export async function getEmailSetting(params) {
    return request.get('/marketing/getEmailSetting', { ...params, companyCode });
}
// 保存邮箱配置信息
export async function saveEmailSetting(params) {
    return request.postJSON('/marketing/saveEmailSetting', { ...params, companyCode });
}


// 获取通配符列表
export async function getMarketingWildcard(params) {
    return request.get('/marketing/getMarketingWildcard', { ...params });
}

// 获取模板详情
export async function noticeTemplate(params) {
    return request.get('/marketing/getMarketingServiceTempList', { ...params, companyCode });
}
// 删除文件
export async function deleteFile(params) {
    return request.get('/attachment/deleteFile', { ...params, companyCode });
}

//获取管理员列表
export async function getAdminUserList(params) {
    return request.get('/manager/managerUser/selectAllUser', { ...params, companyCode });
}

//查询用户
export async function getMarketingCustomer(params) {
    return request.postJSON('/marketing/getMarketingCustomer', params);
}

