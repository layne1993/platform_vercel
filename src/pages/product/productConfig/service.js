/*
 * @description:
 * @Author: tangsc
 * @Date: 2020-12-23 16:42:48
 */

import axios from '@/utils/rest';

// 查询银行卡变更材料
export async function query(params) {
    return axios.postJSON('/changeTheMaterial/qiueryChangeTheMaterialDetails', params);
}

// 新增修改变更材料
export async function addFile(params) {
    return axios.postForm('/changeTheMaterial/uploadFile', params);
}

// 编辑单个查询
export async function queryEditaFile(params) {
    return axios.get('/changeTheMaterial/compileChangeTheMaterial', params);
}

// 删除文件
export async function deleteFile(params) {
    return axios.get('/changeTheMaterial/deleteByAttachments', params);
}

// 批量下载
export async function batchDownloadFile(params) {
    return axios.postJSON('/changeTheMaterial/attachmentsIds', params);
}

// 产品信息-查询托管公司列表
export async function queryCompany(params) {
    return axios.postJSON('/product/trusteeshipCompany/list', params);
}

// 产品总配置查询
export async function queryProductSetting(params) {
    return axios.get('/productSetting/default/detail', params);
}

// 产品总配置保存
export async function saveProductSetting(params) {
    return axios.postJSON('/productSetting/default/save', params);
}
