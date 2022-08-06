/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-03-17 19:35:31
 * @LastEditTime: 2021-05-20 16:41:45
 */
import React from 'react';
import type { FC } from 'react';
import { Row, Col, Form, Input, Select, DatePicker, Button, Space } from 'antd';
import { LIFE_STATUS } from '@/utils/publicData';
import {CustomSelect} from '@/pages/components/Customize';
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
            type: 'NODE_MANAGEMENT/getListData',
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
            type: 'NODE_MANAGEMENT/getListData',
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
                <Col span={6}>
                    <FormItem label="产品名称" name="productName">
                        <CustomSelect submitValue="productName" displayName="productName"/>
                        {/* <Input placeholder="请输入" allowClear /> */}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem label="流程标题" name="productName">
                        <Input placeholder="请输入" allowClear />
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem label="节点名称" name="productName">
                        <Input placeholder="请输入" allowClear />
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem label="状态" name="status">
                        <Select placeholder="请选择" allowClear>
                            {LIFE_STATUS.map((item) => {
                                return (
                                    <Select.Option key={item.value} value={item.value}>
                                        {item.label}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem label="创建时间" name="createTime">
                        <DatePicker style={{ width: '100%' }} format={'YYYY-MM-DD'} allowClear />
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem label="处理人" name="status">
                        <Select placeholder="请选择" allowClear>
                            {LIFE_STATUS.map((item) => {
                                return (
                                    <Select.Option key={item.value} value={item.value}>
                                        {item.label}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </FormItem>
                </Col>

                <Col span={6} offset={6} style={{ textAlign: 'end' }}>
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
