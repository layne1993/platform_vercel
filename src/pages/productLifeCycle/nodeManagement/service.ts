/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-14 13:16:42
 * @LastEditTime: 2021-03-17 15:18:26
 */

import type { FilterParams } from './data.d';

import request from '@/utils/rest';

/**
 * @description 查询节点信息
 * @param params
 * @returns
 */
export async function listData(params?: FilterParams) {
    return request.postJSON('/customer/query', params);
}
