/*
 * @description: 份额余额信息列表接口
 * @Author: tangsc
 * @Date: 2020-11-21 15:22:26
 */
import request from '@/utils/rest';

// 查询
export async function queryShare(params) {
    return request.postJSON('/shareRecord/query', params);
}


// 删除
export async function deleteShare(params) {
    return request.postForm('/shareRecord/delete', params);
}

// 用户查询
export async function getProduct(params) {
    return request.postJSON('/product/queryByProductName', params);
}

// 该条用户数据是否更新中
export async function updateStatusApi(params) {
    return request.postFormNoqs('/shareRecord/updateStatus', params);
}
