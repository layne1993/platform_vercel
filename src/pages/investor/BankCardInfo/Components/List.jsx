/*
 * @description: 银行卡管理列表
 * @Author: tangsc
 * @Date: 2020-10-21 16:24:43
 */
import React, { PureComponent, Fragment } from 'react';
import { history, connect } from 'umi';
import { Button, Row, Col, Form, Select, Input, Dropdown, Menu, DatePicker, message, notification, Space, Popconfirm } from 'antd';
import Detail from './../detail';
import {
    BANK_STATUS,
    paginationPropsback
} from '@/utils/publicData';
import { DownOutlined, UpOutlined, PlusOutlined } from '@ant-design/icons';
import MXTable from '@/pages/components/MXTable';
import BatchUpload from '@/pages/components/batchUpload';
import styles from './List.less';
import { getRandomKey, listToMap, exportExcel, getCookie, fileExport } from '@/utils/utils';
import moment from 'moment';

// 设置日期格式
const dateFormat = 'YYYY/MM/DD HH:mm';

const FormItem = Form.Item;
const { Option } = Select;

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

class List extends PureComponent {
    state = {
        isShow: false, // 控制显示隐藏
        loading: false, // loading状态
        selectedRowKeys: [], // 选中table行的key值
        selectedRows: [],
        dataSource: {},
        pageData: {
            // 当前的分页数据
            pageNum: 1,
            pageSize: 20
        },
        detailFlag: false,
        bankInfo: {},
        batchUploadModalFlag: false
    };

    componentDidMount() {
        this.setColums();
        this.getListData();
    }

    /**
     * @description columns
     */
    setColums = () => {
        const { params } = this.props;
        if (!params.customerId) {
            this.columns.unshift(
                {
                    title: '客户名称',
                    dataIndex: 'customerName',
                    width: 150,
                    fixed: 'left',
                    ellipsis: true
                });
        }
    }

    // 表单实例对象
    formRef = React.createRef();

    // Table的列
    columns = [
        {
            title: '银行名称',
            dataIndex: 'bankName',
            width: 150,
            ellipsis: true
        },
        {
            title: '银行卡号',
            dataIndex: 'accountNumber',
            width: 200,
            ellipsis: true
        },
        {
            title: '银行户名',
            dataIndex: 'accountName',
            width: 100
        },
        {
            title: '开户行全称',
            dataIndex: 'subbranch',
            width: 400,
            ellipsis: true
        },
        {
            title: '开户行省份',
            dataIndex: 'provice',
            width: 100
        },
        {
            title: '开户行城市',
            dataIndex: 'city',
            width: 100
        },
        {
            title: '关联产品数量',
            dataIndex: 'productNum',
            width: 110
        },
        {
            title: '关联产品',
            dataIndex: 'productName',
            width: 200,
            // ellipsis: true,
            render: (val) => <p title={val}>{val}</p>
        },
        {
            title: '银行卡状态',
            dataIndex: 'status',
            width: 100,
            render: (val) => listToMap(BANK_STATUS)[val]
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            width: 100,
            render: (val) => val ? moment(val).format(dateFormat) : '--'
        },
        {
            title: '操作',
            dataIndex: '',
            // fixed: 'right',
            width: 120,
            render: (record) => {
                return (
                    this.props.authEdit &&
                    <Space>
                        <a className="details" onClick={() => this.edit(record)}>编辑 </a>
                        {record.status === 1 &&
                            <Popconfirm title="确定冻结？" onConfirm={() => this.freeze(record)}>
                                <a>冻结</a>
                            </Popconfirm>
                        }
                        {record.productNum <= 0 &&
                            <Popconfirm title="删除冻结？" onConfirm={() => this.doDelete(record)}>
                                <a>删除</a>
                            </Popconfirm>
                        }
                    </Space>
                );
            }
        }
    ];


    // 下载文档
    _batchDownload = () => {
        const { selectedRowKeys } = this.state;
        fileExport({
            method: 'post',
            url: '/customerBank/checkedExport',
            data: {
                customerBankIds: selectedRowKeys
            },
            callback: ({ status, message = '导出失败！' }) => {
                if (status === 'success') {
                    openNotification('success', '提醒', '导出成功');
                }
                if (status === 'error') {
                    openNotification('error', '提醒', message);
                }
            }
        });
    };


    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = () => {
        this.setState({
            selectedRowKeys: [],
            pageData: {
                // 当前的分页数据
                ...this.state.pageData,
                pageNum: 1
                // pageSize: 20
            }
        });
        this.getListData();
    };

    /**
     * @description: 点击显示隐藏
     */
    _handleShowMore = () => {
        const { isShow } = this.state;
        this.setState({
            isShow: !isShow
        });
    };

    /**
     * @description 删除
     * @param {*} record
     */
    doDelete = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'INVESTOR_BANKINFO/deleteCustomerBank',
            payload: record.customerBankId,
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification('success', '删除', '删除成功', 'topRight');
                    this.setState({ selectedRowKeys: [] });
                    this.getListData();
                } else {
                    const warningText = res.message || res.data || '删除失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };

    /**
     * @description:重置过滤条件
     */
    _reset = () => {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageNum = 1;
        this.formRef.current.resetFields();
        this.getListData();
        this.setState({ selectedRows: [], selectedRowKeys: [] });
    };

    /**
     * @description 获取table 数据
     */
    getListData = () => {

        const { dispatch, params } = this.props;
        const formData = this.formRef.current.getFieldsValue();
        const { pageData } = this.state;
        dispatch({
            type: 'INVESTOR_BANKINFO/bankList',
            payload: {
                ...params,
                ...formData,
                ...pageData,
                createTime: formData.createTime ? moment(formData.createTime).valueOf() : undefined
            },
            callback: (res) => {
                if (res.code === 1008) {
                    this.setState({ dataSource: res.data || {} });
                } else {
                    const warningText = res.message || res.data || '查询失败！';
                    openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                }
            }
        });
    }


    /**
     * @description 冻结操作
     * @param {*} record
     */
    freeze = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'INVESTOR_BANKINFO/doFreeze',
            payload: { customerBankId: record.customerBankId, status: 0 },
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification('success', '提示', '操作成功', 'topRight');
                    this.getListData();
                } else {
                    const warningText = res.message || res.data || '冻结失败！';
                    openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                }
            }
        });
    }


    /**
     * @description 编辑
     * @param {*} obj
     */
    edit = (obj) => {
        this.setState({ bankInfo: obj, detailFlag: true });
    }

    /**
     * @description: Table的CheckBox change事件
     * @param {Array} selectedRowKeys
     */
    _onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRows
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
        // `/manager/investor/investordetails/${0}`
        this.setState({ detailFlag: true });
        // history.push({
        //     pathname: `/investor/bankCardInfo/bankCardDetails/${0}`
        // });
    };

    /**
     * @description: 批量上传 打开模态框
     */
    _batchUpload = () => {
        this.setState({ batchUploadModalFlag: true });
    }

    /**
     * @description: 关闭上传模态框
     */
    closeBatchUploadModal = () => {
        this.setState({ batchUploadModalFlag: false });
    }

    /**
     * @description 上传成功关闭模态框 并且刷新数据
     */
    onOK = () => {
        this.closeBatchUploadModal();
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageNum = 1;
        this.formRef.current.resetFields();
        this.getListData();
    }

    /**
     * @description 关闭模态框
     */
    closeModal = () => {
        this.setState({ detailFlag: false, bankInfo: {} });
    }

    /**
     * @description 新建成功
     */
    buildSuccess = () => {
        this.closeModal();
        this.getListData();
    }

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

    // 导出全部
    _downloadAll = () => {
        const { params } = this.props;
        const formData = this.formRef.current.getFieldsValue();
        const { pageData } = this.state;
        fileExport({
            method: 'post',
            url: '/customerBank/allExport',
            data: {
                ...params,
                ...formData,
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

    render() {
        const { dataSource, pageData, selectedRowKeys, detailFlag, bankInfo, batchUploadModalFlag } = this.state;
        const { params, loading } = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: this._onSelectChange
        };

        return (
            <div className={styles.container}>
                <div className={styles.filter}>
                    <Form name="basic" onFinish={this._onFinish} ref={this.formRef}>
                        <Row gutter={[8, 0]}>
                            {
                                !params.customerId &&                             <Col span={5}>
                                    <FormItem label="客户名称" name="customerName">
                                        <Input placeholder="请输入" allowClear />
                                    </FormItem>
                                </Col>
                            }

                            <Col span={5}>
                                <FormItem label="银行名称" name="accountName">
                                    <Input placeholder="请输入" allowClear />
                                </FormItem>
                            </Col>
                            <Col span={5}>
                                <FormItem label="银行卡状态" name="status">
                                    <Select placeholder="请选择" allowClear>
                                        {BANK_STATUS.map((item) => {
                                            return (
                                                <Option key={getRandomKey(5)} value={item.value}>
                                                    {item.label}
                                                </Option>
                                            );
                                        })}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={5}>
                                <FormItem label="创建时间" name="createTime">
                                    <DatePicker style={{ width: '100%' }} format={'YYYY-MM-DD'} allowClear />
                                </FormItem>
                            </Col>
                            <Col span={4} className={styles.btnGroup}>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                                <Button onClick={this._reset}>重置</Button>
                                {/* <span className={styles.showMore} onClick={this._handleShowMore}>
                                    {isShow ? '隐藏' : '展开'}
                                    {isShow ? <UpOutlined /> : <DownOutlined />}
                                </span> */}
                            </Col>
                        </Row>
                        {/* <Row gutter={[8, 0]} style={{ display: isShow ? '' : 'none' }}>
                            <Col span={9}>
                                <FormItem label="创建时间" name="createTime">
                                    <DatePicker style={{ width: '100%' }} format={dateFormat} />
                                </FormItem>
                            </Col>
                        </Row> */}
                    </Form>
                </div>
                <div className={styles.dataTable}>
                    <div className={styles.operationBtn}>
                        {this.props.authEdit && <Button type="primary" icon={<PlusOutlined />} onClick={this._onAdd}>新建</Button>}
                        {this.props.authEdit && <Button type="primary" onClick={this._batchUpload}>批量上传</Button>}
                        {this.props.authExport &&
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
                        }
                        {/* {this.props.authExport && <Button disabled={selectedRowKeys.length === 0} onClick={this._batchDownload}>批量导出</Button>} */}
                    </div>
                    <MXTable
                        loading={loading}
                        rowSelection={rowSelection}
                        columns={this.columns}
                        dataSource={dataSource.list || []}
                        rowKey="customerBankId"
                        scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
                        sticky
                        total={dataSource.total}
                        pageNum={pageData.pageNum}
                        onChange={this._tableChange}
                    />

                </div>
                {detailFlag && <Detail flag={detailFlag} params={{ ...params, ...bankInfo }} closeModal={this.closeModal} onSuccess={this.buildSuccess} />}

                {
                    batchUploadModalFlag &&
                    <BatchUpload
                        modalFlag={batchUploadModalFlag}
                        url="/customerBank/bulkUpload"
                        onOk={this.onOK}
                        closeModal={this.closeBatchUploadModal}
                        templateUrl={`/customerBank/import/template?&tokenId=${getCookie('vipAdminToken')}`}
                    />
                }
            </div>
        );
    }
}

export default connect(({ loading }) => ({
    loading: loading.effects['INVESTOR_BANKINFO/bankList']
}))(List);

List.defaultProps = {
    params: {}
};
