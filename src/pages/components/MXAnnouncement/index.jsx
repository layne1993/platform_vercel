import React, { useState, useEffect } from 'react';
import { Card, Input, InputNumber, Form, Select, DatePicker, notification, Button, Modal, Row, Col, Space } from 'antd';
import { connect, FormattedMessage, history } from 'umi';
import { getRandomKey, getCookie, getParams } from '@/utils/utils';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { IS_SEAL, ANNOUNCEMENT_TYPE, FILE_TYPE, FILE_PERMISSION } from '@/utils/publicData';
import moment from 'moment';

const DATE_FORMAT = 'YYYY-MM-DD';

const FormItem = Form.Item;
const { Option } = Select;

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 30,
        message,
        description,
        placement,
        duration: duration || 3
    });
};
const formItemLayout = {
    labelCol: {
        xs: {
            span: 6
        },
        sm: {
            span: 6
        }
    },
    wrapperCol: {
        xs: {
            span: 16
        },
        sm: {
            span: 16
        },
        md: {
            span: 16
        }
    }
};





const Announcement = (props) => {
    const { loading, dispatch, modalFlag, params } = props;
    const [form] = Form.useForm();
    const [productList, setProductList] = useState([]);
    const [noticeTemplateType, setTemplateType] = useState(1);
    const [productName, setProductName] = useState();


    /**
     * 初始化表单
     */
    const initFormData = () => {
        form.setFieldsValue({
            openTime: [undefined]
        });

    };

    /**
     * @description 获取产品list
     */
    const queryByProductName = () => {
        const { dispatch } = props;
        dispatch({
            type: 'PRODUCT_ANNOUNCEMENT/queryByProductName',
            callback: (res) => {
                const { code, data } = res;
                if (code === 1008) {
                    setProductList(data || []);
                    data.map((item) => {
                        if (params.productId == item.productId) {
                            setProductName(item.productName);
                            form.setFieldsValue({
                                establishedTime: item.setDate && moment(item.setDate),
                                fundFilingCode: item.fundRecordNumber
                            });
                        }
                    });
                }
            }
        });
    };


    useEffect(() => {
        initFormData();
    }, []);
    useEffect(queryByProductName, []);

    /**
      * @description 关闭模态框
      */
    const closeModal = () => {
        props.closeModal();
    };

    /**
     * @description 提交
     * @param {*} values
     */
    const onFinish = (values) => {
        // console.log(values, 'values');
        let dateStr = [];
        values.openTime && values.openTime.map((item) => dateStr.push(moment(item).format('YYYY年MM月DD日')));
        dispatch({
            type: 'PRODUCT_ANNOUNCEMENT/saveAndPublish',
            payload: {
                ...values,
                productName,
                fileAuthority: values.fileAuthority && JSON.stringify(values.fileAuthority),
                openDayHours: values.openDayHours ? moment(values.openDayHours).format(DATE_FORMAT) : dateStr.join('、'),
                establishedTime: values.establishedTime && moment(values.establishedTime).format(DATE_FORMAT),
                publishTime: values.publishTime && moment(values.publishTime).format(DATE_FORMAT),
                openTime: undefined
            },
            callback: (res) => {
                if (res && res.code === 1008 && res.data) {
                    closeModal();
                    props.updatelist();
                    openNotification('success', '保存成功', res.message, 'topRight');
                } else {
                    const warningText = res.message || res.data || '保存信息失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };


    const addItem = (type, i) => {
        const list = form.getFieldValue(type);
        list.splice(i, 0, undefined);
        form.setFieldsValue({ type: type });
    };


    const setProduct = (value, option = {}) => {
        const { data = {} } = option;
        setProductName(data.productName);
        form.setFieldsValue({
            establishedTime: data.setDate && moment(data.setDate),
            fundFilingCode: data.fundRecordNumber
        });
    };

    // console.log('hh');


    return (
        <Modal
            title="公告模板设置"
            visible={modalFlag}
            width={800}
            footer={null}
            onCancel={closeModal}
        >
            <Card bordered={false}>
                <Form
                    scrollToFirstError
                    name="detail"
                    form={form}
                    onFinish={onFinish}
                    initialValues={{
                        isAdministratorSeal: 1,
                        documentType: 3,
                        fileAuthority: [3],
                        productId: params.productId * 1 || null,
                        publishTime: moment()
                    }}
                >
                    <FormItem
                        {...formItemLayout}
                        label="产品名称"
                        name="productId"
                        rules={[
                            {
                                required: true,
                                message: '请选择产品'
                            }
                        ]}
                    >
                        <Select
                            placeholder="请输入产品名称搜索..."
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            disabled={props.disabled === '1' ? false : true}// disabled==='1' 代表是从产品公告文件传入
                            onChange={setProduct}
                            allowClear
                        >
                            {productList.map((item) => (
                                <Option key={getRandomKey(4)} value={item.productId} data={item}>
                                    {item.productName}
                                </Option>
                            ))}
                        </Select>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="模板类型"
                        name="noticeTemplateType"
                        rules={[
                            {
                                required: true,
                                message: '请选择模板类型'
                            }
                        ]}
                    >
                        <Select
                            placeholder="请选择模板类型"
                            onChange={setTemplateType}
                            allowClear
                        >
                            {ANNOUNCEMENT_TYPE.map((itemO) => (
                                <Option key={getRandomKey(4)} value={itemO.value}>
                                    {itemO.label}
                                </Option>
                            ))}
                        </Select>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="是否需要管理人盖章"
                        name="isAdministratorSeal"
                        rules={[
                            {
                                required: true,
                                message: '请选择印章类型'
                            }
                        ]}
                        extra="默认需要盖章"
                    >
                        <Select
                            placeholder="请选择印章类型"
                            allowClear
                        >
                            {IS_SEAL.map((itemO) => (
                                <Option key={getRandomKey(4)} value={itemO.value}>
                                    {itemO.label}
                                </Option>
                            ))}
                        </Select>
                    </FormItem>
                    {
                        noticeTemplateType === 1 && <>
                            <Form.List name="openTime">
                                {(fields, { add, remove }) => (
                                    fields.map((field, i) => (
                                        <div key={i} style={{ position: 'relative' }}>
                                            <Form.Item
                                                {...formItemLayout}
                                                label={`开放日时间${i + 1}`}
                                                extra={'支持选择多个时间'}
                                                {...field}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: '请选择时间'
                                                    }
                                                ]}
                                            >
                                                <DatePicker />
                                            </Form.Item>
                                            <Space style={{ marginLeft: 15, position: 'absolute', right: '200px', top: '0px' }}>
                                                <span
                                                    title="开放日时间"
                                                    onClick={() => {
                                                        addItem('openTime', i + 1);
                                                    }}
                                                >
                                                    <PlusOutlined />
                                                </span>
                                                {fields.length > 1 ? (
                                                    <span onClick={() => remove(field.name)}>
                                                        <CloseOutlined />
                                                    </span>
                                                ) : null}
                                            </Space>

                                        </div>
                                    ))
                                )}
                            </Form.List>
                            <FormItem
                                {...formItemLayout}
                                label="产品成立时间"
                                name="establishedTime"
                                rules={[
                                    {
                                        required: false,
                                        message: '请选择产品成立时间'
                                    }
                                ]}
                                extra="若无成立时间，可在产品要素进行补充，后续会自动填充成立日期"
                            >
                                <DatePicker />
                            </FormItem>
                        </>
                    }
                    {
                        noticeTemplateType === 2 && <>
                            <FormItem
                                {...formItemLayout}
                                label="开放日时间"
                                name="openDayHours"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择开放日时间'
                                    }
                                ]}
                            >
                                <DatePicker />
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label="上一工作日产品总份额(%)"
                                name="alwaysShare"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入上一工作日产品总份额数字'
                                    }
                                ]}
                            >
                                <InputNumber precision={2} step={0.01} style={{ width: 300 }} placeholder="请输入上一工作日产品总份额数字" />
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="份额处理方式"
                                name="shareHandlingMethod"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入对赎回份额的处理方式'
                                    }
                                ]}
                            >
                                <Input placeholder="请输入对赎回份额的处理方式" />
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="产品备案编码"
                                name="fundFilingCode"
                                rules={[
                                    {
                                        required: false,
                                        message: '请输入产品备案编码'
                                    }
                                ]}
                                extra="若无备案编码，可在产品要素进行补充，后续会自动填充"
                            >
                                <Input placeholder="请输入产品备案编码" />
                            </FormItem>
                        </>
                    }

                    {
                        noticeTemplateType === 3 &&
                        <FormItem
                            {...formItemLayout}
                            label="产品成立时间"
                            name="establishedTime"
                            rules={[
                                {
                                    required: false,
                                    message: '请选择产品成立时间'
                                }
                            ]}
                            extra="若无成立时间，可在产品要素进行补充，后续会自动填充成立日期"
                        >
                            <DatePicker />
                        </FormItem>
                    }

                    <h3>披露设置</h3>
                    <FormItem
                        {...formItemLayout}
                        label="文件类型"
                        name="documentType"
                        rules={[
                            {
                                required: true,
                                message: '请选择文件类型'
                            }
                        ]}
                        extra="文件类型有募集文件、签约文件、披露文件"
                    >
                        <Select
                            placeholder="请选择文件类型"
                            allowClear
                        >
                            {FILE_TYPE.map((itemO) => (
                                <Option key={getRandomKey(4)} value={itemO.value} disabled={itemO.value !== 3}>
                                    {itemO.label}
                                </Option>
                            ))}
                        </Select>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="文件权限"
                        name="fileAuthority"
                        rules={[
                            {
                                required: true,
                                message: '请选择文件权限'
                            }
                        ]}
                        extra="文件权限有：持有人可见，合规投资者可见，风险测评客户可见"
                    >
                        <Select
                            placeholder="请选择文件权限"
                            mode="multiple"
                            allowClear
                        >
                            {FILE_PERMISSION.map((itemO) => (
                                <Option key={getRandomKey(4)} value={itemO.value}>
                                    {itemO.label}
                                </Option>
                            ))}
                        </Select>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="发布时间"
                        name="publishTime"
                        rules={[
                            {
                                required: true,
                                message: '请选择发布时间'
                            }
                        ]}
                        extra="公告时间和发布时间为同一时间"
                    >
                        <DatePicker />
                    </FormItem>
                    <Row justify="center">
                        <Space>
                            <Button
                                onClick={closeModal}
                            >
                                取消
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                            >
                                保存并发布
                            </Button>
                        </Space>
                    </Row>
                </Form>
            </Card>
        </Modal>
    );
};

export default connect(({ PRODUCT_ANNOUNCEMENT, loading }) => ({
    PRODUCT_ANNOUNCEMENT,
    data: PRODUCT_ANNOUNCEMENT.flowData,
    loading: loading.effects['PRODUCT_ANNOUNCEMENT/saveAndPublish']
}))(Announcement);


Announcement.defaultProps = {
    data: {},
    modalFlag: false,
    params: {},
    closeModal: () => { }
};
