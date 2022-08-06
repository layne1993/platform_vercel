/*
 * @description: 模板列表
 * @Author: tangsc
 * @Date: 2021-03-12 09:13:27
 */

import React, { Component } from 'react';
import { connect, history } from 'umi';
import { Button, Row, Col, Form, Modal, Input, Space, notification, Card } from 'antd';
import { paginationPropsback, XWAppointmentType, templateStatus } from '@/utils/publicData';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './style.less';
import moment from 'moment';
import MXTable from '@/pages/components/MXTable';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getPermission } from '@/utils/utils';

// 设置日期格式
const dateFormat = 'YYYY/MM/DD HH:mm:ss';

const FormItem = Form.Item;

// 获取确认框
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
class NewProductLifeCycleInfoTemplate extends Component {
    state = {
        selectedRowKeys: [], // 选中table行的key值
        pageData: {
            // 当前的分页数据
            current: 1,
            pageSize: 20
        },
        searchParams: {},              // 查询参数
        sortFiled: '',                 // 排序字段
        sortType: ''                  // 排序类型：asc-升序；desc-降序
    };

    componentDidMount() {
        this._search();
    }


    // 表单实例对象
    formRef = React.createRef();

    // Table的列
    columns = [
        {
            title: '模板名称',
            dataIndex: 'templateName',
            fixed: 'left',
            width: 120,
            render: (val, record) => {
                return (
                    <span className="details" onClick={() => this._handleDetails(record)}>
                        {val || '--'}
                    </span>
                );
            }
        },
        {
            title: '状态',
            dataIndex: 'templateStatuis',
            width: 100,
            render: (val) => {
                let obj = templateStatus.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '使用次数',
            dataIndex: 'numberOfUse',
            width: 80,
            render: (val) => <span>{val}</span>
        },
        {
            title: '创建人',
            dataIndex: 'managerUserName',
            width: 100,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            width: 120,
            sorter: true,
            render: (val) => <span>{val && moment(val).format(dateFormat) || '--'}</span>
        },
        {
            title: '操作',
            dataIndex: 'operate',
            // fixed: 'right',
            width: 80,
            render: (text, record) => {
                const { authEdit } = getPermission(40400);
                return (
                    <Space>
                        <span className="details" onClick={() => this._handleDetails(record)}>{record.templateStatuis !== 2 ? '编辑' : '查看'} </span>
                        {
                            authEdit && record.templateStatuis === 2 &&
                            <span className="details" onClick={() => this._setDisable(3, record)}>禁用</span>
                        }
                        {
                            authEdit && record.templateStatuis === 3 &&
                            <span className="details" onClick={() => this._setDisable(2, record)}>启用</span>
                        }
                    </Space>
                );
            }
        }
    ];

    /**
     * @description: 查看详情
     * @param {*} record
     */
    _handleDetails = (record) => {
        history.push({
            pathname: `/productLifeCycleInfo/productLifeCycleInfoTemplate/newProductLifeCycleInfoTemplate/${record.lifecycleTemplateId}`
        });
    }

    /**
     * @description: 点击新建模板
     */
    _addTemplate = () => {
        history.push({
            pathname: '/productLifeCycleInfo/productLifeCycleInfoTemplate/newProductLifeCycleInfoTemplate/0'
        });
    }




    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = (values) => {
        this.setState({
            searchParams: {
                ...values
            },
            selectedRowKeys:[],
            pageData: {
                // 当前的分页数据
                current: 1,
                // pageSize: 20
            }
        }, () => {
            this._search();
        });
    };

    /**
     * @description: 列表查询
     */
    _search = () => {

        const { pageData, sortFiled, sortType, searchParams } = this.state;
        const { dispatch } = this.props;
        const tempObj = {};
        if (!!sortType) {
            tempObj.sortFiled = sortFiled;
            tempObj.sortType = sortType;
        }

        dispatch({
            type: 'newProductLifeCycleInfoTemplate/querylifeCycleTemplateList',
            payload: {
                pageNum: pageData.current || 1,
                pageSize: pageData.pageSize || 20,
                ...tempObj,
                ...searchParams
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        templateList: res.data
                    });
                } else {
                    const warningText = res.message || res.data || '查询失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    }


    /**
     * @description:重置过滤条件
     */
    _reset = () => {
        this.formRef.current.resetFields();
        this.setState({
            searchParams: {},
            selectedRowKeys:[],
        }, () => {
            this._search();
        });
    };


    /**
     * @description: 表格变化
     */
    _tableChange = (p, e, s) => {
        this.setState({
            sortFiled: s.field,
            sortType: !!s.order ? s.order === 'ascend' ? 'asc' : 'desc' : undefined,
            pageData: {
                current: p.current,
                pageSize: p.pageSize
            }
        }, () => {
            this._search();
        });
    }

    /**
     * @description: 禁用/启用模板
     * @param {*} type 3：禁用 2： 启用
     * @param {*} record table 选中行数据
     */
    _setDisable = (type, record) => {

        const { dispatch } = this.props;
        let _this = this;
        let tips = type === 2 ? '启用' : '禁用';
        confirm({
            title: `请您确认是否${tips}当前节点?`,
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'productTemplate/updateTemplatStatus',
                    payload: {
                        templateStatuis: type,
                        templateName: record.templateName,
                        lifecycleTemplateId: record.lifecycleTemplateId
                    },
                    callback: (res) => {
                        if (res.code === 1008 && res.data) {
                            openNotification('success', '提示', '设置成功', 'topRight');
                            _this._search();
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

    };

    render() {
        const { pageData, templateList } = this.state;
        const { loading } = this.props;
        // eslint-disable-next-line no-undef
        const { authEdit } = getPermission(40400);

        return (
            <PageHeaderWrapper title="模板列表">
                <GridContent className={styles.tabsCard}>
                    <Card
                        bordered={false}
                    >
                        <div className={styles.container}>
                            <div className={styles.filter}>
                                <Form name="basic" onFinish={this._onFinish} ref={this.formRef} labelCol={{ span: 8 }}>
                                    <Row gutter={[8, 0]} className={styles.rowWrapper}>
                                        <Col span={6}>
                                            <FormItem label="模板名称" name="templateName">
                                                <Input placeholder="请输入" autoComplete="off" />
                                            </FormItem>
                                        </Col>
                                        <Col span={6} className={styles.btnGroup}>
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
                                    {
                                        authEdit &&
                                        <Button type="primary" onClick={this._addTemplate}>创建流程模板</Button>
                                    }


                                </div>
                                <MXTable
                                    loading={loading}
                                    columns={this.columns}
                                    dataSource={templateList && templateList.list}
                                    total={templateList && templateList.total}
                                    pageNum={pageData.current}
                                    rowKey={(record) => record.lifecycleTemplateId}
                                    onChange={(p, e, s) => this._tableChange(p, e, s)}
                                    scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
                                    sticky
                                />
                            </div>
                        </div>

                    </Card>
                </GridContent>
            </PageHeaderWrapper>
        );
    }
}

export default connect(({ newProductLifeCycleInfoTemplate, loading }) => ({
    newProductLifeCycleInfoTemplate,
    loading: loading.effects['newProductLifeCycleInfoTemplate/querylifeCycleTemplateList']
}))(NewProductLifeCycleInfoTemplate);
