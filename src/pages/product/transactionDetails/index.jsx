/*
 * @description: 新增交易信息
 * @Author: tangsc
 * @Date: 2020-11-09 14:11:55
 */
import React, { PureComponent } from 'react';
import {
    Row,
    Col,
    Form,
    Card,
    Input,
    Select,
    Button,
    Space,
    Checkbox,
    DatePicker
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {CustomSelect,MultipleSelect} from '@/pages/components/Customize';
import styles from './index.less';

// 定义表单Item
const FormItem = Form.Item;

// 获取Select组件option选项
const { Option } = Select;

// 设置日期格式
const dateFormat = 'YYYY/MM/DD';

// 表格布局
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 24
        }
    },
    wrapperCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 24
        }
    }
};

// checkBox布局
const checkBoxLayout = {
    labelCol: {
        xs: {
            span: 24
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
        }
    }
};

const checkBoxLayoutSec = {
    labelCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 14
        }
    },
    wrapperCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 10
        }
    }
};

class NetValueDetails extends PureComponent {
    state = {
    };

    // 获取表单实例对象
    formRef = React.createRef();

    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = (values) => {
        // console.log('Success:', values);
    };

    render() {
        return (
            <PageHeaderWrapper title="新增交易信息">
                <Space
                    direction="vertical"
                    style={{ width: '100%' }}
                    size="large"
                    className={styles.container}
                >
                    <Form
                        name="basic"
                        onFinish={this._onFinish}
                        ref={this.formRef}
                        {...formItemLayout}
                    >

                        <Card>
                            <Row>
                                <Col span={7}>
                                    <FormItem label="客户名称" name="customerName" >
                                        <Input placeholder="请输入" autoComplete="off" />
                                    </FormItem>
                                </Col>
                                <Col span={7}>
                                    <FormItem label="产品名称" name="productName">
                                        <CustomSelect submitValue="productName" displayName="productName"/>
                                        {/* <Input placeholder="请输入" autoComplete="off" /> */}
                                    </FormItem>
                                </Col>
                                <Col span={7}>
                                    <FormItem label="交易账号" name="tradingAccount">
                                        <Input placeholder="请输入" autoComplete="off" />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={7}>
                                    <FormItem label="渠道编号" name="investorsType">
                                        <Input placeholder="请输入" autoComplete="off" />
                                    </FormItem>
                                </Col>
                                <Col span={7}>
                                    <FormItem label="单位净值" name="unitNetWorth" >
                                        <Input placeholder="请输入" autoComplete="off" />
                                    </FormItem>
                                </Col>
                                <Col span={7}>
                                    <FormItem label="业绩报酬" name="remuneration" >
                                        <Input placeholder="请输入" autoComplete="off" />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={7}>
                                    <FormItem label="申请日期" name="applicationDate" >
                                        <DatePicker style={{ width: '100%' }} format={dateFormat} />
                                    </FormItem>
                                </Col>
                                <Col span={7}>
                                    <FormItem label="申请金额" name="money" >
                                        <Input placeholder="请输入" autoComplete="off" />
                                    </FormItem>
                                </Col>
                                <Col span={7}>
                                    <FormItem label="申请份额" name="applicationdate" >
                                        <Input placeholder="请输入" autoComplete="off" />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={7}>
                                    <FormItem label="确认日期" name="applicationDate" >
                                        <DatePicker style={{ width: '100%' }} format={dateFormat} />
                                    </FormItem>
                                </Col>
                                <Col span={7}>
                                    <FormItem label="确认金额" name="confirmedshare" >
                                        <Input placeholder="请输入" autoComplete="off" />
                                    </FormItem>
                                </Col>
                                <Col span={7}>
                                    <FormItem label="确认份额" name="applicationdate" >
                                        <Input placeholder="请输入" autoComplete="off" />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={7}>
                                    <FormItem label="交易费用" name="confirmedshare" >
                                        <Input placeholder="请输入" autoComplete="off" />
                                    </FormItem>
                                </Col>
                                <Col span={7}>
                                    <FormItem label="手续费" name="applicationdate" >
                                        <Input placeholder="请输入" autoComplete="off" />
                                    </FormItem>
                                </Col>
                                <Col span={7}></Col>
                            </Row>
                        </Card>
                        <Space className={styles.btnGroup}>
                            <Button type="primary" htmlType="submit">确定</Button>
                            <Button>取消</Button>
                        </Space>
                    </Form>

                </Space>

            </PageHeaderWrapper >
        );
    }
}
export default NetValueDetails;
