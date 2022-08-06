import { Alert, Button, Input, Form, Card, Row, Col, Table, notification, Select, Space, message } from 'antd';
import { connect, Link, history } from 'umi';
import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { getCookie, getPermission } from '@/utils/utils';
import {
    XWnumriskLevel,
    XWcustomerCategoryOptions,
    paginationPropsback,
    XWInvestorsType,
    XWAuditStatus,
    XWIdentification
} from '@/utils/publicData';
import MXTable from '@/pages/components/MXTable';
import { MultipleSelect } from '@/pages/components/Customize';
import BatchDownload from './batchDownload';
import styles from '../style.less';
import { isEmpty } from 'lodash';

const FormItem = Form.Item;

const { Option } = Select;

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


class QualifiedInvestor extends Component {
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
        downloadFlag: false
    };


    componentDidMount() {
        this.getListData();
        this.getAccountManagerList();

    }



    columns = [
        // {
        //     title: '客户名称',
        //     dataIndex: 'customerName',
        //     render: (val) => <span>{val || '--'}</span>,
        //     width: 55,
        //     ellipsis: true
        // },
        {
            title: '客户类别',
            dataIndex: 'customerType',
            render: (val) =>
                (val && XWcustomerCategoryOptions.find((item) => item.value === val).label) || '--',
            width: 70
        },
        {
            title: '客户经理',
            dataIndex: 'managerName',
            render: (val) => <span>{val || '--'}</span>,
            width: 55,
            ellipsis: true
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
            title: '提交时间',
            dataIndex: 'commitTime',
            width: 65,
            render: (val) => <span>{(val && moment(val).format(DATE_FORMAT)) || '--'}</span>
        },
        {
            title: '提交人',
            width: 50,
            dataIndex: 'commitPerson',
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '审核状态',
            dataIndex: 'checkFlowStatus',
            width: 55,
            render: (val) => (
                <span>{(val && XWAuditStatus.find((item) => item.value === val).label) || '未审核'}</span>
            )
        },
        {
            title: '审核时间',
            dataIndex: 'auditTime',
            width: 65,
            render: (val) => <span>{(val && moment(val).format(DATE_FORMAT)) || '--'}</span>
        },
        {
            title: '审核人',
            dataIndex: 'auditPerson',
            width: 70,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '操作',
            width: 40,
            render: (_, record) => (
                <Space>
                    {(record.codeValue == '1060' && record.identifyWay === 1 || record.codeValue == '1040' && record.identifyWay === 2) ? <a style={{ color: 'red' }} onClick={() => this.goDetail(record)}> 审核 </a> : <a onClick={() => this.goDetail(record)}> 详情 </a>}
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
        const fromData = this.searchFormRef.current.getFieldsValue();
        const { pageData } = this.state;
        dispatch({
            type: 'INVESTOR_IDENTIFY/queryQualifiedList',
            payload: { ...fromData, ...pageData, customerId: params && params.customerId },
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
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageNum = 1;
        this.getListData();
        this.setState({
            selectedRowKeys: []
        });
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

    filterPerson = (inputValue, option) => option.props.children.includes(inputValue);

    goto = () => {
        let number = Math.random() * 3 < 2 ? 1 : 2;
        history.push({
            pathname: `/investor/applyprocess/408?type=${number}`
        });
    };
    render() {
        const { pageData, datasources, downloadFlag, selectedRowKeys, accountManagerList } = this.state;
        const { loading, params } = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: this._onSelectChange
        };
        return (
            <Fragment >
                <Form
                    hideRequiredMark
                    className={styles.searchForm}
                    onFinish={this.handerSearch}
                    ref={this.searchFormRef}
                >
                    {params.customerId ?
                        <Row gutter={[20, 0]}>
                            <Col span={6}>
                                <FormItem label="审核状态" name="checkFlowStatus">
                                    <Select placeholder="请选择" allowClear>
                                        {XWAuditStatus.map((item, index) => (
                                            <Option key={index} value={item.value}>
                                                {item.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={6}>
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
                            <Col span={6}>
                                <FormItem label="客户经理" name="managerIds">
                                    <Select placeholder="请选择" mode="multiple" allowClear
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {accountManagerList.map((item, index) => (
                                            <Option key={index} value={item.managerUserId}>
                                                {item.userName}
                                            </Option>
                                        ))}
                                    </Select>
                                </FormItem>
                            </Col>
                            {/* <Col span={6}>
                                <FormItem label="证件号码" name="cardNumber">
                                    <Input placeholder="请输入" autoComplete="off"  allowClear/>
                                </FormItem>
                            </Col> */}
                            <Col span={4}>
                                <FormItem>
                                    <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                                        搜索
                                    </Button>
                                    <Button onClick={this.resetSearch}>重置</Button>
                                </FormItem>
                            </Col>
                        </Row>
                        :
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
                                <FormItem label="客户经理" name="managerIds">
                                    <Select placeholder="请选择" mode="multiple" allowClear
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
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
                                <FormItem label="审核状态" name="checkFlowStatus">
                                    <Select placeholder="请选择" allowClear>
                                        {XWAuditStatus.map((item, index) => (
                                            <Option key={index} value={item.value}>
                                                {item.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </FormItem>
                            </Col>

                            <Col span={4} offset={4}>
                                <FormItem>
                                    <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                                        搜索
                                    </Button>
                                    <Button onClick={this.resetSearch}>重置</Button>
                                </FormItem>
                            </Col>
                        </Row>}
                </Form>
                <Row gutter={[0, 10]}>
                    <Space>
                        {this.props.authEdit && <Button type="primary" onClick={this.add}> + 新建 </Button>}
                        {this.props.authExport && <Button disabled={selectedRowKeys.length === 0} onClick={this._batchDownload} > 批量导出 </Button>}
                    </Space>

                </Row>

                <MXTable
                    loading={loading}
                    rowSelection={rowSelection}
                    columns={this.columns}
                    dataSource={datasources.list || []}
                    rowKey="identifyFlowId"
                    scroll={{ x: '100%', scrollToFirstRowOnChange: true }}

                    sticky
                    total={datasources.total}
                    pageNum={pageData.pageNum}
                    onChange={this._tableChange}
                />
                <BatchDownload isAll={1} modalFlag={downloadFlag} closeModal={this.closeModal} params={params} ids={selectedRowKeys} />
            </Fragment>
        );
    }
}

export default connect(({ loading }) => ({
    loading: loading.effects['INVESTOR_IDENTIFY/queryQualifiedList']
}))(QualifiedInvestor);

QualifiedInvestor.defaultProps = {
    params: {}
};
