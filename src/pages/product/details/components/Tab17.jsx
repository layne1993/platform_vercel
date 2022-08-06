/*
 * @Descripttion: 打新信息维护
 * @version:
 * @Author: yezi
 * @Date: 2021-04-14 18:39:13
 * @LastEditTime: 2021-07-12 13:52:15
 */
import React, { PureComponent } from 'react';
import { connect, Link } from 'umi';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
    Form,
    Row,
    Card,
    Col,
    Input,
    Button,
    Select,
    Space,
    DatePicker,
    Radio,
    notification,
    Table,
    Modal,
    InputNumber,
    Spin
} from 'antd';
import MXTable from '@/pages/components/MXTable';
import BatchUpload from '@/pages/components/batchUpload';
import moment from 'moment';
import { getPermission, isNumber, numTransform2 } from '@/utils/utils';
import _styles from './styles/Tab17.less';

const DATE_FORMAT = 'YYYY/MM/DD';

const unit = 10000;

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const {authEdit, authExport} = getPermission(90100);

const templateHref = 'https://file.simu800.com/vipfundsRes/examples/ipo/%E6%89%93%E6%96%B0%E6%A8%A1%E5%9D%97%E5%90%84%E7%B1%BB%E6%9D%90%E6%96%99%E6%A8%A1%E6%9D%BF/%E6%A8%A1%E6%9D%BF_%E5%87%BA%E8%B5%84%E6%96%B9%E6%A8%A1%E6%9D%BF/%E9%85%8D%E5%94%AE%E5%AF%B9%E8%B1%A1%E5%87%BA%E8%B5%84%E6%96%B9%E5%9F%BA%E6%9C%AC%E4%BF%A1%E6%81%AF%E8%A1%A8--%E6%8B%9B%E5%95%86%E6%A8%A1%E6%9D%BF.xlsx';

class Tab17 extends PureComponent {
    state = {
        selectedRowKeys: [],
        selectedRows: [],
        pageData: {
            pageNum: 1,
            pageSize: 20
        },
        dataSource: [],
        powerInfo: {},
        productList: [],
        batchUploadFlag: false,
        buildFlag: false,
        baseInfo: {}
    };

    componentDidMount() {
        this.getData();
        // this.getProductList();
        this.getBaseInfo();

    }

    baseInfoFormRef = React.createRef();
    searchFormRef = React.createRef();



    columns = [
        {
            title: '产品名称',
            dataIndex: 'productName',
            width: 200,
            ellipsis: true
            // render: (value, row, index) => {
            //     const obj = {
            //         children: value,
            //         props: {}
            //     };
            //     if (index === 2) {
            //         obj.props.rowSpan = 2;
            //     }
            //     // These two are merged into above cell
            //     if (index === 3) {
            //         obj.props.rowSpan = 0;
            //     }
            //     if (index === 4) {
            //         obj.props.colSpan = 0;
            //     }
            //     return obj;
            // }
        },
        {
            title: '序号',
            dataIndex: 'sortNo',
            width: 60,
            ellipsis: true
        },
        {
            title: '出资方名称',
            dataIndex: 'lpName',
            width: 200,
            ellipsis: true
        },
        {
            title: '是否为自有资金',
            dataIndex: 'isPrivateMoney',
            width: 130,
            ellipsis: true,
            render: (val) => {
                let txt = '';
                if (val === true) {
                    txt = '是';
                }
                if (val === false) {
                    txt = '否';
                }
                return txt;
            }
        },
        {
            title: '为配售对象的第几层出资方',
            dataIndex: 'level',
            width: 150,
            ellipsis: true
        },
        // {
        //     title: '出资方证件类型',
        //     dataIndex: 'cardType',
        //     width: 180,
        //     ellipsis: true
        // },
        {
            title: '出资方身份证明号码（组织机构代码证号/身份证号）',
            dataIndex: 'cardNumber',
            width: 230,
            ellipsis: true
        },
        {
            title: '出资比例（%）方式一',
            dataIndex: 'ratio',
            width: 150,
            ellipsis: true
        },
        {
            title: '出资比例（%）方式二',
            dataIndex: 'rate',
            width: 150,
            ellipsis: true
        },
        {
            title: '出资金额（万元）',
            dataIndex: 'amount',
            width: 150,
            ellipsis: true,
            render: (val) => numTransform2(val)
        }
    ];



    /**
     * 产品名称list
     */
    getProductList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'productDetails/queryByProductList',
            callback: (res) => {
                if(res.code === 1008) {
                    this.setState({productList: res.data || []});
                }
            }
        });
    };

    // 请求数据
    getData = () => {
        const { dispatch, params } = this.props;
        dispatch({
            type: 'productDetails/lpQuery',
            payload: {
                ...params
            },
            callback: (res) => {
                if (res.code !== 1008) {
                    const warningText = res.message || res.data || '查询失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }else {
                    this.setState({dataSource: res.data || []});
                }
            }
        });
    };


    // 查询配置基本信息
    getBaseInfo = () => {
        const { dispatch, params } = this.props;
        dispatch({
            type: 'productDetails/applySettingFind',
            payload: {
                ...params
            },
            callback: ({ code, data, message }) => {
                if (code === 1008) {
                    // eslint-disable-next-line react/no-direct-mutation-state

                    this.baseInfoFormRef.current.setFieldsValue({
                        ...data,
                        capitalScale: isNumber(data.capitalScale) && data.capitalScale / unit,
                        capitalScaleUpdateTime: data.capitalScaleUpdateTime ? moment(data.capitalScaleUpdateTime) : undefined
                    });

                    if (this.searchFormRef.current) {
                        this.searchFormRef.current.setFieldsValue({
                            ...data,
                            lpUpdateTime: data.lpUpdateTime ? moment(data.lpUpdateTime) : undefined
                        });
                    }

                    this.setState({
                        baseInfo: data || {}
                    });


                } else {
                    const warningText = message || data || '查询失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${code}）`, warningText, 'topRight');
                }
            }
        });
    }


    /**
     * @description 保存
     *
    */
    baseInfoSave = (values) => {
        const { dispatch, params } = this.props;
        const { baseInfo } = this.state;
        dispatch({
            type: 'productDetails/createOrUpdate',
            payload: {
                ...baseInfo,
                ...params,
                ...values,
                capitalScale: values.capitalScale * unit,
                capitalScaleUpdateTime: values.capitalScaleUpdateTime ? moment(values.capitalScaleUpdateTime).valueOf() : undefined
            },
            callback: (res) => {
                if (res.code === 1008) {
                    this.getBaseInfo();
                    openNotification('success', `提示（代码：${res.code}）`, '保存成功！', 'topRight');
                } else {
                    const warningText = res.message || res.data || '保存失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };



    // 保存出资方的信息
    updateLpUpdateInfo = (values) => {
        const { dispatch, params } = this.props;
        dispatch({
            type: 'productDetails/updateLpUpdateInfo',
            payload: {
                ...params,
                ...values,
                lpUpdateTime: values.lpUpdateTime ? moment(values.lpUpdateTime).valueOf() : undefined
            },
            callback: (res) => {
                if (res.code === 1008) {
                    this.getBaseInfo();
                    openNotification('success', `提示（代码：${res.code}）`, '保存成功！', 'topRight');
                } else {
                    const warningText = res.message || res.data || '保存失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    }


    // 重新计算
    lpRecalculate = () => {
        const { dispatch, params } = this.props;
        dispatch({
            type: 'productDetails/lpRecalculate',
            payload: {
                ...params
            },
            callback: (res) => {
                if (res.code === 1008) {
                    this.getBaseInfo();
                    this.setState({
                        dataSource: res.data || []
                    });
                    openNotification('success', `提示（代码：${res.code}）`, '计算成功！', 'topRight');
                } else {
                    const warningText = res.message || res.data || '计算失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });

    }

    resetSearch = () => {
        this.searchFormRef.current.resetFields();
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageNum = 1;
        this.getData();
    };

    // 表格复选框change事件
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRows
        });
    };

    // 删除前提醒
    deletePre = (rowInfo) => {
        Modal.confirm({
            title: '是否删除？',
            icon: <ExclamationCircleOutlined />,
            content: '是否删除不可找回',
            okText: '确认',
            cancelText: '取消',
            onOk: () => this.doDelete(rowInfo)
        });
    }

    // 删除
    doDelete = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'productDetails/deleteConfirmFile',
            payload: {confirmFileIds: id},
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification('success', '提示', '删除成功！', 'topRight');
                    this.setState({selectedRowKeys:[]});
                    this.getData();
                }else {
                    const warningText = res.message || res.data || '删除失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };


    // 批量上传
    batchUpload = () => {
        this.setState({ batchUploadFlag: true });
    };

    /**
     * @description 批量上传成功
     */
    batchUploadSuccess = () => {
        this.closeModal();
        this.getData();
        this.getBaseInfo();
    }
    // 关闭批量上传模态框
    closeModal = () => {
        this.setState({ batchUploadFlag: false });
    };

    /**
     * @description: 表格变化
     */
    _tableChange = (p, e, s) => {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageNum = p.current;
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageSize = p.pageSize;
        this.getData();
    }


    /**
     * @description 上传成功回调
     */
    uploadCallback = ({ code, data }) => {
        console.log(code, data);
        if (code === 1008) {
            this.getBaseInfo();
            this.getData();
            this.setState({ batchUploadFlag: false });
        }
    }



    render() {
        const { dataSource, batchUploadFlag, baseInfo} = this.state;
        const { loading, params, baseSaveLoading, baseInfoLoading, updateLpUpdateInfoLoading, lpRecalculateLoading } = this.props;
        console.log(baseInfo, baseInfoLoading, 'baseInfoLoading');
        return (
            <div className={_styles.tab16Warp}>
                <Card title="打新所需基本信息">
                    <Spin spinning={baseInfoLoading}>
                        <Form
                            ref={this.baseInfoFormRef}
                            onFinish={this.baseInfoSave}
                            layout="vertical"
                        >
                            <Row gutter={[8, 0]}>
                                <Col span={8}>
                                    <Form.Item
                                        label="是否可打新"
                                        name="canApplyNewShare"
                                        rules={[{required: true, message: '请选择'}]}
                                    >
                                        <Select aceholder="请选择"  allowClear>
                                            <Select.Option value={0}>否</Select.Option>
                                            <Select.Option value={1}>是</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="配售对象证券账户号（沪市）"
                                        name="shanghaiStockExchangeAccount"
                                        rules={[{required: true, message: '请输入'}]}
                                    >
                                        <Input placeholder="请输入" allowClear />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="配售对象证券账户号（深市）"
                                        name="shenzhenStockExchangeAccount"
                                        rules={[{required: true, message: '请输入'}]}
                                    >
                                        <Input placeholder="请输入" allowClear />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="配售对象证券业协会备案编号"
                                        name="productSacCode"
                                        rules={[{required: true, message: '请输入'}]}
                                    >
                                        <Input placeholder="请输入" allowClear />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="配售对象名称"
                                        name="productSacName"
                                        rules={[{required: false, message: '请输入'}]}
                                    >
                                        <Input placeholder="请输入" allowClear />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="总资产或资金规模（万元）"
                                        name="capitalScale"
                                        rules={[{required: true, message: '请输入'}]}
                                    >
                                        <InputNumber style={{ width: 200 }} precision={5} min={0}/>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="总资产或资金规模更新时间"
                                        name="capitalScaleUpdateTime"
                                        rules={[{required: true, message: '请选择'}]}
                                    >
                                        <DatePicker/>
                                    </Form.Item>
                                </Col>
                                <Col offset={16} span={8} style={{ textAlign: 'right', marginTop: 30 }}>
                                    {
                                        this.props.authEdit &&
                                        <Form.Item>
                                            <Button loading={baseSaveLoading} type="primary" htmlType="submit" style={{ marginRight: 8 }}>保存</Button>
                                        </Form.Item>
                                    }

                                </Col>
                            </Row>
                        </Form>
                    </Spin>
                </Card>

                {
                    baseInfo && baseInfo.applySettingId &&
                    <Card title="出资方基本信息表">
                        <Form
                            ref={this.searchFormRef}
                            onFinish={this.updateLpUpdateInfo}
                            initialValues={{
                                lpUpdateMode: baseInfo.lpUpdateMode,
                                lpUpdateTime: baseInfo.lpUpdateTime && moment(baseInfo.lpUpdateTime)
                            }}
                        >
                            <Row gutter={[8, 0]}>
                                <Col span={8}>
                                    <Form.Item
                                        label="更新选项"
                                        name="lpUpdateMode"
                                        extra="选择自动的，每次导出文件时，将自动计算一遍"
                                        rules={[{required: true, message: '请选择'}]}
                                    >
                                        <Radio.Group>
                                            <Radio value={0}>手动</Radio>
                                            <Radio value={1}>自动：根据交易记录自动变更1层出资方</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="更新日期" name="lpUpdateTime">
                                        <DatePicker disabled showTime/>
                                    </Form.Item>
                                </Col>
                                <Col span={8} style={{ textAlign: 'right' }}>
                                    {
                                        this.props.authEdit &&
                                            <Button loading={updateLpUpdateInfoLoading} type="primary" htmlType="submit" style={{ marginRight: 8 }}>保存</Button>
                                    }
                                </Col>
                            </Row>
                        </Form>
                        <Row style={{marginBottom: 15}}>
                            <Space>
                                {this.props.authEdit &&
                                    <Button type="primary" onClick={this.batchUpload}>上传出资方信息表</Button>
                                }
                                {
                                    this.props.authEdit &&
                                    <Button loading={lpRecalculateLoading} onClick={this.lpRecalculate}>重新计算一层出资方出资比例</Button>
                                }
                            </Space>
                        </Row>
                        <Table
                            loading={loading}
                            // rowSelection={rowSelection}
                            columns={this.columns}
                            dataSource={dataSource || []}
                            rowKey={(record, index) => index}
                            scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
                            sticky
                        />
                    </Card>
                }
                {
                    batchUploadFlag &&
                    <BatchUpload
                        params={params}
                        url="/stagging/lp/upload"
                        templateUrl={<a target="_blank" href={templateHref}>模板下载</a>}
                        modalFlag={batchUploadFlag}
                        callback={this.uploadCallback}
                        closeModal={this.closeModal}
                    />
                }

            </div>
        );
    }

}

export default connect(({ loading }) => ({
    loading: loading.effects['productDetails/getListData'],
    baseSaveLoading: loading.effects['productDetails/createOrUpdate'],
    baseInfoLoading: loading.effects['productDetails/applySettingFind'],
    updateLpUpdateInfoLoading: loading.effects['productDetails/updateLpUpdateInfo'],
    lpRecalculateLoading: loading.effects['productDetails/lpRecalculate']
}))(Tab17);


Tab17.defaultProps = {
    params: {}
};
