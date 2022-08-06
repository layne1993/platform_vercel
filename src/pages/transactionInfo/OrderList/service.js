/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-14 13:16:42
 * @LastEditTime: 2021-03-23 17:16:31
 */
import request from '@/utils/rest';

// 查询申赎下单列表
export async function signConfirmList(params) {
    return request.postJSON('/signConfirm/list', params);
}

// 批量导出
export async function signConfirmExport(params) {
    return request.postBlob('/signConfirm/export', params);
}

// 申赎下单-查询托管列表
export async function trusteeship(params) {
    return request.get('/signConfirm/trusteeship/list', params);
}
