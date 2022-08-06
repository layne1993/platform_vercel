import {Row, Form, Modal, Select, InputNumber, Button, Space, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { XWTradeType } from '@/utils/publicData';
import { listToMap } from '@/utils/utils';
import moment from 'moment';

const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        xs: {
            span: 8
        },
        sm: {
            span: 8
        },
        md: {
            span: 8
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

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};


const Add = (props) => {
    const { flag, loading, params } = props;
    const [productList, setProductList] = useState([]);
    const [fundRecordNumber, setFundRecordNumber] = useState([]);

    /**
     * @description 获取产品list
     */
    const queryByProductName = () => {
        const {dispatch} = props;
        dispatch({
            type: 'INVESTOR_BANKINFO/queryByProductName',
            callback: (res) => {
                if(res.code === 1008){
                    setProductList(res.data || []);
                }
            }
        });
    };

    useEffect(queryByProductName, []);

    /**
     * @description 获取产品编号
     */
    const setProduct = (value, option) => {
        const {data = {}} = option;
        setFundRecordNumber(data.fundRecordNumber);
    };

    // 关闭模态框
    const closeModal = () => {
        props.closeModal();
    };

    // 新建成功
    const onSuccess = () => {
        props.onSuccess();
    };

    // 保存
    const onFinish = (values) => {
        // if(!params.customerBankId) {
        //     openNotification('success', '提示', '', 'topRight');
        // }
        const {dispatch} = props;
        dispatch({
            type: 'INVESTOR_BANKINFO/saveCustomerBankProduct',
            payload: {
                ...values,
                fundRecordNumber,
                customerId: params.customerId,
                customerBankId: params.customerBankId
            },
            callback: (res) => {
                const {code, message} = res;
                if(code === 1008){
                    openNotification('success', '提示', '操作成功', 'topRight');
                    onSuccess();
                } else {
                    openNotification('warning', `提示(代码：${res.code})`, `${message || '保存失败！'}`, 'topRight');
                }
            }
        });
    };

    return (
        <Modal
            title="新建"
            visible={flag}
            onCancel={closeModal}
            footer={null}
            width={600}
        >
            <Form
                onFinish={onFinish}
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
                        allowClear
                        onChange={setProduct}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {productList.map((item) => (
                            <Select.Option key={item.productId} value={item.productId} data={item}>
                                {item.productName}
                            </Select.Option>
                        ))}
                    </Select>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="交易类型"
                    name="transactionType"
                    rules={[
                        {
                            required: false,
                            message: '请选择交易类型'
                        }
                    ]}
                >
                    <Select
                        placeholder="请选择交易类型"
                    >
                        {XWTradeType.map((item) => (
                            <Select.Option key={item.value} value={item.value} allowClear>
                                {item.label}
                            </Select.Option>
                        ))}
                    </Select>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="交易金额"
                    name="tradeMoney"
                    rules={[
                        {
                            required: false,
                            message: '请输入'
                        }
                    ]}
                >
                    <InputNumber style={{width: '150px'}} min={0} />
                </FormItem>
                <Row justify="center">
                    <Space>
                        <Button onClick={closeModal}> 取消 </Button>
                        <Button type="primary" htmlType="submit" loading={loading}> 保存 </Button>
                    </Space>
                </Row>

            </Form>
        </Modal>
    );
};

export default connect(({ SIGN_REDEMING, loading }) => ({
    SIGN_REDEMING,
    loading: loading.effects['INVESTOR_BANKINFO/saveCustomerBankProduct']
}))(Add);

Add.defaultProps = {
    params: {},
    flag: false,
    closeModal: () => {},
    onSuccess: () => {}
};
