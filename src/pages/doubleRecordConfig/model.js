/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-12-10 15:59:24
 * @LastEditTime: 2020-12-11 17:02:19
 */

import request from '@/utils/rest';
import { templateList, maxVersion,  templateInfo, influenceProductList, crateOrUpdateTemplate, editIngTemplateInfo } from './api';

export default {
    namespace: 'DOUBLE_RECORD',
    state: {
    },
    effects: {

        *templateList({ payload, callback }) {
            const res = yield request.postJSON(templateList, payload);
            if (callback && typeof callback === 'function') callback(res);
        },

        *maxVersion({ payload, callback }) {
            const res = yield request.postForm(maxVersion, payload);
            if (callback && typeof callback === 'function') callback(res);
        },

        *templateInfo({ payload, callback }) {
            const res = yield request.postForm(templateInfo, payload);
            if (callback && typeof callback === 'function') callback(res);
        },

        *influenceProductList({ payload, callback }) {
            const res = yield request.postForm(influenceProductList, payload);
            if (callback && typeof callback === 'function') callback(res);
        },

        *crateOrUpdateTemplate({ payload, callback }) {
            const res = yield request.postJSON(crateOrUpdateTemplate, payload);
            if (callback && typeof callback === 'function') callback(res);
        },

        *editIngTemplateInfo({ payload, callback }) {
            const res = yield request.postForm(editIngTemplateInfo, payload);
            if (callback && typeof callback === 'function') callback(res);
        }

    },
    reducers: {
    }
};
