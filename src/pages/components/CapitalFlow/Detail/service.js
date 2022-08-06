import request from '@/utils/rest';

// 新建流水
export async function tradeFlowCreate(params) {
    return request.postJSON('/tradeFlow/create', params);
}


// 编辑流水
export async function tradeFlowUpdate(params) {
    return request.postJSON('/tradeFlow/update', params);
}

// 查询流水
export async function tradeFlowQueryById(params) {
    return request.post('/tradeFlow/queryById', params);
}

// 查询用户名下银行卡
export async function queryBank(params) {
    return request.post('/customerBank/queryBank', params);
}



