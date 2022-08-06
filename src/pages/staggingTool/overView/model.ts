import type { Effect } from 'umi';
import moment from 'moment';
import {
    getIPOCalendarData,
    getStockByKeyword,
    getCurrentTodoList,
    submitTodoInfo,
    updateTodoStatus
} from './service';

export interface ModelType {
    namespace: string;
    state: any;
    effects: {
        getStockByKeyword: Effect;
        getCalendarData: Effect;
        getTodoListByDate: Effect;
        createTodo: Effect;
        updateTodo: Effect;
    };
    reducers: {
        updateStepList: any;
        updateModelData: any;
    };
}

const Model: ModelType = {
    namespace: 'staggingOverview',
    state: {
        // 打新日历
        searchOptions: [],
        stepList: [
            { step: 'step1', text: '提交材料', checked: true, isAvailable: true },
            { step: 'step2', text: '询价', checked: true, isAvailable: true },
            { step: 'step3', text: '发行公告', checked: true, isAvailable: false },
            { step: 'step4', text: '申购', checked: true, isAvailable: true },
            { step: 'step5', text: '公布中签', checked: true, isAvailable: false },
            { step: 'step6', text: '缴款日', checked: true, isAvailable: true },
            { step: 'step7', text: '上市', checked: true, isAvailable: false }
        ],
        baseDate: moment().format('YYYY-MM-DD'),
        calendarData: [],

        // 今日待办
        todoBaseDate: moment().format('YYYY-MM-DD'),
        selectedDate: moment().format('YYYY-MM-DD'),
        todoDateList: [],
        todoList: [] // 待办列表
    },
    effects: {
        *getStockByKeyword({ payload, callback }, { call, put }) {
            const { keyword } = payload;
            const res = yield call(getStockByKeyword, { code: keyword });
            if (res.code === 1008) {
                let list = res.data || [];
                list.forEach((item) => {
                    const { secuCode, securityAbbr } = item;
                    item.label = `${secuCode}[${securityAbbr}]`;
                    item.value = secuCode;
                });
                yield put({
                    type: 'updateModelData',
                    payload: {
                        searchOptions: list
                    }
                });
            } else {
                yield put({
                    type: 'updateModelData',
                    payload: {
                        searchOptions: []
                    }
                });
            }
            if (callback) callback();
        },

        *getCalendarData({ payload }, { call, put }) {
            const { baseDate } = payload;
            const res = yield call(getIPOCalendarData, { currentDate: baseDate, dateType: 1 });

            if (res.code === 1008) {
                yield put({
                    type: 'updateModelData',
                    payload: {
                        calendarData: res.data
                    }
                });
            }
        },

        *getTodoListByDate({ payload }, { call, put }) {
            const { date } = payload;
            const res = yield call(getCurrentTodoList, { dateStr: date });

            if (res.code === 1008) {
                yield put({
                    type: 'updateModelData',
                    payload: {
                        todoList: res.data || []
                    }
                });
            }
        },

        *createTodo({ payload }, { call }) {
            const res = yield call(submitTodoInfo, payload);
            return res;
        },

        *updateTodo({ payload }, { call, put }) {
            const res = yield call(updateTodoStatus, { id: payload.id });
            return res;
        }
    },
    reducers: {
        updateStepList(state, { payload }) {
            const stepList = [...state.stepList];
            const { step, checked } = payload;
            const currStep = stepList.find((item) => item.step === step);
            currStep.checked = checked;
            return {
                ...state,
                stepList
            };
        },

        updateModelData(state, { payload }) {
            return {
                ...state,
                ...payload
            };
        }
    }
};
export default Model;
