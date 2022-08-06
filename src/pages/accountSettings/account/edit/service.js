import request from '@/utils/rest';


export async function findUserById(params) {
    return request.get('/manager/managerUser/selectByManagerUserId', params);
    // return request.get('/api/findUserById', params);
}
//  账号新增或修改
export async function insertUser(params) {
    return request.postJSON('/manager/managerUser/addOrUpdateManagerUser', params);
    // return request.postJSON('/api/insertUser', params);
}

//  查询所有角色列表
export async function quireRoleList(params) {
    return request.get('/manager/auth/list', params);
}

//  所属上级
export async function querySelectAllUser(params) {
    return request.get('/manager/managerUser/selectAllUser', params);
}
