/*
 * @description: 份额列表
 * @Author: tangsc
 * @Date: 2020-10-30 11:26:34
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
    Menu,
    Dropdown,
    Statistic,
    notification,
    Modal,
    Space,
    Checkbox,
    Tooltip,
    message
} from 'antd';
import {
    XWcustomerCategoryOptions,
    XWSourceType,
    XWDividendType,
    CUSTOMERSHARETYPE,
    CHANNELTYPE
} from '@/utils/publicData';
import { PlusOutlined, ExclamationCircleOutlined, DownOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import BatchUpload from '@/pages/components/batchUpload';
import styles from './index.less';
import moment from 'moment';
import { getCookie, getRandomKey, numTransform2, fileExport } from '@/utils/utils';
import MXShareDetails from '@/pages/components/MXShare/Details';
import { MultipleSelect, CustomRangePicker } from '@/pages/components/Customize';
import MXTable from '@/pages/components/MXTable';
import ManagedData from '@/pages/components/Transaction/ManagedData';
import { updateStatusApi } from './service';
import lodash from 'lodash';
const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;

// 设置日期格式
const dateFormat = 'YYYY/MM/DD';

// 提示信息
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const formItemLayout = {
    labelCol: {
        xs: { span: 8 },
        sm: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 }
    }
};

@connect(({ shareList, loading }) => ({
    shareList,
    loading: loading.effects['shareList/queryShare']
}))
class ShareList extends PureComponent {
    state = {
        selectedRowKeys: [], // 选中table行的key值
        pageData: {
            // 当前的分页数据
            current: 1,
            pageSize: 20
        },
        noRiskRate: 0, // 设置无风险利率
        searchParams: {}, // 查询参数
        batchUploadModalFlag: false, // 控制批量上传modal显示隐藏
        sortFiled: '', // 排序字段
        sortType: '', // 排序类型：asc-升序；desc-降序
        isModalVisible: false, // 控制新增净值弹窗显示隐藏
        isAddOrEdit: 'add', // 判断新增或者编辑
        shareRecordId: 0, // 份额id
        shareInfo: [], // 份额数据列-查询返回全部信息（包括page、total等）
        shareInfoList: [], // 份额数据列表
        productList: [], // 产品列表
        customerId: '', // 客户id
        modelAndManagedData: false,
        isDistinguishProduct: true,
        accountManagerList: [],    //客户经理
        channelList: []   //渠道列表
    };

    componentDidMount() {
        const { params } = this.props;
        // if (this.formRef.current && !params) {
        // this.formRef.current.setFieldsValue({ shareType: 1 });
        // eslint-disable-next-line react/no-direct-mutation-state
        // this.state.searchParams.shareType = 1;
        // }
        this._search();
        // 列设置
        this._setColums();
        // 查询产品列表
        this._getProductList();
        this.getAccountManagerList();
    }
    RefreshPage = () => {
        this._search();
        // 列设置
        this._setColums();
        // 查询产品列表
        this._getProductList();
    };

    /**
     *
     * @param {*} e 复选框选择状态
     * @param {*} record 操作的数据信息
     */
    saveUpdateStatus = async (e, record) => {
        // 将选中的shareRecordId 和选中状态传给后端
        const updateStatus = e.target.checked ? 0 : 1;  // 0更新中 1更新完成
        const shareRecordIds = [record.shareRecordId];
        let formData = new FormData();
        formData.append('updateStatus', updateStatus);
        formData.append('shareRecordIds', shareRecordIds);
        try {
            const res = await updateStatusApi(formData);
            if(res.code === 1008){
                openNotification(
                    'success',
                    '修改成功',
                );
            }else{
                openNotification('error', res.message);
                this.RefreshPage()
            }

        } catch (error) {
            console.log(error);
        }
    }
    saveUpdateStatus_debounce = lodash.throttle(this.saveUpdateStatus, 500)
    // 表单实例对象
    formRef = React.createRef();

    // Table的列
    columns = [
        // {
        //     title: '客户名称',
        //     dataIndex: 'customerName',
        //     fixed: 'left',
        //     width: 100,
        //     render: (val, record) => <span className="details" onClick={() => this._handleEdit(record)}>{val || '--'}</span>
        // },
        // {
        //     title: '客户类型',
        //     dataIndex: 'customerType',
        //     width: 100,
        //     render: (val) => {
        //         let obj = XWcustomerCategoryOptions.find((item) => {
        //             return item.value === val;
        //         });
        //         return (obj && obj.label) || '--';
        //     }
        // },
        {
            title: '证件号码',
            dataIndex: 'cardNumber',
            width: 120,
            render: (val) => val || '--'
        },
        {
            title: '产品名称',
            dataIndex: 'productName',
            width: 120,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '交易账号',
            dataIndex: 'tradeAccount',
            width: 100,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '份额更新日期',
            dataIndex: 'shareDate',
            width: 120,
            sorter: true,
            render: (val) => <span>{(val && moment(val).format(dateFormat)) || '--'}</span>
        },
        {
            title: '最新份额',
            dataIndex: 'tradeShare',
            width: 120,
            sorter: true,
            render: (val) => val
        },
        {
            title: '可用份额',
            dataIndex: 'usableShare',
            width: 150,
            sorter: true,
            render: (val) => val
        },
        {
            title: '分红方式',
            dataIndex: 'dividendType',
            width: 100,
            render: (val) => {
                let obj = XWDividendType.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '数据来源',
            dataIndex: 'sourceType',
            width: 120,
            render: (val) => {
                let obj = XWSourceType.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {

            title: <span>数据是否更新中<Tooltip placement="top" title={'勾选以后则单客户单产品下的最新份额，单产品市值成本收益展示为更新中，同时总的市值成本收益也展示为更新中，手动取消勾选，则展示拉取到的最新数据'}>
                <QuestionCircleOutlined style={{ cursor: 'pointer' }} />
            </Tooltip></span>,
            dataIndex: 'updateStatus',
            width: 120,
            render: (val = false, record) => {
                // 0 更新中
                return <Checkbox onChange={(e) => this.saveUpdateStatus_debounce(e, record)} defaultChecked={!val} />;
            }
        },
        {
            title: '操作',
            dataIndex: 'age',
            // fixed: 'right',
            width: 100,
            render: (text, record) => {
                // eslint-disable-next-line no-undef
                const { authEdit } =
                    (sessionStorage.getItem('PERMISSION') &&
                        JSON.parse(sessionStorage.getItem('PERMISSION'))['10109']) ||
                    {};
                return (
                    <div>
                        {this.props.authEdit && (
                            <Space>
                                <span className="details" onClick={() => this._handleEdit(record)}>
                                    编辑{' '}
                                </span>
                                <span
                                    className="details"
                                    onClick={() => this._handleDelete(record)}
                                >
                                    删除
                                </span>
                            </Space>
                        )}
                    </div>
                );
            }
        }
    ];

    _setColums = () => {
        const { params } = this.props;
        if (!params) {
            this.columns.unshift({
                title: '客户名称',
                dataIndex: 'customerName',
                width: 100,
                fixed: 'left',
                render: (val, record) =>
                    (
                        <Link to={`/investor/customerInfo/investordetails/${record.customerId}`}>
                            {val}
                        </Link>
                    ) || '--'
                // render: (val, record) => (

                //     <span className="details" onClick={() => this._handleEdit(record)}>
                //         {val || '--'}
                //     </span>
                // )
            });
        }
    };

    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = (values) => {
        // console.log(values)
        // return;
        const { shareDate, updateDate, ...params } = values;
        const tempObj = {};
        // 转换成时间戳
        tempObj.shareDate =
            (shareDate &&
                new Date(`${moment(shareDate).format().split('T')[0]}T00:00:00`).getTime()) ||
            undefined;
        tempObj.startDate = (updateDate && moment(updateDate[0]).valueOf()) || undefined;
        tempObj.endDate = (updateDate && moment(updateDate[1]).valueOf()) || undefined;
        this.setState(
            {
                searchParams: {
                    ...params,
                    ...tempObj
                },
                selectedRowKeys: [],
                pageData: {
                    // 当前的分页数据
                    ...this.state.pageData,
                    current: 1
                    // pageSize: 20
                }
            },

            () => {
                this._search();
            },
        );
    };

    /**
     * @description: 列表查询
     */
    _search = () => {
        const { pageData, sortFiled, sortType, searchParams } = this.state;
        const { dispatch, params } = this.props;
        const tempObj = {};
        if (!!sortType) {
            tempObj.sortFiled = sortFiled;
            tempObj.sortType = sortType;
        }

        dispatch({
            type: 'shareList/queryShare',
            payload: {
                customerId: !!params ? Number(params.customerId) : undefined,
                pageNum: pageData.current || 1,
                pageSize: pageData.pageSize || 20,
                ...tempObj,
                ...searchParams
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        shareInfo: res.data,
                        shareInfoList: res.data.page,
                        customerId: !!params ? Number(params.customerId) : undefined
                    });
                } else {
                    const warningText = res.message || res.data || '查询失败！';
                    openNotification(
                        'warning',
                        `提示（代码：${res.code}）`,
                        warningText,
                        'topRight',
                    );
                    this.setState({
                        shareInfo: [],
                        shareInfoList: []
                    });
                }
            }
        });
    };

    /**
     * @description: 查询所有产品
     * @param {*}
     */
    _getProductList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'shareList/getProductList',
            payload: {},
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        productList: res.data
                    });
                } else {
                    const warningText = res.message || res.data || '查询失败，请稍后再试！';
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
     * @description:重置过滤条件
     */
    _reset = () => {
        this.formRef.current.resetFields();
        this.setState(
            {
                searchParams: {},
                selectedRowKeys: []
            },
            () => {
                this._search();
            },
        );
    };

    /**
     * @description: 份额编辑
     * @param {*}
     */
    _handleEdit = (record) => {
        this.setState({
            isAddOrEdit: 'edit',
            shareRecordId: record.shareRecordId,
            isModalVisible: true
        });
    };

    /**
     * @description: 删除份额
     */
    _handleDelete = (record) => {
        const { dispatch } = this.props;
        const { selectedRowKeys } = this.state;
        const _this = this;
        confirm({
            title: '请您确认是否删除?',
            icon: <ExclamationCircleOutlined />,
            content: '删除后该份额余额信息会全部删除',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'shareList/deleteShare',
                    payload: {
                        shareRecordId: record.shareRecordId
                    },
                    callback: (res) => {
                        if (res.code === 1008) {
                            openNotification('success', '提示', '删除成功', 'topRight');
                            _this._search();
                            let selectArr = selectedRowKeys.filter((item) => {
                                return item !== record.shareRecordId;
                            });
                            _this.setState({
                                selectedRowKeys: selectArr
                            });
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
            },
            onCancel() {
                // console.log('Cancel');
            }
        });
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
     * @description: 新增份额余额信息
     */
    _onAdd = () => {
        this.setState({
            isModalVisible: true,
            isAddOrEdit: 'add'
        });
    };

    /**
     * @description: 关闭新增、编辑弹窗
     * @param {*}
     */
    _handleClose = () => {
        this.setState(
            {
                isModalVisible: false
            },
            () => {
                this._search();
            },
        );
    };

    /**
     * @description: 表格变化
     */
    _tableChange = (p, e, s) => {
        this.setState(
            {
                sortFiled: s.field,
                sortType: !!s.order ? (s.order === 'ascend' ? 'asc' : 'desc') : undefined,
                pageData: {
                    current: p.current,
                    pageSize: p.pageSize
                }
            },
            () => {
                this._search();
            },
        );
    };

    /**
     * @description: 批量上传 打开模态框
     */
    _batchUpload = () => {
        this.setState({ batchUploadModalFlag: true });
    };

    // 批量上传确定按钮回调
    onOk = () => {
        this.setState({ batchUploadModalFlag: true });
    };

    /**
     * @description: 关闭上传模态框
     */
    closeModal = () => {
        this.setState(
            {
                batchUploadModalFlag: false
            },
            () => {
                this._search();
            },
        );
    };

    /**
     * @description: 批量导出
     * @param {*}
     */
    _export = () => {
        const { selectedRowKeys, isDistinguishProduct } = this.state;
        const { params = {} } = this.props;
        if (params.customerId) {
            window.location.href = `${window.location.origin}${BASE_PATH.adminUrl
                }/shareRecord/batchDownload?shareRecordIds=${selectedRowKeys.toString()}&customerId=${params.customerId
                }&tokenId=${getCookie('vipAdminToken')}&isDistinguishProduct=${isDistinguishProduct && 1 || 0}`;
        } else {
            window.location.href = `${window.location.origin}${BASE_PATH.adminUrl
                }/shareRecord/batchDownload?shareRecordIds=${selectedRowKeys.toString()}&tokenId=${getCookie(
                    'vipAdminToken',
                )}&isDistinguishProduct=${isDistinguishProduct && 1 || 0}`;
        }
    };

    /**
     * @description: 导出全部
     * @param {*}
     */
    _downloadAll = () => {
        const { pageData, sortFiled, sortType, searchParams, isDistinguishProduct } = this.state;
        const { params } = this.props;
        const tempObj = {};
        if (!!sortType) {
            tempObj.sortFiled = sortFiled;
            tempObj.sortType = sortType;
        }


        fileExport({
            method: 'post',
            url: '/shareRecord/allExport',
            data: {
                customerId: !!params ? Number(params.customerId) : undefined,
                pageNum: pageData.current || 1,
                pageSize: pageData.pageSize || 20,
                isDistinguishProduct: isDistinguishProduct && 1 || 0,
                ...tempObj,
                ...searchParams
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
    };

    _getManagedData = (val) => {
        this.setState({
            modelAndManagedData: val
        });
    };

    fileonChange = (e) => {
        console.log(e);
        this.setState({
            isDistinguishProduct: e.target.checked
        });
    }

    getAccountManagerList = () => {
        const { dispatch } = this.props;

        // 获取客户列表
        dispatch({
            type: 'INVESTOR_IDENTIFY/selectAllAccountManager',
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        accountManagerList: res.data
                    });
                }
            }
        });
        // 获取渠道列表
        dispatch({
            type: 'global/channelList',
            callback: ({ code, data, message }) => {
                if (code === 1008) {
                    this.setState({
                        channelList: data
                    });
                } else {
                    const txt = message || data || '查询失败';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };

    render() {
        const {
            pageData,
            selectedRowKeys,
            shareInfo,
            shareInfoList,
            productList,
            batchUploadModalFlag,
            isModalVisible,
            shareRecordId,
            isAddOrEdit,
            customerId,
            modelAndManagedData,
            isDistinguishProduct,
            accountManagerList,
            channelList
        } = this.state;
        const { loading, params } = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: this._onSelectChange
        };

        // eslint-disable-next-line no-undef
        const { authEdit, authExport } =
            (sessionStorage.getItem('PERMISSION') &&
                JSON.parse(sessionStorage.getItem('PERMISSION'))['10109']) ||
            {};

        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <Row>
                        <Col span={8}>
                            <Statistic
                                title="最新份额合计"
                                value={shareInfo.totalTradeShare || '--'}
                            />
                        </Col>
                        <Col span={8}>
                            <Statistic
                                title="可用份额合计"
                                value={shareInfo.totalUsableShare || '--'}
                            />
                        </Col>
                    </Row>
                </div>
                {!params && (
                    <div className={styles.filter}>
                        <Form
                            name="basic"
                            onFinish={this._onFinish}
                            ref={this.formRef}
                            {...formItemLayout}
                        >
                            <Row gutter={[8, 0]}>
                                <Col span={20}>
                                    <Row>
                                        <Col span={8}>
                                            <FormItem label="客户名称" name="customerName">
                                                <Input placeholder="请输入" autoComplete="off" />
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <MultipleSelect
                                                params="productIds"
                                                value="productId"
                                                label="productName"
                                                mode="multiple"
                                                formLabel="产品名称"
                                            />
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label="客户类型" name="customerType">
                                                <Select placeholder="请选择" allowClear>
                                                    {XWcustomerCategoryOptions.map((item) => (
                                                        <Option
                                                            key={getRandomKey(6)}
                                                            value={item.value}
                                                        >
                                                            {item.label}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label="证件号码" name="cardNumber">
                                                <Input
                                                    placeholder="请输入"
                                                    autoComplete="off"
                                                    allowClear
                                                />
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label="客户筛选" name="shareType">
                                                <Select placeholder="请选择" allowClear>
                                                    {CUSTOMERSHARETYPE.map((item) => (
                                                        <Option key={item.value} value={item.value}>
                                                            {item.label}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label="客户经理" name="managerUserIds">
                                                <Select placeholder="请选择" mode="multiple" filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                } allowClear
                                                >
                                                    {accountManagerList.map((item, index) => (
                                                        <Option key={index} value={item.managerUserId}>
                                                            {item.userName}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </FormItem>
                                        </Col>

                                        <Col span={8}>
                                            <FormItem label="所属渠道" name="channelIds">
                                                <Select
                                                    allowClear
                                                    placeholder="请选择"
                                                    showSearch
                                                    mode="multiple"
                                                    filterOption={(input, option) =>
                                                        option.children && option.children
                                                            .toLowerCase()
                                                            .indexOf(input.toLowerCase()) >= 0
                                                    }
                                                >
                                                    {
                                                        channelList.map((item, index) => {
                                                            return <Select.Option key={index} value={item.channelId}>{item.channelName}</Select.Option>;
                                                        })
                                                    }
                                                </Select>
                                            </FormItem>
                                        </Col>

                                        <Col span={8}>
                                            <FormItem label="渠道类型" name="channelType">
                                                <Select placeholder="请选择" allowClear>
                                                    {CHANNELTYPE.map((item) => (
                                                        <Option key={item.value} value={item.value}>
                                                            {item.label}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </FormItem>
                                        </Col>

                                        <Col span={8}>
                                            <CustomRangePicker formItemLayout={formItemLayout} assignment={this.formRef} label="更新日期" name="updateDate" />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={4} className={styles.btnGroup}>
                                    <Space>
                                        <Button type="primary" htmlType="submit">
                                            查询
                                        </Button>
                                        <Button onClick={this._reset}>重置</Button>
                                    </Space>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                )}
                <div className={styles.dataTable}>
                    <div className={styles.operationBtn}>
                        <Space>
                            {this.props.authEdit && (
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={this._onAdd}
                                >
                                    新建
                                </Button>
                            )}
                            {this.props.authEdit && (
                                <Button type="primary" onClick={this._batchUpload}>
                                    批量上传
                                </Button>
                            )}
                            {this.props.authExport && (
                                <>
                                    <Dropdown
                                        overlay={
                                            <Menu>
                                                <Menu.Item
                                                    key="1"
                                                    disabled={selectedRowKeys.length === 0}
                                                    onClick={this._export}
                                                >
                                                    导出选中
                                                </Menu.Item>
                                                <Menu.Item key="0" onClick={this._downloadAll}>
                                                    导出全部
                                                </Menu.Item>
                                            </Menu>
                                        }
                                    >
                                        <Button>
                                            &nbsp;&nbsp;批量导出
                                            <DownOutlined />
                                        </Button>
                                    </Dropdown>
                                    <Checkbox checked={isDistinguishProduct} onChange={this.fileonChange}>不同产品单独文件</Checkbox>
                                </>
                            )}
                            {!!params && <Button type="primary" onClick={this.RefreshPage}>刷新页面</Button>}

                            {/*{this.props.authExport && !params && (*/}
                            {/*    <Button onClick={(e) => this._getManagedData(true)} type="link">*/}
                            {/*        读取托管数据*/}
                            {/*    </Button>*/}
                            {/*)}*/}
                        </Space>
                    </div>
                    {/* {!isEmpty(selectedRowKeys) && (
                        <Alert
                            message={
                                <Fragment>
                                    已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                                    <a onClick={this._cleanSelectedKeys} style={{ marginLeft: 24 }}>
                                        清空
                                    </a>
                                </Fragment>
                            }
                            type="info"
                            showIcon
                        />
                    )}
                    <Table
                        loading={loading}
                        rowSelection={rowSelection}
                        columns={this.columns}
                        dataSource={shareInfoList && shareInfoList.list}
                        rowKey={(record) => record.shareRecordId}
                        scroll={{ x: '100%',y:500,scrollToFirstRowOnChange:true }}
                        pagination={paginationPropsback(
                            shareInfoList && shareInfoList.total,
                            pageData.current
                        )}
                        onChange={(p, e, s) => this._tableChange(p, e, s)}
                    /> */}
                    <MXTable
                        loading={loading}
                        columns={this.columns}
                        dataSource={shareInfoList && shareInfoList.list}
                        total={shareInfoList && shareInfoList.total}
                        pageNum={pageData.current}
                        rowKey={(record) => record.shareRecordId}
                        onChange={(p, e, s) => this._tableChange(p, e, s)}
                        rowSelection={rowSelection}
                        scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
                    />
                </div>
                {batchUploadModalFlag && (
                    <BatchUpload
                        modalFlag={batchUploadModalFlag}
                        closeModal={this.closeModal}
                        templateMsg="份额模板下载"
                        templateUrl={`/shareRecord/downloadTemplate?tokenId=${getCookie(
                            'vipAdminToken',
                        )}`}
                        params={params}
                        onOk={this.closeModal}
                        url="/shareRecord/batchUpload"
                    />
                )}
                {isModalVisible && (
                    <MXShareDetails
                        modalVisible={isModalVisible}
                        onCancel={this._handleClose}
                        shareRecordId={shareRecordId}
                        type={isAddOrEdit}
                        saveCustomerId={customerId}
                        authEdit={this.props.authEdit}
                        authExport={this.props.authExport}
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
                        type="hosting"
                    />
                </Modal>
            </div>
        );
    }
}
export default ShareList;
