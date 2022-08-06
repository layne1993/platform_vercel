/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-05-10 17:00:49
 * @LastEditTime: 2021-07-21 10:34:06
 */
import request from '@/utils/rest';

export async function saveInfo(params) {
    return request.postJSON('/company/update', params);
}

export async function renderLogo(params) {
    return request.get('/company/selectlist');
}

// 查询企业实名认证信息
export async function getRealNameInfo(params) {
    return request.get('/seal/web/real/info', params);
}

// 发送金额
export async function sendAmount(params) {
    return request.postJSON('/company/selectlist', params);
}


// 企业实名认证校验
export async function verifiedCheck(params) {
    return request.postJSON('/seal/web/verified/check', params);
}

// 企业实名认证
export async function verified(params) {
    return request.postJSON('/seal/web/verified', params);
}

// 印模文件上传
export async function sealUpload(params) {
    return request.postMultipart('/seal/web/seal/upload', params);
}

// 企业实名认证查询所有省
export async function queryProvince(params) {
    return request.get('/seal/web/query/province', params);
}


// 企业实名认证查询省下市
export async function queryCity(params) {
    return request.get('/seal/web/query/city', params);
}


// 企业实名认证查询所有银行
export async function queryBank(params) {
    return request.get('/seal/web/query/bank', params);
}


// 查询企业印章信息
export async function sealInfo(params) {
    return request.get('/seal/web/seal/info', params);
}

// 印章体系管理
export async function sealManager(params) {
    return request.postJSON('/seal/web/seal/manager', params);
}


// 盖章体系管理
export async function stampManager(params) {
    return request.postJSON('/seal/web/stamp/manager', params);
}

// 印章体系管理-获取验证码
export async function captcha(params) {
    return request.postJSON('/seal/web/seal/send/captcha', params);
}

// 企业实名认证查询所有银行
export async function subbranch(params) {
    return request.get('/seal/web/query/subbranch', params);
}


// 查询已存在的印章管理者
export async function getSealManager(params) {
    return request.get('/seal/web/seal/user/info', params);
}


// 查询托管机构
export async function getTrusteeshipInfo(params) {
    return request.get('/seal/web/seal/trusteeship/info', params);
}

// 用印人
export async function getStampUserInfo(params) {
    return request.get('/seal/web/seal/stamp/user/info', params);
}

// 盖章体系管理-查询印章名称
export async function getSealNameInfo(params) {
    return request.get('/seal/web/seal/name', params);
}

// 印章体系管理-校验验证码
export async function validateCaptcha(params) {
    return request.postJSON('/seal/web/seal/validate/captcha', params);
}

// 盖章体系管理-用印人管理-查询用印人信息
export async function queryManagerInfo(params) {
    return request.get('/seal/web/seal/stamp/manage/user/info', params);
}

// 盖章体系管理-查询印章信息
export async function querySealInfo(params) {
    return request.get('/seal/web/stamp/info', params);
}

// 查询法人章
export async function queryStampList(params) {
    return request.get('/seal/web/stamp/name', params);
}

// 删除公司logo
export async function deleteLogo(params) {
    return request.get('/company/deleteCompanyLogo', params);
}

// 清除企业实名认证
export async function clearRealName(params) {
    return request.postForm('/seal/web/clean/verified', params);
}



// 便捷实名-根据证件号查询实名信息
export async function isHasRealName(params) {
    return request.get('/seal/web/query/convenient/real/name', params);
}

// 印章体系管理-新增授权代表章-授权代表人开户
export async function openAccount(params) {
    return request.postJSON('/seal/web/seal/authorized/representative/open/account', params);
}

// 印章体系管理-新增授权代表章-授权代表人开户
export async function hasexistRealName(params) {
    return request.postJSON('/seal/web/convenient/real/name', params);
}

