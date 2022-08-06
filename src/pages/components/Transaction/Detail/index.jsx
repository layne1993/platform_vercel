import { notification, Card, Button, Form, Row, Col, DatePicker, Input, Select, InputNumber, Upload, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { Component } from 'react';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { tradeType, XWSourceType } from '@/utils/publicData';
import { connect, history } from 'umi';
import { getCookie } from '@/utils/utils';
import request from '@/utils/rest';
import styles from './index.less';
import { values } from 'lodash-es';

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
            customerList: [],
            productList: [],
            channelList: [],
            fileList: []
        };
    }

    componentDidMount() {
        const { dispatch, params } = this.props;
        console.log(this.props);
        const product = {
            label: '产品名称',
            name: 'productId',
            placeholder: '请输入产品名称',
            message: '请输入产品名称',
            Required: true,
            type: 'product',
            data: this.state && this.state.productList
        };
        const customer = {
            label: '客户名称',
            name: 'customerId',
            placeholder: '请输入客户名称',
            message: '请输入客户名称',
            Required: true,
            type: 'customer',
            data: this.state && this.state.customerList
        };
        if (!params.productId) {
            this.datasource.unshift(product);
        }
        if (!params.customerId) {
            this.datasource.unshift(customer);
        }
        if (params && params.tradeRecordId && Number(params.tradeRecordId) !== 0) {
            // this.setState({
            //     isEidt: true
            // });
            dispatch({
                type: 'TransactionDetail/TradeQueryById',
                payload: {
                    tradeRecordId: Number(params.tradeRecordId)
                },
                callback: (res) => {
                    if (res.code === 1008 && res.data) {
                        const { tradeApplyTime, tradeTime, channelName, confirmFiles  } = res.data;
                        let temChannelIds = channelName ? channelName.split(',').map(Number) : undefined;
                        const fileList = Array.isArray(confirmFiles) && confirmFiles.map((item) => ({
                            uid: item.attachmentsId,
                            confirmFileId:item.confirmFileId,
                            name: item.fileName,
                            url: item.fileUrl,
                            status: 'done'
                        })) || [];
                        this.formRef.current.setFieldsValue({
                            ...res.data,
                            channelName: temChannelIds,
                            tradeApplyTime: tradeApplyTime && moment(tradeApplyTime),
                            tradeTime: tradeTime && moment(tradeTime),
                            fileList
                        });
                        this.setState({ fileList });
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

        dispatch({
            type: 'global/channelList',
            callback: (res) => {
                if (res.code === 1008) {
                    this.setState({
                        channelList: res.data || []
                    });
                }
            }
        });
    }

    formRef = React.createRef();
    datasource = [
        {
            label: '交易类型',
            name: 'tradeType',
            placeholder: '请选择交易类型',
            message: '请选择交易类型',
            Required: true,
            type: 'select',
            data: tradeType
        },
        {
            label: '确认日期',
            name: 'tradeTime',
            placeholder: '请选择确认日期',
            message: '请选择确认日期',
            Required: false,
            type: 'datePicker'
        },
        {
            label: '确认金额',
            name: 'tradeMoney',
            placeholder: '请输入确认金额',
            message: '请输入确认金额',
            Required: true,
            precision:2,
            step:0.01,
            type: 'inputNumber'
        },
        {
            label: '确认份额',
            name: 'tradeShare',
            placeholder: '请输入确认份额',
            message: '请输入确认份额',
            Required: true,
            precision:4,
            step:0.0001,
            type: 'inputNumber'
        },
        {
            label: '交易净值',
            name: 'tradeNetValue',
            placeholder: '请输入交易净值',
            message: '请输入交易净值',
            Required: true,
            precision:4,
            step:0.0001,
            type: 'inputNumber'
        },
        {
            label: '申请日期',
            name: 'tradeApplyTime',
            placeholder: '请选择申请日期',
            message: '请选择申请日期',
            Required: true,
            type: 'datePicker'
        },
        {
            label: '申请金额',
            name: 'tradeApplyMoney',
            placeholder: '请输入申请金额',
            message: '请输入申请金额',
            Required: false,
            precision:2,
            step:0.01,
            type: 'inputNumber'
        },
        {
            label: '申请份额',
            name: 'tradeApplyShare',
            placeholder: '请输入申请份额',
            message: '请输入申请份额',
            Required: false,
            precision:4,
            step:0.0001,
            type: 'inputNumber'
        },
        {
            label: '交易费用',
            name: 'tradeFare',
            placeholder: '请输入交易费用',
            message: '请输入交易费用',
            Required: false,
            precision:2,
            step:0.01,
            type: 'inputNumber'
        },
        {
            label: '手续费',
            name: 'serviceMoney',
            placeholder: '请输入手续费',
            message: '请输入手续费',
            Required: false,
            precision:2,
            step:0.01,
            type: 'inputNumber'
        },
        {
            label: '业绩报酬',
            name: 'reward',
            placeholder: '请输入业绩报酬',
            message: '请输入业绩报酬',
            Required: false,
            precision:2,
            step:0.01,
            type: 'inputNumber'
        },
        {
            label: '交易账号',
            name: 'tradeAccount',
            placeholder: '请输入交易账号',
            message: '请输入交易账号',
            Required: false,
            type: 'input'
        },
        // {
        //     label: '渠道编号',
        //     name: 'dealer',
        //     placeholder: '请输入渠道编号',
        //     message: '请输入渠道编号',
        //     Required: false,
        //     type: 'input'
        // },
        {
            label: '渠道名称',
            name: 'channelName',
            placeholder: '请选择渠道名称',
            message: '请选择渠道名称',
            Required: false,
            type: 'channelName',
            data: []
        },
        {
            label: '渠道编号',
            name: 'dealer',
            placeholder: '',
            message: '',
            Required: false,
            type: 'input',
            disabled: true,
            data: []
        },
        {
            label: '数据来源',
            name: 'sourceType',
            placeholder: '请选择数据来源',
            message: '请选择数据来源',
            Required: true,
            type: 'select',
            data: XWSourceType,
            disabled: true
        }
    ];

    // 上传图片方法
    uploadFileChange = async ({ file, fileList }) => {
        if (file.status === 'uploading' || file.status === 'removed') {
            this.setState({ fileList });
            return;
        }
        if (file.status === 'done') {
            if (file.response.code === 1008) {
                const flieObj = file.response.data || {};
                openNotification('success', '提醒', '上传成功');
                const fl = {
                    uid: flieObj.attachmentsId,
                    name: flieObj.fileName,
                    url: flieObj.baseUrl,
                    status: 'done'
                };
                const { fileList } = this.state;
                const reallyFileList = Array.isArray(fileList) && fileList.filter((item) => {
                    return item?.status === 'done' || false;
                }) || [];
                this.setState({ fileList: [fl, ...reallyFileList] });
                this.formRef.current.setFieldsValue({ fileList:  [fl, ...reallyFileList]  });
            } else {
                openNotification('warning', '提醒', '上传失败');
            }
        }
    };

    // 删除文件
    deleteFile = async (e) => {
        const {params={}} = this.props;
        let res = await request.post('/trade/deleteConfirmFileLink', {tradeRecordId:params.tradeRecordId || undefined, confirmFileId:e.confirmFileId || undefined});
        let fl = this.formRef.current.getFieldValue('fileList') || [];
        let fileList;
        if (Array.isArray(fl)) {
            fileList = fl;
        } else {
            fileList = fl.fileList || [];
        }
        let arr = [];
        if (res.code === 1008) {
            openNotification('success', '提醒', res.message || '删除成功');
            arr = fileList.filter((item) => item.uid !== e.uid);
            this.formRef.current.setFieldsValue({ fileList: arr });
            this.setState({ fileList: arr });
        }else{
            openNotification('warning', '提醒', '删除失败');
        }
    };

    confirmDelete = (e)=>{
        console.log(e);
        Modal.confirm({
            content:'确认删除该文件???',
            onOk:()=>this.deleteFile(e)
        });
        return false;
    };



    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = (values) => {
        const { dispatch, params, close, getTradeQuery } = this.props;
        let type = '';
        if (params && params.tradeRecordId && Number(params.tradeRecordId) !== 0) {
            type = 'TransactionDetail/TradeUpdate';
        } else {
            type = 'TransactionDetail/TradeCreate';
        }
        const { fileList, ...formValues } = values;
        let confirmFiles;
        if (fileList) {
            const fl = Array.isArray(fileList) && fileList || fileList.fileList;
            confirmFiles = fl.map((item) => ({
                attachmentId: item.uid,
                confirmFileId: item.confirmFileId || null
            }));
        } else {
            confirmFiles = [];
        }

        dispatch({
            type,
            payload: {
                ...formValues,
                customerId: params && params.customerId || values.customerId,
                productId: params && params.productId || values.productId,
                channelName: values.channelName ? values.channelName.join(',') : undefined,
                dealer:values.dealer ? values.dealer : '',
                // customerId: values.customerName && values.customerName.split(',')[0],
                // customerName: values.customerName && values.customerName.split(',')[1],
                // productId: values.productName && values.productName.split(',')[0],
                // productName: values.productName && values.productName.split(',')[1],
                tradeRecordId:
                    params && Number(params.tradeRecordId) !== 0
                        ? Number(params.tradeRecordId)
                        : undefined,
                confirmFiles
            },
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification('success', '提示', '保存成功', 'topRight');
                    close();
                    getTradeQuery();
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

    // 渠道change事件
    channelChange = (ids = []) => {
        const { channelList } = this.state;
        const strArr = [];
        channelList.map((item) => {
            if (ids.includes(item.channelId)) {
                strArr.push(item.encodingRules);
            }
        });
        this.formRef.current.setFieldsValue({
            dealer: strArr.join(',')
        });
    }

    goback = () => {
        const { close, getTradeQuery } = this.props;
        close();
        getTradeQuery();
    };

    goSettings = () => {
        const { close } = this.props;
        close();
        history.push('/operation/shareInfoAdmin/share/shareConfirmation');
    }

    render() {

        const { updateLoading, addLoading } = this.props;
        const { fileList } = this.state;
        return (
            // <PageHeaderWrapper title="编辑信息" className={styles.pageHeader}>
            <Card>
                <Form
                    name="basic"
                    onFinish={this._onFinish}
                    ref={this.formRef}
                    initialValues={{
                        sourceType: 1
                    }}
                >
                    <Row gutter={[8, 0]}>
                        {this.datasource.map((item, index) => (
                            <Col span={8} key={index}>
                                <FormItem
                                    label={item.label}
                                    name={item.name}
                                    labelCol={{ span: 6 }}
                                    rules={[
                                        {
                                            required: item.Required,

                                            message: item.message
                                        }
                                    ]}
                                >
                                    {(item.type === 'input' && (
                                        <Input style={{width:220}} placeholder={item.placeholder} disabled={item.disabled} autoComplete="off" />
                                    )) ||
                                        (item.type === 'datePicker' && (
                                            <DatePicker
                                                style={{width:220}}
                                                placeholder={item.placeholder}
                                            />
                                        )) ||
                                        (item.type === 'select' && (
                                            <Select style={{width:220}} allowClear placeholder={item.placeholder} disabled={item.disabled}>
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
                                                style={{width:220}}
                                                placeholder={item.placeholder}
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
                                                style={{width:220}}
                                                placeholder={item.placeholder}
                                                showSearch
                                                allowClear
                                                filterOption={(input, option) =>
                                                    option.children && option.children
                                                        .toLowerCase()
                                                        .indexOf(input.toLowerCase()) >= 0
                                                }
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
                                        )) ||
                                        (item.type === 'channelName' && (
                                            // console.log(item)
                                            <Select
                                                onChange={this.channelChange}
                                                allowClear
                                                mode="multiple"
                                                style={{width:220}}
                                                placeholder={item.placeholder}
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option.children && option.children
                                                        .toLowerCase()
                                                        .indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {
                                                    this.state.channelList.map((item, index) => {
                                                        return <Select.Option key={index} value={item.channelId}>{item.channelName}</Select.Option>;
                                                    })
                                                }
                                            </Select>
                                        )) ||
                                        (item.type === 'inputNumber' && (
                                            <InputNumber precision={item.precision} step={item.step} style={{width:220}} placeholder={item.placeholder} autoComplete="off" />
                                        ))}
                                </FormItem>
                            </Col>
                        ))}
                        <Col span={24}>
                            <p>份额确认书信息：
                                <a onClick={this.goSettings}>
                                    如已经在份额确认书上传，但是未关联，点击此处前往关联
                                </a>
                            </p>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="文件上传"
                                name="fileList"
                                extra="支持多个文件,文件类型：PDF"
                            >
                                <Upload
                                    action={`${BASE_PATH.adminUrl}/attachments/uploadFile`}
                                    headers={{
                                        tokenId: getCookie('vipAdminToken')
                                    }}
                                    accept=".pdf"
                                    data={{
                                        sourceId: '',
                                        source: 6,
                                        codeType: 134
                                    }}
                                    fileList={fileList}
                                    onChange={this.uploadFileChange}
                                    onRemove={this.confirmDelete}
                                    // maxCount={1}
                                >
                                    <Button
                                        icon={<UploadOutlined />}
                                        size="middle"
                                    >
                                上传
                                    </Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={12} offset={10}>
                            <Button loading={updateLoading || addLoading} htmlType="submit" type="primary">
                                保存
                            </Button>

                            <Button style={{ marginLeft: 10 }} onClick={this.goback}>
                                取消
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
            // </PageHeaderWrapper>
        );
    }
}

export default connect(({ signprocess, loading }) => ({
    signprocess,
    loading: loading.effects['signprocess/getBaseInfo'],
    updateLoading: loading.effects['TransactionDetail/TradeUpdate'],
    addLoading: loading.effects['TransactionDetail/TradeCreate']
}))(Detail);
