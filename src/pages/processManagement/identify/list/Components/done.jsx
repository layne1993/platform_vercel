import { Alert, Button, Input, Form, Card, Row, Col, Table, notification, Select, Space, message, Dropdown, Menu, Modal } from 'antd';
import { connect, Link, history } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { getCookie, getPermission, fileExport } from '@/utils/utils';
import {
    XWnumriskLevel,
    XWcustomerCategoryOptions,
    paginationPropsback,
    XWInvestorsType,
    XWAuditStatus,
    ORGIN_FROM,
    XWIdentification
} from '@/utils/publicData';
import MXTable from '@/pages/components/MXTable';
import { MultipleSelect } from '@/pages/components/Customize';
import BatchDownload from './batchDownload';
import styles from '../style.less';
import { isEmpty } from 'lodash';

const FormItem = Form.Item;

const { Option } = Select;

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

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const DATE_FORMAT = 'YYYY/MM/DD HH:mm';

// 完成状态
const DONE = [
    { value: 2, label: '审核失败' },
    { value: 1, label: '审核通过' }
];


class Done extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        selectedRowKeys: [],
        accountManagerList: [], // 客户经理
        selectedRow: [],
        pageData: {
            pageNum: 1,
            pageSize: 20
        },
        datasources: {
            data: [],
            page: {}
        },
        downloadFlag: false,
        // 材料导出选中，2材料导出全部
        isAll: 1
    };


    componentDidMount() {

        this.getListData();
        this.getAccountManagerList();

    }

    //废除提示
    abolishPre = (record) => {
        // 废除
        const doAbolish = (id) => {
            const { dispatch } = this.props;
            dispatch({
                type: 'INVESTOR_IDENTIFY/deleteIdentifyFlow',
                payload: id,
                callback: (res) => {
                    if (res.code === 1008) {
                        openNotification('success', '提示', '废除成功', 'topRight');
                        this.getListData();
                    } else {
                        const warningText = res.message || res.data || '废除失败！';
                        openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                    }
                }
            });
        };
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: '请您确认是否废除此条合格投资者认证流程一旦废除，该流程不可修改',
            onOk() {
                doAbolish(record.identifyFlowId);
            }
        });
    }

    columns = [
        {
            title: '客户名称',
            dataIndex: 'customerName',
            fixed: 'left',
            render: (val) => <span>{val || '--'}</span>,
            width: 100
            // ellipsis: true
        },
        {
            title: '证件号码',
            dataIndex: 'cardNumber',
            width: 120,
            render: (val) => val || '--'
        },
        {
            title: '客户类别',
            dataIndex: 'customerType',
            render: (val) =>
                (val && XWcustomerCategoryOptions.find((item) => item.value === val).label) || '--',
            width: 80
        },
        {
            title: '投资者认定类型',
            dataIndex: 'investorType',
            width: 150,
            render: (val) => (
                <span>{(val && XWInvestorsType.find((item) => item.value === val).label) || '--'}</span>
            )
            // width:100,
        },
        {
            title: '客户风险等级',
            dataIndex: 'riskType',
            width: 120,
            align: 'center',
            render: (val) => (
                <span>{(val && XWnumriskLevel.find((item) => item.value === val).label) || '--'}</span>
            )
            // width:100,
        },
        {
            title: '客户经理',
            dataIndex: 'managerName',
            render: (val) => <span>{val || '--'}</span>,
            width: 80
            // ellipsis: true
        },
        {
            title: '认定提交方式',
            dataIndex: 'identifyWay',
            width: 120,
            render: (val) => (
                <span>
                    {((val || val === 0) && XWIdentification.find((item) => item.value === val).label) ||
                        '--'}
                </span>
            )
        },
        {
            title: '提交人',
            width: 70,
            dataIndex: 'commitPerson',
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '审核人',
            dataIndex: 'auditPerson',
            width: 70,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '审核状态',
            dataIndex: 'checkFlowStatus',
            width: 80,
            render: (val) => (
                <span>{(val && XWAuditStatus.find((item) => item.value === val).label) || '未审核'}</span>
            )
        },
        {
            title: '发起时间',
            dataIndex: 'startTime',
            width: 120,
            render: (val) => <span>{(val && moment(val).format(DATE_FORMAT)) || '--'}</span>
        },
        {
            title: '结束时间',
            dataIndex: 'endTime',
            width: 120,
            render: (val) => <span>{(val && moment(val).format(DATE_FORMAT)) || '--'}</span>
        },
        {
            title: '操作',
            width: 60,
            render: (_, record) => (
                <Space>
                    <a onClick={() => this.goDetail(record)}> 查看</a>
                </Space>
            )
        },
        {
            title: '流程是否废除',
            // width: 100,
            // render: (_, record) => (
            //     <Space>
            //         <a onClick={() => this.abolishPre(record)}>废除</a>
            //     </Space>
            // )
            width: 120,
            render: (_, record) => (
                this.props.authEdit &&
                <Space>
                    {record.isDelete === 1 && '已废除' ||  <a onClick={() => this.abolishPre(record)}>废除</a>}
                </Space>
            )
        }
    ];


    searchFormRef = React.createRef();


    /**
     * @description 获取客户经理
     */
    getAccountManagerList = () => {
        const { dispatch } = this.props;
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
    };

    // 获取数据
    getListData = () => {
        const { dispatch, params } = this.props;
        // console.log(params, 'params');
        const fromData = this.searchFormRef.current.getFieldsValue();
        const { pageData } = this.state;
        dispatch({
            type: 'INVESTOR_IDENTIFY/queryQualifiedList',
            payload: { ...fromData, ...pageData, status: 1 },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        datasources: res.data || {}
                    });
                } else {
                    const warningText = res.message || res.data || '查询失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };

    // 重置
    resetSearch = () => {
        this.searchFormRef.current.resetFields();
        this.setState({
            selectedRowKeys: []
        });
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageNum = 1;
        this.getListData();
    };

    // 搜索
    handerSearch = () => {
        this.setState({
            selectedRowKeys: [],
            pageData: {
                ...this.state.pageData,
                pageNum: 1
                // pageSize: 20
            }
        });
        this.getListData();
    };

    /**
     * @description: 表格变化
     */
    _tableChange = (p, e, s) => {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageNum = p.current;
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageSize = p.pageSize;
        this.getListData();
    }


    /**
     * @description 进入详情页
     * @param {} record
     */
    goDetail = (record) => {
        if (record.identifyWay === 1) {
            history.push(`/operation/processManagement/investorsProcessList/online/${record.identifyFlowId}`);
        } else {
            history.push(`/operation/processManagement/investorsProcessList/offline/${record.identifyFlowId}`);
        }
    }

    /**
     * @description 新建 后台新建属于线下新建
     */
    add = () => {
        const { params } = this.props;
        if (params && params.customerId) {
            history.push(`/operation/processManagement/investorsProcessList/offline/${0}?customerId=${params.customerId}`);
        } else {
            history.push(`/operation/processManagement/investorsProcessList/offline/${0}`);
        }

    }


    // 文件导出
    tableExport = (type, ids) => {
        if (type === 1) {
            window.location.href = `${BASE_PATH.adminUrl}${'/identify/flow/export'}?identifyFlowIds=${ids.join()}&tokenId=${getCookie('vipAdminToken')}`;
        }

        if (type === 2) {
            fileExport({
                method: 'post',
                url: '/identify/flow/exportAll',
                data: {},
                callback: ({ status, message = '导出失败！' }) => {
                    if (status === 'success') {
                        openNotification('success', '提醒', '导出成功');
                    }
                    if (status === 'error') {
                        openNotification('error', '提醒', message);
                    }
                }
            });
        }
    }

    /**
     * @description 批量下载
     */
    _batchDownload = () => {
        this.setState({ downloadFlag: true });
    }

    closeModal = () => {
        this.setState({ downloadFlag: false });
    }

    /**
     * @description table checkbox
     * @param {*} selectedRowKeys
     */
    _onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }

    render() {
        const { pageData, datasources, downloadFlag, selectedRowKeys, accountManagerList, isAll } = this.state;
        const { loading, params, authEdit, authExport } = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: this._onSelectChange
        };
        // console.log(this.props.pathName)
        return (
            <Fragment >
                <Form
                    hideRequiredMark
                    className={styles.searchForm}
                    onFinish={this.handerSearch}
                    ref={this.searchFormRef}
                    {...formItemLayout}
                >
                    <Row>
                        <Col span={20}>
                            <Row gutter={[20, 0]}>
                                <Col span={8}>
                                    {/* <MultipleSelect
                                        params="customerId"
                                        value="customerId"
                                        label="customerName"
                                        type={2}
                                        formLabel="客户名称"
                                    /> */}
                                    <FormItem label="客户名称" name="customerName">
                                        <Input placeholder="请输入客户名称" allowClear />
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem label="客户类别" name="customerType">
                                        <Select placeholder="请选择客户类别" allowClear>
                                            {!isEmpty(XWcustomerCategoryOptions) &&
                                                XWcustomerCategoryOptions.map((item, index) => (
                                                    <Option key={index} value={item.value}>
                                                        {item.label}
                                                    </Option>
                                                ))}
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem label="审核状态" name="checkFlowStatus">
                                        <Select placeholder="请选择" allowClear>
                                            {DONE.map((item, index) => (
                                                <Option key={index} value={item.value}>
                                                    {item.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem label="认定提交方式" name="identifyWay">
                                        <Select placeholder="请选择" allowClear>
                                            {ORGIN_FROM.map((item, index) => (
                                                <Option key={index} value={item.value}>
                                                    {item.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </FormItem>
                                </Col>

                                <Col span={8}>
                                    <FormItem label="风险等级" name="riskType">
                                        <Select placeholder="请选择" allowClear>
                                            {XWnumriskLevel.map((item, index) => (
                                                <Option key={index} value={item.value}>
                                                    {item.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem label="证件号码" name="cardNumber">
                                        <Input placeholder="请输入" autoComplete="off" allowClear />
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={4} style={{ textAlign: 'right' }}>
                            <Space>
                                <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                                    搜索
                                </Button>
                                <Button onClick={this.resetSearch}>重置</Button>
                            </Space>
                        </Col>
                    </Row>

                </Form>
                <Row gutter={[0, 10]}>
                    <Space>
                        {authEdit && <Button type="primary" onClick={this.add}> + 新建 </Button>}
                        {authExport && (
                            <Dropdown
                                overlay={<Menu>
                                    <Menu.Item
                                        key="1"
                                        disabled={selectedRowKeys.length === 0}
                                        onClick={() => this.tableExport(1, selectedRowKeys)}
                                    >
                                        导出选中
                                    </Menu.Item>
                                    <Menu.Item
                                        key="2"
                                        onClick={() => this.tableExport(2)}
                                    >
                                        导出全部
                                    </Menu.Item>
                                </Menu>}
                            >
                                <Button >
                                    查询表格导出
                                    <DownOutlined />
                                </Button>
                            </Dropdown>
                        )}
                        {authExport && (
                            <Dropdown
                                overlay={<Menu>
                                    <Menu.Item
                                        key="1"
                                        disabled={selectedRowKeys.length === 0}
                                        onClick={() => { this.setState({ downloadFlag: true, isAll: 1 }); }}
                                    >
                                        导出选中
                                    </Menu.Item>
                                    <Menu.Item
                                        key="0"
                                        onClick={() => { this.setState({ downloadFlag: true, isAll: 2 }); }}
                                    >
                                        导出全部
                                    </Menu.Item>
                                </Menu>}
                            >
                                <Button >
                                    材料文件导出
                                    <DownOutlined />
                                </Button>
                            </Dropdown>
                        )}

                    </Space>

                </Row>
                <MXTable
                    loading={loading}
                    rowSelection={rowSelection}
                    columns={this.columns}
                    dataSource={datasources.list || []}
                    rowKey="identifyFlowId"
                    scroll={{ x: '100%', scrollToFirstRowOnChange:true }}
                    sticky
                    total={datasources.total}
                    pageNum={pageData.pageNum}
                    onChange={this._tableChange}
                />
                <BatchDownload isAll={isAll} modalFlag={downloadFlag} closeModal={this.closeModal} ids={selectedRowKeys} params={this.searchFormRef.current && this.searchFormRef.current.getFieldsValue()} />
            </Fragment>
        );
    }
}

export default connect(({ loading }) => ({
    loading: loading.effects['INVESTOR_IDENTIFY/queryQualifiedList']
}))(Done);

Done.defaultProps = {
    params: {}
};