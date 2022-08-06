import { getAllProduct, getAllCustomer, AllUser, quireMenuByRoleId } from '@/services/user';
import {
    getResourcePath,
    queryByCustomerName,
    queryByProductName,
    getSysSetting,
    queryManagedData,
    updateData, // 更新托管数据
    getCompanyUid, //获取公司密钥
    getSysMenu,  //获取所有菜单权限
    getManagerList,
    channelList,
    selectAllAccountManager,
    getMenuMessageBadge
} from '@/services/global';
import { setCookie, authTransform, menuAuthTransform } from '@/utils/utils';
import { setAuthority } from '@/utils/authority';

const GlobalModel = {
    namespace: 'global',
    state: {
        collapsed: false,
        notices: []
    },
    effects: {
        *clearNotices({ payload }, { put, select }) {
            yield put({
                type: 'saveClearedNotices',
                payload
            });
            const count = yield select((state) => state.global.notices.length);
            const unreadCount = yield select(
                (state) => state.global.notices.filter((item) => !item.read).length,
            );
            yield put({
                type: 'user/changeNotifyCount',
                payload: {
                    totalCount: count,
                    unreadCount
                }
            });
        },

        *changeNoticeReadState({ payload }, { put, select }) {
            const notices = yield select((state) =>
                state.global.notices.map((item) => {
                    const notice = { ...item };

                    if (notice.id === payload) {
                        notice.read = true;
                    }

                    return notice;
                }),
            );
            yield put({
                type: 'saveNotices',
                payload: notices
            });
            yield put({
                type: 'user/changeNotifyCount',
                payload: {
                    totalCount: notices.length,
                    unreadCount: notices.filter((item) => !item.read).length
                }
            });
        },

        // 获取资源路径
        *getResourcePath({ payload, callback }, { call }) {
            const response = yield call(getResourcePath, payload);
            if (response.code === 1008) {
                setCookie('RESOURCE_PATH', response.data);
            }
            if (callback) callback(response);
        },

        // 获取系统配置
        *getSysSetting({ payload, callback }, { call }) {
            const response = yield call(getSysSetting, payload);
            const { code, data = {} } = response;
            if (code === 1008) {
                // eslint-disable-next-line no-undef
                sessionStorage.setItem('defaultDoubleCheckType', data.defaultDoubleCheckType);
            }
            if (callback) callback(response);
        },

        /* 所有产品 */
        *queryByProductName({ payload, callback }, { call }) {
            const response = yield call(queryByProductName, payload);
            if (callback) callback(response);
        },

        /* 所有用户 */
        *queryByCustomerName({ payload, callback }, { call }) {
            const response = yield call(queryByCustomerName, payload);
            if (callback) callback(response);
        },

        /* 所有产品 */
        *getAllProduct({ payload, callback }, { call }) {
            const response = yield call(getAllProduct, payload);
            if (callback) callback(response);
        },
        /* 所有用户 */
        *getAllCustomer({ payload, callback }, { call }) {
            const response = yield call(getAllCustomer, payload);
            if (callback) callback(response);
        },
        /* 客户经理 所有账号 */
        *getAllUser({ payload, callback }, { call }) {
            const response = yield call(AllUser, payload);
            if (callback) callback(response);
        },

        /* 查询权限 */
        *quireMenuByRoleId({ payload, callback }, { call }) {
            const response = yield call(quireMenuByRoleId, payload);
            if (response.code === 1008) {
                const { data = [] } = response;
                let permissionList = {};
                data.map((item) => {
                    permissionList[item.menuCode] = authTransform(item);
                });
                let menuList = menuAuthTransform(data);
                setAuthority(menuList);
                // eslint-disable-next-line no-undef
                sessionStorage.setItem('PERMISSION', JSON.stringify(permissionList));
            }
            if (callback) callback(response);
        },
        // 查询托管
        *queryManagedData({ callback }, { call }) {
            const response = yield call(queryManagedData);
            if (callback) {
                callback(response);
            }
        },
        // 更新托管数据
        *updateData({ callback, path, payload }, { call }) {
            const response = yield call(updateData, path, payload);
            if (callback) {
                callback(response);
            }
        },

        /* 获取公司code*/
        *getCompanyUid({ payload, callback }, { call }) {
            const response = yield call(getCompanyUid, payload);
            if (callback) callback(response);
        },

        /* 查询菜单信息*/
        *getSysMenu({ payload, callback }, { call }) {
            const response = yield call(getSysMenu, payload);
            if (callback) callback(response);
        },
        /* 获取管理者list*/
        *getManagerList({ payload, callback }, { call }) {
            const response = yield call(getManagerList, payload);
            if (callback) callback(response);
        },

        /* 获取渠道list*/
        *channelList({ payload, callback }, { call }) {
            const response = yield call(channelList, payload);
            if (callback) callback(response);
        },

        /* 获取客户经理list*/
        *selectAllAccountManager({ payload, callback }, { call }) {
            const response = yield call(selectAllAccountManager, payload);
            if (callback) callback(response);
        },

        /* 获取客户经理list*/
        *getMenuMessageBadge({ payload, callback }, { call, put }) {
            const response = yield call(getMenuMessageBadge, payload);
            if (callback) callback(response);
        }

    },
    reducers: {
        changeLayoutCollapsed(
            state = {
                notices: [],
                collapsed: true
            },
            { payload },
        ) {
            return { ...state, collapsed: payload };
        },

        saveNotices(state, { payload }) {
            return {
                collapsed: false,
                ...state,
                notices: payload
            };
        },

        saveClearedNotices(
            state = {
                notices: [],
                collapsed: true
            },
            { payload },
        ) {
            return {
                collapsed: false,
                ...state,
                notices: state.notices.filter((item) => item.type !== payload)
            };
        }

    },
    subscriptions: {
        setup({ history }) {
            // Subscribe history(url) change, trigger `load` action if pathname is `/`
            history.listen(({ pathname, search }) => {
                if (typeof window.ga !== 'undefined') {
                    window.ga('send', 'pageview', pathname + search);
                }
            });
        }
    }
};
export default GlobalModel;
