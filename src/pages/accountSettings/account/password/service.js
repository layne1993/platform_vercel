import request from '@/utils/rest';

//  修改密码
export async function updateUserPassword(params) {
    return request.postJSON('/manager/managerUser/updatePassword', params);
    // return request.postJSON('/api/updateUserPassword', params);
}
