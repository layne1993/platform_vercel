import React, { PureComponent } from 'react';
import {
    Modal,
    Row,
    Col,
    Button,
    notification,
    message,
    Select,
    Input,
    InputNumber,
    DatePicker,
    Form,
    Space
} from 'antd';
import { getCookie } from '@/utils/utils';
import { connect } from 'umi';
import request from '@/utils/rest';
import { XWDividendType } from '@/utils/publicData';
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
    static defaultProps = {
        title: '新建',
        params: {}
    };

    constructor(props) {
        super(props);
        this.state = {
            dividendType: 1,
            detailInfo: props.data,
            customerList: [],
            productList: []
        };
    }

    componentDidMount() {
        this.getCustomerList();
        this.getproductList();
        if (this.props.data.dividendRecordId) {
            this.setFieldsValue();
        }
    }

    formRef = React.createRef();

    /**
     * @description 设置表单值
     * @param {*} data
     */
    setFieldsValue = () => {
        const { data } = this.props;
        this.formRef.current.setFieldsValue({
            ...data,
            confirmDate: data.confirmDate && moment(data.confirmDate),
            registerDate: data.registerDate && moment(data.registerDate),
            secondDate: data.secondDate && moment(data.secondDate)
        });
        this.setState({ dividendType: data.dividendType });
    };

    /**
     * @description 获取客户list
     */
    getCustomerList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'DIVIDENDS_LIST/queryByCustomerList',
            callback: (res) => {
                if (res.code === 1008) {
                    this.setState({ customerList: res.data || [] });
                }
            }
        });
    };

    /**
     * @description 获取产品list
     */
    getproductList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'DIVIDENDS_LIST/queryByProductList',
            callback: (res) => {
                if (res.code === 1008) {
                    this.setState({ productList: res.data || [] });
                }
            }
        });
    };

    /**
     * @description 分红类型
     * @param {*} val
     */
    setDividendType = (val) => {
        this.setState({ dividendType: val });
    };

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
        const { dispatch, data, params } = this.props;
        let url = data.dividendRecordId
            ? 'DIVIDENDS_LIST/dividendsEdit'
            : 'DIVIDENDS_LIST/createDividends';
        dispatch({
            type: url,
            payload: {
                ...params,
                ...data,
                ...values,
                confirmDate: values.confirmDate && moment(values.confirmDate).valueOf(),
                registerDate: values.registerDate && moment(values.registerDate).valueOf(),
                secondDate: values.secondDate && moment(values.secondDate).valueOf(),
                sourceType: '1'
            },
            callback: (res) => {
                let msg = res.message;
                if (res.code === 1008) {
                    openNotification('success', '提醒', `${msg ? msg : '操作成功！'}`);
                    this.closeModal();
                } else {
                    openNotification('warning', '提醒', `${msg ? msg : '操作失败！'}`);
                }
            }
        });
    };

    render() {
        const { dividendType, customerList, productList } = this.state;
        const { modalFlag = false, title, fromType, params, addLoading, updateLoading } = this.props;
        // console.log(dividendType,  'formRef');

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
                    initialValues={{ dividendType: 1 }}
                    onFinish={this.onFinish}
                >
                    <Row gutter={[15, 0]}>
                        {dividendType === 1 ? (
                            <>
                                {!params.customerId && (
                                    <Col span={8}>
                                        <Form.Item
                                            label="客户名称"
                                            name="customerId"
                                            {...formItemLayout}
                                            rules={[{ required: true, message: '请选择客户' }]}
                                        >
                                            <Select
                                                style={{ width: 220 }}
                                                allowClear
                                                showSearch
                                                placeholder="请输入搜索"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.children && option.children
                                                        .toLowerCase()
                                                        .indexOf(input.toLowerCase()) >= 0
                                                }
                                                optionLabelProp="label"
                                            >
                                                {customerList.map((item) => {
                                                    return (
                                                        <Select.Option
                                                            label={item.customerName}
                                                            key={item.customerId}
                                                            value={item.customerId}
                                                        >
                                                            {item.customerBrief}
                                                        </Select.Option>
                                                    );
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                )}

                                {!params.productId && (
                                    <Col span={8}>
                                        <Form.Item
                                            label="产品名称"
                                            name="productId"
                                            {...formItemLayout}
                                            rules={[{ required: true, message: '请选择产品' }]}
                                        >
                                            <Select
                                                style={{ width: 220 }}
                                                allowClear
                                                showSearch
                                                placeholder="请输入搜索"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.children && option.children
                                                        .toLowerCase()
                                                        .indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {productList.map((item) => {
                                                    return (
                                                        <Select.Option
                                                            key={item.productId}
                                                            value={item.productId}
                                                        >
                                                            {item.productName}
                                                        </Select.Option>
                                                    );
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                )}

                                <Col span={8}>
                                    <Form.Item
                                        label="分红类型"
                                        name="dividendType"
                                        {...formItemLayout}
                                        rules={[{ required: true, message: '请选择分红' }]}
                                    >
                                        <Select
                                            style={{ width: 220 }}
                                            onChange={this.setDividendType}
                                        >
                                            {XWDividendType.map((item) => {
                                                return (
                                                    <Select.Option
                                                        key={item.value}
                                                        value={item.value}
                                                    >
                                                        {' '}
                                                        {item.label}
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item
                                        label="分红确认日"
                                        name="confirmDate"
                                        {...formItemLayout}
                                        rules={[{ required: true, message: '请选择' }]}
                                    >
                                        <DatePicker style={{ width: 220 }} />
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item
                                        label="实发现金"
                                        name="actualMoney"
                                        {...formItemLayout}
                                        rules={[{ required: true, message: '请输入' }]}
                                    >
                                        <InputNumber
                                            precision={2}
                                            step={0.01}
                                            style={{ width: 220 }}
                                            placeholder="请输入实发现金"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item
                                        label="红利总金额"
                                        name="tradeMoney"
                                        {...formItemLayout}
                                    >
                                        <InputNumber
                                            precision={2}
                                            step={0.01}
                                            style={{ width: 220 }}
                                            placeholder="请输入红利总金额"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="分红登记日"
                                        name="registerDate"
                                        {...formItemLayout}
                                    >
                                        <DatePicker style={{ width: 220 }} />
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item label="交易账号" name="fundAcco" {...formItemLayout}>
                                        <Input
                                            style={{ width: 220 }}
                                            placeholder="请输入交易账号"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="业绩报酬"
                                        name="pushMoney"
                                        {...formItemLayout}
                                    >
                                        <InputNumber
                                            precision={2}
                                            step={0.01}
                                            placeholder="请输入业绩报酬"
                                            style={{ width: 220 }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="数据来源" {...formItemLayout}>
                                        <Input style={{ width: 220 }} disabled value="系统录入" />
                                    </Form.Item>
                                </Col>
                            </>
                        ) : (
                            <>
                                {!params.customerId && (
                                    <Col span={8}>
                                        <Form.Item
                                            label="客户名称"
                                            name="customerId"
                                            {...formItemLayout}
                                            rules={[{ required: true, message: '请选择客户' }]}
                                        >
                                            <Select
                                                style={{ width: 220 }}
                                                allowClear
                                                showSearch
                                                placeholder="请输入搜索"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.children && option.children
                                                        .toLowerCase()
                                                        .indexOf(input.toLowerCase()) >= 0
                                                }
                                                optionLabelProp="label"
                                            >
                                                {customerList.map((item) => {
                                                    return (
                                                        <Select.Option
                                                            label={item.customerName}
                                                            key={item.customerId}
                                                            value={item.customerId}
                                                        >
                                                            {item.customerBrief}
                                                        </Select.Option>
                                                    );
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                )}

                                {!params.productId && (
                                    <Col span={8}>
                                        <Form.Item
                                            label="产品名称"
                                            name="productId"
                                            {...formItemLayout}
                                            rules={[{ required: true, message: '请选择产品' }]}
                                        >
                                            <Select
                                                allowClear
                                                style={{ width: 220 }}
                                                showSearch
                                                placeholder="请输入搜索"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.children && option.children
                                                        .toLowerCase()
                                                        .indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {productList.map((item) => {
                                                    return (
                                                        <Select.Option
                                                            key={item.productId}
                                                            value={item.productId}
                                                        >
                                                            {item.productName}
                                                        </Select.Option>
                                                    );
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                )}

                                <Col span={8}>
                                    <Form.Item
                                        label="分红类型"
                                        name="dividendType"
                                        {...formItemLayout}
                                        rules={[{ required: true, message: '请选择分红' }]}
                                    >
                                        <Select
                                            style={{ width: 220 }}
                                            onChange={this.setDividendType}
                                            allowClear
                                        >
                                            {XWDividendType.map((item) => {
                                                return (
                                                    <Select.Option
                                                        key={item.value}
                                                        value={item.value}
                                                    >
                                                        {' '}
                                                        {item.label}
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item
                                        label="分红确认日"
                                        name="confirmDate"
                                        {...formItemLayout}
                                        rules={[{ required: true, message: '请选择' }]}
                                    >
                                        <DatePicker style={{ width: 220 }} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="再投资金额"
                                        name="secondMoney"
                                        {...formItemLayout}
                                        rules={[{ required: false, message: '请输入' }]}
                                    >
                                        <InputNumber
                                            precision={2}
                                            step={0.01}
                                            style={{ width: 220 }}
                                            placeholder="请输入再投资金额"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="再投资份额"
                                        name="secondShare"
                                        {...formItemLayout}
                                        rules={[{ required: true, message: '请输入' }]}
                                    >
                                        <InputNumber
                                            precision={2}
                                            step={0.01}
                                            style={{ width: 220 }}
                                            placeholder="请输入再投资份额"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="再投资净值"
                                        name="secondNetValue"
                                        {...formItemLayout}
                                        rules={[{ required: false, message: '请输入' }]}
                                    >
                                        <InputNumber
                                            precision={4}
                                            step={0.0001}
                                            style={{ width: 220 }}
                                            placeholder="请输入再投资净值"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="再投资费用"
                                        name="secondFee"
                                        {...formItemLayout}
                                    >
                                        <InputNumber
                                            precision={2}
                                            step={0.01}
                                            style={{ width: 220 }}
                                            placeholder="请输入再投资费用"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="分红总份额"
                                        name="tradeShare"
                                        {...formItemLayout}
                                        rules={[{ required: false, message: '请输入' }]}
                                    >
                                        <InputNumber
                                            precision={2}
                                            step={0.01}
                                            style={{ width: 220 }}
                                            placeholder="请输入分红总份额"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="分红登记日"
                                        name="registerDate"
                                        {...formItemLayout}
                                    >
                                        <DatePicker style={{ width: 220 }} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="交易账号" name="fundAcco" {...formItemLayout}>
                                        <Input
                                            style={{ width: 220 }}
                                            placeholder="请输入交易账号"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="业绩报酬"
                                        name="pushMoney"
                                        {...formItemLayout}
                                    >
                                        <InputNumber
                                            precision={2}
                                            step={0.01}
                                            style={{ width: 220 }}
                                            placeholder="请输入业绩报酬"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="数据来源" {...formItemLayout}>
                                        <Input disabled value="系统录入" style={{ width: 220 }} />
                                    </Form.Item>
                                </Col>
                            </>
                        )}
                    </Row>
                    <Row gutter={[0, 20]} style={{ marginTop: 30 }} justify="center">
                        <Space>
                            <Button onClick={this.closeModal}> 取消</Button>
                            <Button loading={addLoading || updateLoading} type="primary" htmlType="submit">
                                确定
                            </Button>
                        </Space>
                    </Row>
                </Form>
            </Modal>
        );
    }
}

export default connect(({ DIVIDENDS_LIST, loading }) => ({
    DIVIDENDS_LIST,
    addLoading: loading.effects['DIVIDENDS_LIST/createDividends'],
    updateLoading: loading.effects['DIVIDENDS_LIST/dividendsEdit']
}))(DividendsDetail);

DividendsDetail.defaultProps = {
    data: {}
};
