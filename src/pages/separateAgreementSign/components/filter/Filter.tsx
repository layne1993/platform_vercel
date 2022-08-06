/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-03-17 19:35:31
 * @LastEditTime: 2021-06-16 18:46:01
 */
import React from 'react';
import type { FC } from 'react';
import { Row, Col, Form, Input, Select, DatePicker, Button, Space } from 'antd';
import { XWTemplateType, SIGNINGPROCESS } from '@/utils/publicData';
import { MultipleSelect } from '@/pages/components/Customize';
import { connect } from 'umi';

const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        xs: { span: 8 },
        sm: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 }
    }
};

interface FilterProps {
    loading: Boolean,
    dispatch: any,
    forwardRef: any
}



const Filter: FC<FilterProps> = (props) => {
    const { forwardRef, dispatch } = props;
    const [form] = Form.useForm();

    /**
     * @description 查询
     */
    const _onFinish = (values) => {
        dispatch({
            type: 'SEPARATEAGREEMENT/getListData',
            payload: {
                ...values,
                pageNum: 1,
                pageSize: 20
            }
        });
    };

    /**
     * @description 重置
     */
    const reset = () => {
        form.resetFields();
        dispatch({
            type: 'SEPARATEAGREEMENT/getListData',
            payload: {
                pageNum: 1,
                pageSize: 20
            }
        });
    };

    return (
        <Form
            ref={forwardRef}
            form={form}
            {...formItemLayout}
            onFinish={_onFinish}
        >
            <Row gutter={[8, 0]}>
                <Col span={20}>
                    <Row>
                        <Col span={8}>
                            <FormItem label="客户名称" name="customerName">
                                <Input placeholder="请输入全称或简称" allowClear />
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <MultipleSelect
                                params="productIds"
                                value="productId"
                                label="productName"
                                mode="multiple"
                                formLabel="产品名称"
                            />
                        </Col>
                        <Col span={8}>
                            <FormItem label="签署进度" name="signedProgress">
                                <Select placeholder="请选择" allowClear>
                                    {SIGNINGPROCESS.map((item) => {
                                        return (
                                            <Select.Option key={item.value} value={item.value}>
                                                {item.label}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="协议类型" name="documentType">
                                <Select placeholder="请选择" allowClear>
                                    {XWTemplateType.map((item) => {
                                        return (
                                            <Select.Option key={item.value} value={item.value}>
                                                {item.label}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="协议名称" name="documentName">
                                <Input placeholder="请输入" allowClear />
                            </FormItem>
                        </Col>

                        <Col span={8}>
                            <FormItem label="证件号码" name="cardNumber">
                                <Input placeholder="请输入" autoComplete="off" allowClear />
                            </FormItem>
                        </Col>
                    </Row>
                </Col>


                <Col span={4} style={{ textAlign: 'end' }}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            查询
                        </Button>
                        <Button htmlType="reset" onClick={reset}>重置</Button>
                    </Space>
                </Col>

            </Row>
        </Form>
    );
};


export default connect(({ loading }) => ({
    loading: loading.effects['NODE_MANAGEMENT/getListData']
}))(Filter);
