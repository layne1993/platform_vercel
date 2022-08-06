/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-06 10:54:47
 * @LastEditTime: 2021-08-03 14:33:37
 */
import request from '@/utils/rest';

// 查询产品产品列表
export async function selectCustomer(params) {
    return request.postJSON('/product/getProductList', params);
}

// 份额确认书个数
export async function selectSaleUser(params) {
    return request.post('/product/deleteProduct', params);
}


// 份额确认书列表
export async function list(params) {
    return request.postJSON('/confirmFile/list', params);
}

// 份额确认书 -- 删除
export async function deleteConfirmFile(params) {
    return request.ax_delete('/confirmFile/delete', params);
}


// 份额确认书 -- 发布
export async function publish(params) {
    return request.postForm('/confirmFile/publish', params);
}


// 产品列表
export async function queryByProductList(params) {
    return request.postJSON('/product/queryByProductName', params);
}



// 自动生成模板-查询全部
export async function selectAll(params) {
    return request.get('/confirmTemplateSetting/selectAll', params);
}

// 自动生成模板-生成份额确认书
export async function autoGeneration(params) {
    return request.postJSON('/confirmTemplateSetting/autoGeneration', params);
}

// 关联认申赎记录查询
export async function recordQuery(params) {
    return request.postJSON('/confirmFile/queryShareRecordList', params);
}

// 上传投资者的份额确认书查询
export async function recordQueryFile(params) {
    const { tradeRecordId, ...p } = params;
    return request.get(`/confirmFile/queryAttachmentsByTradeRecordId/${tradeRecordId}`, p);
}

// 份额确认书关联认申赎记录
export async function recordFileUpload(params) {
    return request.postJSON('/confirmFile/saveConfirmFile', params);
}



