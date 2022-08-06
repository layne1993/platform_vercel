import {
  getUnderwriterTemplate,
  getUnderwriterMaintain,
  saveUnderwriterMaintain,
  getManagerDetail,
  saveManagerDetail
} from './service'

export interface ModelType {
  namespace: string;
  state: {
    relatedList: object[],
    investorList: object[],
    assetList: object[]
  },
  effects: any,
  reducers: any
}

const Model: ModelType = {
  namespace: 'makeNewMaintain',
  state: {
    relatedList: [], // 关联方模板
    investorList: [], //出资方模板
    assetList: [], // 资产规模模板
  },
  effects: {
    // 获取模板
    *getUnderwriterTemplate({ payload, callback }, { call, put }) {
      const response = yield call(getUnderwriterTemplate, payload);
      if (payload) {
        const { type } = payload
        let url = ''
        switch (type) {
          case 1: url = 'setRelatedList'; break;
          case 2: url = 'setInvestorList'; break;
          case 3: url = 'setAssetList'; break;
          default: break;
        }
        yield put({
          type: url,
          payload: response
        })
      }
      if (callback) callback(response);
    },
    // 获取数据
    *getUnderwriterMaintain({ payload, callback }, { call, put }) {
      const response = yield call(getUnderwriterMaintain, payload);
      if (callback) callback(response);
    },
    // 保存数据
    *saveUnderwriterMaintain({ payload, callback }, { call, put }) {
      const response = yield call(saveUnderwriterMaintain, payload);
      if (callback) callback(response);
    },
    // 获取数据
    *getManagerDetail({ payload, callback }, { call, put }) {
      const response = yield call(getManagerDetail, payload);
      if (callback) callback(response);
    },
    // 保存数据
    *saveManagerDetail({ payload, callback }, { call, put }) {
      const response = yield call(saveManagerDetail, payload);
      if (callback) callback(response);
    },
  },
  reducers: {
    // 设置关联方模板
    setRelatedList(state, { payload }) {
      let list = []
      if (payload.code === 1008) {
        const { data = [] } = payload;
        list = data.map(item => ({
          value: item.templateId,
          title: item.templateName
        }))
      }

      return { ...state, relatedList: list };
    },
    // 设置出资方模板
    setInvestorList(state, { payload }) {
      let list = []
      if (payload.code === 1008) {
        const { data = [] } = payload;
        list = data.map(item => ({
          value: item.templateId,
          title: item.templateName
        }))
      }
      return { ...state, investorList: list };
    },
    // 设置出资方模板
    setAssetList(state, { payload }) {
      let list = []
      if (payload.code === 1008) {
        const { data = [] } = payload;
        list = data.map(item => ({
          value: item.templateId,
          title: item.templateName
        }))
      }
      return { ...state, assetList: list };
    },
  }
}

export default Model