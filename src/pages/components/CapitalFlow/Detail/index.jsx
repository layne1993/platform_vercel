import { Steps, notification, Card, Button, Form, Row, Col, DatePicker, Input, Select, InputNumber  } from 'antd';
// import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import moment from 'moment';
import { XWSourceType, XWTradeType, XWFlowState2, currency } from '@/utils/publicData';
import { connect, Link, history } from 'umi';

import styles from './index.less';

const { Step } = Steps;

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const FormItem = Form.Item;

const { Option } = Select;

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEidt: undefined,
            productList: [],
            customerList: [],
            bankList:[],
            sourceType:undefined,
            tradeStatus: undefined
        };
    }

    componentDidMount() {
        const { dispatch, params } = this.props;
        console.log(params)
        if(params.customerId){
            this.getBankList(params.customerId);
        }

        if (params && params.tradeFlowId && Number(params.tradeFlowId) !== 0) {
            this.setState({
                isEidt: true
            });
            dispatch({
                type: 'CapitalFlowDetail/TradeFlowQueryById',
                payload: {
                    tradeFlowId: Number(params.tradeFlowId)
                },
                callback: (res) => {
                    if (res.code === 1008 && res.data) {
                        const { tradeApplyDate, tradeTime, tradeStatus, sourceType } = res.data;
                        this.setState({
                            sourceType,
                            tradeStatus
                        });
                        // this.getBankList(res.data.customerId);
                        this.formRef.current.setFieldsValue({
                            ...res.data,
                            tradeApplyDate: tradeApplyDate && moment(tradeApplyDate),
                            tradeTime: tradeTime && moment(tradeTime),
                            tradeStatus:tradeStatus
                        });
                    } else {
                        openNotification('warning', '提示', res.message || '查询失败', 'topRight');
                    }
                }
            });
        }
        dispatch({
            type: 'global/queryByProductName',
            callback: (res) => {
                if (res.code === 1008) {
                    this.setState({
                        productList: res.data
                    });
                }
            }
        });

        dispatch({
            type: 'global/queryByCustomerName',
            callback: (res) => {
                if (res.code === 1008) {
                    this.setState({
                        customerList: res.data
                    });
                }
            }
        });
        // console.log(this.state);
    }
    getBankList = (id)=>{
        const {dispatch} = this.props;
        dispatch({
            type:'CapitalFlowDetail/QueryBank',
            payload:{
                customerId:id
            },
            callback:(res)=>{
                if(res.code === 1008){
                    this.setState({
                        bankList:res.data
                    });
                }
            }
        });
    }
    formRef = React.createRef();


    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = (values) => {
        const { dispatch, params, close, getFlowingWaterList } = this.props;
        let type = '';
        if (params && params.tradeFlowId && Number(params.tradeFlowId) !== 0) {
            type = 'CapitalFlowDetail/TradeFlowUpdate';
        } else {
            type = 'CapitalFlowDetail/TradeFlowCreate';
        }
        // console.log(values);
        // return;
        dispatch({
            type,
            payload: {
                ...values,
                customerId:params && params.customerId || values.customerId,
                tradeFlowId:
                    params && Number(params.tradeFlowId) !== 0
                        ? Number(params.tradeFlowId)
                        : undefined
            },
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification('success', '提示', '保存成功', 'topRight');
                    close();
                    getFlowingWaterList();
                } else {
                    openNotification(
                        'warning',
                        `提示(代码：${res.code})`,
                        res.message || '保存失败',
                        'topRight',
                    );
                }
            }
        });
    };

    goback = () => {
        const {close} = this.props;
        close();
    };

    onSelectCustomer = (value)=>{
        this.getBankList(value);
    }
    gobankList = ()=>{
        history.push('/investor/bankCardInfo')
        this.props.close()
    }   

    render() {
        const { loading1, loading2, params} = this.props;
        const { isEidt, bankList, tradeStatus } = this.state;
        const datasource = [
            {
                label: '产品名称',
                name: 'productId',
                placeholder: '请输入产品名称',
                message: '请输入产品名称',
                Required: true,
                type: 'product',
                disabled:this.state && this.state.sourceType===4,
                data: this.state && this.state.productList
            },
            {
                label: '关联交易类型',
                name: 'tradeType',
                placeholder: '请选择交易类型',
                message: '请选择交易类型',
                Required: true,
                disabled:this.state && this.state.sourceType===4,
                data: XWTradeType,
                type: 'select'
            },
            {
                label: '交易申请日期',
                name: 'tradeApplyDate',
                placeholder: '请选择交易申请日期',
                message: '请选择交易申请日期',
                disabled:this.state && this.state.sourceType===4,
                Required: true,
                type: 'datePicker'
            },
            {
                label: '交易申请金额',
                name: 'tradeApplyMoney',
                placeholder: '请输入交易申请金额',
                message: '请输入交易申请金额',
                disabled:this.state && this.state.sourceType===4,
                Required: true,
                type: 'inputNumber'
            },
            {
                label: '申请银行卡号',
                name: 'applyBankNumber',
                placeholder: '请输入申请银行卡号',
                message: '请输入申请银行卡号',
                disabled:this.state && this.state.sourceType===4,
                Required: true,
                type: 'BankNumber'
            },
            {
                label: '流水银行卡号',
                name: 'bankNumber',
                placeholder: '请输入流水银行卡号',
                message: '请输入流水银行卡号',
                disabled:this.state && this.state.sourceType===3,
                Required: true,
                type: 'input'
            },
            {
                label: '流水时间',
                name: 'tradeTime',
                placeholder: '选择流水时间',
                message: '选择流水时间',
                Required: true,
                disabled:this.state && this.state.sourceType===3,
                type: 'datePicker'
            },
            {
                label: '流水金额',
                name: 'tradeMoney',
                placeholder: '请输入流水金额',
                message: '请输入流水金额',
                Required: true,
                disabled:this.state && this.state.sourceType===3,
                type: 'inputNumber'
            },
            {
                label: '流水银行开户行',
                name: 'bankName',
                placeholder: '请输入流水银行开户行',
                message: '请输入流水银行开户行',
                disabled:this.state && this.state.sourceType===3,
                Required: false,
                type: 'input'
            },
            {
                label: '币种',
                name: 'currency',
                placeholder: '请输入币种',
                message: '请输入币种',
                Required: false,
                type: 'select',
                data:currency
            },
            {
                label: '流水状态',
                name: 'tradeStatus',
                placeholder: '请选择流水状态',
                message: '请选择流水状态',
                Required: true,
                data: XWFlowState2,
                type: 'select'
            },
            {
                label: '数据来源',
                name: 'sourceType',
                placeholder: '请选择数据来源',
                message: '请选择数据来源',
                data: XWSourceType,
                disabled: true,
                Required: true,
                type: 'select'
            }
        ];
        const customer =   {
            label: '客户名称',
            name: 'customerId',
            placeholder: '请输入客户名称',
            message: '请输入客户名称',
            Required: true,
            type: 'customer',
            disabled:this.state.sourceType===4,
            data: this.state && this.state.customerList
        };
        if(!params.customerId){
            datasource.unshift(customer);
        }



        return (
            <Card>
                <Form
                    name="basic"
                    onFinish={this._onFinish}
                    ref={this.formRef}
                    layout="vertical"
                    initialValues={{
                        sourceType: 1,
                        currency:'人民币',
                        tradeStatus:1
                    }}
                >
                    <Row gutter={[8, 0]}>
                        {datasource.map((item, index) => (
                            <Col span={8} key={index}>
                                <FormItem
                                    label={item.label}
                                    name={item.name}
                                    labelCol={{ span: 8 }}
                                    rules={[
                                        {
                                            required: item.Required,
                                            message: item.message
                                        }
                                    ]}
                                >
                                    {(item.type === 'input' && (
                                        <Input disabled={item.disabled} placeholder={item.placeholder} autoComplete="off" />
                                    )) ||
                                        (item.type === 'datePicker' && (
                                            <DatePicker
                                                disabled={item.disabled}
                                                style={{ width: '100%' }}
                                                placeholder={item.placeholder}
                                            />
                                        )) ||
                                        (item.type === 'select' && (
                                            <Select
                                                placeholder={item.placeholder}
                                                disabled={item.disabled}
                                                allowClear
                                            >
                                                {item.data.map((items, indexs) => (
                                                    <Option key={indexs} value={items.value}>
                                                        {items.label}
                                                    </Option>
                                                ))}
                                            </Select>
                                        )) ||
                                        (item.type === 'product' && (
                                            // console.log(item.data)
                                            <Select
                                                placeholder={item.placeholder}
                                                disabled={item.disabled}
                                                showSearch
                                                allowClear
                                                filterOption={(input, option) =>
                                                    option.children && option.children
                                                        .toLowerCase()
                                                        .indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {this.state.productList &&
                                                    this.state.productList.map((items, indexs) => (
                                                        <Option
                                                            key={items.productId}
                                                            value={items.productId}
                                                        >
                                                            {items.productName}
                                                        </Option>
                                                    ))}
                                            </Select>
                                        )) ||
                                        (item.type === 'customer' && (
                                            // console.log(item)
                                            <Select
                                                allowClear
                                                placeholder={item.placeholder}
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option.children && option.children
                                                        .toLowerCase()
                                                        .indexOf(input.toLowerCase()) >= 0
                                                }
                                                onSelect={this.onSelectCustomer}
                                                optionLabelProp="label"
                                            >
                                                {this.state.customerList &&
                                                    this.state.customerList.map((items, indexs) => (
                                                        <Option
                                                            label={items.customerName}
                                                            key={items.customerId}
                                                            value={items.customerId}
                                                        >
                                                            {items.customerBrief}
                                                        </Option>
                                                    ))}
                                            </Select>
                                        )) || (item.type==='inputNumber' &&(
                                        <InputNumber style={{width:'100%'}} disabled={item.disabled} placeholder={item.placeholder} autoComplete="off" />
                                    )) ||  (item.type === 'BankNumber' && (
                                        <Select
                                            placeholder={item.placeholder}
                                            notFoundContent={<a onClick={this.gobankList}>暂无银行卡,点击去新建</a>}
                                            showSearch
                                            allowClear
                                            disabled={item.disabled}
                                            filterOption={(input, option) =>
                                                option.children
                                                    .toLowerCase()
                                                    .indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {bankList && bankList.map((items, indexs) => (
                                                <Option
                                                    key={items.accountNumber}
                                                    value={items.accountNumber}
                                                >
                                                    {items.accountNumber}
                                                </Option>
                                            ))}
                                        </Select>
                                    ))}
                                </FormItem>
                            </Col>
                        ))}
                        <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
                            {this.props.authEdit &&
                                <Button
                                    htmlType="submit"
                                    type="primary"
                                    // disabled={tradeStatus === 1 || tradeStatus === 2}
                                    loading={isEidt ? loading2 : loading1}
                                >
                                保存
                                </Button>
                            }

                            <Button style={{ marginLeft: 10 }} onClick={this.goback}>
                                取消
                            </Button>
                        </Col>

                    </Row>
                </Form>
            </Card>
        );
    }
}

export default connect(({ CapitalFlowDetail, loading }) => ({
    CapitalFlowDetail,
    loading1: loading.effects['CapitalFlowDetail/TradeFlowCreate'],
    loading2: loading.effects['CapitalFlowDetail/TradeFlowUpdate']
}))(Detail);
