/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-08-12 17:06:02
 * @LastEditTime: 2021-08-12 17:06:03
 */

import request from '@/utils/rest';

// 获取公司投资者端合格投资者认定配置信息
export async function offlineIdentifyConfig(params) {
    return request.get('/identify/flow/identifyConfig/get', params);
}

// 编辑公司投资者端合格投资者认定配置信息
export async function offlineIdentifyConfigUpdate(params) {
    return request.postJSON_original('/identify/flow/identifyConfig/update', params);
}
