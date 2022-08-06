/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-02-19 17:38:05
 * @LastEditTime: 2021-02-20 14:43:26
 */

import request from '@/utils/rest';

// 查看产品名称
export async function queryByProductName(params) {
    return request.postJSON('/product/queryByProductName', params);
}

// 文件模板保存并发布
export async function saveAndPublish(params) {
    return request.postJSON('/noticeTemplate/saveAndPublish', params);
}

