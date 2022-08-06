/*
 * @description:
 * @Author: tangsc
 * @Date: 2020-11-24 13:24:02
 */
import axios from '@/utils/rest';

// 新建
export async function addProductApply(params) {
    return axios.postJSON('/productApply/create', params);
}
