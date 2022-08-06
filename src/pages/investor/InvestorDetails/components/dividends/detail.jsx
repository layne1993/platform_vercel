import React, { PureComponent } from 'react';
import { Modal, Row, Col, Button, notification, message, Select, Input, DatePicker, Form, Space } from 'antd';
import { getCookie } from '@/utils/utils';
import request from '@/utils/rest';
import {XWDividendType} from '@/utils/publicData';
import moment from 'moment';

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const formItemLayout = {
    labelCol: {
        xs: {
            span: 12
        },
        sm: {
            span: 8
        }
    },
    wrapperCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 16
        },
        md: {
            span: 16
        }
    }
};

class DividendsDetail extends PureComponent {



    static defaultProps ={
        title: '新建',
        params: {}
    }

    constructor(props){
        super(props);
        this.state={
            dividendType: 1
        };
    }



    componentDidMount() {

    }

    formRef = React.createRef();

    /**
     * @description 设置表单值
     * @param {*} data
     */
    setFieldsValue = (data ={}) => {
        this.formRef.current.setFieldsValue({...data});
    }


    /**
     * @description 分红类型
     * @param {*} val
     */
    setDividendType = (val) => {
        this.setState({dividendType: val});
    }


    /**
     * 关闭模态框
     */
    closeModal = () => {
        if (this.props.closeModal) {
            this.props.closeModal();
        }
    };


    /**
     * @description 确定事件
     * @param {*} values
     */
    onFinish = async (values) => {

        let res = await request.postJSON('', {...values});
        if (res.code === 1008) {
            openNotification('success', '提醒', '操作成功！');
            this.closeModal();
        } else {
            openNotification('warning', '提醒', '操作失败！');
        }
    }


    render() {
        const { dividendType } = this.state;
        const { modalFlag = false, title, fromType  } = this.props;

        return (
            <Modal
                width={1000}
                title={fromType === 1 ? '新建' : '详情'}
                visible={modalFlag}
                onCancel={this.closeModal}
                footer={null}
            >
                <Form
                    ref={this.formRef}
                    initialValues={{dividendType: 1}}
                    onFinish={this.onFinish}
                >
                    <Row gutter={[15, 0]}>
                        <Col span={8}>
                            <Form.Item label="分红类型" name="dividendType" {...formItemLayout}>
                                <Select onChange={this.setDividendType}  allowClear>
                                    {
                                        XWDividendType.map((item) => {
                                            return <Select.Option key={item.value} value={item.value}> {item.label}</Select.Option>;
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        {
                            dividendType === 1 ?
                                <>
                                    <Col span={8}>
                                        <Form.Item label="客户名称" name="customerName" {...formItemLayout}>
                                            <Input/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="产品名称" name="productName" {...formItemLayout}>
                                            <Input/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="交易名称"  {...formItemLayout}>
                                            <Input/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="分红登记日" {...formItemLayout}>
                                            <DatePicker/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="分红登记日" {...formItemLayout}>
                                            <DatePicker/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="红利总金额" {...formItemLayout}>
                                            <Input/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="实发现金" {...formItemLayout}>
                                            <Input/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="业绩报酬" {...formItemLayout}>
                                            <Input/>
                                        </Form.Item>
                                    </Col>
                                </>
                                :
                                <>
                                    <Col span={8}>
                                        <Form.Item label="客户名称" {...formItemLayout}>
                                            <Input/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="产品名称" {...formItemLayout}>
                                            <Input/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="交易名称" {...formItemLayout}>
                                            <Input/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="分红登记日" {...formItemLayout}>
                                            <DatePicker/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="分红登记日" {...formItemLayout}>
                                            <DatePicker/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="分红总金额" {...formItemLayout}>
                                            <Input/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="再投资金额" {...formItemLayout}>
                                            <Input/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="再投资份额" {...formItemLayout}>
                                            <Input/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="再投资费用" {...formItemLayout}>
                                            <Input/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="再投资净值" {...formItemLayout}>
                                            <Input/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="业绩报酬" {...formItemLayout}>
                                            <Input/>
                                        </Form.Item>
                                    </Col>
                                </>
                        }

                    </Row>
                    <Row gutter={[0, 20]} style={{marginTop: 30}} justify="center">
                        <Space>
                            <Button onClick={this.closeModal}> 取消</Button>
                            <Button type="primary" htmlType="submit"> 确定</Button>
                        </Space>
                    </Row>
                </Form>
            </Modal>
        );
    }
}

export default DividendsDetail;
