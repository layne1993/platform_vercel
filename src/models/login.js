/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-10-30 14:02:18
 * @LastEditTime: 2021-04-21 11:12:30
 */
import { stringify } from 'querystring';

import { history } from 'umi';

import { accountLogin,  logout, getFakeCaptcha, getCompanies } from '@/services/login';

// import { setAuthority } from '@/utils/authority';

import { setCookie } from '@/utils/utils';

const Model = {
    namespace: 'LOGIN',
    state: {
        status: undefined,
        // eslint-disable-next-line no-undef
        hasRememberPassword: !!localStorage.getItem('hasRememberPassword'),
        // eslint-disable-next-line no-undef
        account: localStorage.getItem('zc_account') || null
    },
    effects: {

        // 登录
        *login({ payload, callback }, { call }) {
            const response = yield call(accountLogin, payload);
            if (callback) callback(response);
        },

        // 退出登录
        *logout({ payload, callback }, { call }) {
            const response = yield call(logout, payload);
            if (callback) callback(response);
        },

        // 查询多公司
        *getCompanies({ payload, callback }, { call }) {
            const response = yield call(getCompanies, payload);
            if (callback) callback(response);
        },

        // 发送验证码
        *getFakeCaptcha({ payload, callback }, { call }) {
            const response = yield call(getFakeCaptcha, payload);
            if (callback) callback(response);
        }


    },

    reducers: {

        // changeLoginStatus(state, { payload }) {

        //     setAuthority(payload.currentAuthority);

        //     return { ...state, status: payload.status, type: payload.type };

        // }

    }

};

export default Model;

