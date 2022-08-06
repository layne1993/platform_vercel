import axios from '@/utils/rest';

// 产品开放日列表-查询
export async function getOpenDayList(params) {
    return axios.postJSON('/productDay/list', params);
}

// 产品开放日详情-查询
export async function getOpenDayDetails(params) {
    return axios.get('/productDay/detail', params);
}

// 产品开放日-新建
export async function createOpenDay(params) {
    return axios.postJSON('/productDay/create', params);
}

// 产品开放日-编辑
export async function editOpenDay(params) {
    return axios.put('/productDay/edit', params);
}

// 产品开放日-删除
export async function deleteOpenDay(params) {
    return axios.ax_delete('/productDay/delete', params);
}


export async function selectProductByCount(params) {
    return axios.postJSON('/shareRecord/selectProductByCount', params);
}


export async function setStatus(params) {
    return axios.postJSON('/productDay/updateSignOpenDay', params);
}
