/*
 * @description: 新建客户回访
 * @Author: tangsc
 * @Date: 2021-02-05 10:34:01
 */
import React, {PureComponent} from 'react';
import {
    Form,
    Modal,
    Select,
    Button,
    Radio,
    Space,
    DatePicker,
    notification,
    Spin
} from 'antd';
import styles from './AddModal.less';
import {connect} from 'umi';
import moment from 'moment';
import {isEmpty} from 'lodash';

// 定义表单Item
const FormItem = Form.Item;

// 获取Select组件option选项
const {Option} = Select;

// 设置日期格式
const dateFormat = 'YYYY/MM/DD';

// 表格布局
const formItemLayout = {
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

// 提示信息
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

@connect(({returnVisitList, loading}) => ({
    returnVisitList,
    loading: loading.effects['returnVisitList/createSingle']
}))
class ReturnVisitDetails extends PureComponent {
    state = {
        productList: [],                  // 所有产品列表
        customerList: [],                 // 所有客户列表
        returnVisitType: 0                // 回访类型：0：募集回访  1：适当性回访

    };

    // 获取表单实例对象
    formRef = React.createRef();

    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = (values) => {
        const {dispatch, onCancel} = this.props;
        const {coolingPeriodTime} = values;
        const payload = {
            ...values,
            coolingPeriodTime: coolingPeriodTime ? coolingPeriodTime.format('x') : ''
        };
        dispatch({
            type: 'returnVisitList/createSingle',
            payload,
            callback: () => {
                onCancel();
            }
        });

    };

    /**
     * @description: 查询所有产品（不分页）
     */
    _getProductList = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'returnVisitList/getProductAllList',
            callback: (productList) => {
                this.setState({
                    productList
                });
            }
        });
    }

    // 请求客户名称和客户证件号码
    _getUserList = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'returnVisitList/getUserList',
            callback: (customerList) => {
                this.setState({customerList});
            }
        });
    }

    /**
     * @description: Radio单选框change事件
     * @param {Object} e
     */
    _handleChange = (e) => {
        this.setState({
            returnVisitType: e.target.value
        });
    };


    componentDidMount() {
        const {dispatch} = this.props;
        // 请求产品名称
        this._getProductList();
        // 请求客户名称，客户证件号码
        this._getUserList();
    }

    render() {
        const {productList, returnVisitType, customerList} = this.state;
        const {loading, editLoading, modalVisible, onCancel} = this.props;
        // eslint-disable-next-line no-undef
        const {authEdit} = sessionStorage.getItem('PERMISSION') && JSON.parse(sessionStorage.getItem('PERMISSION'))['20200'] || {};

        return (

            <Modal
                width="800px"
                className={styles.container}
                title={'新增客户回访'}
                centered
                maskClosable={false}
                visible={modalVisible}
                onCancel={onCancel}
                footer={null}
            >
                <Spin spinning={Boolean(loading)}>
                    <Space
                        direction="vertical"
                        style={{width: '100%'}}
                        size="large"
                        className={styles.container}
                    >
                        <Form
                            name="basic"
                            onFinish={this._onFinish}
                            ref={this.formRef}
                            {...formItemLayout}
                            initialValues={{
                                visitType: 0
                            }}
                        >
                            <FormItem
                                label="回访类型"
                                name="returnType"
                                rules={[{required: true, message: '请选择回访类型'}]}
                            >
                                <Radio.Group onChange={this._handleChange}>
                                    <Radio value={0}>募集回访</Radio>
                                    <Radio value={1}>适当性回访</Radio>
                                </Radio.Group>
                            </FormItem>
                            {
                                returnVisitType === 0 &&
                                <FormItem
                                    label="产品名称"
                                    name="productId"
                                >
                                    <Select placeholder="请选择"
                                        showSearch
                                        allowClear
                                        defaultActiveFirstOption={false}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        notFoundContent={null}
                                    >
                                        {
                                            !isEmpty(productList) &&
                                            productList.map((item) => (
                                                <Option
                                                    key={item.productId}
                                                    value={item.productId}
                                                >
                                                    {item.productName}
                                                </Option>))
                                        }
                                    </Select>
                                </FormItem>
                            }

                            <FormItem
                                label="客户名称"
                                name="customerId"
                                rules={[
                                    {
                                        required: true
                                    }
                                ]}
                            >
                                <Select placeholder="请选择"
                                    showSearch
                                    defaultActiveFirstOption={false}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    notFoundContent={null}
                                    allowClear
                                >
                                    {
                                        !isEmpty(customerList) &&
                                        customerList.map((item) => (
                                            <Option
                                                key={item.customerId}
                                                value={item.customerId}
                                            >
                                                {item.customerName}
                                            </Option>))
                                    }
                                </Select>
                            </FormItem>
                            <FormItem
                                label="客户证件号码"
                                name="customerId"
                                extra="客户姓名和证件号码可以任选其一录入；请录入已有客户"
                                rules={[
                                    {
                                        required: true
                                    }
                                ]}
                            >
                                <Select placeholder="请选择"
                                    allowClear
                                    showSearch
                                    defaultActiveFirstOption={false}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    notFoundContent={null}
                                >
                                    {
                                        !isEmpty(customerList) &&
                                        customerList.map((item) => (
                                            <Option
                                                key={item.customerId}
                                                value={item.customerId}
                                            >
                                                {item.cardNumber}
                                            </Option>))
                                    }
                                </Select>
                            </FormItem>
                            {
                                returnVisitType === 0 &&
                                <FormItem
                                    label="冷静期开始时间"
                                    name="coolingPeriodTime"
                                >
                                    <DatePicker style={{width: '100%'}} format={dateFormat}/>
                                </FormItem>
                            }
                            <Space className={styles.btnGroup}>
                                {
                                    authEdit &&
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading || editLoading}
                                    >
                                        确定
                                    </Button>
                                }
                                <Button onClick={onCancel}>取消</Button>
                            </Space>
                        </Form>
                    </Space>
                </Spin>
            </Modal>


        );
    }
}

export default ReturnVisitDetails;
