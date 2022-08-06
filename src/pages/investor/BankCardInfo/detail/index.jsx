/*
 * @description: 银行卡信息详情
 * @Author: tangsc
 * @Date: 2020-10-28 15:19:37
 */
import React, { PureComponent, useContext, useState, useEffect, useRef } from 'react';
import {
    Row,
    Col,
    Form,
    Card,
    Input,
    Select,
    Button,
    Modal,
    Space,
    Table,
    notification
} from 'antd';
import {connect, history} from 'umi';
import styles from './index.less';
import { PlusOutlined } from '@ant-design/icons';
import {
    BANK_STATUS,
    XWTradeType
} from '@/utils/publicData';
import moment from 'moment';

import Add from './add';
import ProductRecord from './productRecord';
import {listToMap, numTransform2} from '@/utils/utils';

// 定义表单Item
const FormItem = Form.Item;


const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

// 获取Select组件option选项
const { Option } = Select;

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


class BankCardDetails extends PureComponent {
    state = {
        count: 2,
        customerBankInfoList: [],
        bankInfo: {},
        bankProduct: [],
        recorData: [],
        recorModalFlag: false,
        addModalFlag: false,
        recordData: {}
    };

    componentDidMount() {
        const { params } = this.props;
        this.getcustomerBankInfo();
        if(params.customerBankId) {
            this.getBankInfo(params.customerBankId);
            this.findCustomerBankProduct();
        }
    }

    columns = [
        {
            title: '产品名称',
            dataIndex: 'productFullName',
            width: '200'
        },
        {
            title: '产品编号',
            dataIndex: 'fundRecordNumber',
            width: '100'
        },
        {
            title: '交易金额',
            dataIndex: 'tradeMoney',
            render: (val) => numTransform2(val)
        },
        {
            title: '交易类型',
            dataIndex: 'transactionType',
            render: (val) => listToMap(XWTradeType)[val]
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            render: (val) => val ? moment(val).format('YYYY/MM/DD') : '--'
        },
        {
            title: '变更记录',
            dataIndex: '',
            render: (record) => <a onClick={()=>this.recordModalSwitch(true, record)}> 查看 </a>
        }
    ];


    // 获取表单实例对象
    formRef = React.createRef();

    /**
     * 客户银行卡信息
     */
    getcustomerBankInfo = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'INVESTOR_BANKINFO/findCustomer',
            callback: (res) => {
                if(res.code === 1008) {
                    this.setState({
                        customerBankInfoList: res.data || []
                    });
                }
            }
        });
    }

    /**
     * 查询银行卡信息
     */
    getBankInfo = (id) => {
        const {dispatch} = this.props;
        dispatch({
            type: 'INVESTOR_BANKINFO/queryBank',
            payload: {customerBankId: id},
            callback: (res) => {
                if(res.code === 1008) {
                    if(this.formRef) {
                        let data = res.data || {};
                        this.formRef.current.setFieldsValue({
                            ...data,
                            customerId: data.customerId
                        });
                        this.setState({bankInfo: data});
                    }
                }
            }
        });
    }

    /**
     * 查询银行卡关联产品信息
     */
    findCustomerBankProduct = () => {
        const {dispatch, params} = this.props;
        dispatch({
            type: 'INVESTOR_BANKINFO/findCustomerBankProduct',
            payload: {customerBankId: params.customerBankId, customerId: params.customerId},
            callback: (res) => {
                if(res.code === 1008) {
                    this.setState({
                        bankProduct: res.data || []
                    });
                }
            }
        });
    }

    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = (values) => {

        const { dispatch, params } = this.props;
        const { bankInfo, customerBankInfoList } = this.state;
        let userInfo = {};
        if(params.customerId) {
            userInfo =  customerBankInfoList.find((item) => item.customerId == params.customerId) || {};
        } else {
            userInfo =  customerBankInfoList.find((item) => item.customerId === values.customerId) || {};
        }

        dispatch({
            type: 'INVESTOR_BANKINFO/createOrUpdateCustomerBank',
            payload: {
                ...params,
                ...bankInfo,
                ...values,
                accountName:values.accountName ||userInfo.accountName,
                customerName: userInfo.customerName
            },
            callback: (res) => {
                if(res.code === 1008) {
                    openNotification('success', `提示（代码：${res.code}）`, '操作成功', 'topRight');
                    if(this.props.onSuccess) {
                        this.props.onSuccess();
                    }
                }else {
                    const warningText = res.message || res.data || '操作失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };



    /**
     * @description: 新增
     */
    _handleAdd = () => {
        this.setState({
            addModalFlag: true
        });
    };

    // 关闭新建模态框
    closeAddModal = () => {
        this.setState({
            addModalFlag: false
        });
    }

    // 新建成功回调
    onSuccess = () => {
        this.findCustomerBankProduct();
        this.closeAddModal();
    }

    /**
     * @description 详情模态框
     */
    closeModal = () => {
        if(this.props.closeModal) {
            this.props.closeModal();
        }
    }

    /**
     * @description: 点击确定保存
     */
    _onSubmit = () => {
        const { bankProduct } = this.state;
        let tempArr = bankProduct.filter((item) => {
            return !(item.productName === '请输入' && item.custodianBank === '请输入' && item.remainingAmount === '请输入');
        });
        tempArr.forEach((item) => {
            if (item.productName === '请输入') {
                item.productName = '暂无';
            }
            if (item.custodianBank === '请输入') {
                item.custodianBank = '暂无';
            }
            if (item.remainingAmount === '请输入') {
                item.remainingAmount = '暂无';
            }
        });
    }


    /**
     * @description 变更记录模态框
     */
    recordModalSwitch = (flag, record) => {
        this.setState({recorModalFlag: flag, recordData: record});
    }
    onValuesChange = (changedValues)=>{
        const {customerBankInfoList} = this.state;
        let accountName = {}
        if(changedValues.customerId){
            customerBankInfoList.map((item)=>{
                if(item.customerId === changedValues.customerId){
                    return accountName=item;
                }
            } );
            console.log(accountName);
            this.formRef.current.setFieldsValue({
                accountName:accountName.customerName
            });
        }

    }


    render() {

        const { bankProduct, customerBankInfoList, recorModalFlag, recordData, addModalFlag } = this.state;
        const { flag, params, loading } = this.props;
        // console.log(params)
        return (
            <>
                <Modal
                    width={1000}
                    title={params.customerBankId ? '编辑' : '新建'}
                    visible={flag}
                    onCancel={this.closeModal}
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
                            onValuesChange={this.onValuesChange}
                            {...formItemLayout}
                        >

                            <Card title="银行卡基本信息">
                                <Row gutter={[20, 10]}>
                                    {!params.customerId &&
                                <Col span={8}>
                                    <FormItem
                                        label="客户名称"
                                        name="customerId"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入银行账户名'
                                            }
                                        ]}
                                    >
                                        <Select
                                            showSearch
                                            placeholder="请输入搜索"
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            optionLabelProp="label"
                                            allowClear

                                        >
                                            {customerBankInfoList.map((item, index) => (
                                                <Option label={item.customerName} key={index} value={item.customerId}>{item.customerBrief}</Option>
                                            ))}
                                        </Select>
                                    </FormItem>
                                </Col>
                                    }
                                    <Col span={8}>
                                        <FormItem
                                            label="银行名称"
                                            name="bankName"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请输入银行名称'
                                                }
                                            ]}
                                        >
                                            <Input placeholder="请输入" autoComplete="off" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="银行卡号"
                                            name="accountNumber"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请输入银行卡号'
                                                }
                                            ]}
                                        >
                                            <Input placeholder="请输入" autoComplete="off" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="开户行全称"
                                            name="subbranch"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请输入开户行全称'
                                                }
                                            ]}
                                        >
                                            <Input placeholder="请输入" autoComplete="off" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="开户行省份"
                                            name="provice"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请输入开户行省份'
                                                }
                                            ]}
                                        >
                                            <Input placeholder="请输入" autoComplete="off" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label="开户行城市" name="city" >
                                            <Input placeholder="请输入" autoComplete="off" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="银行卡状态"
                                            name="status"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请选择银行卡状态'
                                                }
                                            ]}
                                        >
                                            <Select placeholder="请选择" allowClear>
                                                {
                                                    BANK_STATUS.map((item, index) => (
                                                        <Option key={index} value={item.value}>
                                                            {item.label}
                                                        </Option>
                                                    ))
                                                }
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label="银行卡户名" name="accountName"                                             rules={[
                                            {
                                                required: true,
                                                message: '请输入银行卡户名'
                                            }
                                        ]}
                                        >
                                            <Input placeholder="请输入" autoComplete="off" />
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Card>
                            <Space className={styles.btnGroup}>
                                <Button loading={loading} type="primary" htmlType="submit">确定</Button>
                                <Button onClick={this.closeModal}>取消</Button>
                            </Space>
                        </Form>

                        {params.customerBankId
                        && <Card title="关联产品信息">
                            <div style={{ textAlign: 'center' }}>
                                <Table
                                    key="productId"
                                    bordered
                                    dataSource={bankProduct}
                                    columns={this.columns}
                                    pagination={false}
                                    scroll={{x: '100%', y: 100}}
                                />
                                <Button
                                    onClick={this._handleAdd}
                                    type="dashed"
                                    style={{
                                        marginTop: 16,
                                        width: '100%'
                                    }}
                                    icon={<PlusOutlined />}
                                >
                            新增关联产品
                                </Button>
                            </div>
                        </Card>
                        }


                    </Space>
                </Modal>
                {addModalFlag && <Add flag={addModalFlag} closeModal={this.closeAddModal} params={params}  onSuccess={this.onSuccess} />}
                {recorModalFlag &&  <ProductRecord flag={recorModalFlag} closeModal={this.recordModalSwitch} params={{...params, ...recordData}}  onSuccess={this.onSuccess}/>}
            </>
        );
    }
}

export default connect(({ loading }) => ({
    loading: loading.effects['INVESTOR_BANKINFO/createOrUpdateCustomerBank']
}))(BankCardDetails);


BankCardDetails.defaultProps = {
    params: {}
};
