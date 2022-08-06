import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Select, Button, DatePicker, Spin, notification } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import needDisposeColumns from '../../needDisposeColumns';
import styles from './styles.less';
const { Option } = Select;
const { RangePicker } = DatePicker;

interface QueryFormPro {
    forwardRef: any;
    dispatch: any;
    loading: boolean;
    loading2: boolean;
    customMetricsSelectTree:any;
    customMetricsTable:any;
    queryForm:any;
}

const QueryForm: React.FC<QueryFormPro> = (props) => {
    const [form] = Form.useForm();
    const [templateTypeVal, changeTemplateTypeVal] = useState<any>(1);
    const [templateNameOrgArr, setTemplateNameOrgArr] = useState<any[]>([]);
    const [standardArr, setStandardArr] = useState<any[]>([]);
    let time = null;

    const onFinish = (val) => {
        const { dispatch } = props;
        const resultVal = cloneDeep(val);
        if (val.timeArr) {
            resultVal.startDate = moment(val.timeArr[0]).format('YYYY-MM-DD');
            resultVal.endDate = moment(val.timeArr[1]).format('YYYY-MM-DD');
        }
        if (val.time) {
            resultVal.startDate = resultVal.endDate = moment(val.time).format('YYYY-MM-DD');
        }
        if (typeof val.productIds !== 'object') {
            resultVal.productIds = [val.productIds];
        } else {
            resultVal.productIds = val.productIds.map((item) => item.value);
        }
        delete resultVal.timeArr;
        delete resultVal.time;
        // 保存当前比较基准，处理分页请求时的问题
        dispatch({
            type: 'queryForm/setStandardCodes',
            standardCodes:resultVal.standardCodes
        });
        resultVal.standardCodes =
            resultVal.standardCodes && resultVal.standardCodes.map((item) => item.value);
        // 保存点击确定时的form表单数据
        dispatch({
            type: 'queryForm/setFormData',
            formData: resultVal
        });
        // 保存当前选中的指标
        dispatch({
            type: 'queryForm/setCheckedArrUseExportAndQueryTableList',
            checkedArrUseExportAndQueryTableList: props.customMetricsSelectTree.checkedKeys
        });
        // 获取选中的指标的源数据

        if (props.customMetricsTable.pageNumber === 1) {
            dispatch({
                type: 'customMetricsTable/queryTableList',
                payload: {
                    ...resultVal,
                    pageNum: 1,
                    pageSize: props.customMetricsTable.pageSize,
                    targets: props.customMetricsSelectTree.checkedKeys
                },
                callback(res) {
                    const {
                        customMetricsSelectTree: { checkedOrgArr }
                    } = props;
                    const columns = [];
                    for (let i = 0; i < checkedOrgArr.length; i++) {
                        if(!checkedOrgArr[i].isLeafNode) {
                            continue;
                        }
                        columns.push({
                            title: checkedOrgArr[i].fullName  || checkedOrgArr[i].targetName,
                            dataIndex: checkedOrgArr[i].targetCode,
                            width: 200,
                            align: 'center',
                            render: (e) => e || '--'
                        });
                        if (
                            needDisposeColumns.find((item) => item === checkedOrgArr[i].targetCode)
                        ) {
                            // 添加相关比较基准列
                            // 遍历选中的比较
                            (form.getFieldValue('standardCodes') || []).forEach((item) => {
                                let key = checkedOrgArr[i].targetCode;
                                key = key[0].toUpperCase() + key.slice(1);
                                columns.push({
                                    title: checkedOrgArr[i].fullName && `${item.label}${checkedOrgArr[i].fullName}` || `${item.label}${checkedOrgArr[i].targetName}`,
                                    dataIndex: `standard${key}${item.value}`,
                                    width: 200,
                                    align: 'center',
                                    render: (e) => e || '--'
                                });
                            });
                        }
                    }
                    dispatch({
                        type: 'customMetricsTable/saveColumns',
                        columns
                    });
                }
            });
        } else {
            dispatch({
                type: 'customMetricsTable/changePageNumber',
                pageNumber: 1
            });
        }
        // 查询提示
        dispatch({
            type: 'customMetricsTable/queryTips',
            payload: {
                ...resultVal,
                pageNum: 1,
                pageSize: props.customMetricsTable.pageSize,
                targets: props.customMetricsSelectTree.checkedKeys
            },
            callback(res) {
                if (res.code !== 1008) {
                    notification.error({
                        message: res.message
                    });
                }
                // console.log(res);
            }
        });
    };

    const onReset = () => {
        const { dispatch } = props;
        form.resetFields();
        changeTemplateTypeVal(1);
        dispatch({
            type: 'customMetricsTable/saveTableList',
            tableData: {}
        });
        dispatch({
            type: 'customMetricsSelectTree/savecheckedKeysAndCheckedOrgArr',
            checkedKeys: props.customMetricsSelectTree.initCheckedKeys,
            checkedOrgArr: props.customMetricsSelectTree.initCheckedOrgArr
        });
    };

    // 选择模板
    const chooseTemplate = (productTargetTemplateId) => {
        const { dispatch } = props;
        if (!productTargetTemplateId) return;
        const nowData = props.queryForm.templateArr.find(
            (item) => item.productTargetTemplateId === productTargetTemplateId,
        );
        let checkedOrgArr = [];
        const { renderArr } = props.customMetricsSelectTree;
        for (let i = 0; i < nowData.targets.length; i++) {
            renderArr.forEach((item) => {
                if (item.targetCode === nowData.targets[i]) {
                    checkedOrgArr.push(item);
                }
            });
        }

        if (nowData.templateType === 1) {
            // 单产品 设置时间范围
            form.setFieldsValue({
                frequency: nowData.frequency,
                timeArr:
                    nowData.startDate && nowData.endDate
                        ? [moment(nowData.startDate), moment(nowData.endDate)]
                        : undefined,
                week: nowData.frequency === 2 ? nowData.week : undefined,
                month: nowData.frequency === 3 ? nowData.month : undefined,
                otherDay: nowData.frequency !== 1 ? nowData.otherDay : undefined,
                standardCodes: nowData.standardCodes && standardArr.filter((item) => nowData.standardCodes.includes(item.standardCode)).map((item2) => ({value: item2.standardCode, label: item2.standardName}))
            });
        }
        if (nowData.templateType === 2) {
            form.setFieldsValue({
                time: nowData.startDate ? moment(nowData.startDate) : undefined,
                standardCodes: nowData.standardCodes && standardArr.filter((item) => nowData.standardCodes.includes(item.standardCode)).map((item2) => ({value: item2.standardCode, label: item2.standardName}))
            });
        }

        dispatch({
            type: 'customMetricsSelectTree/savecheckedKeysAndCheckedOrgArr',
            checkedOrgArr,
            checkedKeys: nowData.targets
        });
    };

    // 查询产品名称
    const handleSearch = (productName) => {
        const { dispatch } = props;
        clearTimeout(time);
        time = setTimeout(() => {
            dispatch({
                type: 'queryForm/queryProductist',
                payload: { productName},
                callback(data) {
                    setTemplateNameOrgArr(data || []);
                }
            });
        }, 500);
    };

    // 指标类型
    const templateTypeChange = (e) => {
        form.setFieldsValue({ productIds: [] });
        form.setFieldsValue({ productTargetTemplateId: undefined });
        changeTemplateTypeVal(e);
    };

    useEffect(() => {
        // 请求模板
        const { dispatch } = props;
        dispatch({
            type: 'queryForm/queryTempList',
            payload: { templateType: templateTypeVal, pageNum: 0 }
        });
    }, [templateTypeVal]);

    // 请求比较基准
    useEffect(() => {
        const { dispatch } = props;
        dispatch({
            type: 'queryForm/queryStandardArr',
            callback(data) {
                setStandardArr(data || []);
                if (data?.length) {
                    const item = data.find((i) => i.standardName === '沪深300');
                    if (item) {
                        const newStandardCodes = [{ value: item.standardCode, label: item.standardName }];
                        form.setFieldsValue({
                            standardCodes: newStandardCodes
                        });
                    }
                }
            }
        });
    }, []);

    useEffect(() => {
        const { dispatch } = props;
        dispatch({
            type: 'queryForm/queryProductist',
            // payload: { pageNum: 0 },
            callback(data) {
                setTemplateNameOrgArr(data || []);
            }
        });
        return () => {
            clearTimeout(time);
        };
    }, []);
    return (
        <Form form={form} onFinish={onFinish} ref={props.forwardRef}>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        label="指标类型"
                        name="templateType"
                        rules={[{ required: true }]}
                        initialValue={1}
                    >
                        <Select onChange={(e) => templateTypeChange(e)} allowClear>
                            <Option value={1}>单产品</Option>
                            <Option value={2}>多产品</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="选择模板" name={'productTargetTemplateId'}>
                        <Select
                            allowClear
                            placeholder={'若已保存请选择'}
                            onChange={chooseTemplate}
                            loading={props.loading2}
                            disabled={props.loading2}
                        >
                            {props.queryForm.templateArr.map((item) => (
                                <Option
                                    value={item.productTargetTemplateId}
                                    key={item.productTargetTemplateId}
                                >
                                    {item.templateName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) =>
                            prevValues.templateType !== currentValues.templateType
                        }
                    >
                        {({ getFieldValue }) =>
                            getFieldValue('templateType') === 1 ? (
                            // true ? (
                                <Form.Item
                                    label="产品名称"
                                    name="productIds"
                                    rules={[{ required: true }]}
                                >
                                    <Select
                                        showSearch
                                        allowClear
                                        placeholder={'请输入全称或简称'}
                                        defaultActiveFirstOption={false}
                                        showArrow={false}
                                        filterOption={false}
                                        onSearch={handleSearch}
                                        notFoundContent={
                                            props.loading ? <Spin size="small" /> : null
                                        }
                                    >
                                        {templateNameOrgArr.map((item) => (
                                            <Option value={item.productId} key={item.productId}>
                                                {item.productName}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            ) : getFieldValue('templateType') === 2 ? (
                                <Form.Item
                                    label="产品名称"
                                    name="productIds"
                                    rules={[{ required: true }]}
                                >
                                    <Select
                                        labelInValue
                                        placeholder={'请输入全称或简称'}
                                        mode={'multiple'}
                                        showSearch
                                        allowClear
                                        defaultActiveFirstOption={false}
                                        showArrow={false}
                                        filterOption={false}
                                        onSearch={handleSearch}
                                        notFoundContent={
                                            props.loading ? <Spin size="small" /> : null
                                        }
                                    >
                                        {templateNameOrgArr.map((item) => (
                                            <Option value={item.productId} key={item.productId}>
                                                {item.productName}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            ) : null
                        }
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) =>
                            prevValues.templateType !== currentValues.templateType
                        }
                    >
                        {({ getFieldValue }) =>
                            // getFieldValue('templateType') === 1 ? (
                            true ? (
                                <Form.Item name="timeArr" label="时间范围">
                                    <RangePicker allowClear style={{ width: '100%' }} />
                                </Form.Item>
                            ) : getFieldValue('templateType') === 2 ? (
                                <Form.Item name="standardCodes" label="比较基准">
                                    <Select
                                        allowClear
                                        mode={'multiple'}
                                        placeholder="请选择"
                                        labelInValue
                                    >
                                        {standardArr.map((item, index) => (
                                            <Option key={index} value={item.standardCode}>
                                                {item.standardName}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            ) : null
                        }
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                        prevValues.templateType !== currentValues.templateType
                    }
                >
                    {({ getFieldValue }) =>
                        // getFieldValue('templateType') === 1 ? (
                        true ? (
                            <React.Fragment>
                                <Col span={12}>
                                    <Row gutter={24}>
                                        <Col span={14}>
                                            <Form.Item
                                                label="数据频率"
                                                name="frequency"
                                                rules={[{ required: true }]}
                                                initialValue={1}
                                            >
                                                <Select allowClear>
                                                    <Option value={1}>日频</Option>
                                                    <Option value={2}>周频</Option>
                                                    <Option value={3}>月频</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={10}>
                                            <Form.Item
                                                noStyle
                                                shouldUpdate={(prevValues, currentValues) =>
                                                    prevValues.frequency !== currentValues.frequency
                                                }
                                            >
                                                {({ getFieldValue }) =>
                                                    getFieldValue('frequency') === 2 ? (
                                                        <Form.Item
                                                            name="week"
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: '该项必填'
                                                                }
                                                            ]}
                                                        >
                                                            <Select allowClear>
                                                                <Option value={1}>周一</Option>
                                                                <Option value={2}>周二</Option>
                                                                <Option value={3}>周三</Option>
                                                                <Option value={4}>周四</Option>
                                                                <Option value={5}>周五</Option>
                                                            </Select>
                                                        </Form.Item>
                                                    ) : getFieldValue('frequency') === 3 ? (
                                                        <Form.Item
                                                            name="month"
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: '该项必填'
                                                                }
                                                            ]}
                                                        >
                                                            <Select allowClear>
                                                                {Array(31)
                                                                    .fill(1)
                                                                    .map(
                                                                        (item, index) =>
                                                                            item + index,
                                                                    )
                                                                    .map((item2) => (
                                                                        <Option value={item2}>
                                                                            {item2}
                                                                        </Option>
                                                                    ))}
                                                            </Select>
                                                        </Form.Item>
                                                    ) : null
                                                }
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        noStyle
                                        shouldUpdate={(prevValues, currentValues) =>
                                            prevValues.frequency !== currentValues.frequency
                                        }
                                    >
                                        {({ getFieldValue }) =>
                                            getFieldValue('frequency') !== 1 ? (
                                                <Form.Item
                                                    name="otherDay"
                                                    label="其他日期"
                                                    extra="多选"
                                                >
                                                    <Select
                                                        allowClear
                                                        mode={'multiple'}
                                                        placeholder="请选择"
                                                    >
                                                        <Option value={1}>分红日</Option>
                                                        <Option value={2}>业绩计提日</Option>
                                                        <Option value={3}>开放日</Option>
                                                    </Select>
                                                </Form.Item>
                                            ) : (
                                                <Form.Item name="standardCodes" label="比较基准">
                                                    <Select
                                                        labelInValue
                                                        allowClear
                                                        mode={'multiple'}
                                                        placeholder="请选择"
                                                    >
                                                        {standardArr.map((item) => (
                                                            <Option value={item.standardCode}>
                                                                {item.standardName}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            )
                                        }
                                    </Form.Item>
                                </Col>
                            </React.Fragment>
                        ) : null
                    }
                </Form.Item>
            </Row>

            <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                    prevValues.templateType !== currentValues.templateType ||
                    prevValues.frequency !== currentValues.frequency
                }
            >
                {({ getFieldValue }) =>
                    // getFieldValue('templateType') !== 1 ? (
                    false ?(
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="time"
                                    label="选择日期"
                                    rules={[{ required: true }]}
                                >
                                    <DatePicker style={{ width: '100%' }} allowClear />
                                </Form.Item>
                            </Col>
                        </Row>
                    ) : getFieldValue('frequency') !== 1 ? (
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item name="standardCodes" label="比较基准">
                                    <Select
                                        allowClear
                                        mode={'multiple'}
                                        placeholder="请选择"
                                        labelInValue
                                    >
                                        {standardArr.map((item) => (
                                            <Option value={item.standardCode}>
                                                {item.standardName}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    ) : null
                }
            </Form.Item>
            <div className={styles.btnG}>
                <Button htmlType={'button'} className={styles.btnGAndRest} onClick={onReset}>
                    清空数据
                </Button>
                <Button
                    htmlType={'submit'}
                    type={'primary'}
                    disabled={!props.customMetricsSelectTree.checkedKeys.length}
                >
                    生成数据
                </Button>
            </div>
        </Form>
    );
};

export default connect(({ customMetricsSelectTree, loading, queryForm, customMetricsTable }) => ({
    customMetricsSelectTree,
    queryForm,
    customMetricsTable,
    loading: loading.effects['queryForm/queryProductist'],
    loading2: loading.effects['queryForm/queryTempList']
}))(QueryForm);
