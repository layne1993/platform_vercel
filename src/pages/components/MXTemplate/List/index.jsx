/*
 * @description:
 * @Author: tangsc
 * @Date: 2020-12-21 17:37:06
 */
import { Button, Modal, Form, Row, Col, Input, Select, notification, Alert, Popover, Tooltip } from 'antd';
import React, { Component } from 'react';
import { connect, Link, history } from 'umi';
import {
    XWTemplateType,
    XWReleaseStatus,
    XWEnableStatus,
    XWdeleteState,
    paginationPropsback
} from '@/utils/publicData';
import { getRandomKey } from '@/utils/utils';
import moment from 'moment';
import styles from './style.less';
import MXTable from '@/pages/components/MXTable';
import { PlusOutlined, ExclamationCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { isEmpty, isUndefined } from 'lodash';
import { MultipleSelect } from '@/pages/components/Customize';
import TextLoop from 'react-text-loop';

const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

class TemplateList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datasources: {},
            formValues: {},
            current: 1,
            pageSize: 20,
            powerInfo: {},
            tipsList: [],
            order: ''
        };
    }

    componentDidMount() {
        const { productId } = this.props;
        if (productId !== '0') {
            this.Interfacesearch({}, 1, 20);
            this._queryProtocolAlert();
        }
        this._setColums();
    }

    searchFormRef = React.createRef();

    columns = [

        {
            title: '协议类型',
            dataIndex: 'documentType',
            width: 100,
            render: (val) => (
                <span>
                    {val || val === 0
                        ? XWTemplateType.find((item) => item.value === val).label
                        : '--'}
                </span>
            )
        },
        {
            title: '协议编号',
            dataIndex: 'documentCode',
            width: 100,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '协议名称',
            dataIndex: 'documentName',
            width: 100,
            render: (val, record) => (
                <Link
                    to={
                        this.props.type === 'templateType' ?
                            `/raisingInfo/template/templateList/detail/${record.documentId}?productId=${record.productId}`
                            :
                            `/product/list/details/${this.props.productId}/template/${record.documentId}?type=${this.props.type}&productId=${record.productId}`
                    }
                >
                    {val || '--'}
                </Link>
            )
        },
        {
            title: '协议版本',
            dataIndex: 'documentVersion',
            width: 80,
            render: (val) => <span>{val || '--'}</span>
        },
        // {
        //     title: '关联协议',
        //     dataIndex: 'relatedDocumentCode',
        //     width: 120,
        //     render: (val) => <span>{val || '--'}</span>
        // },
        {
            title: '托管方参与',
            dataIndex: 'trusteeStatus',
            width: 100,
            render: (val) => <span>{val === 0 ? '不参与' : '参与'}</span>
        },
        {
            title: '签署客户数',
            align: 'center',
            dataIndex: 'signCustomerNum',
            width: 100,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '发布状态',
            align: 'center',
            dataIndex: 'publishStatus',
            width: 80,
            render: (val) => (
                <span>
                    {val || val === 0
                        ? XWReleaseStatus.find((item) => item.value === val).label
                        : '--'}
                </span>
            )
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            width: 120,
            sorter: true,
            render: (val) => (
                <span>{(val && moment(val).format('YYYY/MM/DD HH:mm')) || '--'}</span>
            )
        },
        {
            title: '操作',
            width: 100,
            render: (_, record) => {
                return (
                    <div>
                        {
                            this.props.authEdit &&
                            <Link
                                style={{ marginRight: 5 }}
                                to={
                                    this.props.type === 'templateType' ?
                                        `/raisingInfo/template/templateList/detail/${record.documentId}?productId=${record.productId}`
                                        :
                                        `/product/list/details/${this.props.productId}/template/${record.documentId}?type=${this.props.type}&productId=${record.productId}`
                                }
                            >
                                编辑
                            </Link>
                        }
                        {
                            this.props.authEdit && record.publishStatus === 2 &&
                            <span
                                style={{ color: '#3D7FFF', cursor: 'pointer' }}
                                onClick={() => this._handleOperate(record.documentId, 1)}
                            >
                                恢复
                            </span>
                        }
                        {
                            this.props.authEdit && record.publishStatus === 1 &&
                            <span
                                style={{ color: '#3D7FFF', cursor: 'pointer' }}
                                onClick={() => this._handleOperate(record.documentId, 2)}
                            >
                                废除
                            </span>
                        }
                    </div>
                );
            }
        }
    ];

    /**
     * @description: 查询协议警示
     * @param {*}
     */
    _queryProtocolAlert = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'templateList/getProtocolAlert',
            payload: {},
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        tipsList: res.data
                    });
                }
            }
        });
    }

    /**
     * @description: 废除、恢复
     * @param {*}
     */
    _handleOperate = (id, status) => {
        const { formValues, current, pageSize } = this.state;
        const { dispatch } = this.props;
        let title = status === 1 ? '点击恢复后该协议需客户签署' : '点击废除后该协议无需客户签署';
        let content = status === 1 ? '该流程只对修改后的流程生效，请确认您的操作' : '该流程只对修改后的流程生效，请确认您的操作';
        const _this = this;
        confirm({
            title: title,
            icon: <ExclamationCircleOutlined />,
            content: content,
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'templateList/abolishOrRecovery',
                    payload: {
                        documentId: id,
                        publishStatus: status
                    },
                    callback: (res) => {
                        if (res.code === 1008) {
                            openNotification('success', '提示', '设置成功', 'topRight');

                            _this.Interfacesearch(formValues, current, pageSize);
                        } else {
                            const warningText = res.message || res.data || '设置失败！';
                            openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                        }
                    }
                });
            },
            onCancel() {
                // console.log('Cancel');
            }
        });
    }

    /**
     * @description: 设置表头列
     * @param {*}
     */
    _setColums = () => {
        const { productId, type } = this.props;
        if (type === 'productTab') {
            this.columns.splice(1, 0,
                {
                    title: <span><Tooltip placement="top" title={'默认读取母基金的所有协议文档，如在子基金创建协议，那么只有这个子基金签署时需要签署本文件'}><InfoCircleOutlined /></Tooltip>&nbsp;母基金文件</span>,
                    dataIndex: 'isParentFund',
                    render: (val) => <span>{val || '--'}</span>,
                    width:100
                }
            );
        }
        if (!productId) {
            this.columns.unshift(
                {
                    title: '产品名称',
                    dataIndex: 'productName',
                    width: 100,
                    fixed: 'left',
                    render: (val, record) => (
                        <Link
                            to={
                                this.props.type === 'templateType' ?
                                    `/raisingInfo/template/templateList/detail/${record.documentId}?documentCode=${record.documentCode}&productId=${record.productId}`
                                    :
                                    `/product/list/details/${this.props.productId}/template/${record.documentId}?documentCode=${record.documentCode}&type=${this.props.type}&productId=${record.productId}`
                            }
                        >
                            {val || '--'}
                        </Link>
                    )
                });
        }
    }


    Interfacesearch = (values, pageNum, pageSize) => {
        const { order } = this.state;
        const { dispatch, productId } = this.props;
        dispatch({
            type: 'templateList/queryTemplateList',
            payload: {
                ...values,
                productName: values.productName && values.productName.trim(),
                documentName: values.documentName && values.documentName.trim(),
                pageNum: pageNum || 1,
                pageSize: pageSize || 20,
                createTimeSort: (order && (order === 'ascend' ? 'asc' : 'desc')) || undefined,
                publishStatus: values.publishStatus,
                startStatus: values.startStatus === 2 ? '' : values.startStatus,
                isDelete: values.isDelete === 2 ? '' : values.isDelete,
                productId: !!productId ? productId : undefined
            },
            callback: (res) => {
                if (res.code === 1008) {
                    this.setState({
                        datasources: res
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

    // 重置搜索
    resetSearch = () => {
        this.searchFormRef.current.resetFields();
        this.setState({
            formValues: {},
            current: 1,
            pageSize: 20
        });
        this.Interfacesearch({}, 1, 20);
    };

    // 搜索
    handerSearch = (values) => {
        const { current, pageSize } = this.state;
        this.Interfacesearch(values, 1, 20);
        this.setState({
            formValues: { ...values }
        });
    };

    // 新建产品
    NewlyBuild = () => {
        const { productId, type } = this.props;
        if (productId === '0') {
            openNotification('warning', '提醒', '请先创建产品');
        } else {
            if (type === 'templateType') {
                history.push('/raisingInfo/template/templateList/detail/0');
            } else {
                history.push(`/product/list/details/${this.props.productId}/template/0?type=${this.props.type}&proId=${productId}`);
            }

        }
    };

    // 页码改变
    // pageNumChange = (current, size) => {
    //     const { formValues } = this.state;
    //     this.Interfacesearch(formValues, current, size, 'desc');
    //     this.setState({
    //         current
    //     });
    // };

    // pageSizeChange = (page, pageSize) => {
    //     const { formValues } = this.state;
    //     this.Interfacesearch(formValues, page, pageSize, 'desc');
    //     this.setState({
    //         current: page
    //     });
    // };

    tableChange = (p, e, s) => {
        const { formValues } = this.state;
        this.setState({
            current: p.current,
            pageSize: p.pageSize,
            order: s.order
        }, () => {
            this.Interfacesearch(formValues, p.current, p.pageSize);
        });
    };

    contentRender = (data) => {
        return (
            <React.Fragment>
                {
                    data ? (data || []).map((item, index) => (
                        <p key={index}>{index + 1}、{item}</p>
                    )) : '暂无数据'
                }
            </React.Fragment>
        );
    }

    update = () => {
        const { dispatch, productId } = this.props;
        const { error, confirm, success } = Modal;
        dispatch({
            type: 'templateList/queryDocumentInfo',
            payload: {
                productId
            },
            callback: (res) => {
                const { data } = res;
                res.code === 1009 && error({
                    title: res.message
                });
                // 无任何创建模板
                res.code === 1031 && confirm({
                    title: '同步失败',
                    icon: <CloseCircleOutlined style={{ color: 'red' }} />,
                    content: '您好，您还未创建任何模板，点击确认，前往创建',
                    okText: '确 定，前往协议创建',
                    cancelText: '关闭',
                    onOk: () => {
                        this.props.goTab15();
                    }
                });
                // 模板均在创建中
                res.code === 1032 && error({
                    title: '同步失败',
                    icon: <CloseCircleOutlined style={{ color: 'red' }} />,
                    content: '模板均在创建中',
                    okText: '关闭'
                });
                // 暂无新增
                res.code === 1033 && error({
                    title: '同步失败',
                    icon: <CloseCircleOutlined style={{ color: 'red' }} />,
                    content: '暂无新增',
                    okText: '关闭'
                });
                // 全部同步
                res.code === 1034 && success({
                    title: '同步成功',
                    content: '全部同步',
                    okText: '关闭'
                });
                // 部分同步
                res.code === 1035 && success({
                    title: '同步成功',
                    width: 600,
                    content: (
                        <div>
                            <p>您好，协议同步结果如下：</p>
                            <div style={{
                                paddingLeft: 20
                            }}
                            >
                                <p>已同步{(res.data?.haveSynchronous || []).length}个：模板名称：<Popover trigger="click" content={this.contentRender(res.data?.haveSynchronous)}><span className={styles.goToT15Span}>点击查看</span></Popover>；</p>
                                <p>已废除{(res.data?.theAbolitionOfThe || []).length}个，模板名称：<Popover trigger="click" content={this.contentRender(res.data?.theAbolitionOfThe)}><span className={styles.goToT15Span}>点击查看</span></Popover>；</p>
                                <p>还有{(res.data?.beEditing || []).length}个在创建中无法同步，<span className={styles.goToT15Span} onClick={(e) => {
                                    Modal.destroyAll();
                                    this.props.goTab15();
                                }}
                                                                                   >点击此处继续创建</span>，<Popover trigger="click" content={this.contentRender(res.data?.beEditing)}><span className={styles.goToT15Span}>点击查看</span></Popover>；</p>
                            </div>
                        </div>
                    ),
                    okText: '关闭'
                });
                this.resetSearch();
            }
        });

    }

    renderSearch = () => {
        const { type } = this.props;

        const { productDetails: { linkSimu, productInfo}, productId } = this.props;
        return (
            <Form
                ref={this.searchFormRef}
                hideRequiredMark
                onFinish={this.handerSearch}
            // initialValues={{
            //     publishStatus: 2,
            //     startStatus: 2,
            //     isDelete: 2
            // }}
            >
                <Row gutter={8}>
                    {
                        !productId &&
                        <Col span={6}>
                            <MultipleSelect
                                params="productIds"
                                value="productId"
                                label="productName"
                                mode="multiple"
                                formLabel="产品名称"
                            />
                        </Col>
                    }
                    {
                        productId &&
                        <Col span={6}>
                            <FormItem label="发布状态" name="publishStatus">
                                <Select placeholder="请选择" allowClear>
                                    <Option key={getRandomKey(6)} value={0}>编辑中</Option>
                                    <Option key={getRandomKey(6)} value={1}>已发布</Option>
                                    <Option key={getRandomKey(6)} value={2}>已废除</Option>
                                    <Option key={getRandomKey(6)} value={3}>废除中</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    }
                    <Col span={6}>
                        <FormItem label="协议名称" name="documentName">
                            <Input placeholder="请输入" autoComplete="off" />
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem label="协议类型" name="documentType">
                            <Select placeholder="请选择" allowClear>
                                {XWTemplateType.map((itemT) => (
                                    <Option key={getRandomKey(6)} value={itemT.value}>
                                        {itemT.label}
                                    </Option>
                                ))}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={6} className={styles.formBtn}>
                        <FormItem>
                            <Button type="primary" htmlType="submit" loading={false}>
                                查询
                            </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.resetSearch}>
                                重置
                            </Button>
                        </FormItem>
                    </Col>
                </Row>
                {
                    !productId &&
                    <Row gutter={8}>
                        <Col span={6}>
                            <FormItem label="发布状态" name="publishStatus">
                                <Select placeholder="请选择" allowClear>
                                    <Option key={getRandomKey(6)} value={0}>编辑中</Option>
                                    <Option key={getRandomKey(6)} value={1}>已发布</Option>
                                    <Option key={getRandomKey(6)} value={2}>已废除</Option>
                                    <Option key={getRandomKey(6)} value={3}>废除中</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                }
                <Row>
                    <Col span={12}>
                        {
                            this.props.authEdit &&
                            <Button type="primary" icon={<PlusOutlined />} onClick={this.NewlyBuild}>
                                新建
                            </Button>
                        }
                        {
                            this.props.authEdit && !linkSimu && (type !== 'templateType') &&
                            <Button
                                onClick={this.props.goTab15}
                                type="primary"
                                icon={<PlusOutlined />}
                                style={{
                                    marginLeft: 8
                                }}
                            >
                                创建有托管电子协议
                            </Button>
                        }
                        {
                            this.props.authEdit && !linkSimu && (type !== 'templateType') && productInfo.fundLevel !==1 &&
                            <Button
                                style={{
                                    marginLeft: 8
                                }}
                                onClick={(e) => this.update()}
                            >
                                手动同步电子协议
                            </Button>
                        }
                    </Col>
                </Row>
            </Form>
        );
    };

    render() {
        const { datasources, current, tipsList } = this.state;
        const { loading, loading2, productId } = this.props;
        return (
            <div className={styles.container}>
                {
                    !isEmpty(tipsList) && isUndefined(productId) &&
                    <Alert
                        className={styles.tipsWrapper}
                        message={
                            <TextLoop mask>
                                {
                                    tipsList.map((item, index) => {
                                        return (
                                            <div key={index}>
                                                {item}
                                            </div>
                                        );
                                    })
                                }
                            </TextLoop>
                        }
                        type="warning"
                        showIcon
                        closable
                    />
                }

                <div className={styles.searchForm}>{this.renderSearch()}</div>
                {/* <Table
                    // actionRef={actionRef}
                    rowKey={(record) => record.documentId}
                    pagination={paginationPropsback(
                        datasources.data && datasources.data.total,
                        current,
                        // this.pageNumChange,
                        // this.pageSizeChange,
                    )}
                    columns={this.columns}
                    dataSource={datasources.data && datasources.data.list}
                    loading={loading}
                    onChange={(p, e, s) => this.tableChange(p, e, s)}
                /> */}
                <MXTable
                    loading={loading || loading2}
                    columns={this.columns}
                    dataSource={datasources.data && datasources.data.list}
                    total={datasources.data && datasources.data.total}
                    pageNum={current}
                    rowKey={(record) => record.documentId}
                    onChange={(p, e, s) => this.tableChange(p, e, s)}
                    rowSelection={null}
                    scroll={{ x: '100%', y: 500 }}
                />
            </div>
        );
    }
}

export default connect(({ templateList, loading, productDetails }) => ({
    loading: loading.effects['templateList/queryTemplateList'],
    loading2: loading.effects['templateList/queryDocumentInfo'],
    templateList,
    productDetails
}))(TemplateList);
