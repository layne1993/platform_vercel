/*
 * @description: 基本要素card
 * @Author: tangsc
 * @Date: 2021-03-12 14:47:12
 */
import React, { useEffect, useRef, useReducer, Fragment, useState } from 'react';
import styles from '../styles/ProcessNodeInfo.less';
import { isEmpty, cloneDeep, isInteger } from 'lodash';
import { getRandomKey } from '@/utils/utils';
import Generator, { fromFormily, toFormily, defaultSettings, defaultCommonSettings, defaultGlobalSettings } from 'fr-generator';
import { Row, Col, Card, Spin, Tabs, Form, Radio, Modal, Space, Input, Empty, Table, Alert, Button, Select, Checkbox, DatePicker, InputNumber, notification } from 'antd';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { MenuOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import arrayMove from 'array-move';
import { connect } from 'umi';
import moment from 'moment';
import { isNumber } from '@/utils/utils';
import { formItemType } from '@/utils/publicData';

// 定义表单Item
const FormItem = Form.Item;

// 获取文本域
const { TextArea } = Input;

// 获取Select组件option选项
const { Option } = Select;

// 获取日期组件
const { RangePicker } = DatePicker;

// 获取确认框
const { confirm } = Modal;

// 设置日期格式
const dateFormat = 'YYYY/MM/DD';

// 提示信息
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};
// 月度天数
const monthDay = [];
for (let i = 1; i <= 31; i++) {
    monthDay.push({
        label: `${i}天`,
        value: i
    });
}

// schema初始值
const defaultValue = {
    'type': 'object',
    'ui:displayType': 'row',
    'ui:showDescIcon': true
};

// 表格布局
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 24 }
    },
    wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 }
    }
};

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

// 表格排序按钮
const DragHandle = sortableHandle(() => (
    <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
));

// 初始化字段
const ininFields = {
    tabList: [],                        // 保存左侧tab列表
    show: false,                        // 控制schema Modal显示隐藏
    schema: defaultValue,               // schema默认值
    configs: [],                        // schema默认配置
    formData: {},                       // 获取FormRender保存的表单数据
    nodeName: '',                       // 保存当前步骤名称
    defaultHandler: [],                 // 保存当前步骤默认处理人
    remindRules: 1,                     // 节点截止时间 1-31工作日
    remindNotifier: 2,                  // 截止后通知人员 1-节点处理人,2-全流程处理人
    remindModels: [3],                  // 通知方式 1-邮件,2-短信,3-系统提醒
    sequence: 1,                        // 保存步骤顺序
    formListData: [],                   // 保存产品信息
    currentKey: 1,                      // 保存当前Tab key值
    isModalVisible: false,              // 控制产品信息表单Modal显示隐藏
    dataSource: [],                     // 表格数据源
    selectedRowKeys: [],                // 表格选中项id
    queryFiledName: '',                 // 保存过滤时输入的字段名称
    isAddStepModal: false,              // 控制新增节点弹窗显示隐藏
    lifecycleTemplateId: 0,             // 当前模板id
    userList: [],                       // 步骤默认处理人
    isUporDown: true,                   // 上移下移是否保存
    backupsData: []                     // 备份要素要素信息即DataSource
};

function processNodeInfoReducer(state, action) {
    switch (action.type) {
        case 'patch':
            return { ...state, ...action.stateData };
        case 'reset':
            // 数据重置
            return {
                ...state,
                schema: defaultValue,
                formData: {},
                formListData: [],
                selectedRowKeys: [],
                queryFiledName: ''
            };
        default:
            throw new Error();
    }
}

const ProcessNodeInfo = (props) => {

    const { dispatch, templateId, loading, queryloading, productTemplate, queryHistory, queryData } = props;
    const { lifecycleNodeList, currentNode={}, templateStatuis, relatedProducts } = productTemplate;

    const [stateData, dispatchReducer] = useReducer(processNodeInfoReducer, ininFields);


    // 控制要素table loading状态
    const [tableLoading, setTableLoading] = useState(false);
    // relatedProducts: 0                  // 与产品模板是否关联
    const [templateInfo, setTemplateInfo] = useState();
    useEffect(() => {
        console.log(templateId);
        dispatchReducer({ type: 'reset' }); // 数据重置
    }, []);

    // 创建schema实例对象
    const genRef = useRef();

    // 创建form表单实例对象
    const formRef = useRef();

    // 创建基础信息form表单实例对象
    const baseInfoRef = useRef();


    /**
     * @description: 勾选是否必填
     * @param {*} text 表格单元格的值
     * @param {*} record 表格一行的值
     */


    const _checkedChange = (text, record) => {
        const tempArr = cloneDeep(stateData.dataSource);
        !isEmpty(tempArr) &&
            tempArr.forEach((item) => {
                if (item.lifecycleElementId === record.lifecycleElementId) {
                    item.required = text === 1 ? 0 : 1;
                }
            });
        dispatchReducer({ type: 'patch', stateData: { dataSource: tempArr, backupsData: tempArr } });
    };

    // 表格列
    const columns = [
        {
            title: '字段',
            dataIndex: 'label',
            width: 120,
            className: 'drag-visible',
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '类型',
            dataIndex: 'type',
            width: 100,
            className: 'drag-visible',
            render: (val) => <span>{formItemType[val] || '--'}</span>
        },
        {
            title: '是否必填',
            dataIndex: 'required',
            width: 100,
            className: 'drag-visible',
            render: (text, record) => {

                return (
                    <Checkbox
                        disabled={!props.authEdit}
                        checked={Number(text) === 1}
                        onChange={() => _checkedChange(text, record)}
                    />
                );
            }
        },
        {
            title: '排序',
            dataIndex: 'sort',
            width: 80,
            className: 'drag-visible',
            render: () => <DragHandle />
        }
    ];

    // 拖拽结束
    const _onSortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex !== newIndex) {
            const newData = arrayMove([].concat(stateData.dataSource), oldIndex, newIndex).filter((el) => !!el);
            // console.log('Sorted items: ', newData);
            dispatchReducer({ type: 'patch', stateData: { dataSource: newData, backupsData: newData } });
        }
    };

    // 拖拽容器
    const _DraggableContainer = (props) => (
        <SortableContainer
            useDragHandle
            disableAutoscroll
            helperClass="row-dragging"
            onSortEnd={_onSortEnd}
            {...props}
        />
    );

    const _DraggableBodyRow = ({ className, style, ...restProps }) => {
        // function findIndex base on Table rowKey props and should always be a right array index
        const index = stateData.dataSource.findIndex((x) => x.index === restProps['data-row-key']);
        return <SortableItem index={index} {...restProps} />;
    };

    /**
     * @description: 控制页面中Modal显示隐藏
     * @param {String} type 弹窗类型 schema：自定义表单弹窗 editFundInfo： 产品信息编辑弹窗 addStep：新增节点弹窗
     * @param {Object} item 单个节点数据
     */
    const _toggle = (type, item) => {
        switch (type) {
            case 'schema':
                dispatchReducer({ type: 'patch', stateData: { show: !stateData.show } });
                break;
            case 'editFundInfo':
                if (!isEmpty(item)) {       // 点击打开弹窗时请求, 关闭弹窗时则不请求
                    setTableLoading(true);
                    dispatch({
                        type: 'productTemplate/queryLifeCycleElementInfo',
                        callback: (res) => {
                            if (res.code === 1008 && res.data) {
                                let tempArr = cloneDeep(res.data);
                                if (!item.featureInfoForm || isEmpty(JSON.parse(item.featureInfoForm))) {        // featureInfoForm为空即未配置要素时查询
                                    Array.isArray(tempArr) &&
                                        tempArr.forEach((d, i) => {
                                            d.index = i;
                                        });
                                    dispatchReducer({ type: 'patch', stateData: { dataSource: tempArr, backupsData: tempArr } });
                                } else if (isNumber(item.lifecycleNodeId)) {                                   // 存在节点id 即已经保存过要素信息
                                    if (isEmpty(stateData.dataSource)) {
                                        let formListArr = !!item.featureInfoForm ? cloneDeep(JSON.parse(item.featureInfoForm)) : [];
                                        let newArray = [];

                                        !isEmpty(tempArr) && !isEmpty(formListArr) &&
                                            formListArr.forEach((fItem) => {
                                                tempArr.forEach((innerItem) => {
                                                    if (fItem.lifecycleElementId === innerItem.lifecycleElementId) {
                                                        newArray.push({
                                                            ...innerItem,
                                                            required: fItem.required,
                                                            index: fItem.index
                                                        });
                                                    }
                                                });
                                            });
                                        // 若要素信息有新增，则添加到最后
                                        if (tempArr.length !== formListArr.length) {
                                            let addArr = tempArr.filter((v) => {
                                                return formListArr.every((e) => e.lifecycleElementId != v.lifecycleElementId);
                                            });
                                            // 设置添要素的index
                                            addArr.forEach((item, i) => {
                                                item.index = newArray.length + i;
                                            });
                                            newArray = [
                                                ...newArray,
                                                ...addArr
                                            ];
                                        }

                                        dispatchReducer({ type: 'patch', stateData: { dataSource: newArray, backupsData: newArray } });
                                    }

                                }
                                setTableLoading(false);
                            } else {
                                setTableLoading(false);
                            }
                        }
                    });
                }
                dispatchReducer({ type: 'patch', stateData: { isModalVisible: !stateData.isModalVisible } });
                break;
            case 'addStep':
                dispatchReducer({ type: 'patch', stateData: { isAddStepModal: !stateData.isAddStepModal } });
                break;
            default:
                break;
        }
    };
    // 渲染流程节点的基础信息、要素信息
    const _setData = (data) => {
        let tempArr = [];

        // 要素table选择的index值
        if (data.featureInfoForm && !isEmpty(JSON.parse(data.featureInfoForm)) && !isEmpty(data.lifeCycleElementRspList)) {
            JSON.parse(data.featureInfoForm).forEach((item) => {
                data.lifeCycleElementRspList.forEach((innerItem) => {
                    if (innerItem.lifecycleElementId === item.lifecycleElementId) {
                        tempArr.push(item.index);
                    }

                });
            });
        }
        dispatchReducer({
            type: 'patch',
            stateData: {
                defaultHandler: !!data.defaultHandler ? JSON.parse(data.defaultHandler) : [],
                formListData: !!data.lifeCycleElementRspList ? data.lifeCycleElementRspList : [],
                nodeName: !!data.nodeName ? data.nodeName : '',
                remindRules: !!data.remindRules ? data.remindRules : 1,
                remindNotifier: !!data.remindNotifier ? data.remindNotifier : 2,
                remindModels: !!data.remindModels ? data.remindModels : [3],
                selectedRowKeys: tempArr
            }
        });
    };

    // 查询单个tab数据
    const _queryInfo = (key, tabData) => {
        let id = 0;
        !isEmpty(tabData) &&
            tabData.forEach((item) => {
                if (item.sequence === Number(key)) {
                    id = item.lifecycleNodeId;
                }
            });
        if (!!id) {
            dispatch({
                type: 'productTemplate/querylifeCycleTemplate',
                payload: {
                    lifecycleTemplateId: templateId,
                    lifecycleNodeId: id
                },
                callback: (res) => {
                    if (res.code === 1008 && res.data) {
                        _setData(res.data.lifeCycleNodeRsp, res.data);        // 已有节点id的节点数据
                        setTemplateInfo(res.data);
                        dispatch({
                            type: 'productTemplate/updateState',
                            payload: {
                                currentNode: res.data.lifeCycleNodeRsp
                            }
                        });
                    }
                }
            });
        } else {
            _setData(stateData.tabList[Number(key) - 1]);           // 新建时的节点数据
        }

    };


    /**
     * @description: 数据初始化
     */
    useEffect(() => {
        // schema配置初始化
        let tempArr = cloneDeep(defaultSettings).slice(0, 2);
        dispatchReducer({ type: 'patch', stateData: { configs: tempArr } });

        dispatch({
            type: 'productTemplate/selectAllUser',
            payload: {
                pageSize: 99999,
                pageNo: 1
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    dispatchReducer({ type: 'patch', stateData: { userList: res.data.list } });
                }
            }
        });
    }, []);

    useEffect(() => {
        setTemplateInfo({relatedProducts});
    }, [relatedProducts]);

    /**
     * @description: 编辑时数据渲染
     * @param {*}
     */
    useEffect(() => {
        if (!isEmpty(lifecycleNodeList) && !isEmpty(currentNode) && Number(templateId)!==0) {
            let tempArr = cloneDeep(lifecycleNodeList);
            tempArr.forEach((item) => {
                item.key = item.sequence;
            });
            _setData(currentNode);
            dispatchReducer({ type: 'patch', stateData: { tabList: tempArr } });
        }
    }, [lifecycleNodeList]);

    /**
     * @description: Tab切换事件
     * @param {*} key TabKey
     */
    const _onOperationTabChange = (key) => {
        if (stateData.currentKey !== Number(key)) {
            if (stateData.isUporDown) {
                _queryInfo(key, stateData.tabList);
                // 切换tab 请求接口查询右侧数据,渲染表单数据，清除缓存字段，如queryFiledName
                dispatchReducer({
                    type: 'patch',
                    stateData: {
                        currentKey: Number(key),
                        queryFiledName: '',
                        dataSource: [],
                        selectedRowKeys: [],
                        backupsData: []
                    }
                });
            } else {
                openNotification('warning', '提示', '节点步骤顺序已修改，请先保存！', 'topRight');
            }
        }
    };

    /**
     * @description: change事件保存选中的值
     * @param {String} type 判断具体哪个checkbox、radio、select
     * @param {*} e 改变的值
     */
    const _handleChange = (e, type) => {
        switch (type) {
            case 'nodeName':
                dispatchReducer({ type: 'patch', stateData: { nodeName: e.target.value } });
                break;
            case 'defaultHandler':
                dispatchReducer({ type: 'patch', stateData: { defaultHandler: e } });
                break;
            case 'remindRules':
                dispatchReducer({ type: 'patch', stateData: { remindRules: e } });
                break;
            case 'remindNotifier':
                dispatchReducer({ type: 'patch', stateData: { remindNotifier: e.target.value } });
                break;
            case 'remindModels':
                dispatchReducer({ type: 'patch', stateData: { remindModels: e } });
                break;
            case 'sequence':
                dispatchReducer({ type: 'patch', stateData: { sequence: e } });
                break;

            default:
                break;
        }
    };

    /**
     * @description: 点击页面中的弹窗保存按钮
     * @param {String} type 弹窗类型
     */
    const _handleOk = (type) => {
        if (type === 'schema') {
            const value = genRef.current && genRef.current.getValue();
            dispatchReducer({ type: 'patch', stateData: { schema: value } });
            _toggle(type);

        } else if (type === 'editFundInfo') {

            // 设置表单数据
            let tempArr = [];
            (Array.isArray(stateData.selectedRowKeys) && !isEmpty(stateData.dataSource)) &&
                stateData.dataSource.forEach((item) => {
                    stateData.selectedRowKeys.forEach((innerItem) => {
                        if (item.index === innerItem) {
                            tempArr.push(item);
                        }
                    });
                });
            dispatchReducer({ type: 'patch', stateData: { formListData: tempArr } });
            _toggle(type);

        } else if (type === 'addStep') {

            // 触发表单校验规则
            formRef.current.validateFields()
                .then((values) => {
                    let tempArr = cloneDeep(stateData.tabList);
                    const { nodeName, defaultHandler } = values;
                    if (!isEmpty(stateData.tabList)) {
                        if (stateData.currentKey === stateData.tabList.length) {      // 当前tab为最后一个就直接添加
                            tempArr.push({
                                key: stateData.currentKey + 1,
                                sequence: stateData.currentKey + 1,
                                isDelete: 0,
                                remindRules: 1,
                                remindNotifier: 2,
                                remindModels: [3],
                                nodeName,
                                defaultHandler
                            });
                        } else {
                            stateData.tabList.forEach((item, i) => {

                                if (item.key > stateData.currentKey) {                    // 当前tab在中间，插入一个，且后面的key递增
                                    tempArr[i].key = item.key + 1;
                                    tempArr[i].sequence = item.sequence + 1;
                                }
                            });
                            tempArr.splice(stateData.currentKey, 0, {
                                key: stateData.currentKey + 1,
                                sequence: stateData.currentKey + 1,
                                isDelete: 0,
                                remindRules: 1,
                                remindNotifier: 2,
                                remindModels: [3],
                                nodeName,
                                defaultHandler
                            });
                        }
                        // 新增完成自动切换到新的Tab
                        dispatchReducer({
                            type: 'patch',
                            stateData: {
                                currentKey: (stateData.currentKey + 1),
                                queryFiledName: '',
                                dataSource: [],
                                selectedRowKeys: [],
                                backupsData: []
                            }
                        });
                    } else {            // 新建
                        tempArr.push({
                            key: stateData.currentKey,
                            sequence: stateData.currentKey,
                            isDelete: 0,
                            nodeName,
                            remindRules: 1,
                            remindNotifier: 2,
                            remindModels: [3],
                            defaultHandler
                        });
                    }
                    dispatchReducer({
                        type: 'patch',
                        stateData: {
                            tabList: tempArr,
                            remindRules: 1,
                            remindNotifier: 2,
                            remindModels: [3],
                            nodeName,
                            defaultHandler
                        }
                    });
                    dispatchReducer({ type: 'reset' }); // 数据重置
                    _toggle(type);
                })
                .catch((errorInfo) => {
                    // console.log('errorInfo', errorInfo);
                });
        }
    };

    // 保存节点信息
    const _onOk = () => {

        let tempTabList = cloneDeep(stateData.tabList);

        let idList = [];   // 当前节点的产品要素选中字段的id列表
        Array.isArray(stateData.formListData) &&
            stateData.formListData.forEach((item) => {
                idList.push({
                    lifecycleElementId: item.lifecycleElementId,
                    required: item.required
                });
            });
        tempTabList.forEach((item) => {
            if (item.sequence === stateData.currentKey) {
                // 要素信息表单配置
                item.key = undefined;
                item.lifeCycleElementRspList = idList;
                item.nodeName = stateData.nodeName;
                item.defaultHandler = JSON.stringify(stateData.defaultHandler);
                item.remindRules = stateData.remindRules;
                item.remindNotifier = stateData.remindNotifier;
                item.remindModels = stateData.remindModels;
                item.featureInfoForm = JSON.stringify(stateData.dataSource);
            }
        });
        dispatch({
            type: 'productTemplate/insertTemplate',
            payload: {
                lifecycleNodeList: tempTabList,
                lifecycleTemplateId: templateId
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    _queryInfo(stateData.currentKey, res.data.lifecycleNodeList);
                    if (!isEmpty(res.data.lifecycleNodeList)) {
                        let tempArr = cloneDeep(res.data.lifecycleNodeList);
                        tempArr.forEach((item) => {
                            item.key = item.sequence;
                        });
                        dispatchReducer({ type: 'patch', stateData: { tabList: tempArr, currentKey: stateData.currentKey, isUporDown: true } });
                    }
                    queryHistory(templateId);
                    openNotification('success', '提示', '保存成功', 'topRight');
                } else {
                    const warningText = res.message || res.data || '保存失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }

        });
    };

    /**
     * @description: 删除节点
     */
    const _deleteStep = () => {

        confirm({
            title: '请您确认是否删除当前节点?',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            onOk() {
                let arr = cloneDeep(stateData.tabList);
                !isEmpty(arr) &&
                    arr.forEach((item) => {
                        if (item.sequence === stateData.currentKey) {
                            item.isDelete = 1;
                        }
                    });
                dispatch({
                    type: 'productTemplate/insertTemplate',
                    payload: {
                        lifecycleNodeList: arr,
                        lifecycleTemplateId: templateId
                    },
                    callback: (res) => {
                        if (res.code === 1008 && res.data) {
                            openNotification('success', '提示', '删除成功', 'topRight');
                            // 删除完成自动切换到tab1
                            queryData(res.data.lifecycleTemplateId);
                            if (stateData.currentKey === 1) {
                                dispatchReducer({ type: 'patch', stateData: { currentKey: 1, tabList: [] } });
                            } else {
                                dispatchReducer({ type: 'patch', stateData: { currentKey: 1 } });
                            }

                        } else {
                            const warningText = res.message || res.data || '删除失败！';
                            openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                        }
                    }
                });
            },
            onCancel() {
                // console.log('Cancel');
            }
        });

    };

    /**
      * @description: 上移、下移
      * @param {String} type
      */
    const _sortStep = (type) => {

        let calcNum = type === 'up' ? -1 : 1;
        let oldIndex = stateData.currentKey - 1;
        let newIndex = stateData.currentKey - 1 + calcNum;

        let tempArr = cloneDeep(stateData.tabList);

        // 节点key和sequence不变，其他字段信息互换
        let tempKey = tempArr[oldIndex].key;
        let tempSequence = tempArr[oldIndex].sequence;
        tempArr[oldIndex].key = tempArr[newIndex].key;
        tempArr[newIndex].key = tempKey;
        tempArr[oldIndex].sequence = tempArr[newIndex].sequence;
        tempArr[newIndex].sequence = tempSequence;

        // 互换两个节点数据
        let tempObj = tempArr[oldIndex];
        tempArr[oldIndex] = tempArr[newIndex];
        tempArr[newIndex] = tempObj;
        dispatchReducer({ type: 'patch', stateData: { tabList: tempArr, currentKey: (newIndex + 1), isUporDown: false } });
    };


    /**
     * @description: Table的CheckBox change事件
     * @param {Array} selectedRowKeys
     */
    const _onSelectChange = (selectedRowKeys) => {
        dispatchReducer({ type: 'patch', stateData: { selectedRowKeys: selectedRowKeys } });
    };

    // 表格checkbox配置项
    const rowSelection = {
        selectedRowKeys: stateData.selectedRowKeys,
        onChange: _onSelectChange
    };

    /**
     * @description: 设置表单要素loading状态
     * @param {*} data
     */
    const _setLoading = (data) => {
        setTableLoading(true);
        // eslint-disable-next-line no-undef
        let timer = setTimeout(() => {
            dispatchReducer({ type: 'patch', stateData: data });
            setTableLoading(false);
            // eslint-disable-next-line no-undef
            clearTimeout(timer);
        }, 1000);
    };

    /**
     * @description: 字段名称change事件
     * @param {Object} e
     */
    const _filedNameChange = (e) => {
        if (!e.target.value) {
            // 清空查询框重新渲染DataSource
            if (stateData.tabList[Number(stateData.currentKey) - 1].lifecycleNodeId) {
                _setLoading({ dataSource: stateData.backupsData });
            } else {
                // 新增时清空后重新请求接口渲染DataSource
                // 编辑时，featureInfoForm字段为空时重新请求接口
                dispatch({
                    type: 'productTemplate/queryLifeCycleElementInfo',
                    callback: (res) => {
                        if (res.code === 1008 && res.data) {
                            let tempArr = cloneDeep(res.data);
                            Array.isArray(tempArr) &&
                                tempArr.forEach((item, i) => {
                                    item.index = i;
                                });
                            _setLoading({ dataSource: tempArr });
                        }
                    }
                });
            }
        }
        dispatchReducer({ type: 'patch', stateData: { queryFiledName: e.target.value } });
    };

    /**
     * @description: 产品信息根据字段名称筛选
     * @param {*}
     */
    const _handleSearch = () => {
        let tempArr = stateData.dataSource.filter((val) => val.label.includes(stateData.queryFiledName));
        _setLoading({ dataSource: tempArr });
    };

    /**
     * @description: Tab页签渲染
     * @param {*} data 页签对应的数据
     */
    const TabRender = (data) => {
        let defaultHandlerArr = typeof data.defaultHandler === 'string' ? JSON.parse(data.defaultHandler) : data.defaultHandler;
        let tempArr = [];
        (Array.isArray(stateData.userList) && Array.isArray(defaultHandlerArr)) &&
            defaultHandlerArr.forEach((item) => {
                stateData.userList.forEach((innerItem) => {
                    if (innerItem.managerUserId === item) {
                        tempArr.push(innerItem.userName);
                    }
                });
            });
        return (
            <div className={styles.tabBox} style={{ textAlign: 'left', maxWidth: 200 }}>
                <p title={data.nodeName || '--'}>步骤{data.key}：{data.nodeName || '--'}</p>
                <p title={data.createTime && moment(data.createTime).format(dateFormat) || '--'}>
                    创建时间：{data.createTime && moment(data.createTime).format(dateFormat) || '--'}
                </p>
                <p title={tempArr.toString() || '--'}>处理人：{tempArr.toString() || '--'}</p>
            </div>
        );
    };

    /**
     * @description: form表单渲染
     * @param {Object} item formItem数据
     */
    const formRender = (item) => {
        switch (item.type) {
            case 'input':
                return (
                    <Input placeholder={item.placeholder} />
                );
            case 'inputNumber':
                return (
                    <Input placeholder={item.placeholder} type="number" />
                );
            case 'datePicker':
                return (
                    <DatePicker format={dateFormat} style={{ width: '100%' }} />
                );
            case 'rangePicker':
                return (
                    <RangePicker format={dateFormat} style={{ width: '100%' }} />
                );
            case 'textArea':
                return (
                    <TextArea placeholder={item.placeholder} />
                );
            case 'select':
                return (
                    <Select placeholder={item.placeholder}  allowClear>
                        {
                            !isEmpty(item.options) &&
                            item.options.map((innerItem) => (
                                <Option key={getRandomKey(4)} value={innerItem.value}>
                                    {innerItem.label}
                                </Option>
                            ))
                        }
                    </Select>
                );
            case 'selectMultiple':
                return (
                    <Select placeholder={item.placeholder}  allowClear mode="multiple">
                        {
                            !isEmpty(item.options) &&
                            item.options.map((innerItem) => (
                                <Option key={getRandomKey(4)} value={innerItem.value}>
                                    {innerItem.label}
                                </Option>
                            ))
                        }
                    </Select>
                );
            case 'radio':
                return (
                    <Radio.Group>
                        {
                            !isEmpty(item.options) &&
                            item.options.map((innerItem) => (
                                <Radio key={innerItem.id} value={innerItem.value}>{innerItem.label}</Radio>
                            ))
                        }
                    </Radio.Group >
                );
            default:
                break;
        }
    };

    console.log(stateData, 'stateData');

    return (
        <Card
            className={styles.processNodeInfoWrapper}
            title="流程节点信息"
        // loading={loading}
        >
            <Tabs
                tabPosition="left"
                activeKey={String(stateData.currentKey)}
                onChange={_onOperationTabChange}
                style={{ maxHeight: 800 }}
            >
                {
                    !isEmpty(stateData.tabList) &&
                    stateData.tabList.map((item) => {
                        return (
                            <Tabs.TabPane
                                key={String(item.key)}
                                // forceRender
                                tab={TabRender(item)}
                            >
                                <Card title="基础信息编辑" className={styles.editBaseInfo}>
                                    <Row gutter={[8, 25]}>
                                        <Col span={8}>
                                            <p>步骤名称：</p>
                                            <Input
                                                onChange={(e) => _handleChange(e, 'nodeName')}
                                                value={stateData.nodeName}
                                                autoComplete="off"
                                            />
                                        </Col>
                                        <Col span={8}>
                                            <p>步骤默认处理人：</p>
                                            <Select
                                                style={{ width: '100%' }}
                                                placeholder="请选择"
                                                mode="multiple"
                                                allowClear
                                                value={stateData.defaultHandler}
                                                onChange={(e) => _handleChange(e, 'defaultHandler')}
                                            >
                                                {
                                                    !isEmpty(stateData.userList) &&
                                                    stateData.userList.map((item) => {
                                                        return (
                                                            <Option key={item.managerUserId} value={item.managerUserId}>{item.userName}</Option>
                                                        );
                                                    })
                                                }
                                            </Select>
                                        </Col>
                                    </Row>
                                    <Row gutter={[8, 25]}>
                                        <Col span={8}>
                                            <p>节点截止时间（空则不提醒）：</p>
                                            <Select
                                                style={{ width: '100%' }}
                                                placeholder="请选择"
                                                allowClear
                                                value={stateData.remindRules}
                                                onChange={(e) => _handleChange(e, 'remindRules')}
                                            >
                                                {
                                                    !isEmpty(monthDay) &&
                                                    monthDay.map((item) => {
                                                        return (
                                                            <Option key={item.value} value={item.value}>{item.label}</Option>
                                                        );
                                                    })
                                                }
                                            </Select>
                                        </Col>
                                        <Col span={12}>
                                            <p>截止后通知人员：</p>
                                            <Radio.Group
                                                value={stateData.remindNotifier}
                                                onChange={(e) => _handleChange(e, 'remindNotifier')}
                                            >
                                                <Radio value={1}>节点处理人</Radio>
                                                <Radio value={2}>全流程处理人</Radio>
                                            </Radio.Group>
                                        </Col>
                                    </Row>
                                    <Row gutter={[8, 25]}>
                                        <Col span={8}>
                                            <p>通知方式：</p>
                                            <Checkbox.Group
                                                value={stateData.remindModels}
                                                onChange={(e) => _handleChange(e, 'remindModels')}
                                            >
                                                <Checkbox value={3}>系统提醒</Checkbox>
                                                <Checkbox value={2}>短信</Checkbox>
                                                <Checkbox value={1}>邮件</Checkbox>
                                            </Checkbox.Group>
                                        </Col>
                                        <Col>
                                            <p>步骤顺序：</p>
                                            <Space>
                                                <InputNumber
                                                    onChange={(e) => _handleChange(e, 'sequence')}
                                                    value={stateData.currentKey}
                                                    autoComplete="off"
                                                    min={1}
                                                    disabled
                                                />
                                                {
                                                    props.authEdit &&
                                                    <Button
                                                        type="primary"
                                                        disabled={
                                                            !(stateData.tabList.every((item) => {
                                                                return !!item.lifecycleNodeId;
                                                            }))
                                                            || stateData.currentKey === 1
                                                            || templateStatuis === 2
                                                        }
                                                        onClick={() => _sortStep('up')}
                                                    >
                                                        上移
                                                    </Button>
                                                }
                                                {
                                                    props.authEdit &&
                                                    <Button
                                                        type="primary"
                                                        disabled={
                                                            !(stateData.tabList.every((item) => {
                                                                return !!item.lifecycleNodeId;
                                                            }))
                                                            || stateData.currentKey === stateData.tabList.length
                                                            || templateStatuis === 2
                                                        }
                                                        onClick={() => _sortStep('down')}
                                                    >
                                                        下移
                                                    </Button>
                                                }

                                            </Space>
                                            <p className={styles.tips}>请先保存节点信息再调整步骤顺序</p>
                                        </Col>

                                    </Row>
                                </Card>
                                {templateInfo.relatedProducts === 1 &&
                                    <Card title="要素信息编辑">
                                        <div className={styles.customMenu}>
                                            {/* <h3><strong>自定义表单</strong></h3>
                                            {
                                                stateData.schema && stateData.schema.properties ?
                                                    <FormRender
                                                        schema={stateData.schema}
                                                        formData={stateData.formData}
                                                        onChange={(e) => dispatchReducer({ type: 'patch', stateData: { formData: e } })}
                                                    />
                                                    :
                                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                            } */}

                                            {/* <Space className={styles.editBtn}>
                                                <Button type="primary" onClick={() => _toggle('schema')} style={{ marginBottom: 12 }}>
                                                    编辑自定义表单
                                                </Button>
                                            </Space> */}
                                        </div>
                                        {
                                            queryloading &&
                                            <div className={styles.spinBox}>
                                                <Spin size="large" />
                                            </div>
                                        }

                                        <div className={styles.editInfo}>
                                            <h3><strong>产品信息</strong></h3>
                                            <div className={styles.customBtn}>
                                                {
                                                    !isEmpty(stateData.formListData) ?
                                                        <Form
                                                            name="productInfoData"
                                                            ref={baseInfoRef}
                                                            // layout="vertical"
                                                            {...formItemLayout}
                                                            autoComplete="off"
                                                        >
                                                            <Row>
                                                                {
                                                                    !isEmpty(stateData.formListData) &&
                                                                    stateData.formListData.map((item) => (
                                                                        <Col key={getRandomKey(6)} span={12}>
                                                                            <FormItem
                                                                                label={item.label}
                                                                                name={item.fieldName}
                                                                                rules={[
                                                                                    {
                                                                                        required: item.required === 1,
                                                                                        message: item.message
                                                                                    }
                                                                                ]}
                                                                            >
                                                                                {formRender(item)}
                                                                            </FormItem>
                                                                        </Col>

                                                                    ))}
                                                            </Row>
                                                        </Form>
                                                        :
                                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                                }
                                                {
                                                    // props.authEdit &&
                                                    <Space className={styles.editBtn}>
                                                        <Button type="primary"
                                                            onClick={() => _toggle('editFundInfo', item)}
                                                            style={{ marginBottom: 12 }}
                                                            disabled={templateStatuis === 2}
                                                        >
                                                            编辑产品信息表单
                                                        </Button>
                                                    </Space>
                                                }
                                            </div>
                                        </div>
                                    </Card>
                                }
                            </Tabs.TabPane>
                        );
                    })
                }

            </Tabs>


            {
                props.authEdit &&
                    !isEmpty(stateData.tabList) ?
                    <Space className={styles.btnGroup}>
                        <Button type="primary" onClick={_onOk} loading={loading} disabled={templateStatuis === 2}>
                            保存节点信息
                        </Button>
                        <Button
                            onClick={() => _toggle('addStep')}
                            disabled={
                                stateData.tabList.some((item) => {
                                    return !item.lifecycleNodeId;
                                })
                                || !stateData.isUporDown
                                || templateStatuis === 2
                            }
                        >
                            插入节点
                        </Button>
                        <Button
                            danger
                            onClick={() => _deleteStep()}
                            disabled={
                                stateData.tabList.some((item) => {
                                    return !item.lifecycleNodeId;
                                })
                                || !stateData.isUporDown
                                || templateStatuis === 2
                            }
                        >
                            删除节点
                        </Button>
                    </Space>
                    :
                    props.authEdit &&
                    <Space className={styles.btnGroupEmpty}>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        <Button
                            type="primary"
                            onClick={() => _toggle('addStep')}
                            disabled={Number(templateId) === 0 || templateStatuis === 2}
                        >
                            新增节点
                        </Button>
                    </Space>

            }


            {
                stateData.isAddStepModal &&
                <Modal
                    title="新增节点"
                    visible={stateData.isAddStepModal}
                    onCancel={() => _toggle('addStep')}
                    onOk={() => _handleOk('addStep')}
                    okText="确定"
                    cancelText="取消"
                    className={styles.addStepModal}
                    width={450}
                >
                    <Form
                        name="basic"
                        ref={formRef}
                    >
                        <Row gutter={[8, 0]}>
                            <Col span={24}>
                                <FormItem
                                    label="步骤名称"
                                    name="nodeName"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入步骤名称'
                                        }
                                    ]}
                                >
                                    <Input placeholder="请输入" autoComplete="off" />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={[8, 0]}>
                            <Col span={24}>
                                <FormItem
                                    label="步骤默认处理人"
                                    name="defaultHandler"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择步骤默认处理人'
                                        }
                                    ]}
                                >

                                    <Select
                                        style={{ width: '100%' }}
                                        allowClear
                                        placeholder="请选择"
                                        mode="multiple"
                                    >
                                        {
                                            !isEmpty(stateData.userList) &&
                                            stateData.userList.map((item) => {
                                                return (
                                                    <Option key={item.managerUserId} value={item.managerUserId}>{item.userName}</Option>
                                                );
                                            })
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            }
            {/* {
                stateData.show &&
                <Modal
                    visible={stateData.show}
                    onCancel={() => _toggle('schema')}
                    onOk={() => _handleOk('schema')}
                    okText="确定"
                    cancelText="取消"
                    width="90%"
                    bodyStyle={{ height: '80vh' }}
                >
                    <Generator
                        ref={genRef}
                        defaultValue={stateData.schema}
                        transformer={{
                            from: fromFormily,
                            to: toFormily
                        }}
                        settings={stateData.configs}
                    />
                </Modal>
            } */}
            {
                stateData.isModalVisible &&
                <Modal
                    title="产品信息"
                    visible={stateData.isModalVisible}
                    onCancel={() => _toggle('editFundInfo')}
                    onOk={() => _handleOk('editFundInfo')}
                    okText="确定"
                    cancelText="取消"
                    centered
                    maskClosable={false}
                    className={styles.sortModal}
                    width={800}
                >
                    <div className={styles.filter}>
                        <Space>
                            <span>字段名称:</span>
                            <Input placeholder="请输入" autoComplete="off" onChange={_filedNameChange} allowClear />
                        </Space>
                        <Button type="primary" onClick={_handleSearch}>查询</Button>
                    </div>
                    <Alert
                        style={{ marginTop: 12 }}
                        message={
                            <Fragment>
                                <Row align="middle">
                                    <Col span={20}>
                                        已选择{' '}
                                        <a style={{ fontWeight: 600 }}>{stateData.selectedRowKeys.length}</a>{' '}
                                        项&nbsp;&nbsp;
                                        {/* 必填{' '}
                                        <a style={{ fontWeight: 600 }}>{stateData.selectedRowKeys.length}</a>{' '}
                                        项&nbsp;&nbsp; */}
                                    </Col>

                                </Row>
                            </Fragment>
                        }
                        type="info"
                        showIcon
                    />
                    <Table
                        scroll={{ x: '100%', y: 600 }}
                        pagination={false}
                        dataSource={stateData.dataSource}
                        columns={columns}
                        rowKey="index"
                        rowSelection={rowSelection}
                        components={{
                            body: {
                                wrapper: _DraggableContainer,
                                row: _DraggableBodyRow
                            }
                        }}
                        loading={tableLoading}
                    />
                </Modal>
            }
        </Card >
    );
};

export default connect(({ productTemplate, loading }) => ({
    productTemplate,
    loading: loading.effects['productTemplate/insertTemplate'],
    queryloading: loading.effects['productTemplate/querylifeCycleTemplate']
}))(ProcessNodeInfo);
