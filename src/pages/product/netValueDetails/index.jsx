/*
 * @description: 净值数据管理详情
 * @Author: tangsc
 * @Date: 2020-10-29 17:08:34
 */
import React, { PureComponent } from 'react';
import {
    Row,
    Col,
    Form,
    Input,
    InputNumber,
    Modal,
    Select,
    Button,
    Space,
    Checkbox,
    DatePicker,
    notification
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import { connect } from 'umi';
import moment from 'moment';
import { isEmpty } from 'lodash';

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

// 提示信息
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};
@connect(({ netValueDetails, loading }) => ({
    loading: loading.effects['netValueDetails/createNetValue'],
    editLoading: loading.effects['netValueDetails/editNetValue']
}))
class NetValueDetails extends PureComponent {
    state = {
        productList: [],                  // 所有产品列表
        isShowNetvalue: ''                 // 净值是否展示
    };

    componentDidMount() {
        const { productNetvalueId, type, productId } = this.props;
        this._getProductList();
        if (type === 'edit') {
            this._editSearch(productNetvalueId);
        } else {
            if (!!productId) this._setValues(productId);
        }
    }
    // 获取表单实例对象
    formRef = React.createRef();

    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = (values) => {
        const { isShowNetvalue } = this.state;
        const { dispatch, onCancel, type, productNetvalueId } = this.props;
        const { netDate, isDividendDay, isfetchdDay, isOpenDay, ...params } = values;
        let tempObj = {};

        // 转换成时间戳
        tempObj.netDate = (netDate && new Date(`${moment(netDate).format().split('T')[0]}T00:00:00`,).getTime()) || undefined;

        // checkBox状态转换
        tempObj.isDividendDay = isDividendDay ? 1 : 0;
        // tempObj.isShowNetvalue = isShowNetvalue ? 1 : 0;
        tempObj.isfetchdDay = isfetchdDay ? 1 : 0;
        tempObj.isOpenDay = isOpenDay ? 1 : 0;
        if (type === 'add') {
            dispatch({
                type: 'netValueDetails/createNetValue',
                payload: {
                    ...params,
                    ...tempObj
                },
                callback: (res) => {
                    if (res.code === 1008 && res.data) {
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
                type: 'netValueDetails/editNetValue',
                payload: {
                    productNetvalueId,
                    isShowNetvalue,
                    ...params,
                    ...tempObj
                },
                callback: (res) => {
                    if (res.code === 1008 && res.data) {
                        openNotification('success', '提示', '编辑成功', 'topRight');
                        // 保存新的productId 然后查询
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
    }

    /**
     * @description: 编辑时数据获取
     * @param {*}
     */
    _editSearch = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'netValueDetails/getNetValueDetails',
            payload: {
                productNetvalueId: id
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    if (res.data) {
                        const { data } = res;
                        const { netDate, isShowNetvalue, ...tempObj } = data;
                        this.setState({
                            isShowNetvalue
                        });
                        this.formRef.current.setFieldsValue({
                            netDate: netDate ? moment(netDate) : null,
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
            productId: Number(id)
        });
    }

    render() {
        const { productList } = this.state;
        const { loading, editLoading, modalVisible, onCancel, type } = this.props;

        return (
            <Modal
                width="800px"
                className={styles.container}
                title={type === 'edit' ? '编辑净值' : '新增净值'}
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
                                    label="净值日期"
                                    name="netDate"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择净值日期'
                                        }
                                    ]}
                                >
                                    <DatePicker style={{ width: '100%' }} format={dateFormat} disabledDate={(currentDate)=>{
                                        if(moment(currentDate).valueOf()>moment().valueOf()){
                                            return true
                                        }
                                        // console.log(moment().valueOf())
                                        // console.log(moment(currentDate).valueOf())
                                    }}/>
                                </FormItem>
                            </Col>
                            <Col span={7}>
                                <FormItem
                                    label="单位净值"
                                    name="netValue"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入单位净值'
                                        }
                                    ]}
                                >
                                    <InputNumber style={{ width: '100%' }} precision={4} step={0.0001} placeholder="请输入" autoComplete="off" />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <FormItem
                                    label="累计单位净值"
                                    name="acumulateNetValue"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入累计单位净值'
                                        }
                                    ]}
                                >
                                    <InputNumber style={{ width: '100%' }} precision={4} step={0.0001} placeholder="请输入" autoComplete="off" />
                                </FormItem>
                            </Col>
                            <Col span={7}>
                                <FormItem label="复权净值" name="adjustedNetValue" >
                                    <InputNumber style={{ width: '100%' }} precision={4} step={0.0001} placeholder="请输入" autoComplete="off" />
                                </FormItem>
                            </Col>
                            <Col span={7}>
                                <FormItem label="资产净值" name="feeNetValue" >
                                    <InputNumber style={{ width: '100%' }} precision={4} step={0.0001} placeholder="请输入" autoComplete="off" />
                                </FormItem>
                            </Col>

                        </Row>
                        <Row>
                            <Col span={7}>
                                <FormItem label="资产份额" name="shareValue" >
                                    <InputNumber style={{ width: '100%' }} precision={2} step={0.01} placeholder="请输入" autoComplete="off" />
                                </FormItem>
                            </Col>
                            <Col span={7}>
                                <FormItem label="资产总值" name="totalValue" >
                                    <InputNumber style={{ width: '100%' }} precision={2} step={0.01} placeholder="请输入" autoComplete="off" />
                                </FormItem>
                            </Col>
                            <Col span={7}></Col>
                            {/* <Col span={5} className={styles.checkWrap}>
                                <FormItem
                                    label="净值是否展示"
                                    name="isShowNetvalue"
                                    {...checkBoxLayoutSec}
                                    valuePropName="checked"
                                >
                                    <Checkbox />
                                </FormItem>
                            </Col> */}
                        </Row>
                        <Row>
                            <Col span={5} className={styles.checkWrap}>
                                <FormItem
                                    label="分红日"
                                    name="isDividendDay"
                                    {...checkBoxLayout}
                                    valuePropName="checked"
                                >
                                    <Checkbox />
                                </FormItem>
                            </Col>
                            <Col span={5} className={styles.checkWrap}>
                                <FormItem
                                    label="计提日"
                                    name="isfetchdDay"
                                    {...checkBoxLayout}
                                    valuePropName="checked"
                                >
                                    <Checkbox />
                                </FormItem>
                            </Col>
                            <Col span={5} className={styles.checkWrap}>
                                <FormItem
                                    label="开放日"
                                    name="isOpenDay"
                                    {...checkBoxLayout}
                                    valuePropName="checked"
                                >
                                    <Checkbox />
                                </FormItem>
                            </Col>
                            <Col span={7}></Col>
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

                </Space>
            </Modal>
        );
    }
}
export default NetValueDetails;
