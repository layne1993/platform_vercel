/*
 * @description: 产品分红-列表
 * @Author: tangsc
 * @Date: 2020-10-29 18:02:27
 */
import React, { PureComponent } from 'react';
import { connect, Link } from 'umi';
import {
    Button,
    Row,
    Col,
    Form,
    Select,
    Input,
    Dropdown,
    Menu,
    Statistic,
    DatePicker,
    Modal,
    Space,
    notification} from 'antd';
import {
    XWDividendType,
    XWSourceType,
    XWCurrency
} from '@/utils/publicData';
import {
    DownOutlined,
    PlusOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import BatchUpload from '@/pages/components/batchUpload';
import MXTable from '@/pages/components/MXTable';
import Detail from './../../detail/index';
import { listToMap, getCookie, fileExport, numTransform2 } from '@/utils/utils';
import { FORM_CUSTOMER, FORM_ALL, FORM_PRODUCT } from './../../data';
import styles from './index.less';
import moment from 'moment';
import ManagedData from '@/pages/components/Transaction/ManagedData';
import { MultipleSelect } from '@/pages/components/Customize';


const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;

// 设置日期格式
const dateFormat = 'YYYY/MM/DD';

// 设置币种对应
const currencyTransform = {
    '人民币': 'CNY',
    '美元': 'USD',
    '港币': 'HKD'
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

class DividendsList extends PureComponent {
    state = {
        selectedRowKeys: [], // 选中table行的key值
        pageData: {
            // 当前的分页数据
            pageNum: 1,
            pageSize: 20
        },
        statistics: {},
        batchUploadModalFlag: false,
        dataSource: [],
        formData: FORM_ALL,
        detailFlag: false,
        detailInfo: {},
        productList: [],
        modelAndManagedData: false,
        currency: '人民币'
    };

    componentDidMount() {
        const {information, dispatch} = this.props;

        dispatch({
            type: 'global/queryByProductName',
            callback: (res) => {
                if (res.code === 1008) {
                    this.setState({
                        productList:res.data
                    });


                    if(information &&  this.formRef.current){
                        let currency = '';
                        res.data.map((item)=>{
                            if(item.productId === information.productId){
                                currency=item.currency;
                            }
                        });
                        this.formRef.current.setFieldsValue({
                            confirmDate:information.confirmDate && moment(information.confirmDate),
                            productIdList:[information.productId],
                            currency:currency || '人民币',
                            dividendType:information.dividendType
                        });
                    }
                }
                this.getDividendsList();
            }
        });


        this.getDividendStatistics();
        this.getFrom();
        // this.getproductList();
        this._setColums();
    }

    /**
     * 哪里调用这个组件
     */
    getFrom = () => {
        const { params } = this.props;
        if (params.productId) {
            this.setState({ formData: FORM_PRODUCT });
        }

        if (params.customerId) {
            this.setState({ formData: FORM_CUSTOMER });
        }
    };

    // 表单实例对象
    formRef = React.createRef();

    // Table的列
    columns = [
        // {
        //     title: '产品名称',
        //     dataIndex: 'productName',
        //     width: 150
        // },

        {
            title: '证件号码',
            dataIndex: 'cardNumber',
            width: 120,
            render: (val) => val || '--'
        },
        {
            title: '分红类型',
            dataIndex: 'dividendType',
            width: 80,
            render: (val) => listToMap(XWDividendType)[val]
        },
        {
            title: '币种',
            dataIndex: 'currency',
            width: 80,
            align: 'center'
        },
        {
            title: '分红登记日',
            dataIndex: 'registerDate',
            width: 100,
            render: (val) => <span>{(val && moment(val).format(dateFormat)) || '--'}</span>
        },
        {
            title: '分红确认日',
            dataIndex: 'confirmDate',
            width: 100,
            render: (val) => <span>{(val && moment(val).format(dateFormat)) || '--'}</span>
        },
        {
            title: '实发现金',
            dataIndex: 'actualMoney',
            width: 120,
            render: (val) => numTransform2(val)
        },
        {
            title: '红利总金额',
            dataIndex: 'tradeMoney',
            width: 120,
            render: (val) => numTransform2(val)
        },
        {
            title: '再投资金额',
            dataIndex: 'secondMoney',
            width: 120,
            render: (val) => numTransform2(val)
        },
        {
            title: '再投资份额',
            dataIndex: 'secondShare',
            width: 120,
            render: (val) => numTransform2(val)
        },
        {
            title: '再投资净值',
            dataIndex: 'secondNetValue',
            width: 90
        },
        {
            title: '再投资费用',
            dataIndex: 'secondFee',
            width: 120,
            render: (val) => numTransform2(val)
        },
        {
            title: '分红总份额',
            dataIndex: 'tradeShare',
            width: 120,
            render: (val) => numTransform2(val)
        },
        {
            title: '交易账户',
            dataIndex: 'fundAcco',
            width: 120
        },
        {
            title: '业绩提成',
            dataIndex: 'pushMoney',
            width: 100,
            render: (val) => numTransform2(val)
        },
        {
            title: '数据来源',
            dataIndex: 'sourceType',
            width: 80,
            render: (val) => {
                let obj = XWSourceType.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '操作',
            // fixed: 'right',
            width: 100,
            render: (record) => {
                return (
                    this.props.authEdit && (
                        <Space>
                            <span
                                className="details"
                                onClick={() => this.getDividendsDetail(record)}
                            >
                                编辑{' '}
                            </span>
                            <a onClick={() => this.deletePre([record.dividendRecordId])}>删除</a>
                        </Space>
                    )
                );
            }
        }
    ];

    /**
     * @description: 设置表头列
     * @param {*}
     */
    _setColums = () => {
        const { params = {} } = this.props;


        if (!params.customerId) {
            this.columns.unshift({
                title: '客户名称',
                dataIndex: 'customerName',
                fixed: 'left',
                width: 80,
                render: (val, record) => <Link to={`/investor/customerInfo/investordetails/${record.customerId}`}>{val}</Link> || '--'
            });
        }
        if (!params.productId) {
            this.columns.unshift({
                title: '产品名称',
                dataIndex: 'productName',
                width: 150,
                fixed: 'left',
                render: (val, record) => <Link to={`/product/list/details/${record.productId}`}>{val}</Link> || '--'
            });
        }else{
            this.columns.unshift(
                {
                    title: '份额类别',
                    dataIndex: 'parentProductId',
                    width: 100,
                    fixed: 'left',
                    render: (val, record) => <div style={{width:80}}>{val && record.productName || '--'}</div>
                }
            );
        }

    };


    /**
     * @description 获取顶部统计
     */
    getDividendStatistics = () => {
        const { dispatch, params } = this.props;
        const formData = this.formRef.current.getFieldsValue();
        dispatch({
            type: 'DIVIDENDS_LIST/dividendStatistics',
            payload: { ...params, ...formData },
            callback: (res) => {
                if (res.code === 1008) {
                    let data = res.data || {};
                    this.setState({ statistics: data });
                } else {
                    openNotification(
                        'warning',
                        `提示（代码：${res.code}）`,
                        `${res.message || '获取顶部统计失败！'}`,
                        'topRight',
                    );
                }
            }
        });
    };

    /**
     * 获取类别数据
     */
    getDividendsList = () => {
        const { dispatch, params } = this.props;
        const formData = this.formRef.current.getFieldsValue();
        const { pageData } = this.state;
        dispatch({
            type: 'DIVIDENDS_LIST/getDividendsList',
            payload: {
                ...params,
                ...formData,
                registerDate: formData.registerDate && moment(formData.registerDate).valueOf(),
                confirmDate: formData.confirmDate && moment(formData.confirmDate).valueOf(),
                ...pageData
            },
            callback: (res) => {
                if (res.code === 1008) {
                    const { list } = res.data || {};
                    this.setState({
                        dataSource: res.data || {}
                    });
                    // 当在产品列表时显示当前产品默认币种
                    if (!!params.productId) {
                        this.setState({
                            currency: list[0]?.currency || ''
                        });
                    }
                } else {
                    const warningText = res.message || res.data || '查询失败！';
                    openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                }
            }
        });
    };

    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = (values) => {
        const { currency } = values;
        this.state.pageData.pageNum = 1;
        this.state.pageData.pageSize = 20;
        this.setState({ currency }, this.getDividendsList());
        this.getDividendStatistics();
    };

    /**
     * @description:重置过滤条件
     */
    _reset = () => {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageNum = 1;
        this.formRef.current.resetFields();
        this.getDividendsList();
        this.getDividendStatistics();
    };

    /**
     * @description: Table的CheckBox change事件
     * @param {Array} selectedRowKeys
     */
    _onSelectChange = (selectedRowKeys) => {
        this.setState({
            selectedRowKeys
        });
    };

    /**
     * @description: 清空已勾选
     */
    _cleanSelectedKeys = () => {
        this.setState({
            selectedRowKeys: []
        });
    };

    /**
     * @description: 新增客户（路由跳转）
     */
    _onAdd = () => {
        this.setState({ detailFlag: true });
    };

    /**
     * @description: 表格变化
     */
    _tableChange = (p, e, s) => {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageNum = p.current;
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageSize = p.pageSize;
        this.getDividendsList();
        this.getDividendStatistics();
    };

    /**
     * 获取详情
     */
    getDividendsDetail = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'DIVIDENDS_LIST/dividendsDetail',
            payload: { dividendId: record.dividendRecordId },
            callback: (res) => {
                if (res.code === 1008) {
                    let data = res.data || {};
                    this.setState({ detailInfo: data });
                    this.openDetailModal();
                } else {
                    openNotification(
                        'warning',
                        `提示（代码：${res.code}）`,
                        `${res.message || '获取详情失败！'}`,
                        'topRight',
                    );
                }
            }
        });
    };

    /**
     * @description 禁用启用前提示
     */
    deletePre = (ids) => {
        Modal.confirm({
            title: '是否删除分红数据',
            icon: <ExclamationCircleOutlined />,
            content: '确定删除？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => this._handleDelete(ids)
        });
    }

    /**
     * @description: 删除
     */
    _handleDelete = (ids) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'DIVIDENDS_LIST/deleteDividends',
            payload: { dividendId: ids },
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification('success', '删除', '删除成功', 'topRight');
                    this.getDividendsList();
                    this.getDividendStatistics();
                } else {
                    const warningText = res.message || res.data || '删除失败！';
                    openNotification(
                        'warning',
                        `提示（代码：${res.code}）`,
                        warningText,
                        'topRight',
                    );
                }
            }
        });
    };

    /**
     * @description: 批量上传 打开模态框
     */
    _batchUpload = () => {
        this.setState({ batchUploadModalFlag: true });
    };

    /**
     * @description 批量下载
     */
    _batchDownload = () => {
        const { selectedRowKeys } = this.state;
        const { params = {} } = this.props;
        let ids = selectedRowKeys.join(',');
        if (params.productId) {
            window.location.href = `${BASE_PATH.adminUrl}${'/dividend/export'}?&productId=${params.productId
            }&dividendRecordIds=${ids}&tokenId=${getCookie('vipAdminToken')}`;
        } else {
            window.location.href = `${BASE_PATH.adminUrl
            }${'/dividend/export'}?&dividendRecordIds=${ids}&tokenId=${getCookie(
                'vipAdminToken',
            )}`;
        }
        if (params.customerId) {
            window.location.href = `${BASE_PATH.adminUrl
            }${'/dividend/export'}?dividendRecordIds=${ids}&tokenId=${getCookie(
                'vipAdminToken',
            )}&customerId=${params.customerId}`;
        } else {
            window.location.href = `${BASE_PATH.adminUrl
            }${'/dividend/export'}?dividendRecordIds=${ids}&tokenId=${getCookie('vipAdminToken')}`;
        }
    };

    // 导出全部
    _downloadAll = () => {
        const { params } = this.props;
        const formData = this.formRef.current.getFieldsValue();
        const { pageData } = this.state;

        fileExport({
            method: 'post',
            url: '/dividend/allExport',
            data: {
                ...params,
                ...formData,
                registerDate: formData.registerDate && moment(formData.registerDate).valueOf(),
                confirmDate: formData.confirmDate && moment(formData.confirmDate).valueOf(),
                ...pageData
            },
            callback: ({ status }) => {
                if (status === 'success') {
                    openNotification('success', '提醒', '导出成功');
                }
                if (status === 'error') {
                    openNotification('error', '提醒', '导出失败！');
                }
            }
        });
    }
    /**
     * @description 打开详情模态框
     */
    openDetailModal = () => {
        this.setState({ detailFlag: true });
    };

    /**
     * 关闭详情模态框
     */
    closeDetailModal = () => {
        this.setState({ detailFlag: false, detailInfo: {} });
        this.getDividendsList();
        this.getDividendStatistics();
    };

    /**
     * @description: 关闭上传模态框
     */
    closeModal = () => {
        this.setState({ batchUploadModalFlag: false });
    };

    /**
     * 批量上传回调
     */
    onOk = () => {
        this.getDividendsList();
        this.getDividendStatistics();
        this.closeModal();
    };

    _getManagedData = (val) => {
        this.setState({
            modelAndManagedData: val
        });
    };

    setUp = (value)=>{
        const{productList} = this.state;
        const changeArr = [];
        if(value){
            productList.map((item)=>{
                Array.isArray(value) && value.map((itemT)=>{
                    item.productId === itemT && changeArr.push(item.currency);
                });
            });
        }
        if (changeArr.length > 0) {
            changeArr.some( (value, index)=> {
                if(value !== changeArr[0]){
                    this.formRef.current.setFieldsValue({
                        currency:undefined
                    });
                }else{
                    this.formRef.current.setFieldsValue({
                        currency:changeArr[0]
                    });
                }
            });
        } else {
            this.formRef.current.setFieldsValue({
                currency:changeArr[0]
            });
        }
    }

    render() {
        const {
            pageData,
            selectedRowKeys,
            batchUploadModalFlag,
            dataSource,
            formData,
            detailFlag,
            detailInfo,
            statistics,
            modelAndManagedData,
            currency
        } = this.state;
        const { loading, params } = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: this._onSelectChange
        };

        return (
            <div className={styles.container}>

                {
                    (params.productId || currency) && (
                        <div className={styles.header}>
                            <Row gutter={[8, 10]}>
                                {!params.productId && (
                                    <Col span={6}>
                                        <Statistic
                                            title="产品数量"
                                            value={statistics.productStatistic || '--'}
                                        />
                                    </Col>
                                )}

                                {!params.customerId && (
                                    <Col span={6}>
                                        <Statistic
                                            title="客户数量"
                                            value={statistics.customerStatistic || '--'}
                                        />
                                    </Col>
                                )}

                                <Col span={6}>
                                    <Statistic
                                        title="分红总份额(份)"
                                        value={statistics.tradeShareStatistic || '--'}
                                    />
                                </Col>
                                <Col span={6}>
                                    <Statistic
                                        title={currency ? `红利总金额(${currencyTransform[currency]})` : '红利总金额'}
                                        value={statistics.tradeMoneyStatistic || '--'}
                                    />
                                </Col>
                                <Col span={6}>
                                    <Statistic
                                        title={currency ? `实发现金(${currencyTransform[currency]})` : '实发现金'}
                                        value={statistics.actualMoneyStatistic || '--'}
                                    />
                                </Col>
                                <Col span={6}>
                                    <Statistic
                                        title={currency ? `再投资金额(${currencyTransform[currency]})` : '再投资金额'}
                                        value={statistics.secondMoneyStatistic || '--'}
                                    />
                                </Col>
                                <Col span={6}>
                                    <Statistic
                                        title="再投资份额(份)"
                                        value={statistics.secondShareStatistic || '--'}
                                    />
                                </Col>

                                <Col span={6}>
                                    <Statistic
                                        title={currency ? `业绩计提(${currencyTransform[currency]})` : '业绩计提'}
                                        value={statistics.pushMoneyStatistic || '--'}
                                    />
                                </Col>

                            </Row>
                        </div>
                    )
                }

                <div className={styles.filter}>
                    <Form
                        name="basic"
                        onFinish={this._onFinish}
                        ref={this.formRef}
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 14 }}
                        autoComplete="off"
                    >
                        <Row gutter={[8, 0]}>
                            <Col span={20}>
                                <Row>
                                    <Col span={8}>
                                        <FormItem label="分红类型" name="dividendType">
                                            <Select placeholder="请选择" allowClear>
                                                {XWDividendType.map((item, index) => {
                                                    return (
                                                        <Option key={index} value={item.value}>
                                                            {item.label}
                                                        </Option>
                                                    );
                                                })}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    {!params.customerId && (
                                        <Col span={8}>
                                            <MultipleSelect
                                                params="customerId"
                                                value="customerId"
                                                label="customerName"
                                                type={2}
                                                formLabel="客户名称"
                                            />
                                            {/* <FormItem label="客户名称" name="customerName">
                                                <Input placeholder="请输入客户名称" allowClear />
                                            </FormItem> */}
                                        </Col>
                                    )}

                                    {!params.productId && (
                                        <Col span={8}>
                                            <MultipleSelect
                                                params="productIdList"
                                                value="productId"
                                                label="productName"
                                                mode="multiple"
                                                formLabel="产品名称"
                                                setUp={this.setUp}
                                            />
                                        </Col>
                                    )}

                                    <Col span={8}>
                                        <FormItem label="分红登记日" name="registerDate">
                                            <DatePicker style={{width:'100%'}}/>
                                        </FormItem>
                                    </Col>

                                    <Col span={8}>
                                        <FormItem label="分红确认日" name="confirmDate">
                                            <DatePicker style={{width:'100%'}}/>
                                        </FormItem>
                                    </Col>

                                    {params.customerId && (
                                        <Col span={8}>
                                            <FormItem label="再投资日" name="againDate">
                                                <DatePicker style={{width:'100%'}}/>
                                            </FormItem>
                                        </Col>
                                    )}

                                    {
                                        !params.productId && (
                                            <Col span={8}>
                                                <FormItem label="币种" name="currency" initialValue="人民币">
                                                    <Select placeholder="请选择" allowClear>
                                                        {XWCurrency.map((item, index) => {
                                                            return (
                                                                <Option key={index} value={item.value}>
                                                                    {item.label}
                                                                </Option>
                                                            );
                                                        })}
                                                    </Select>
                                                </FormItem>
                                            </Col>
                                        )
                                    }

                                    {!params.customerId && (
                                        <Col span={8}>
                                            <FormItem label="证件号码" name="cardNumber">
                                                <Input placeholder="请输入" autoComplete="off"  allowClear/>
                                            </FormItem>
                                        </Col>
                                    )}

                                </Row>
                            </Col>

                            <Col span={4} className={styles.btnGroup}>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                                <Button onClick={this._reset}>重置</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className={styles.dataTable}>
                    <div className={styles.operationBtn}>
                        <Space>
                            {this.props.authEdit && (
                                <Button type="primary" icon={<PlusOutlined />} onClick={this._onAdd}>
                                    新建
                                </Button>
                            )}
                            {this.props.authEdit && (
                                <Button type="primary" onClick={this._batchUpload}>
                                    批量上传
                                </Button>
                            )}
                            {this.props.authExport && (
                                <Dropdown
                                    overlay={<Menu>
                                        <Menu.Item
                                            key="1"
                                            disabled={selectedRowKeys.length === 0}
                                            onClick={this._batchDownload}
                                        >
                                            导出选中
                                        </Menu.Item>
                                        <Menu.Item
                                            key="0"
                                            onClick={this._downloadAll}
                                        >
                                            导出全部
                                        </Menu.Item>
                                    </Menu>}
                                >
                                    <Button >
                                        &nbsp;&nbsp;批量导出
                                        <DownOutlined />
                                    </Button>
                                </Dropdown>
                            )}
                            {
                                this.props.authEdit &&
                                 <Button
                                     disabled={selectedRowKeys.length === 0}
                                     onClick={()=>this.deletePre(selectedRowKeys)}
                                 >
                                批量删除
                                 </Button>
                            }
                            {this.props.authExport && !params.customerId && !params.productId && (
                                <Button onClick={(e) => this._getManagedData(true)} type="link">
                                    读取托管数据
                                </Button>
                            )}
                        </Space>
                    </div>
                    <MXTable
                        loading={loading}
                        rowSelection={rowSelection}
                        columns={this.columns}
                        dataSource={dataSource.list}
                        rowKey="dividendRecordId"
                        scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
                        sticky
                        total={dataSource.total}
                        pageNum={pageData.pageNum}
                        onChange={this._tableChange}
                    />
                </div>
                {batchUploadModalFlag && (
                    <BatchUpload
                        modalFlag={batchUploadModalFlag}
                        url="/dividend/import"
                        closeModal={this.closeModal}
                        onOk={this.onOk}
                        params={params}
                        accept=".xls,.xlsx"
                        templateUrl={`/dividend/import/template?tokenId=${getCookie(
                            'vipAdminToken',
                        )}`}
                    />
                )}

                {detailFlag && (
                    <Detail
                        modalFlag={detailFlag}
                        closeModal={this.closeDetailModal}
                        params={params}
                        data={detailInfo}
                    />
                )}
                <Modal
                    visible={modelAndManagedData}
                    footer={null}
                    title={'读取托管数据'}
                    maskClosable={false}
                    destroyOnClose
                    onCancel={(e) => this._getManagedData(false)}
                >
                    <ManagedData
                        changeModal={this._getManagedData}
                        updateTable={this._reset}
                        type="dividendRecord"
                    />
                </Modal>

            </div>
        );
    }
}
export default connect(({ DIVIDENDS_LIST, loading }) => ({
    DIVIDENDS_LIST,
    loading: loading.effects['DIVIDENDS_LIST/getDividendsList']
}))(DividendsList);

DividendsList.defaultProps = {
    params: {}
};
