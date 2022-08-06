import { updateUserPassword } from './service';

const Model = {
    namespace: 'passwordInfo',
    state: {},
    effects: {
        *submitPasswordForm({ payload, callback }, { call }) {
            const response = yield call(updateUserPassword, payload);
            if (callback) callback(response);
        }
    }
};

export default Model;
