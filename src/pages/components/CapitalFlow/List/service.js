import request from '@/utils/rest';

// 查询流程每一步完成的时间和操作者
export async function tradeFlowQuery(params) {
    return request.postJSON('/tradeFlow/query', params);
}

// 获取当前登录账号通知方式
export async function tradeGetNotifyType(params) {
    return request.postJSON('/tradeFlow/getNotifyType', params);
}

// 修改当前通知方式
export async function tradeGetNotify(params) {
    return request.postJSON('/tradeFlow/notify', params);
}

// 金额确认
export async function tradeConfirm(params) {
    return request.postJSON('/tradeFlow/confirm', params);
}


