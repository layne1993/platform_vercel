/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-06 13:26:08
 * @LastEditTime: 2020-12-22 14:09:08
 */
/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-06 10:54:47
 * @LastEditTime: 2020-11-06 10:57:03
 */
import {getListData, productList, create, detail, edit, getManagerUser} from './service';

const Model = {
    namespace: 'COMFIRMATION_TEMPLATE',
    state: {
        listData: [],
        accountManager:[]
    },
    effects: {
        *getListData({ payload, callback }, { call, put }) {
            const response = yield call(getListData, payload);
            if (callback) callback(response);
        },
        // *selectSaleUser({ payload, callback }, { call, put }) {
        //     const response = yield call(selectSaleUser, payload);
        //     if(response.code === 1008) {
        //         yield put({
        //             type: 'setAccountManager',
        //             payload: response.data || []
        //         });
        //     }
        //     if (callback) callback(response);
        // },

        *productList({ payload, callback }, { call }) {
            const response = yield call(productList, payload);
            if (callback) callback(response);
        },

        *create({ payload, callback }, { call }) {
            const response = yield call(create, payload);
            if (callback) callback(response);
        },

        *detail({ payload, callback }, { call }) {
            const response = yield call(detail, payload);
            if (callback) callback(response);
        },

        *edit({ payload, callback }, { call }) {
            const response = yield call(edit, payload);
            if (callback) callback(response);
        },

        *getManagerUser({ payload, callback }, { call }) {
            const response = yield call(getManagerUser, payload);
            if (callback) callback(response);
        }




    },
    reducers: {
        setListData(state, { payload }) {
            return {
                ...state,
                listData: payload
            };
        },
        setAccountManager(state, { payload }) {
            return {
                ...state,
                accountManager: payload
            };
        }
    }
};
export default Model;
