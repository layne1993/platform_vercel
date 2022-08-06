import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Select, Modal, Button, Tooltip, notification } from 'antd';
import { connect } from 'umi';
import StandardTable from './StandardTable';
import { getRandomKey, listToMap } from '@/utils/utils';
import { XWCustomerLevel, XWcustomerCategoryOptions, XWnumriskLevel, CHANNELTYPE } from '@/utils/publicData';

import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;

function tips(arr) {
    if (arr instanceof Array) {
        return (
            <div>
                {arr.map((item) => (
                    <p key={getRandomKey(8)}>{item}</p>
                ))}
            </div>
        );
    }
    return '';
}

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};


// @Form.create()
class CustomerList extends PureComponent {
    static defaultProps = {
        handleUpdate: () => { },
        handleModalVisible: () => { }
    };
    constructor(props) {
        super(props);

        this.state = {
            formValues: {},
            selectedRows: [],
            dataList: [],
            pageData: {
                pageNum: 1,
                pageSize: 20
            },
            channelList: [],
            managerList: []
        };

        this.columns = [
            {
                title: '客户名称',
                width: 120,
                dataIndex: 'customerName',
                render: (text) => text
            },
            {
                title: '证件号码',
                width: 120,
                dataIndex: 'cardNumber',
                render: (text) => text || '--'
            },
            {
                title: '客户类别',
                width: 110,
                dataIndex: 'customerType',
                render: (val) => listToMap(XWcustomerCategoryOptions)[val]
            },
            {
                title: BASE_PATH.config && BASE_PATH.config.CustomerStatus || '客户等级',
                dataIndex: 'customerLevel',
                width: 100,
                render: (val) => listToMap(XWCustomerLevel)[val]
            },
            {
                title: '风险等级',
                width: 80,
                dataIndex: 'riskType',
                render: (val) => listToMap(XWnumriskLevel)[val]
            },
            {
                title: '持有产品',
                width: 100,
                dataIndex: 'productFullName',
                render: (text) => text || '--',
                ellipsis: true
            },
            {
                title: '渠道名称',
                width: 100,
                dataIndex: 'channelName',
                render: (text) => text || '--',
                ellipsis: true
            },
            {
                title: '渠道类型',
                width: 100,
                dataIndex: 'channelType',
                render: (txt) => {
                    if (txt) {
                        let txtArr = [];
                        CHANNELTYPE.map((item) => {
                            if (txt.includes(item.value)) {
                                txtArr.push(item.label);
                            }
                        });
                        return txtArr.join(',');
                    } else {
                        return '--';
                    }
                },
                ellipsis: true
            },
            {
                title: '客户经理',
                width: 100,
                dataIndex: 'managerUserNames',
                render: (text) => text || '--',
                ellipsis: true
            },
            // {
            //     title: '公众号',
            //     width: 65,
            //     dataIndex: 'OrderTemplateType',
            //     render: (val) => (val > -1 ? '已关注' : '未关注') //  1:已关注  0:已关注  -1:未关注
            // },
            {
                title: '手机号',
                width: 65,
                dataIndex: 'mobile',
                render: (val) => (val ? '已维护' : '未维护')
            },
            {
                title: '邮箱',
                width: 65,
                dataIndex: 'email',
                render: (val) => (val ? '已维护' : '未维护')
            }
        ];
    }


    componentDidMount() {
        this.handleSearch({});
        this.getChannelList();
        this.getManagerList();
    }


    // componentWillReceiveProps(nextProps) {
    //     //  设置dataList
    //     if (nextProps.data.length !== this.props.data.length) {
    //         // console.log(nextProps)
    //         this.setState({
    //             dataList: nextProps.data
    //         });
    //     }
    // }


    // 查询渠道
    getChannelList = () => {
        const { dispatch } = this.props;
        // 查询通配符列表
        dispatch({
            type: 'global/channelList',
            payload: {},
            callback: ({code, data, message = '查询失败'}) => {
                if (code === 1008) {
                    this.setState({
                        channelList: data || []
                    });
                } else {
                    openNotification('error', `失败（${code}）`, message, 'topRight');
                }
            }
        });
    }

    // 查询客户号经理
    getManagerList = () => {
        const { dispatch } = this.props;
        // 查询通配符列表
        dispatch({
            type: 'global/selectAllAccountManager',
            payload: {},
            callback: ({code, data, message = '查询失败'}) => {
                if (code === 1008) {
                    this.setState({
                        managerList: data || []
                    });
                } else {
                    openNotification('error', `失败（${code}）`, message, 'topRight');
                }
            }
        });
    }

    searchFormRef = React.createRef();

    handleSearch = (values) => {
        const { dispatch } = this.props;
        const { pageData } = this.state;
        // 查询通配符列表
        dispatch({
            type: 'tempForm/getMarketingCustomer',
            payload: {
                ...pageData,
                ...values
            },
            callback: (res) => {
                if (res.code === 1008) {
                    this.setState({
                        formValues: values,
                        dataList: res.data || []
                    });
                } else {
                    openNotification('error', `失败（${res.code}）`, res.message, 'topRight');
                }
            }
        });
    };

    tableChange = (p) => {
        this.setState({
            pageData: {
                pageNum: p.current,
                pageSize: p.pageSize
            }
        }, () => {
            const formData = this.searchFormRef.current.getFieldsValue();
            this.handleSearch(formData);
        });

    }

    handleFormReset = () => {
        const { data } = this.props;
        const { resetFields } = this.searchFormRef.current;
        resetFields();
        this.setState({
            formValues: {},
            dataList: data
        });
        this.handleSearch({});
    };

    // 模糊查询产品
    filterProduct = (inputValue, option) => option.props.children.includes(inputValue);

    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        // const { dispatch } = this.props;
        const { formValues } = this.state;

        const params = {
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
            ...formValues
        };
        if (sorter.field) {
            params.sorter = `${sorter.field}_${sorter.order}`;
        }
    };

    // 列表选中项
    handleSelectRows = (rowKeys, rows) => {
        this.setState({
            selectedRowKeys: rowKeys,
            selectedRows: rows
        });
    };

    renderForm() {
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
        const { productChildren, riskStyleChildren } = this.props;
        const { managerList, channelList } = this.state;
        return (
            <Form
                onFinish={this.handleSearch}
                layout="inline"
                ref={this.searchFormRef}
                {...formItemLayout}
            >
                <Row>
                    <Col span={8}>
                        <FormItem label="客户名称" name={'customerName'}>
                            <Input placeholder="请输入" allowClear />
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="客户类别"
                            name="customerType"
                        >
                            <Select placeholder="请选择"  allowClear>
                                {XWcustomerCategoryOptions.map((item) => (
                                    <Option key={item.value} value={item.value}>{item.label}</Option>
                                ))}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={BASE_PATH.config && BASE_PATH.config.CustomerStatus || '客户等级'}
                            name="customerLevel"
                        >
                            <Select placeholder="请选择"  allowClear>
                                {XWCustomerLevel.map((item) => (
                                    <Option key={item.value} value={item.value}>{item.label}</Option>
                                ))}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="风险等级" name={'riskType'}>
                            <Select placeholder="请选择"  allowClear>
                                {XWnumriskLevel.map((item) => (
                                    <Option key={item.value} value={item.value}>{item.label}</Option>
                                ))}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="现持有产品" name={'productIds'}>
                            <Select
                                mode="multiple"
                                showSearch
                                allowClear
                                filterOption={this.filterProduct}
                                placeholder="请选择，可搜索"
                            >
                                {productChildren}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="证件号码" name="cardNumber">
                            <Input allowClear/>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="渠道名称" name="channelId">
                            <Select
                                showSearch
                                allowClear
                                filterOption={this.filterProduct}
                                placeholder="请选择(支持模糊搜索)  "
                            >
                                {channelList.map((item) => (
                                    <Select.Option key={item.channelId} value={item.channelId}>{item.channelName}</Select.Option>
                                ))}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="渠道类型" name="channelType">
                            <Select
                                showSearch
                                allowClear
                                filterOption={this.filterProduct}
                                placeholder="请选择"
                            >
                                {CHANNELTYPE.map((item) => (
                                    <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                                ))}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="客户经理" name="managerUserIds">
                            <Select
                                // mode="multiple"
                                showSearch
                                allowClear
                                filterOption={this.filterProduct}
                                placeholder="请选择(支持模糊搜索)  "
                            >
                                {managerList.map((item) => (
                                    <Select.Option key={item.managerUserId} value={item.managerUserId}>{item.userName}</Select.Option>
                                ))}
                            </Select>
                        </FormItem>
                    </Col>

                    <Col span={8} offset={16} style={{ textAlign: 'end' }}>
                        <span className={styles.submitButtons}>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }


    renderFooter = () => {
        const { handleModalVisible, selectCustomerList } = this.props;
        const { selectedRowKeys = selectCustomerList } = this.state;
        return [
            <Button
                key="cancel"
                type="primary"
                onClick={() => handleModalVisible(false, selectedRowKeys, 1)}
            >
                确定
            </Button>
        ];
    };

    render() {
        const { modalVisible, handleModalVisible, selectCustomerList, loading } = this.props;
        const tempList = selectCustomerList.filter((item) => item !== 'all');
        const { dataList, selectedRows, selectedRowKeys = tempList, pageData } = this.state;
        // const tableData = {
        //     list: dataList
        // };
        return (
            <Modal
                width={1000}
                style={{ top: 20 }}
                bodyStyle={{ padding: '12px 15px 0px' }}
                maskClosable={false}
                // destroyOnClose
                title="选择通知客户"
                visible={modalVisible}
                footer={this.renderFooter()}
                onCancel={() => handleModalVisible(false, undefined, 1)}
                afterClose={() => handleModalVisible()}
            >
                <div className={styles.tableList}>
                    <div className={styles.tableListForm}>{this.renderForm()}</div>
                    <StandardTable
                        rowKey="customerId"
                        selectedRows={selectedRows}
                        selectedRowKeys={selectedRowKeys}
                        loading={loading}
                        data={dataList}
                        columns={this.columns}
                        onSelectRow={this.handleSelectRows}
                        onChange={this.tableChange}
                        pageData={pageData}
                        scroll={{ x: '100%', scrollToFirstRowOnChange:true, y: 400 }}
                    // onChange={this.handleStandardTableChange}
                    />
                </div>
            </Modal>
        );
    }
}


export default connect(({ tempForm, loading }) => ({
    tempForm,
    loading: loading.effects['tempForm/getMarketingCustomer']
}))(CustomerList);
