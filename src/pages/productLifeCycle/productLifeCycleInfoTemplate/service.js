/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-14 13:16:42
 * @LastEditTime: 2021-03-18 17:04:36
 */
import request from '@/utils/rest';

// 生命周期模板列表查询
export async function querylifeCycleTemplateList(params) {
    return request.postJSON('/manager/lifeCycleTemplate/querylifeCycleTemplateList', params);
}
