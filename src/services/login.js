/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-10-30 14:02:19
 * @LastEditTime: 2020-11-26 14:13:25
 */
import request from '@/utils/rest';

//  登录
export async function accountLogin(params) {
    return request.postJSON('/managerUser/login', params);
    // return request.postJSON('/api/account/login', params);
}

//  退出登录
export async function logout(params) {
    return request.postForm('/managerUser/logout', params);
    // return request.postJSON('/api/account/login', params);
}


// 获取验证码
export async function getFakeCaptcha(params) {
    return request.postJSON('/managerUser/sendMessage', params);
}

// 查询公司
export async function getCompanies(params) {
    return request.postJSON('/managerUser/getCompanies', params);
}


