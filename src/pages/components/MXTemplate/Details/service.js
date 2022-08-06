/*
 * @Author: your name
 * @Date: 2021-04-01 13:14:02
 * @LastEditTime: 2021-04-18 17:54:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vip-manager\src\pages\components\MXTemplate\Details\service.js
 */
import request from '@/utils/rest';

// 模板基本信息：查询
export async function getTemplateBaseInfo(params) {
    return request.get('/product/document/detail', params);
}

// 模板基本信息：新增
export async function newAddSaveTemplateInfo(params) {
    return request.postJSON('/product/document/save', params);
}


// 查询关联协议列表
export async function getAllList(params) {
    return request.post('/product/document/getAllList', params);
}


// 获取验证码
export async function sendCfcaSignMobileCode(params) {
    // return request.post('/company/sendCfcaSignMobileCode', params);
    return request.get(`/company/sendCfcaSignMobileCode/${params}`);
}

// 用印
export async function managerSign(params) {
    return request.postJSON('/product/document/managerSign', params);
}

// 获取绝对路径前半段
export async function queryServer(params) {
    return request.get('/attachments/queryServer', params);
}



// 查询关联协议列表（查询所有）
export async function getAllInfoList(params) {
    return request.get('/product/document/list', params);
}

//查询已配协议
export async function getAllocatedProtocol(params) {
    return request.get('/product/document/getAllocatedProtocol', params);
}

//获取图片的路径
export async function getPdfUrl(params) {
    return request.get('/product/document/getPdfUrl', params);
}






