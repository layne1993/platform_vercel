// import {  } from '@/services/user';
import { getCookie } from '@/utils/utils';

const UserModel = {
    namespace: 'user',
    state: {
        currentUser: {
            token: getCookie('vipAdminToken')  || '',
            avatar: getCookie('headUrl') || ''
        }
    },
    effects: {

    },
    reducers: {
        saveCurrentUser(state, action) {
            return { ...state, currentUser: action.payload || {} };
        },

        changeNotifyCount(
            state = {
                currentUser: {}
            },
            action,
        ) {
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    notifyCount: action.payload.totalCount,
                    unreadCount: action.payload.unreadCount
                }
            };
        }
    }
};
export default UserModel;
