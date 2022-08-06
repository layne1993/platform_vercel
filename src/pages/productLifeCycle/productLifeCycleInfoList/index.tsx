import { Card, Row, Col, Statistic, Tag, Form, Input, Select, DatePicker, notification, Space, Button, Modal, Tooltip, Badge } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ExclamationCircleTwoTone, ExclamationCircleOutlined } from '@ant-design/icons';

import React, { Component } from 'react';
import { connect, history } from 'umi';
import _styles from './style.less';
import { LIFE_STATUS } from '@/utils/publicData';
import { listToMap, getPermission } from '@/utils/utils';
import MXTable from '@/pages/components/MXTable';
import Notices from './components/Notices/Notices';
import NewFlowModal from './components/NewFlowModal/NewFlowModal';
import { MultipleSelect } from '@/pages/components/Customize';

import moment from 'moment';
const FormItem = Form.Item;

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


const openNotification = (type, message, description, placement, duration = 3) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const status_color = {
    1: '#FDC854', //进行中
    2: '#EB4C47', // 延期
    3: '#188FFF' // 完成
};


const DATE_FORMAT = 'YYYY-MM-DD: HH:mm:ss';

interface ProductLifeCycleInfoListProps {
    dispatch: any
}

interface StateProps {
    loading: boolean,
    selectedRowKeys: any[],
    dataSource: any & {},
    pageData: any,
    crateFlowModalFlag: boolean,
    handlePersion: any[]
}

const { authEdit, authExport } = getPermission(40100);
class ProductLifeCycleInfoList extends Component<ProductLifeCycleInfoListProps, StateProps> {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            selectedRowKeys: [],
            dataSource: {},
            pageData: {
                pageNum: 1,
                pageSize: 20
            },
            crateFlowModalFlag: false,      // 创建流程的模态框
            handlePersion: []              // 处理人
        };
    }

    componentDidMount() {
        this.getListData();
        // this.getHandlePersion();
    }

    // 表单实例对象
    formRef = React.createRef<FormInstance>();


    columns = [
        {
            title: '流程标题',
            dataIndex: 'processTitle',
            width: 200,
            ellipsis: true,
            render: (val: string, record) => val ? <Tooltip placement="topLeft" title={val}><a style={{ width: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} onClick={() => this.goDetail(record)}>{val}</a></Tooltip> : '--'
        },
        {
            title: '模板名称',
            dataIndex: 'templateName',
            width: 200,
            render: (val?: string) => val || '--'
        },
        {
            title: '关联产品',
            dataIndex: 'productFullName',
            width: 200,
            render: (val?: string) => val || '--'
            // render: (val, record) => <a onClick={() => this.goProductDetail(record)} >{val}</a>
        },
        {
            title: '状态',
            dataIndex: 'flowStatus',
            width: 80,
            render: (val?: number) => {
                // const status = {
                //     1: <Tag color="#108ee9">进行中</Tag>,
                //     2: <Tag color="red">延期</Tag>,
                //     3: <Tag color="#87d068">成功</Tag>

                // };
                return val ? <Badge color={status_color[val]} text={listToMap(LIFE_STATUS)[val]} /> : '--';
            }

        },
        {
            title: '当前节点序号',
            dataIndex: 'sequence',
            width: 110,
            render: (val?: number) => val || '--'
        },
        {
            title: '当前节点名称',
            dataIndex: 'nodeName',
            width: 200,
            render: (val?: string) => val || '--'
        },
        {
            title: '当前节点发起时间',
            dataIndex: 'startDate',
            width: 200,
            render: (val) => val ? moment(val).format(DATE_FORMAT) : '--',
            sorter: (a, b) => a.startDate - b.startDate,
            ellipsis: true
        },
        {
            title: '处理人',
            dataIndex: 'managerUserName',
            width: 100,
            ellipsis: true,
            render: (val?: string) => val ? <Tooltip title={val}><p style={{ width: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</p></Tooltip> : '--'
        },
        {
            title: '备注',
            dataIndex: 'auditOpinion',
            width: 100,
            ellipsis: true,
            render: (val?: string) => val || '--'
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            width: 120,
            render: (val) => val ? moment(val).format(DATE_FORMAT) : '--',
            sorter: (a, b) => a.createTime - b.createTime,
            ellipsis: true
        },
        {
            title: '操作',
            width: 100,
            render: (record) => (
                <Space>
                    {authEdit && <a onClick={() => this.cancelPre([record.lifecycleFlowId])}>撤销</a>}
                    <a onClick={() => this.goDetail(record)}>详情</a>
                </Space>

            )
        }
    ]

    /**
     * @description 获取table 数据
     */
    getListData = () => {
        const { dispatch } = this.props;
        const formData = this.formRef.current.getFieldsValue();
        const { pageData } = this.state;
        dispatch({
            type: 'PRODUCTLIFECYCLEINFO/getListData',
            payload: {
                ...formData,
                ...pageData,
                createTime: formData.createTime ? moment(formData.createTime).format('YYYY-MM-DD') : undefined
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
     * @description 获取处理人数据
     */
    getHandlePersion = () => {

        const { dispatch } = this.props;
        dispatch({
            type: 'PRODUCTLIFECYCLEINFO/getAdminUserList',
            payload: {},
            callback: (res) => {
                if (res.code === 1008) {
                    this.setState({ handlePersion: res.data || {} });
                } else {
                    const warningText = res.message || res.data || '查询失败！';
                    openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                }
            }
        });
    }


    /**
     * @description 做撤销操作请求接口
     */
    doCancel = (ids: number[]) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'PRODUCTLIFECYCLEINFO/repealLifeCycleProcess',
            payload: { lifecycleFlowIdList: ids },
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification('success', '成功', '撤销成功', 'topRight');
                    this.getListData();
                } else {
                    const warningText = res.message || res.data || '操作失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    }

    /**
     * @description 撤销前提醒
     */
    cancelPre = (arr: number[]) => {
        Modal.confirm({
            title: '请您确认是否撤销该条流程？',
            icon: <ExclamationCircleOutlined />,
            content: '撤销后该流程将不可恢复',
            okText: '确认',
            cancelText: '取消',
            onOk: () => this.doCancel(arr)
        });
    }


    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = () => {
        this.setState({
            selectedRowKeys:[],
            pageData: {
                ...this.state.pageData,
                pageNum: 1
                // pageSize: 20
            }
        });
        this.getListData();
    };

    /**
     * @description:重置过滤条件
     */
    _reset = () => {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageNum = 1;
        this.formRef.current.resetFields();
        this.getListData();
        this.setState({ selectedRowKeys: [] });
    };

    /**
     * @description 创建流程
     */
    crateFlow = (flag: boolean) => {
        this.setState({ crateFlowModalFlag: flag });
    }


    /**
     * @description 查看详情
     *  lifecycleFlowId 流程id
     *  lifecycleNodeDataId 节点id
     */
    goDetail = (record: { lifecycleFlowId: number }) => {
        history.push(`/productLifeCycleInfo/list/processDetails/${record.lifecycleFlowId}`);
    }

    /**
     * @description 查看产品详情
     */
    goProductDetail = (record: { productId?: number } = { productId: 0 }) => {
        history.push(`/product/list/details/${record.productId}`);
    }


    /**
     * @description table checkbox
     * @param {*} selectedRowKeys
     */
    _onSelectChange = (selectedRowKeys: number[]) => {
        this.setState({ selectedRowKeys });
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


    render() {
        const { loading, dataSource, pageData, selectedRowKeys, crateFlowModalFlag, handlePersion } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this._onSelectChange
        };
        return (
            <PageHeaderWrapper>

                {/* 通知连部分 */}
                {/* <Notices data={[]} /> */}

                <Card style={{ marginTop: 15 }}>
                    <Form
                        name="basic"
                        onFinish={this._onFinish}
                        ref={this.formRef}
                        {...formItemLayout}
                    >
                        <Row gutter={[8, 0]}>
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
                                <FormItem label="流程标题" name="processTitle">
                                    <Input placeholder="请输入" allowClear />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="创建时间" name="createTime">
                                    <DatePicker style={{ width: '100%' }} format={'YYYY-MM-DD'} allowClear />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="状态" name="flowStatus">
                                    <Select placeholder="请选择" allowClear>
                                        {LIFE_STATUS.map((item) => {
                                            return (
                                                <Select.Option key={item.value} value={item.value}>
                                                    {item.label}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="处理人" name="managerUserName">
                                    <Input placeholder="请输入" allowClear />
                                    {/* <Select
                                        placeholder="请选择"
                                        allowClear
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {handlePersion.map((item) => {
                                            return (
                                                <Select.Option key={item.value} value={item.value}>
                                                    {item.label}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select> */}
                                </FormItem>
                            </Col>
                            <Col span={8} style={{ textAlign: 'end' }}>
                                <Space>
                                    <Button type="primary" htmlType="submit">查询</Button>
                                    <Button onClick={this._reset}>重置</Button>
                                </Space>
                            </Col>

                        </Row>
                    </Form>
                    <Row>
                        <Space>
                            {authEdit && <Button type="primary" onClick={() => this.crateFlow(true)}>创建流程</Button>}
                            {authEdit && <Button danger disabled={selectedRowKeys.length === 0} onClick={() => this.cancelPre(selectedRowKeys)} >撤销</Button>}
                        </Space>
                    </Row>
                    <MXTable
                        loading={loading}
                        rowSelection={rowSelection}
                        columns={this.columns}
                        dataSource={dataSource.list || []}
                        rowKey="lifecycleFlowId"
                        scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
                        sticky
                        total={dataSource.total}
                        pageNum={pageData.pageNum}
                        onChange={this._tableChange}
                    />
                </Card>

                {/* 创建模态框 */}
                {crateFlowModalFlag &&
                    <NewFlowModal
                        flag={crateFlowModalFlag}
                        onClose={() => this.crateFlow(false)}
                        goProductDetail={this.goProductDetail}
                        onSuccess={() => this.crateFlow(false)}
                    />
                }

            </PageHeaderWrapper>
        );
    }
}

export default connect(({ loading }) => ({
    loading: loading.effects['PRODUCTLIFECYCLEINFO/getListData']
}))(ProductLifeCycleInfoList);
