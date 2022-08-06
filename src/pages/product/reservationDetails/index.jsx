/*
 * @description: 预约详情
 * @Author: tangsc
 * @Date: 2020-11-24 13:21:28
 */
import React, { PureComponent } from 'react';
import {
    Row,
    Col,
    Form,
    Input,
    Modal,
    Select,
    Button,
    Space,
    InputNumber,
    Checkbox,
    DatePicker,
    notification
} from 'antd';
import styles from './index.less';
import { connect } from 'umi';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { XWAppointmentType, XWAppointmentStatus } from '@/utils/publicData';
import { getRandomKey } from '@/utils/utils';

// 定义表单Item
const FormItem = Form.Item;

// 获取Select组件option选项
const { Option } = Select;

// 设置日期格式
const dateFormat = 'YYYY-MM-DD HH:MM:SS';

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

// 提示信息
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};
@connect(({ reservationDetails, loading }) => ({
    loading: loading.effects['reservationDetails/addProductApply']
}))
class ReservationList extends PureComponent {
    state = {
        productList: [],                  // 所有产品列表
        customerList: []                  // 所有用户列表
    };

    componentDidMount() {
        const { applyId, type, productId } = this.props;
        if (type === 'edit') {
            this._editSearch(applyId);
        } else {
            if (!!productId) this._setValues(productId);
        }
        this._getProductList();
    }
    // 获取表单实例对象
    formRef = React.createRef();

    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = (values) => {

        const { dispatch, onCancel, type, applyId } = this.props;
        const { applyDate, ...params } = values;
        let tempObj = {};

        // 转换成时间戳
        tempObj.applyDate = (applyDate && new Date(`${moment(applyDate).format()}`,).getTime()) || undefined;
        if (type === 'add') {
            dispatch({
                type: 'reservationDetails/addProductApply',
                payload: {
                    ...params,
                    ...tempObj
                },
                callback: (res) => {
                    if (res.code === 1008) {
                        openNotification('success', '提示', '新增成功', 'topRight');
                        onCancel();
                    } else {
                        const warningText = res.message || res.data || '新增失败！';
                        openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                    }
                }
            });
        } else {
            dispatch({
                type: 'reservationDetails/editNetValue',
                payload: {
                    applyId,
                    ...params,
                    ...tempObj
                },
                callback: (res) => {
                    if (res.code === 1008) {
                        openNotification('success', '提示', '编辑成功', 'topRight');
                        onCancel();
                    } else {
                        const warningText = res.message || res.data || '编辑失败！';
                        openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                    }
                }
            });
        }
    };

    /**
     * @description: 查询所有产品（不分页）
     */
    _getProductList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/getAllProduct',
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        productList: res.data
                    });
                }
            }
        });
        dispatch({
            type: 'global/queryByCustomerName',
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        customerList: res.data
                    });
                }
            }
        });
    }

    /**
     * @description: 编辑时数据获取
     * @param {*}
     */
    _editSearch = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'reservationDetails/getNetValueDetails',
            payload: {
                applyId: id
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    if (res.data) {
                        const { data } = res;
                        const { applyDate, ...tempObj } = data;
                        this.formRef.current.setFieldsValue({
                            applyDate: applyDate ? moment(applyDate) : null,
                            ...tempObj
                        });
                    }
                }
            }
        });
    }

    /**
     * @description: 设置当前产品名称
     * @param {*} id
     */
    _setValues = (id) => {
        this.formRef.current.setFieldsValue({
            productId: id
        });
    }

    /**
     * @description: 设置select搜索项
     * @param {String} inputValue
     * @param {Object} option
     */
    _filterPerson = (inputValue, option) => {
        return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
    }
    render() {
        const { productList, customerList } = this.state;
        const { loading, modalVisible, onCancel } = this.props;

        return (
            <Modal
                width="800px"
                className={styles.container}
                title="新增预约"
                centered
                maskClosable={false}
                visible={modalVisible}
                onCancel={onCancel}
                footer={null}
            >
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
                        <Row>
                            <Col span={7}>
                                <FormItem
                                    label="预约类型"
                                    name="applyType"
                                    rules={[
                                        {
                                            required: true,
                                            message: '预约类型'
                                        }
                                    ]}
                                >
                                    <Select placeholder="请选择"  allowClear>
                                        {
                                            XWAppointmentType.map((item) => {
                                                return (
                                                    <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                                );
                                            })
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={7}>
                                <FormItem
                                    label="客户名称"
                                    name="customerId"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择客户名称'
                                        }
                                    ]}
                                >
                                    <Select placeholder="请选择"
                                        showSearch
                                        allowClear
                                        defaultActiveFirstOption={false}
                                        // showArrow={false}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        notFoundContent={null}
                                        optionLabelProp="label"
                                    >
                                        {
                                            !isEmpty(customerList) &&
                                            customerList.map((item, i) => <Option label={item.customerName} key={i} value={item.customerId}>{item.customerBrief}</Option>)
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={7}>
                                <FormItem
                                    label="产品名称"
                                    name="productId"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择产品名称'
                                        }
                                    ]}
                                >
                                    <Select placeholder="请选择"
                                        showSearch
                                        allowClear
                                        defaultActiveFirstOption={false}
                                        // showArrow={false}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        notFoundContent={null}
                                    >
                                        {
                                            !isEmpty(productList) &&
                                            productList.map((item) => <Option key={item.productId} value={item.productId}>{item.productName}</Option>)
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <FormItem
                                    label="预约时间"
                                    name="applyDate"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择预约时间'
                                        }
                                    ]}
                                >
                                    <DatePicker format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} showTime={{ format: 'HH:mm' }} />
                                </FormItem>
                            </Col>
                            <Col span={7}>
                                <FormItem
                                    label="预约额"
                                    name="applyMoney"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入预约额'
                                        }
                                    ]}
                                >
                                    <InputNumber placeholder="请输入" autoComplete="off" addonAfter="万" precision={2} step={0.01} min={0} />
                                </FormItem>
                            </Col>
                            {/* <Col span={7}>
                                <FormItem
                                    label="预约状态"
                                    name="status"
                                >
                                    <Select placeholder="请选择">
                                        {
                                            XWAppointmentStatus.map((item) => {
                                                return (
                                                    <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                                );
                                            })
                                        }
                                    </Select>
                                </FormItem>
                            </Col> */}
                            <Col span={7}></Col>
                        </Row>
                        <Space className={styles.btnGroup}>
                            {
                                this.props.authEdit &&
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                >
                                    确定
                                </Button>
                            }
                            <Button onClick={onCancel}>取消</Button>
                        </Space>
                    </Form>

                </Space>
            </Modal>
        );
    }
}
export default ReservationList;
