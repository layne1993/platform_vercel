/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-02-19 16:31:36
 * @LastEditTime: 2021-02-19 16:31:37
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

