import request from '@/utils/rest';

// 新建申赎确认
export async function tradeCreate(params) {
    return request.postJSON('/trade/create', params);
}


// 查询
export async function tradeQueryById(params) {
    return request.post('/trade/queryById', params);
}

// 新建申赎确认
export async function tradeUpdate(params) {
    return request.postJSON('/trade/update', params);
}

