/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-03-29 09:48:57
 * @LastEditTime: 2021-06-09 09:12:42
 */

import request from '@/utils/rest';

/**
 * @description 获取配置
 * @param params
 * @returns
 */
export async function getSetting(params) {
    return request.get('/letterOverSetting/findById', params);
}

/**
 * @description 新建或者编辑
 * @param params
 * @returns
 */
export async function createOrEdit(params) {
    return request.postJSON('/letterOverSetting/save', params);
}
