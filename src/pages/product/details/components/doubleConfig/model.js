/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-12-10 15:59:24
 * @LastEditTime: 2020-12-15 11:25:55
 */

import request from '@/utils/rest';
import { templateList, maxVersion,  templateInfo, influenceProductList, crateOrUpdateTemplate, editIngTemplateInfo, lastTotalTemplateInfo, updateProductAutoType, productSetting } from './service';

export default {
    namespace: 'PRODUCT_DOUBLE',
    state: {
        templateCode: undefined
    },
    effects: {

        *templateList({ payload, callback }) {
            const res = yield request.postJSON(templateList, payload);
            if (callback && typeof callback === 'function') callback(res);
        },

        *lastTotalTemplateInfo({ payload, callback }) {
            const res = yield request.postForm(lastTotalTemplateInfo, payload);
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
        },

        *updateProductAutoType({ payload, callback }) {
            const res = yield request.postForm(updateProductAutoType, payload);
            if (callback && typeof callback === 'function') callback(res);
        },

        *productSetting({ payload, callback }) {
            const res = yield request.get(productSetting, payload);
            if (callback && typeof callback === 'function') callback(res);
        }

    },
    reducers: {
        setTemplateCode(state, { payload }) {
            return { ...state, ...payload };
        }
    }
};
