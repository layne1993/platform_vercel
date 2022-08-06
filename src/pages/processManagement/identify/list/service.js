/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-14 13:16:42
 * @LastEditTime: 2020-11-16 18:15:08
 */
import request from '@/utils/rest';

//  认定流程list
export async function getQualifiedList(params) {
    return request.postJSON('/identify/flow/getPage', params);
}


// 客户经理 --下拉
export async function selectAllAccountManager(params) {
    return request.get('/manager/managerUser/selectAllAccountManager', params);
}

// 合格投资者认定流程-修改签约流程有效性
export async function deleteIdentifyFlow(params) {
    return request.deleteForm(`/identify/flow/deleteIdentifyFlow/${params}`);
}

