/*
 * @description: 头部筛选配置
 * @Author: tangsc
 * @Date: 2021-03-29 11:22:21
 */
import React, { useEffect, useState } from 'react';
import { Form, Select, Row, Col, Button, DatePicker, Card, Space, Modal, Input, Checkbox, notification, Spin } from 'antd';
import { isEmpty } from 'lodash';
import { connect } from 'umi';
import styles from '../index.less';
import { getPermission, getRandomKey } from '@/utils/utils';
import moment from 'moment';
import { ExclamationCircleOutlined } from '@ant-design/icons';

// 定义FormItem
const FormItem = Form.Item;
const { confirm } = Modal;

// 获取select下拉选项
const { Option } = Select;

// 获取日期范围区间
const { RangePicker } = DatePicker;

// 设置日期格式
const dateFormat = 'YYYY/MM/DD';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
    }
};


const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};


const Filter = (props) => {

    const { dispatch, createReportForm, forwardRef, toPdf, loading, exportLoading, queryLoading, queryLoading1 } = props;
    const {
        baseInfo,
        tipsInfo,
        templateList,
        attachmentsId,
        customFormData = {},
        assetAllocation,
        isNetValueInfo,
        isProductInfo,
        isNetValueTrends,
        isHistoricalIncomes,
        isStatisticalTable,
        isText,
        isImportantNote,
        templateId,
        productId,
        periods,
        isSelectAll
    } = createReportForm;
    const { productIds = [] } = customFormData;

    // 保存所有产品列表
    const [productList, setProductList] = useState([]);

    // 控制导出报表弹窗显示隐藏
    const [modalVisible, setModalVisible] = useState(false);

    // 控制导出报表弹窗中模板名称是否可编辑
    const [isDisabled, setIsDisabled] = useState(false);

    // 构造表单实例
    const [form] = Form.useForm();
    const [formModal] = Form.useForm();

    // 生成报表
    const _onFinish = (values) => {
        const { productId, tDate } = values;
        let tempObj = {};
        tempObj.productId = productId;
        tempObj.startDate = (tDate && new Date(`${moment(tDate[0]).format().split('T')[0]}T00:00:00`,).getTime()) || undefined;
        tempObj.endDate = (tDate && new Date(`${moment(tDate[1]).format().split('T')[0]}T23:59:59`,).getTime()) || undefined;

        dispatch({
            type: 'createReportForm/getReportData',
            payload: {
                ...tempObj
            },
            callback: ((res) => {
                if (res.code === 1008 && res.data) {
                    dispatch({
                        type: 'createReportForm/updateState',
                        payload: {
                            assetAllocation: true,
                            isNetValueInfo: true,
                            isProductInfo: true,
                            isNetValueTrends: true,
                            isHistoricalIncomes: true,
                            isStatisticalTable: true,
                            isText: true,
                            isImportantNote: true,
                            customFormData: res.data,
                            periods: res.data.performanceRangeShows,
                            isSelectAll: res.data.isSelectAll
                        }
                    });
                    form.setFieldsValue({
                        reportTemplateId: ''
                    });
                }
            })
        });

        // console.log('values', values);
        // console.log('baseInfo', baseInfo);
        // if (tipsInfo) console.log('tipsInfo', tipsInfo.toHTML());
        // if (forwardRef) {
        //     let aaa = forwardRef.current.getFieldsValue();
        //     console.log('---------ref', aaa);
        //     console.log('toHtml', aaa.titleAndContent[0].content.toHTML());
        // }
    };

    const _toggle = () => {
        let tempIdArr = [];
        if (!modalVisible) {
            form.validateFields().then(() => {

                const { reportTemplateId } = form.getFieldsValue();

                tempIdArr = isSelectAll ? [] : productIds;
                if (!isSelectAll && !tempIdArr.includes(productId)) tempIdArr.unshift(productId);

                if (!!reportTemplateId) {

                    let temoObj = [];
                    setIsDisabled(true);
                    if (Array.isArray(templateList)) {
                        temoObj = templateList.filter((item) => {
                            return item.reportTemplateId === reportTemplateId;
                        });
                        formModal.setFieldsValue({
                            templateName: temoObj[0].templateName,
                            productIds: tempIdArr,
                            isAllProducts: isSelectAll
                        });
                    }
                } else {
                    setIsDisabled(false);
                    formModal.setFieldsValue({
                        productIds: tempIdArr
                    });
                }

                dispatch({
                    type: 'createReportForm/updateState',
                    payload: {
                        isShowa: false
                    }
                });
                setModalVisible((o) => !o);
            }).catch((errorInfo) => {
                console.log(errorInfo, 'errorInfo');
            });
        } else {
            setModalVisible((o) => !o);
            formModal.setFieldsValue({
                templateName: '',
                productIds: [],
                isAllProducts: false
            });
            dispatch({
                type: 'createReportForm/updateState',
                payload: {
                    isShowa: true
                }
            });
        }
    };

    const _handleOk = () => {
        formModal.validateFields().then(() => {
            let textList = [];
            let modulesArr = [];
            let name = '';
            let formModalFields = formModal.getFieldsValue();
            const { logoUrl, ...params } = baseInfo;
            if (forwardRef.current) {
                let textBraftEditor = forwardRef.current.getFieldsValue();
                const { titleAndContent = [] } = textBraftEditor;
                if (!isEmpty(titleAndContent)) {
                    titleAndContent.forEach((item) => {
                        textList.push({
                            headlineInfo: item.title.toHTML(),
                            content: item.content.toHTML()
                        });
                    });
                }
            }

            if (assetAllocation) modulesArr.push({ moduleCode: 1 });
            if (isNetValueInfo) modulesArr.push({ moduleCode: 2 });
            if (isProductInfo) modulesArr.push({ moduleCode: 3 });
            if (isNetValueTrends) modulesArr.push({ moduleCode: 4 });
            if (isHistoricalIncomes) modulesArr.push({ moduleCode: 5 });
            if (isStatisticalTable) modulesArr.push({ moduleCode: 6 });
            if (isText) modulesArr.push({ moduleCode: 7, text: textList });
            if (isImportantNote) modulesArr.push({ moduleCode: 8, importantNoteInfo: tipsInfo.toHTML() });

            name = `${formModalFields.templateName}_${customFormData.productName}
                    ${moment(customFormData.startDate).format(dateFormat)}-${moment(customFormData.endDate).format(dateFormat)}`;

            if (templateId === 0) {
                dispatch({
                    type: 'createReportForm/createTemplate',
                    payload: {
                        ...formModalFields,
                        ...params,
                        attachmentsId: attachmentsId === 0 ? undefined : attachmentsId,
                        reportModules: modulesArr,
                        periods: periods
                    },
                    callback: ((res) => {
                        if (res.code === 1008 && res.data) {
                            form.setFieldsValue({
                                reportTemplateId: res.data
                            });
                            openNotification('success', '提示', '导出成功', 'topRight');
                            dispatch({
                                type: 'createReportForm/queryByProductId',
                                payload: {
                                    productId: productId
                                },
                                callback: ((res) => {
                                    if (res.code === 1008 && res.data) {
                                        dispatch({
                                            type: 'createReportForm/updateState',
                                            payload: {
                                                templateList: res.data
                                            }
                                        });
                                    }
                                })
                            });
                            toPdf(name);
                            _toggle();
                        } else {
                            const warningText = res.message || res.data || '导出失败！';
                            openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                        }
                    })
                });
            } else {
                dispatch({
                    type: 'createReportForm/updateTemplate',
                    payload: {
                        ...formModalFields,
                        ...params,
                        attachmentsId: attachmentsId === 0 ? undefined : attachmentsId,
                        reportModules: modulesArr,
                        periods: periods,
                        reportTemplateId: templateId,
                        assetAllocation: assetAllocation ? undefined : false,
                        isNetValueInfo: isNetValueInfo ? undefined : false,
                        isProductInfo: isProductInfo ? undefined : false,
                        isNetValueTrends: isNetValueTrends ? undefined : false,
                        isHistoricalIncomes: isHistoricalIncomes ? undefined : false,
                        isStatisticalTable: isStatisticalTable ? undefined : false,
                        isText: isText ? undefined : false,
                        isImportantNote: isImportantNote ? undefined : false
                    },
                    callback: ((res) => {
                        if (res.code === 1008) {
                            openNotification('success', '提示', '导出成功', 'topRight');
                            dispatch({
                                type: 'createReportForm/queryByProductId',
                                payload: {
                                    productId: productId
                                },
                                callback: ((res) => {
                                    if (res.code === 1008 && res.data) {
                                        dispatch({
                                            type: 'createReportForm/updateState',
                                            payload: {
                                                templateList: res.data
                                            }
                                        });
                                    }
                                })
                            });
                            toPdf(name);
                            _toggle();
                        } else {
                            const warningText = res.message || res.data || '导出失败！';
                            openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                        }
                    })
                });
            }

        }).catch((errorInfo) => {
            console.log(errorInfo, 'errorInfo');
        });

    };

    // 日期change事件
    const _dataChange = (time) => {
        dispatch({
            type: 'createReportForm/updateState',
            payload: {
                time
            }
        });
    };

    // 打开、关闭日期选择
    const onDateOpenChange = (d) => {
        const { createReportForm: { productId, time, templateId } } = props;
        let tempObj = {};
        tempObj.productId = productId;
        tempObj.reportTemplateId = templateId === 0 ? undefined : templateId;
        tempObj.startDate = (time && new Date(`${moment(time[0]).format().split('T')[0]}T00:00:00`,).getTime()) || undefined;
        tempObj.endDate = (time && new Date(`${moment(time[1]).format().split('T')[0]}T23:59:59`,).getTime()) || undefined;

        if (!d && !isEmpty(customFormData)) {
            if (templateId === 0) {
                dispatch({
                    type: 'createReportForm/getReportData',
                    payload: {
                        ...tempObj
                    },
                    callback: ((res) => {
                        if (res.code === 1008 && res.data) {
                            dispatch({
                                type: 'createReportForm/updateState',
                                payload: {
                                    customFormData: res.data,
                                    periods: res.data.performanceRangeShows
                                }
                            });
                        }
                    })
                });
            } else {
                dispatch({
                    type: 'createReportForm/queryCustomReport',
                    payload: {
                        ...tempObj
                    }
                });
            }
        }
    };

    // 产品全称change事件
    const _handleChange = (id) => {
        dispatch({
            type: 'createReportForm/queryByProductId',
            payload: {
                productId: id
            },
            callback: ((res) => {
                if (res.code === 1008 && res.data) {
                    form.setFieldsValue({
                        reportTemplateId: ''
                    });
                    dispatch({
                        type: 'createReportForm/updateState',
                        payload: {
                            templateList: res.data,
                            productId: id,
                            assetAllocation: false,
                            isNetValueInfo: false,
                            isProductInfo: false,
                            isNetValueTrends: false,
                            isHistoricalIncomes: false,
                            isStatisticalTable: false,
                            isText: false,
                            isImportantNote: false,
                            customFormData: {}
                        }
                    });
                }
            })
        });
    };

    // 选择模板change事件
    const _templateChange = (id) => {
        const { createReportForm: { productId, time, templateList } } = props;

        if (!!id) {
            let tempObj = {};
            tempObj.productId = productId;
            tempObj.reportTemplateId = id;
            tempObj.startDate = (time && new Date(`${moment(time[0]).format().split('T')[0]}T00:00:00`,).getTime()) || undefined;
            tempObj.endDate = (time && new Date(`${moment(time[1]).format().split('T')[0]}T23:59:59`,).getTime()) || undefined;
            dispatch({
                type: 'createReportForm/queryCustomReport',
                payload: {
                    ...tempObj
                },
                callback: ((res) => {
                    if (res.code === 1008 && res.data) {
                        const { startDate, endDate } = res.data;
                        dispatch({
                            type: 'createReportForm/updateState',
                            payload: {
                                templateId: id
                            }
                        });
                        form.setFieldsValue({
                            tDate: (startDate && endDate) ? [moment(startDate), moment(endDate)] : [null, null]
                        });
                    } else {
                        dispatch({
                            type: 'createReportForm/clearData',
                            payload: {
                                time,
                                isShowa: true,
                                templateList,
                                productId
                            }
                        });
                        const warningText = res.message || res.data || '请求失败！';
                        openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                    }
                })
            });
        } else {
            dispatch({
                type: 'createReportForm/clearData',
                payload: {
                    time,
                    isShowa: true,
                    templateList,
                    productId
                }
            });
        }

    };

    // 删除模板
    const _delete = () => {
        confirm({
            title: '请您确认是否删除该模板?',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'createReportForm/deleteTemplate',
                    payload: {
                        reportTemplateId: templateId
                    },
                    callback: ((res) => {
                        if (res.code === 1008) {
                            dispatch({
                                type: 'createReportForm/clearData',
                                payload: {
                                    productId,
                                    isShowa: true
                                }
                            });
                            form.setFieldsValue({
                                reportTemplateId: ''
                            });
                            dispatch({
                                type: 'createReportForm/queryByProductId',
                                payload: {
                                    productId: productId
                                },
                                callback: ((res) => {
                                    if (res.code === 1008 && res.data) {
                                        dispatch({
                                            type: 'createReportForm/updateState',
                                            payload: {
                                                templateList: res.data
                                            }
                                        });
                                    }
                                })
                            });
                            openNotification('success', '删除', '删除成功', 'topRight');
                        } else {
                            const warningText = res.message || res.data || '请求失败！';
                            openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                        }
                    })
                });
            },
            onCancel() {
                console.log('Cancel');
            }
        });
    };

    // checkbox change事件
    const _checkChange = (e) => {
        let tempIdArr = [];
        if (!e.target.checked) {
            tempIdArr.unshift(productId);
            formModal.setFieldsValue({
                productIds: tempIdArr
            });
        } else {
            formModal.setFieldsValue({
                productIds: []
            });
        }
        dispatch({
            type: 'createReportForm/updateState',
            payload: {
                isSelectAll: e.target.checked
            }
        });
    };

    const { authEdit, authExport } = getPermission(90200);

    useEffect(() => {
        // 初始化获取产品列表
        dispatch({
            type: 'createReportForm/getProductList',
            payload: {
                pageNum: 0
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    setProductList(res.data.list);
                }
            }
        });
    }, []);

    return (
        <Card className={styles.filterBox}>
            {
                (queryLoading || queryLoading1) &&
                <Spin size="large" style={{ position: 'fixed', top: '50%', left: '50%', zIndex: 999 }} />
            }
            <Form
                name="filter"
                onFinish={_onFinish}
                form={form}
                {...formItemLayout}
                autoComplete="off"
            >
                <Row justify="space-between">
                    <Col span={8}>
                        <FormItem
                            label="产品全称"
                            name="productId"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择产品'
                                }
                            ]}
                        >
                            <Select placeholder="请选择"
                                allowClear
                                showArrow
                                showSearch
                                defaultActiveFirstOption={false}
                                filterOption={
                                    (inputValue, option) => {
                                        return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
                                    }}
                                notFoundContent={null}
                                onChange={_handleChange}
                            >
                                {
                                    !isEmpty(productList) &&
                                    productList.map((item) => <Option key={item.productId} value={item.productId}>{item.productName}</Option>)
                                }
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem
                            label="日期"
                            name="tDate"
                        // rules={[
                        //     {
                        //         required: true,
                        //         message: '请选择日期'
                        //     }
                        // ]}
                        >
                            <RangePicker
                                style={{ width: '100%' }}
                                format={dateFormat}
                                onChange={_dataChange}
                                onOpenChange={onDateOpenChange}
                            />
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem
                            label="选择模板"
                            name="reportTemplateId"
                        >
                            <Select placeholder="请选择" onChange={_templateChange} allowClear>
                                {
                                    !isEmpty(templateList) &&
                                    templateList.map((item) => {
                                        return <Option key={getRandomKey(3)} value={item.reportTemplateId}>{item.templateName}</Option>;
                                    })
                                }
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row justify="end">
                    <Col>
                        <FormItem>
                            <Space>
                                <div
                                    style={{
                                        display: authEdit ? 'unset' : 'none'
                                    }}
                                >
                                    {
                                        isEmpty(customFormData) ?
                                            <Button type="primary" htmlType="submit">
                                                生成报表
                                            </Button>
                                            :
                                            null
                                    }
                                    {
                                        templateId !== 0 ?
                                            <Button danger onClick={_delete}>
                                                删除模板
                                            </Button>
                                            : null

                                    }
                                </div>
                                <div
                                    style={{
                                        display: authExport ? 'unset' : 'none'
                                    }}
                                >
                                    {
                                        !isEmpty(customFormData) ?
                                            <Button type="primary" onClick={_toggle}>
                                                导出报表
                                            </Button>
                                            : null
                                    }
                                </div>
                            </Space>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <Modal
                className={styles.modalContainer}
                width={400}
                title="导出报表"
                centered
                maskClosable={false}
                visible={modalVisible}
                onCancel={_toggle}
                footer={
                    [
                        <Button key="next" type="primary" className="modalButton" onClick={_handleOk} loading={loading || exportLoading}>
                            确定
                        </Button>,
                        <Button key="cancel" className="modalButton" onClick={_toggle}>
                            取消
                        </Button>
                    ]
                }
                autoComplete="off"
            >
                <Form
                    name="filter"
                    form={formModal}
                    autoComplete="off"
                    className={styles.exportFormModal}
                >
                    <FormItem
                        label="模板名称"
                        name="templateName"
                        rules={[
                            {
                                required: true,
                                message: '请输入模板名称'
                            }
                        ]}
                    >
                        <Input placeholder="请输入模板名称" disabled={isDisabled} />
                    </FormItem>
                    <FormItem
                        label="选择产品"
                        name="productIds"
                        rules={[
                            {
                                required: true,
                                message: '请选择产品'
                            }
                        ]}
                    >
                        <Select placeholder="请选择"
                            // showArrow
                            allowClear
                            showSearch
                            defaultActiveFirstOption={false}
                            filterOption={
                                (inputValue, option) => {
                                    return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
                                }}
                            notFoundContent={null}
                            mode="multiple"
                            disabled
                        // disabled={isSelectAll}
                        >
                            {
                                !isEmpty(productList) &&
                                productList.map((item) => <Option key={item.productId} value={item.productId}>{item.productName}</Option>)
                            }
                        </Select>
                    </FormItem>
                    {/* <FormItem
                        label="全部产品"
                        name="isAllProducts"
                        // {...checkBoxLayout}
                        valuePropName="checked"
                    >
                        <Checkbox onChange={_checkChange} />
                    </FormItem> */}
                </Form>
                <p>
                    备注：1、如果填写模板名称，那么该报表将会保存为一个模板，下次使用可以直接选择该模板进行报表生成；模板会保存报表内的各个模块以及收益率选择展示的字段，产品和日期需要重新选择。
                </p>
                <p>
                    2、不可删除在生成报表时选择的产品。
                </p>
            </Modal>
        </Card>
    );
};

export default connect(({ createReportForm, loading }) => ({
    createReportForm,
    loading: loading.effects['createReportForm/createTemplate'],
    exportLoading: loading.effects['createReportForm/updateTemplate'],
    queryLoading: loading.effects['createReportForm/queryCustomReport'],
    queryLoading1: loading.effects['createReportForm/getReportData']
}))(Filter);
