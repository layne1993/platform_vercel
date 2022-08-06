/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-08-12 13:58:41
 * @LastEditTime: 2021-08-12 13:58:42
 */
import request from '@/utils/rest';

// 配置回显
export async function getManagerDistributeSetting(params) {
    return request.get('/managerDistributeSetting/select', params);
}


// 配置保存
export async function saveManagerDistributeSetting(params) {
    return request.postJSON('/managerDistributeSetting/save', params);
}
