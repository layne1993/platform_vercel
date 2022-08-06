import request from '@/utils/rest';

//  查询所有角色列表
export async function quireRoleList(params) {
    return request.get('/manager/auth/list', params);
}

//  查询所有角色详情
export async function quireMenuByRoleId(params) {
    return request.get('/manager/auth/detail', params);
}

//  删除角色
export async function deleteRole(params) {
    return request.ax_delete('/manager/auth/delete', params);
}

//  新建角色
export async function addRoleMenu(params) {
    return request.postJSON('/manager/auth/create', params);
}

//  编辑角色
export async function editRoleMenu(params) {
    return request.put('/manager/auth/edit', params);
}


//  查询所有菜单权限
export async function queryAllMenuRole(params) {
    return request.get('/manager/auth/menuOperation/list', params);
}




