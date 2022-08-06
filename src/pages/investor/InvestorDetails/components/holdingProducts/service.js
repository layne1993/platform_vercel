/*
 * @description:
 * @Author: tangsc
 * @Date: 2021-07-06 13:21:10
 */
import axios from '@/utils/rest';

export async function dividendWayRecord(params) {
    return axios.postJSON('/holdProduct/selectAll', params);
}