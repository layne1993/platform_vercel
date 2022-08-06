/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-06 10:54:47
 * @LastEditTime: 2021-08-10 14:29:43
 */
import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import {
    Form,
    Row,
    Col,
    Input,
    Select,
    Button,
    Table,
    notification,
    Popconfirm,
    Space,
    Modal,
    message
} from 'antd';
import { paginationPropsback, COMFIRMATION_TEMPLATE_STATUS } from '@/utils/publicData';
import { numTransform, listToMap } from '@/utils/utils';
import Template from './../crateTemplate';
import moment from 'moment';

const DATE_FORMAT = 'YYYY/MM/DD HH:mm';

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

class TemplateList extends PureComponent {
    state = {
        selectedRowKeys: [],
        selectedRows: [],
        dataSource: {},
        userList: [],
        modalFlag: false,
        productList: [],
        productIds: [],
        record: {},
        pageData: {
            pageNum: 1,
            pageSize: 20
        }
    };

    componentDidMount() {
        this.getData();
        this.getManagerUser();
    }

    searchFormRef = React.createRef();

    columns = [
        {
            title: '模板名称',
            dataIndex: 'templateName',
            //   width: 300,
            ellipsis: true,
            render: (txt) => (txt ? txt : '--')
        },
        {
            title: '标题格式',
            dataIndex: 'titleFormat',
            //   width: 300,
            ellipsis: true,
            render: (arr) => {
                if (Array.isArray(arr)) {
                    return arr.join('');
                } else {
                    return '--';
                }
            }
        },
        // {
        //     title: '模板状态',
        //     dataIndex: 'enableStatus',
        //     //   width: 100,
        //     ellipsis: true,
        //     render: (txt) => listToMap(COMFIRMATION_TEMPLATE_STATUS)[txt]
        // },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            //   width: 100,
            ellipsis: true,
            render: (txt) => (txt ? moment(txt).format(DATE_FORMAT) : '--')
        },
        {
            title: '创建人',
            dataIndex: 'userName',
            //   width: 100,
            ellipsis: true,
            render: (txt) => (txt ? txt : '--')
        },
        // {
        //     title: '匹配产品',
        //     dataIndex: 'products',
        //     //   width: 200,
        //     ellipsis: true,
        //     render: (arr) => {
        //         if (Array.isArray(arr)) {
        //             let names = arr.map((item) => item.productName);
        //             return names.join('，');
        //         } else {
        //             return '--';
        //         }
        //     }
        // },
        {
            title: '操作',
            render: (record) =>
                this.props.authEdit && (
                    <Space>
                        <a onClick={() => this.edit(record)}>编辑</a>
                        {/* {record.enableStatus === 1 && (
                            <Popconfirm
                                title="确定禁用？"
                                onConfirm={() => this.doForbidden(record, 0)}
                            >
                                <a>禁用</a>
                            </Popconfirm>
                        )}

                        {record.enableStatus === 0 && (
                            <Popconfirm
                                title="确定启用？"
                                onConfirm={() => this.doForbidden(record, 1)}
                            >
                                <a>启用</a>
                            </Popconfirm>
                        )}

                        <a onClick={() => this.show(record)}>匹配产品</a> */}
                    </Space>
                )
        }
    ];

    // 编辑
    edit = (data) => {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.record = data;
        this.crateTempate();
    };

    // 请求数据
    getData = () => {
        const { dispatch } = this.props;
        const formData = this.searchFormRef.current.getFieldsValue();
        const { pageData } = this.state;
        this.setState({
            selectedRowKeys: [],
            selectedRows: []
        });
        dispatch({
            type: 'COMFIRMATION_TEMPLATE/getListData',
            payload: { ...formData, ...pageData, sortFiled: 'createTime', sortType: 'desc' },
            callback: (res) => {
                if (res.code !== 1008) {
                    const warningText = res.message || res.data || '查询失败，请稍后再试！';
                    openNotification(
                        'warning',
                        `提示（代码：${res.code}）`,
                        warningText,
                        'topRight',
                    );
                } else {
                    this.setState({ dataSource: res.data || {} });
                }
            }
        });
    };

    // 获取管理端用户
    getManagerUser = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'COMFIRMATION_TEMPLATE/getManagerUser',
            payload: { pageSize: '00' },
            callback: (res) => {
                let { code, data = {} } = res;
                if (code === 1008) {
                    this.setState({ userList: data.list || [] });
                } else {
                    const warningText = res.message || res.data || '查询失败，请稍后再试！';
                    openNotification('error', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };

    resetSearch = () => {
        this.searchFormRef.current.resetFields();
        const pageNum = 1;
        const pageSize = 20;
        this.setState({
            pageNum,
            pageSize,
            selectedRowKeys: [],
            selectedRows: []
        });
        this.getData({ pageNum, pageSize });
    };

    // 表格复选框change事件
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRows
        });
    };

    /**
     * @description 禁用
     * @param {*} record type 0 禁用 1启用
     */
    doForbidden = (record, type) => {
        const { dispatch } = this.props;
        let productIds = [];

        if (record.products && Array.isArray(record.products)) {
            record.products.map((item) => {
                productIds.push(item.productId);
            });
        }

        dispatch({
            type: 'COMFIRMATION_TEMPLATE/edit',
            payload: { ...record, productIds, enableStatus: type },
            callback: (res) => {
                if (res.code === 1008) {
                    if(type === 1) {
                        openNotification('success', '启用', '启用成功', 'topRight');
                    } else {
                        openNotification('success', '禁用', '禁用成功', 'topRight');
                    }

                    this.getData();
                } else {
                    const warningText = res.message || res.data || '禁用失败，请稍后再试！';
                    openNotification('error', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };

    /**
     * @description 禁用
     * @param {*} record
     */
    doMatchProduct = (record) => {
        const { dispatch } = this.props;
        const { productIds } = this.state;
        if (productIds.length === 0) {
            return message.warning('匹配产品不能为空！');
        }
        dispatch({
            type: 'COMFIRMATION_TEMPLATE/edit',
            payload: { ...record, productIds },
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification('success', '匹配', '匹配成功', 'topRight');
                    this.getData();
                    this.cancel();
                } else {
                    const warningText = res.message || res.data || '匹配失败，请稍后再试！';
                    openNotification('error', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };

    // 获取产品列表
    getProductList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'COMFIRMATION_TEMPLATE/productList',
            callback: (res) => {
                if (res.code === 1008) {
                    this.setState({
                        productList: res.data
                    });
                }
            }
        });
    };

    // 模态框显示
    show = (record) => {
        this.getProductList();
        let productIds = [];

        if (record.products && Array.isArray(record.products)) {
            record.products.map((item) => {
                productIds.push(item.productId);
            });
        }
        this.setState({ modalFlag: true, productIds, record });
    };

    // 取消
    cancel = () => {
        this.setState({ modalFlag: false, productIds: [], record: {} });
    };

    // 产品change事件
    productChange = (val) => {
        this.setState({ productIds: val });
    };

    // 份额确认书创建成功
    onOk = () => {
        this.getData();
        this.templateClose();
    };

    // 创建新的模板
    crateTempate = () => {
        this.setState({
            templateFlag: true
        });
    };

    // 关闭模态框
    templateClose = () => {
        this.setState({
            record: {},
            templateFlag: false
        });
    };

    render() {
        const {
            dataSource,
            pageData,
            userList = [],
            modalFlag,
            productList,
            productIds,
            record,
            templateFlag
        } = this.state;
        const { loading } = this.props;

        return (
            <div>
                <Form ref={this.searchFormRef} onFinish={this.getData}>
                    <Row gutter={[8, 0]}>
                        <Col span={6}>
                            <Form.Item label="模板名称" name="templateName">
                                <Input placeholder="请输入文件名称" allowClear />
                            </Form.Item>
                        </Col>

                        {/* {
                            <Col span={6}>
                                <Form.Item label="模板状态" name="enableStatus">
                                    <Select allowClear placeholder="请选择">
                                        {COMFIRMATION_TEMPLATE_STATUS.map((item) => {
                                            return (
                                                <Select.Option key={item.value} value={item.value}>
                                                    {item.label}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                        } */}

                        <Col span={6}>
                            <Form.Item label="创建人" name="userId">
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder="请输入搜索"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children &&
                                        option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {userList.map((item, index) => (
                                        <Select.Option key={index} value={item.managerUserId}>
                                            {item.userName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6} style={{ textAlign: 'right' }}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                                    搜索
                                </Button>
                                <Button onClick={this.resetSearch} style={{ marginRight: 8 }}>
                                    重置
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Row gutter={[0, 10]}>
                    {this.props.authEdit && (
                        <Button
                            type="primary"
                            style={{ marginRight: 8 }}
                            onClick={this.crateTempate}
                        >
                            添加新的模板
                        </Button>
                    )}
                </Row>
                <Table
                    loading={loading}
                    rowKey="confirmFileTemplateId"
                    columns={this.columns}
                    dataSource={dataSource.list || []}
                    pagination={paginationPropsback(dataSource.total, pageData.pageNum)}
                    onChange={(p, e, s) => this._tableChange(p, e, s)}
                />

                <Modal
                    title="匹配产品"
                    visible={modalFlag}
                    onOk={() => this.doMatchProduct(record)}
                    onCancel={this.cancel}
                    maskClosable={false}
                >
                    <Select
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        value={productIds}
                        mode="multiple"
                        style={{ width: 400, marginRight: 15 }}
                        placeholder="请选择"
                        allowClear
                        onChange={(val, option) => this.productChange(val)}
                    >
                        {productList.map((item, index) => {
                            return (
                                <Select.Option key={index} value={item.productId}>
                                    {item.productName}
                                </Select.Option>
                            );
                        })}
                    </Select>
                </Modal>

                {templateFlag && (
                    <Template
                        modalFlag={templateFlag}
                        onClose={this.templateClose}
                        onOk={this.onOk}
                        params={record}
                    />
                )}
            </div>
        );
    }
}

export default connect(({ loading }) => ({
    loading: loading.effects['COMFIRMATION_TEMPLATE/getListData']
}))(TemplateList);
