/*
 * @description: 资金流水列表
 * @author: wangcl
 * @Date: 2020/10/28
 */
import React, { PureComponent, Fragment } from 'react';
import { history, Link } from 'umi';
import {
    Button,
    Row,
    Col,
    Form,
    Select,
    Input,
    Table,
    Alert,
    notification,
    Upload,
    Tree,
    DatePicker,
    Modal,
    message,
    Dropdown,
    Menu
} from 'antd';
import {
    XWcustomerCategoryOptions,
    paginationPropsback,
    XWInvestorsType,
    TEADE_FLOW_TYPE
} from '@/utils/publicData';
import { DownOutlined, UpOutlined, InboxOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { connect } from 'umi';
import { isEmpty } from 'lodash';
import styles from './List.less';
import { MultipleSelect, CustomRangePicker } from '@/pages/components/Customize';
import { getRandomKey, getCookie, getPermission, fileExport } from '@/utils/utils';


const { Dragger } = Upload;

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
        message,
        description,
        placement,
        duration: duration || 3
    });
};

// 设置日期格式
const dateFormat = 'YYYY/MM/DD';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;

const { Option } = Select;


class List extends PureComponent {
    state = {
        loading: false, // loading状态
        selectedRowKeys: [], // 选中table行的key值
        pageData: {
            // 当前的分页数据
            current: 1,
            pageSize: 20
        },
        checkedValues: [], //通知客户的集中选项
        showColumn: false, //列设置是否显示
        columnsStandard: [], //表头基准值  因为有列设置
        columnsValue: [], //表头
        isShow: false, //t弹框默认关闭
        confirmId: null, //单个点击确认金额的id
        showUpload: false,
        datasources: {
            list: [],
            total: '',
            pageNum: '',
            pageSize: '',
            pages: ''
        },
        formValues: {},
        customerList: [],
        productList: [],
        trusteeshipList: [],                 //托管列表
        trusteeship: undefined               // 选中的托管
    };

    componentDidMount() {
        this.setState({
            columnsStandard: this.columns,
            columnsValue: this.columns
        });
        this.getTrusteeship();
        this.getSignInfoList();
    }

    getSignInfoList = (values = {}) => {
        const { dispatch } = this.props;
        const { pageData } = this.state;
        // dispatch({
        //     type: 'global/queryByProductName',
        //     callback: (res) => {
        //         if (res.code === 1008) {
        //             this.setState({
        //                 productList: res.data
        //             });
        //         }
        //     }
        // });

        // dispatch({
        //     type: 'global/queryByCustomerName',
        //     callback: (res) => {
        //         if (res.code === 1008) {
        //             this.setState({
        //                 customerList: res.data
        //             });
        //         }
        //     }
        // });

        dispatch({
            type: 'OrderList/SignConfirmList',
            payload: {
                ...values,
                ...pageData
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        datasources: res.data,
                        formValues: values
                    });
                } else {
                    openNotification('warning', '提醒', res.message || '查询失败');
                }
            }
        });
    };
    // 表单实例对象
    formRef = React.createRef();
    popUpRef = React.createRef();
    // Table的列
    columns = [
        {
            title: '份额类别',
            dataIndex: 'parentProductId',
            width:100,
            fixed: 'left',
            render: (val, record) => <div style={{width:80}}>{val && record.productName || '--'}</div>
        },
        {
            title: '客户名称',
            dataIndex: 'customerName',
            width: 150,
            ellipsis: true,
            render: (txt, record) => <Link to={`/investor/customerInfo/investordetails/${record.customerId}`}>{txt}</Link>,
            fixed: 'left'
        },
        {
            title: '产品名称',
            dataIndex: 'productName',
            width: 200,
            ellipsis: true,
            render: (txt, record) => <Link to={`/product/list/details/${record.productId}`}>{txt}</Link>
        },
        {
            title: '开放日日期',
            dataIndex: 'openDay',
            width: 120,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '交易类型',
            dataIndex: 'flowType',
            width: 100,
            render: (val) => <span>{TEADE_FLOW_TYPE[val] || '--'}</span>
        },
        {
            title: '交易额',
            dataIndex: 'tradeMoney',
            width: 120,
            ellipsis: true,
            render: (val) => val || '--'
        },
        {
            title: '证件号码',
            dataIndex: 'cardNumber',
            ellipsis: true,
            width: 120,
            render: (val) => val || '--'
        },
        {
            title: '银行名称',
            dataIndex: 'bankName',
            width: 140,
            ellipsis: true,
            render: (val) => val || '--'
        },
        {
            title: '银行账号',
            dataIndex: 'accountNumber',
            width: 140,
            ellipsis: true,
            render: (val) => val || '--'
        },
        {
            title: '银行户名',
            dataIndex: 'accountName',
            width: 140,
            ellipsis: true,
            render: (val) => val || '--'
        },
        {
            title: '银行省份',
            dataIndex: 'provice',
            width: 140,
            ellipsis: true,
            render: (val, record) => <><span>{val}</span><span>{record.city}</span></>
        },
        {
            title: '开户行名称',
            dataIndex: 'depositBankName',
            width: 140,
            ellipsis: true,
            render: (val) => val || '--'
        },
        {
            title: '申请日期/开放日',
            dataIndex: 'applyTime',
            width: 200,
            ellipsis: true,
            sorter: true,
            render: (val) => val ? moment(val).format(dateFormat) : '--'
        }
    ];


    /**
     * @description 获取托管list
     */
    getTrusteeship = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'OrderList/trusteeship',
            callback: (res) => {
                if (res.code === 1008) {
                    this.setState({
                        trusteeshipList: res.data || []
                    });
                } else {
                    openNotification('warning', '提醒', res.message || '查询失败');
                }
            }
        });
    }

    /**
     * @description t托管change事件
     * @param {*} val
     */
    setTrusteeship = (val) => {
        this.setState({
            trusteeship: val
        });
    }


    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = (values) => {
        const { openDayDate, ...params } = values;
        let tempObj = {};
        tempObj.openDayStartTime = (openDayDate && moment(openDayDate[0]).valueOf()) || undefined;
        tempObj.openDayEndTime = (openDayDate && moment(openDayDate[1]).valueOf()) || undefined;
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageNum = 1;
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageSize = 20;
        this.getSignInfoList({ ...tempObj, ...params });
        this.setState({
            selectedRowKeys: []
        });
        // console.log('Success:', values);
    };

    /**
     * @description:重置过滤条件
     */
    _reset = () => {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageNum = 1;
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageSize = 20;
        this.formRef.current.resetFields();
        this.getSignInfoList();
        this.setState({
            selectedRowKeys: []
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
     * @description: 选择通知客户的方式
     * @param {Array} checkedValues
     */

    NotificationChange = (checkedValues) => {
        this.setState({
            checkedValues
        });
        // console.log('checked = ', checkedValues);
    };

    /**
     * @description: 监听上传成功或者失败
     */
    handleFileChange = (e) => {
        // console.log(e)
        const { file } = e;
        if (file.status === 'uploading' || file.status === 'removed') {
            return;
        }
        if (file.status === 'done') {
            if (file.response.code === 1008) {
                openNotification('success', '提醒', '上传成功');
                this.handleOk();
                this.getSignInfoList(this.formRef.current.getFieldsValue());
            } else {
                const message = file.response.message || '上传失败';
                openNotification('warning', '提醒', message);
            }
        }
    };
    /**
     *
     *@description: 批量导出
     **/
    bulkdownload = (ids) => {
        const { selectedRowKeys, trusteeship } = this.state;
        const formData = this.formRef.current.getFieldsValue();
        fileExport({
            method: 'post',
            url: '/signConfirm/export',
            data: {
                ...formData,
                trusteeship: trusteeship,
                signConfirmIds: ids
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
     *@description: 列设置的下拉
     **/
    Columnmenu = () => {
        const { columnsStandard } = this.state;
        const newArray = [];
        const pitchonArray = [];
        columnsStandard.map((item, index) => {
            newArray.push({
                title: item.title,
                key: index,
                checkbox: true
            });
            pitchonArray.push(index);
        });
        // this.setState({
        //     pitchonArray
        // });
        return (
            <Tree
                style={{ width: '100%', paddingTop: 20, border: '1px solid #ccc' }}
                checkable
                defaultCheckedKeys={pitchonArray}
                onCheck={this.HeadColumn}
                // onCheck={onCheck}
                treeData={newArray}
            />
        );
    };
    /**
     *@description: 列设置变化
     **/
    HeadColumn = (selectedKeys, info) => {
        const select = info.checkedNodes;
        // console.log(select)
        // return;
        const { columnsStandard } = this.state;
        const headerArray = [];
        // columnsStandard.map(item=>)
        columnsStandard.forEach((currentValue) => {
            select.forEach((value) => {
                if (value.title === currentValue.title) {
                    headerArray.push(currentValue);
                }
            });
        });
        this.setState({
            columnsValue: headerArray
        });
    };
    /**
     *@description: 是否显示表头选项
     **/
    showColumn = () => {
        const { showColumn } = this.state;
        this.setState({
            showColumn: !showColumn
        });
    };
    /**
     *@description: 表格变化
     **/
    tableChange = (p, e, s) => {

        const { formValues } = this.state;
        // sortFiled: '', // 排序字段
        // sortType: '',
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageNum = p.current;
        this.state.pageData.sortFiled = s&& s.field;
        this.state.pageData.sortType = s && s.order && (s.order === 'ascend' ? 'asc':'desc');
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageSize = p.pageSize;
        this.getSignInfoList(this.formRef.current.getFieldsValue());
    };
    /**
     *@description: 切换托管行
     **/
    switchHosting = (value) => {
        // console.log(value);
    };

    /**
     *@description: 批量上传弹窗的okcancal
     **/
    handleOk = (e) => {
        // console.log(e);
        this.setState({
            showUpload: false
        });
    };

    handleCancel = (e) => {
        // console.log(e);
        this.setState({
            showUpload: false
        });
    };


    render() {
        const {
            datasources,
            pageData,
            selectedRowKeys,
            showColumn,
            columnsValue,
            isShow,
            showUpload,
            productList,
            customerList,
            trusteeshipList,
            trusteeship
        } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this._onSelectChange
        };
        const { loading } = this.props;


        return (
            <div className={styles.container}>
                <Modal
                    visible={showUpload}
                    closable={false}
                    //   onOk={this.handleOk}
                    //   onCancel={this.handleCancel}
                    footer={
                        <Row>
                            <Col span={6}>
                                <a href={`${window.location.origin}${BASE_PATH.adminUrl
                                }/signConfirm/import/template?tokenId=${getCookie('vipAdminToken')}&trusteeship=${trusteeship}`} download
                                >申赎下单模板下载</a>
                            </Col>
                            <Col span={3} offset={10}>
                                <Button type="primary" onClick={this.handleOk}>
                                    关闭
                                </Button>
                            </Col>
                            {/* <Col span={3} offset={1}>
                                <Button onClick={this.handleCancel}>取消</Button>
                            </Col> */}
                        </Row>
                    }
                >
                    <Dragger
                        name="file"
                        action={`${BASE_PATH.adminUrl}/signConfirm/import`}
                        headers={{
                            tokenId: getCookie('vipAdminToken')
                        }}
                        data={{
                            trusteeship
                        }}
                        showUploadList={false}
                        accept=".xlsx, .xls"
                        // beforeUpload={this.beforeUpload}
                        onChange={this.handleFileChange}
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        点击将表格拖拽到这里上传
                    </Dragger>
                </Modal>

                <div className={styles.filter}>
                    <Form name="basic" onFinish={this._onFinish} ref={this.formRef} {...formItemLayout}>
                        <Row gutter={[8, 0]}>
                            <Col span={8}>
                                <FormItem label="客户姓名" name="customerName">
                                    <Input placeholder="请输入客户名称" />
                                    {/* <Select
                                        placeholder="请输入客户名称"
                                        showSearch
                                        // autoClearSearchValue={false}
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {customerList.map((item, index) => (
                                            <Option key={item.customerId} value={item.customerName}>
                                                {item.customerName}
                                            </Option>
                                        ))}
                                    </Select> */}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="客户类型" name="customerType">
                                    <Select
                                        allowClear
                                        placeholder="请选择客户类型"
                                    >
                                        {XWcustomerCategoryOptions.map((item, index) => (
                                            <Option key={index} value={item.value}>
                                                {item.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </FormItem>
                            </Col>

                            <Col span={8}>
                                <FormItem label="证件号码" name="cardNumber">
                                    <Input allowClear placeholder="请输入证件号码" />
                                    {/* <Select
                                        placeholder="请选择产品名称"
                                        // autoClearSearchValue={false}
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {productList.map((item, index) => (
                                            <Option key={index} value={item.productName}>
                                                {item.productName}
                                            </Option>
                                        ))}
                                    </Select> */}
                                </FormItem>
                            </Col>

                            <Col span={8}>
                                <FormItem label="银行名称" name="bankName">
                                    <Input allowClear placeholder="请输入银行名称" />
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
                                <CustomRangePicker assignment={this.formRef} label="开放日日期" name="openDayDate"/>
                                {/* <FormItem label="开放日日期" name="openDayDate">
                                    <RangePicker style={{ width: '100%' }} format="YYYY/MM/DD" />
                                </FormItem> */}
                            </Col>

                        </Row>
                        <Row justify="end">
                            <Col span={6} offset={4} className={styles.btnGroup}>
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
                        <Row>
                            <Col span={12}>
                                {this.props.authEdit && <Button type="primary" disabled={!Boolean(trusteeship)} onClick={() => this.setState({ showUpload: true })}>批量上传</Button>}
                                {this.props.authExport && (
                                    <Dropdown
                                        overlay={<Menu>
                                            <Menu.Item
                                                key="1"
                                                disabled={!Boolean(trusteeship) || isEmpty(selectedRowKeys)}
                                                onClick={() => this.bulkdownload(selectedRowKeys)}
                                            >
                                                导出选中
                                            </Menu.Item>
                                            <Menu.Item
                                                key="0"
                                                disabled={!Boolean(trusteeship)}
                                                onClick={() => this.bulkdownload(undefined)}
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
                                {/* {this.props.authExport && <Button disabled={!Boolean(trusteeship) || isEmpty(selectedRowKeys)} onClick={this.bulkdownload} >批量导出</Button>} */}
                            </Col>
                            <Col span={12} style={{ textAlign: 'end' }}>
                                <span>选择托管：</span>
                                <Select
                                    allowClear
                                    placeholder="请选择托管"
                                    showSearch
                                    style={{ width: 200, textAlign: 'left' }}
                                    onChange={this.setTrusteeship}
                                    // autoClearSearchValue={false}
                                    filterOption={(input, option) =>
                                        option.children && option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {trusteeshipList.map((item) => (
                                        <Option key={item.trusteeship} value={item.trusteeship}>
                                            {item.trusteeshipName}
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                        </Row>
                    </div>
                    {/* {!isEmpty(selectedRowKeys) && ( */}
                    <Alert
                        message={
                            <Fragment>
                                <Row>
                                    <Col span={20}>
                                        已选择{' '}
                                        <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a>{' '}
                                        项&nbsp;&nbsp;
                                        {/* <a onClick={this._cleanSelectedKeys} style={{ marginLeft: 24 }}>
                                        清空
                                        </a> */}
                                    </Col>
                                    <Col span={4}>
                                        <Button onClick={this.showColumn} style={{ width: '100%' }}>
                                            列设置 <DownOutlined />
                                        </Button>
                                        <div
                                            style={{
                                                position: 'absolute',
                                                zIndex: 999,
                                                width: '100%'
                                            }}
                                        >
                                            {showColumn ? this.Columnmenu() : null}
                                        </div>

                                        {/*
                                      <Dropdown overlay={this.Columnmenu}>
                                          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>

                                          </a>
                                      </Dropdown> */}
                                    </Col>
                                </Row>
                            </Fragment>
                        }
                        type="info"
                        showIcon
                    />
                    {/* )} */}
                    <Table
                        loading={loading}
                        rowSelection={rowSelection}
                        columns={columnsValue}
                        dataSource={datasources.list}
                        rowKey="signConfirmId"
                        scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
                        sticky
                        pagination={paginationPropsback(datasources.total, datasources.pageNum)}
                        onChange={(p, e, s) => this.tableChange(p, e, s)}
                    />
                </div>
            </div>
        );
    }
}

export default connect(({ OrderList, loading }) => ({
    OrderList,
    loading: loading.effects['OrderList/SignConfirmList']
}))(List);
