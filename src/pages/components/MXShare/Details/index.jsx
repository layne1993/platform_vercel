/*
 * @description: 份额详情
 * @Author: tangsc
 * @Date: 2020-11-04 15:51:49
 */
import React, { PureComponent } from 'react';
import {
    Row,
    Col,
    Form,
    Input,
    Modal,
    Space,
    Select,
    Button,
    DatePicker,
    notification,
    InputNumber
} from 'antd';
import { FormattedMessage, connect } from 'umi';
import styles from './index.less';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { XWSourceType } from '@/utils/publicData';
import { getRandomKey } from '@/utils/utils';

// 定义表单Item
const FormItem = Form.Item;

// 获取Select组件option选项
const { Option } = Select;


// 设置日期格式
const dateFormat = 'YYYY/MM/DD';

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
@connect(({ shareDetails, loading }) => ({
    loading: loading.effects['shareDetails/addShare'],
    editLoading: loading.effects['shareDetails/editShare']
}))
class MXShareDetails extends PureComponent {
    state = {
        productList: [],                  // 所有产品列表
        customerList: []                  // 所有用户列表
    };

    componentDidMount() {
        const { shareRecordId, type, saveCustomerId } = this.props;
        if (type === 'edit') {
            this._editSearch(shareRecordId);
        } else {
            if (!!saveCustomerId) {
                this._setValues(saveCustomerId);
            }
        }
        this._getInfoList();
    }

    // 获取表单实例对象
    formRef = React.createRef();

    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = (values) => {
        // console.log('Success:', values);

        const { dispatch, type, onCancel, shareRecordId, saveCustomerId } = this.props;
        const { shareDate, ...params } = values;
        let tempObj = {};

        if (!!saveCustomerId) tempObj.customerId = saveCustomerId;
        // 转换成时间戳
        tempObj.shareDate = (shareDate && new Date(`${moment(shareDate).format().split('T')[0]}T00:00:00`,).getTime()) || undefined;
        if (type === 'add') {
            dispatch({
                type: 'shareDetails/addShare',
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
                type: 'shareDetails/editShare',
                payload: {
                    shareRecordId,
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
    _getInfoList = () => {
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
            type: 'shareDetails/queryByCustomerName',
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
            type: 'shareDetails/queryDetails',
            payload: {
                shareRecordId: id
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    if (res.data) {
                        const { data } = res;
                        const { shareDate, ...tempObj } = data;
                        this.formRef.current.setFieldsValue({
                            shareDate: shareDate ? moment(shareDate) : null,
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
            customerId: id
        });
    }

    render() {
        const { productList, customerList } = this.state;
        const { loading, editLoading, modalVisible, onCancel, type, saveCustomerId } = this.props;

        // eslint-disable-next-line no-undef
        return (
            <Modal
                width="800px"
                className={styles.container}
                title={type === 'add' ? '新增份额' : '编辑份额'}
                centered
                maskClosable={false}
                visible={modalVisible}
                onCancel={onCancel}
                footer={null}
            >
                <Form
                    name="basic"
                    onFinish={this._onFinish}
                    ref={this.formRef}
                    className={styles.container}
                    initialValues={{
                        sourceType: 1
                    }}
                    {...formItemLayout}
                >
                    <Row>
                        {!saveCustomerId &&
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
                                        defaultActiveFirstOption={false}
                                        allowClear
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        notFoundContent={null}
                                        optionLabelProp="label"
                                    >
                                        {
                                            !isEmpty(customerList) &&
                                            customerList.map((item) => <Option label={item.customerName} key={item.customerId} value={item.customerId}>{item.customerBrief}</Option>)
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                        }
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
                                    defaultActiveFirstOption={false}
                                    allowClear
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
                        <Col span={7}>
                            <FormItem
                                label="份额更新日期"
                                name="shareDate"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择份额更新日期'
                                    }
                                ]}
                            >
                                <DatePicker format={dateFormat} style={{ width: '100%' }} />
                            </FormItem>
                        </Col>
                        <Col span={7}>
                            <FormItem label="最新份额" name="tradeShare">
                                <InputNumber precision={4} step={0.0001} style={{ width: '100%' }} placeholder="请输入最新份额"/>
                            </FormItem>
                        </Col>
                        <Col span={7}>
                            <FormItem
                                label="可用份额"
                                name="usableShare"
                            >
                                <InputNumber precision={4} step={0.0001} style={{ width: '100%' }} placeholder="请输入可用份额"/>
                            </FormItem>
                        </Col>
                        <Col span={7}>
                            <FormItem
                                label="交易账号"
                                name="tradeAccount"
                            >
                                <Input placeholder="请输入" autoComplete="off" />
                            </FormItem>
                        </Col>
                        <Col span={7}>
                            <FormItem
                                label="数据来源"
                                name="sourceType"
                            >
                                <Select placeholder="请选择" disabled>
                                    {
                                        !isEmpty(XWSourceType) &&
                                        XWSourceType.map((item) => {
                                            return <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>;
                                        })
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Space className={styles.btnGroup}>
                        {
                            this.props.authEdit &&
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
            </Modal >

        );
    }
}
export default MXShareDetails;
