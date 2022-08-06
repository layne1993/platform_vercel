/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-08-12 13:58:41
 * @LastEditTime: 2021-08-12 13:58:42
 */
import request from '@/utils/rest';

// 回访提醒
export async function visitRemind(params) {
    return request.postJSON('/manager/signFlowController/visitRemind', params);
}
