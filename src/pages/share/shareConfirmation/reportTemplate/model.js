/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-06 13:26:08
 * @LastEditTime: 2021-07-28 10:13:31
 */
import { reportFormLogo } from '@/utils/staticResources';
import {
    getTemplate,
    update
} from './service';

const Model = {
    namespace: 'COMFIRMATION_REPORT_TEMPLATE',
    state: {
        headerInfo: {
            logoImg: null,
            headerBgColor: '#E4E4E4',
            headerTextColor: '#000000'
        },
        templateInfo: {}
    },
    effects: {
        *getTemplate({ payload, callback }, { call, put }) {
            const response = yield call(getTemplate, payload);
            if (callback) callback(response);
        },
        *update({ payload, callback }, { call }) {
            const response = yield call(update, payload);
            if (callback) callback(response);
        }





    },
    reducers: {
        setHeaderInfo(state, { payload }) {
            return {
                ...state,
                headerInfo: {...payload}
            };
        },
        setTmplateInfo(state, { payload }) {
            console.log(payload, 'templateInfoqq');
            return {
                ...state,
                templateInfo: {...payload}
            };
        }
    }
};
export default Model;
