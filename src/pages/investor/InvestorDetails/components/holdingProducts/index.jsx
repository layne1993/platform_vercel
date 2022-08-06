/*
 * @description: 产品投资人-分红
 * @Author: tangsc
 * @Date: 2020-12-21 17:37:06
 */
import React, { PureComponent } from 'react';
import { connect, Link } from 'umi';
import { Dropdown, Menu, Button, Row, Col, Form, Select, Input, DatePicker, notification, Modal, Space, Checkbox } from 'antd';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styles from './index.less';
import { isEmpty } from 'lodash';
import { getRandomKey, getCookie, getPermission, listToMap, fileExport, isNumber, numTransform2 } from '@/utils/utils';
import { XWcustomerCategoryOptions, XWDividendType, DIVIDEND_STATUS } from '@/utils/publicData';
import moment from 'moment';
import MXTable from '@/pages/components/MXTable';
import DividendsWayEditHistory from '../holdingProducts/dividendsWayEditHistory/DividendsWayEditHistory';
import { MultipleSelect } from '@/pages/components/Customize';

const RangePicker = DatePicker.RangePicker;

// 设置日期格式
const dateFormat = 'YYYY/MM/DD HH:mm';

const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;


// 提示信息
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};
@connect(({ loading }) => ({
    newDividendLoading: loading.effects['productDetails/modifyDividend'],
    editDividendLoading: loading.effects['productDetails/dividendWayUpdate'],
    loading: loading.effects['productDetails/dividendWayRecord']
}))
class HoldingProdcuts extends PureComponent {
    state = {
        selectedRowKeys: [], // 选中table行的key值
        selectRows: [],
        pageData: {
            // 当前的分页数据
            pageNum: 1,
            pageSize: 20
        },
        listData: {},                                  // listdata
        dividendsWayEdit_flag: false,                  // 分红方式修改
        dividendsWayEditOpen_flag: false,              // 开启修改分红功能模态框
        rowInfo: {},                                   // 选中的行的数据,
        dividendsWayEditHistory_flag: false            // 分红方式修改记录模态框
    };


    componentDidMount() {
        this._search();
    }

    // 表单实例对象
    formRef = React.createRef();

    // Table的列
    columns = [
        {
            title: '产品名称',
            dataIndex: 'productFullName',
            fixed: 'left',
            width: 150,
            render: (val) => val || '--'
            // render: (val, record) => <Link to={`/investor/customerInfo/investordetails/${record.customerId}`}>{val}</Link> || '--'
        },
        {
            title: '产品编号',
            dataIndex: 'fundRecordNumber',
            width: 120,
            render: (val) => val || '--'
        },
        // {
        //     title: '证件号码',
        //     dataIndex: 'cardNumber',
        //     width: 120
        // },
        // {
        //     title: '客户类别',
        //     dataIndex: 'customerType',
        //     width: 80,
        //     render: (val) => isNumber(val) ? listToMap(XWcustomerCategoryOptions)[val] : '--'
        // },
        {
            title: '最新份额',
            dataIndex: 'tradeShare',
            width: 100,
            render: (val) => isNumber(val) ? val : '--'
        },
        {
            title: '持有人比例',
            dataIndex: 'proportionHolders',
            width: 100,
            render: (val) => val || '--'
        },
        {
            title: '披露总市值',
            dataIndex: 'holdTotalAmount',
            width: 100,
            render: (val) => numTransform2(val)
        },
        {
            title: '总成本',
            dataIndex: 'netPurchaseAmount',
            width: 100,
            render: (val) => numTransform2(val)
        },
        {
            title: '披露总收益',
            dataIndex: 'holdingEarnings',
            width: 120,
            render: (val) => numTransform2(val)
        },
        {
            title: '现有分红方式',
            dataIndex: 'dividendType',
            width: 150,
            // sorter: true,
            render: (val) => isNumber(val) ? listToMap(XWDividendType)[val] : '--'
        },
        {
            title: '收益率',
            dataIndex: 'earningsRateString',
            width: 120,
            // sorter: true,
            render: (val) => val || '--'
        },
        {
            title: '分红修改状态',
            dataIndex: 'status',
            width: 150,
            // sorter: true,
            render: (val) => isNumber(val) ? listToMap(DIVIDEND_STATUS)[val] : '--'
        },
        {
            title: '修改后分红方式',
            dataIndex: 'changedDividendWay',
            width: 120,
            render: (val) => isNumber(val) ? listToMap(XWDividendType)[val] : '--'
        },
        {
            title: '修改时间',
            dataIndex: 'changeTime',
            width: 120,
            render: (val) => <span>{val ? moment(val).format(dateFormat) : '--'}</span>
        },
        {
            title: '修改期限',
            dataIndex: '',
            width: 300,
            render: (record) => <span><span>{record.timeLimitStart ? moment(record.timeLimitStart).format(dateFormat) : '-'}</span>~<span>{record.timeLimitStop ? moment(record.timeLimitStop).format(dateFormat) : '-'}</span></span>
        },
        {
            title: '修改分红记录',
            width: 150,
            render: (record) => record.status !== 0 ? <a onClick={() => this.setState({ rowInfo: record, dividendsWayEditHistory_flag: true })}>查看</a> : '--'
        },
        {
            title: '操作',
            // fixed: 'right',
            width: 80,
            render: (record) => {
                return (
                    <Space>
                        {
                            this.props.authEdit && <a onClick={() => this.setState({ rowInfo: { ...record }, dividendsWayEdit_flag: true })}>编辑</a>
                        }
                        {
                            this.props.authEdit && record.status === 1 && <a onClick={() => this.closePre(record)}>关闭</a>
                        }
                    </Space>
                );
            }
        }
    ];

    /**
     * @description 批量下载
     */
    batchDownload = (ids) => {
        fileExport({
            method: 'post',
            url: '/holdProduct/exportCheckId',
            data: { shareRecordId: ids },
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

    // 导出全部
    _downloadAll = () => {
        const { params } = this.props;
        const formData = this.formRef.current.getFieldsValue();
        fileExport({
            method: 'post',
            url: '/holdProduct/exportAll',
            data: {
                ...params,
                ...formData
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
    }


    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = () => {
        const { pageData } = this.state;
        // 转换成时间戳
        this.setState({
            pageData: {
                // 当前的分页数据
                ...pageData,
                pageNum: 1
            }
        }, () => {
            this._search();
        });
    };


    /**
     * @description: 列表查询
     */
    _search = () => {

        const { pageData } = this.state;
        const { dispatch, params } = this.props;
        const filterParams = this.formRef.current.getFieldsValue();

        dispatch({
            type: 'HoldingProducts/dividendWayRecord',
            payload: {
                customerId: params.customerId,
                ...filterParams,
                ...pageData
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        listData: res.data || {}
                    });
                } else {
                    const warningText = res.message || res.data || '查询失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                    this.setState({
                        listData: []
                    });
                }
            }
        });
    }


    /**
     * @description:重置过滤条件
     */
    _reset = () => {
        const { pageData } = this.state;
        this.formRef.current.resetFields();
        this._cleanSelectedKeys();
        this.setState({
            pageData: { ...pageData, pageNum: 1 }
        }, () => {
            this._search();
        });
    };

    /**
     * @description: Table的CheckBox change事件
     * @param {Array} selectedRowKeys
     */
    _onSelectChange = (selectedRowKeys, selectRows) => {
        this.setState({
            selectedRowKeys,
            selectRows
        });
    };

    /**
     * @description: 清空已勾选
     */
    _cleanSelectedKeys = () => {
        this.setState({
            selectedRowKeys: [],
            selectRows: []
        });
    };

    /**
     * @description: 表格变化
     */
    _tableChange = (p, e, s) => {
        this.setState({
            pageData: {
                pageNum: p.current,
                pageSize: p.pageSize
            }
        }, () => {
            this._search();
        });
    }


    closePre = (rowInfo) => {
        Modal.confirm({
            title: '是否关闭？',
            icon: <ExclamationCircleOutlined />,
            content: '关闭后不可修改',
            okText: '确认',
            cancelText: '取消',
            onOk: () => this.doClose(rowInfo)
        });
    }

    /**
     * @description: 执行关闭操作
     * @param {*}
     */
    doClose = (rowInfo) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'productDetails/closeOpen',
            payload: {
                ...rowInfo,
                isDelete: 1
            },
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification('success', '提示', '关闭成功', 'topRight');
                    this._search();
                    this._cleanSelectedKeys();
                } else {
                    const warningText = res.message || res.data || '关闭失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    }


    /**
     * @description 开启修改分红功能 模态框
     */
    switchDividendsWayEditOpenFlag = (flag) => {
        this.setState({
            dividendsWayEditOpen_flag: flag
        });
    }

    /**
     * @description 开启分红功能 保存
     */
    dividendsWayEditOpenSubmit = (values) => {
        const { dispatch } = this.props;
        const { selectRows } = this.state;
        let exportData = [];
        if (Array.isArray(selectRows)) {
            selectRows.map((item) => exportData.push({ customerId: item.customerId, productId: item.productId }));
        }
        dispatch({
            type: 'productDetails/modifyDividend',
            payload: {
                exportData,
                informWay: values.informWay,
                timeLimitStart: values.timeLimit && moment(values.timeLimit[0]).valueOf(),
                timeLimitStop: values.timeLimit && moment(values.timeLimit[1]).valueOf()
            },
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification('success', '操作', '开启成功', 'topRight');
                    this._search();
                    this._cleanSelectedKeys();
                    this.switchDividendsWayEditOpenFlag(false);
                } else {
                    const warningText = res.message || res.data || '开启失败！';
                    openNotification(
                        'warning',
                        `提示（代码：${res.code}）`,
                        warningText,
                        'topRight',
                    );
                }
            }
        });
    }


    /**
     * @description 开启修改分红功能 模态框
     */
    switchDividendsWayEditFlag = (flag) => {
        this.setState({
            dividendsWayEdit_flag: flag,
            dividendsWayEditOpen_flag:flag
        });
    }

    /**
     * @description 编辑分红方式
     */
    dividendsWayEditSubmit = (values) => {
        const { dispatch } = this.props;
        const { rowInfo } = this.state;
        dispatch({
            type: 'productDetails/dividendWayUpdate',
            payload: {
                ...rowInfo,
                dividendType: values.dividendType,
                changedDividendWay: values.changedDividendWay,
                timeLimitStart: values.timeLimit && moment(values.timeLimit[0]).valueOf(),
                timeLimitStop: values.timeLimit && moment(values.timeLimit[1]).valueOf()
            },
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification('success', '操作', '修改成功', 'topRight');
                    this._search();
                    this._cleanSelectedKeys();
                    this.switchDividendsWayEditFlag(false);
                } else {
                    const warningText = res.message || res.data || '修改失败！';
                    openNotification(
                        'warning',
                        `提示（代码：${res.code}）`,
                        warningText,
                        'topRight',
                    );
                }
            }
        });
    }


    // 分红方式修改历史记录
    historyRecordColumns = [
        {
            title: '客户名称',
            dataIndex: 'customerName',
            width: 80
        },
        {
            title: '证件号码',
            dataIndex: 'cardNumber',
            width: 100
        },
        {
            title: '产品名称',
            dataIndex: 'productName',
            width: 120
        },
        {
            title: '分红修改状态',
            dataIndex: 'status',
            width: 120,
            sorter: true,
            render: (val) => val ? listToMap(DIVIDEND_STATUS)[val] : '--'
        },
        {
            title: '已有分红方式',
            dataIndex: 'existingDividendWay',
            width: 120,
            sorter: true,
            render: (val) => val ? listToMap(XWDividendType)[val] : '--'
        },
        {
            title: '修改后分红方式',
            dataIndex: 'changedDividendWay',
            width: 120,
            render: (val) => val ? listToMap(XWDividendType)[val] : '--'
        },
        {
            title: '修改时间',
            dataIndex: 'changeTime',
            width: 100,
            render: (val) => val ? moment(val).format(dateFormat) : '--'
        }
    ]

    initForm = (rowInfo) => {
        if (rowInfo.timeLimitStart && rowInfo.timeLimitStop) {
            return {
                ...rowInfo,
                timeLimit: [moment(rowInfo.timeLimitStart), moment(rowInfo.timeLimitStop)]
            };
        }
        return { ...rowInfo };
    }

    render() {
        const {
            pageData,
            selectedRowKeys,
            listData,
            dividendsWayEdit_flag,
            dividendsWayEditOpen_flag,
            dividendsWayEditHistory_flag,
            rowInfo
        } = this.state;
        const { loading, editDividendLoading, newDividendLoading } = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: this._onSelectChange
        };

        // eslint-disable-next-line no-undef

        return (
            <div className={styles.container}>
                <div className={styles.filter}>
                    <Form name="basic" onFinish={this._onFinish} ref={this.formRef} labelCol={{ span: 8 }}>
                        <Row gutter={[8, 0]}>
                            <Col span={8}>
                                <MultipleSelect
                                    params="productId"
                                    value="productId"
                                    label="productName"
                                    // mode="multiple"
                                    formLabel="产品名称"
                                />
                            </Col>
                            {/* <Col span={8}>
                                <FormItem label="客户类别" name="customerType">
                                    <Select
                                        placeholder="请选择"
                                        allowClear
                                    >
                                        {
                                            XWcustomerCategoryOptions.map((item) => (
                                                <Option key={item.value} value={item.value} >
                                                    {item.label}
                                                </Option>
                                            ))}
                                    </Select>
                                </FormItem>
                            </Col> */}
                            <Col span={8}>
                                <FormItem label="已有分红方式" name="dividendType">
                                    <Select
                                        placeholder="请选择"
                                        allowClear
                                    >
                                        {
                                            XWDividendType.map((item) => (
                                                <Option key={item.value} value={item.value} >
                                                    {item.label}
                                                </Option>
                                            ))}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="分红修改状态" name="status">
                                    <Select
                                        placeholder="请选择"
                                        allowClear
                                    >
                                        {
                                            DIVIDEND_STATUS.map((item) => (
                                                <Option key={item.value} value={item.value} >
                                                    {item.label}
                                                </Option>
                                            ))}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={24} style={{ textAlign: 'end' }}>
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
                <div className={styles.dataTable}>
                    <Row justify="space-between">
                        <Space>
                            {/* {
                                authEdit &&
                                <Button type="primary" icon={<PlusOutlined />} onClick={this._onAdd}>
                                    新建
                                </Button>
                            } */}
                            {this.props.authExport && (
                                <Dropdown
                                    overlay={<Menu>
                                        <Menu.Item
                                            key="1"
                                            disabled={selectedRowKeys.length === 0}
                                            onClick={() => this.batchDownload(selectedRowKeys)}
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
                        </Space>

                        <Space>
                            {this.props.authEdit && (
                                <Button type="primary" disabled={selectedRowKeys.length === 0} onClick={() => this.switchDividendsWayEditOpenFlag(true)}>
                                    开启修改分红功能
                                </Button>
                            )}
                        </Space>
                    </Row>
                    <MXTable
                        loading={loading}
                        columns={this.columns}
                        dataSource={listData && listData.list}
                        total={listData && listData.total}
                        pageNum={pageData.pageNum}
                        rowKey={(record) => record.shareRecordId}
                        onChange={(p, e, s) => this._tableChange(p, e, s)}
                        rowSelection={rowSelection}
                        scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
                    />
                </div>

                {/* --------------------开启修改分红功能设置----------------------- */}
                {
                    dividendsWayEditOpen_flag &&
                    <Modal
                        title="开启修改分红功能设置"
                        visible={dividendsWayEditOpen_flag}
                        closable={false}
                        footer={null}
                        onCancel={() => this.switchDividendsWayEditFlag(false)}
                    >
                        <Form
                            layout="vertical"
                            onFinish={this.dividendsWayEditOpenSubmit}
                        >
                            <Form.Item
                                label="设置本次分红方式修改期限"
                                name="timeLimit"
                                extra="时间过期后，未修改的客户默认为原来的分红方式"
                                rules={[{ required: true, message: '请选择期限' }]}
                            >
                                <RangePicker showTime />
                            </Form.Item>
                            <Form.Item
                                label="通知方式"
                                name="informWay"
                                extra="默认打开个人中心页面会有弹框提示"
                            >
                                <Checkbox.Group>
                                    <Checkbox value={1}>
                                        短信
                                    </Checkbox>
                                </Checkbox.Group>
                            </Form.Item>
                            <Row justify="center" style={{ marginTop: 30 }}>
                                <Space>
                                    <Button onClick={() => this.switchDividendsWayEditOpenFlag(false)} >取消</Button>
                                    <Button loading={newDividendLoading} type="primary" htmlType="submit">保存</Button>
                                </Space>
                            </Row>
                        </Form>
                    </Modal>
                }

                {/* --------------------编辑分红----------------------- */}
                {
                    dividendsWayEdit_flag &&
                    <Modal
                        title="编辑分红"
                        visible={dividendsWayEdit_flag}
                        footer={null}
                        onCancel={() => this.switchDividendsWayEditFlag(false)}
                    >
                        <Form
                            layout="vertical"
                            onFinish={this.dividendsWayEditSubmit}
                            initialValues={{ ...this.initForm(rowInfo) }}
                        >
                            <Form.Item
                                label="修改期限"
                                name="timeLimit"
                                rules={[{ required: true, message: '请选择期限' }]}
                            >
                                <RangePicker
                                    showTime
                                    disabled={rowInfo.timeLimitStop && moment().valueOf() > moment(rowInfo.timeLimitStop).valueOf()}
                                />
                            </Form.Item>
                            <Form.Item
                                label="现有分红方式"
                                name="dividendType"
                            >
                                <Select
                                    placeholder="请选择"
                                    disabled={rowInfo.dividendType}
                                    allowClear
                                >
                                    {
                                        XWDividendType.map((item) => (
                                            <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="修改后分红方式"
                                name="changedDividendWay"
                                rules={[{ required: true, message: '请选择' }]}
                            >
                                <Select placeholder="请选择" allowClear >
                                    {
                                        XWDividendType.map((item) => (
                                            <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                            <Row justify="center" style={{ marginTop: 30 }}>
                                <Space>
                                    <Button onClick={() => this.switchDividendsWayEditFlag(false)} >取消</Button>
                                    <Button loading={editDividendLoading} type="primary" htmlType="submit">保存</Button>
                                </Space>
                            </Row>
                        </Form>
                    </Modal>
                }

                {
                    dividendsWayEditHistory_flag &&
                    <DividendsWayEditHistory
                        rowKey="dividendWayRecordId"
                        flag={dividendsWayEditHistory_flag}
                        params={rowInfo}
                        columns={this.historyRecordColumns}
                        cancel={() => this.setState({ dividendsWayEditHistory_flag: false, rowInfo: {} })}
                    />
                }
            </div>
        );
    }
}
export default HoldingProdcuts;
