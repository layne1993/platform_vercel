/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-08-12 13:58:41
 * @LastEditTime: 2021-08-12 13:58:42
 */
import request from '@/utils/rest';

// 批量维护投资者信息
export async function batchUpdateCustomer(params) {
    return request.postJSON('/customer/batchUpdateCustomer', params);
}
