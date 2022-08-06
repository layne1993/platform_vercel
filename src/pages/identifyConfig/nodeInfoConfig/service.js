/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-02-19 16:31:36
 * @LastEditTime: 2021-03-02 14:25:42
 */

import request from '@/utils/rest';

//  合格投资者认定流程_保存节点文本配置
export async function saveIdentifyFlowText(params) {
    return request.postJSON('/identifyFlowDynamicAllocationText/saveIdentifyFlowText', params);
}


// 合格投资者认定流程查询节点文本配置
export async function selectIdentifyFlowText(params) {
    return request.postForm('/identifyFlowDynamicAllocationText/selectIdentifyFlowText', params);
}
