/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-14 13:16:42
 * @LastEditTime: 2021-08-02 15:54:36
 */
import request from '@/utils/rest';

// 查询申赎确认列表
export async function tradeQuery(params) {
    return request.postJSON('/trade/query', params);
}


// 删除
export async function tradeDelete(params) {
    return request.postForm('/trade/delete', params);
}

// 导出不存在的客户
export async function exportCustomers(params) {
    return request.get('/trade/exportCustomers', params);
}

