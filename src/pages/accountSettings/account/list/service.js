import request from '@/utils/rest';

//  管理账号列表
export async function findAllUser(params) {
    return request.get('/manager/managerUser/selectAllUser', params);
    // return request.postJSON('/api/findAllUser', params);
}


//  删除当前账号
export async function deleteAccount(params) {
    return request.get('/manager/managerUser/delete', params);
    // return request.postJSON('/api/findAllUser', params);
}

