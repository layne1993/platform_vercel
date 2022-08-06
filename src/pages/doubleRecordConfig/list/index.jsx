/*
 * @description: 智能双录列表
 * @Author: tangsc
 * @Date: 2020-12-01 15:35:06
 */
import React, { PureComponent, Fragment } from 'react';
import { history, connect, Link } from 'umi';
import { Button, Row, Col, Form, Space, Table, notification, Select, Card } from 'antd';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import {
    DOUBLE_RECORD_TYPE,
    paginationPropsback
} from '@/utils/publicData';
import { PlusOutlined } from '@ant-design/icons';
import styles from './style.less';
import { isEmpty } from 'lodash';
import { listToMap, getCookie } from '@/utils/utils';
import moment from 'moment';

// 设置日期格式
const dateFormat = 'YYYY/MM/DD';

const FormItem = Form.Item;
const { Option } = Select;


// 提示信息
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
        pageData: {
            // 当前的分页数据
            pageNum: 1,
            pageSize: 20
        },
        dataSource: {}
    };


    componentDidMount() {
        this._search();
    }

    // 表单实例对象
    formRef = React.createRef();

    // Table的列
    columns = [
        {
            title: '双录类型',
            dataIndex: 'doubleType',
            render: (val) => (val ? listToMap(DOUBLE_RECORD_TYPE)[val] : '--')
        },
        {
            title: '系统双录版本号',
            dataIndex: 'versionNumber',
            width:130
        },
        {
            title: '模板名称',
            dataIndex: 'templateName'
        },
        {
            title: '模板状态',
            dataIndex: 'isLatestVersion',
            render: (val, record) => (val === 1 && record.publishStatus === 1) ? '有效' : '失效'
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            // sorter: true,
            render: (time) => time ? moment(time).format('YYYY/MM/DD HH:mm') : '--'
        },
        {
            title: '创建人',
            dataIndex: 'userName',
            render: (val) => (val || '--')
        },
        {
            title: '发布状态',
            dataIndex: 'publishStatus',
            render: (val) => val === 0 ? '编辑中' : '已发布'
        },
        {
            title: '操作',
            render: (_, record) => (

                <Fragment>
                    {/* <Link to={`/raisingInfo/doubleRecordConfig/generalDoubleDetails/${record.sysWordId}`}>{(record.isLatestVersion === 1 && record.publishStatus === 1) ? '查看' : '编辑'}</Link> */}
                    {
                        record.doubleType === 2 ?
                            <Link to={`/raisingInfo/doubleRecordConfig/aiMindDetails/${record.sysWordId}`}>{(record.publishStatus === 1) ? '查看' : '编辑'}</Link>
                            :
                            <Link to={`/raisingInfo/doubleRecordConfig/generalDoubleDetails/${record.sysWordId}`}>{(record.publishStatus === 1) ? '查看' : '编辑'}</Link>
                    }
                </Fragment>


            )
        }
    ];

    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = () => {
        this.setState({
            selectedRowKeys:[],
            pageData: {
                // 当前的分页数据
                ...this.state.pageData,
                pageNum: 1,
                // pageSize: 20
            }
        }, ()=>{
            this._search();
        });

        // console.log('test');
    };


    /**
     * @description: 列表查询
     */
    _search = () => {

        // const formData = this.formRef.current.getFieldsValue();
        const { pageData } = this.state;
        const { dispatch } = this.props;

        dispatch({
            type: 'DOUBLE_RECORD/templateList',
            payload: {
                // ...formData,
                ...pageData,
                sortFiled: 'updateTime',
                sortType: 'desc'
            },
            callback: (res) => {
                if (res.code === 1008) {
                    this.setState({
                        dataSource: res.data || {}
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
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageNum = 1;
        this.setState({
            selectedRowKeys:[],
        })
        this._search();
    };


    /**
     * @description: 表格变化
     */
    _tableChange = (p, e, s) => {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageNum = p.current;
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageSize = p.pageSize;
        this._search();
    }


    /**
     * @description: 新建AI智能双录
     */
    _onAdd = (type) => {
        if (type === 1) {
            history.push({
                pathname: `/raisingInfo/doubleRecordConfig/generalDoubleDetails/${0}`
            });
        }

        if (type === 2) {
            history.push({
                pathname: `/raisingInfo/doubleRecordConfig/aiMindDetails/${0}`
            });
        }

    };

    rowClassName = (record) => {
        if (record.isLatestVersion === 1 && record.publishStatus === 1) return styles.rowStyle;
        return null;
    }


    render() {
        const { pageData, dataSource } = this.state;
        const { loading } = this.props;
        // eslint-disable-next-line no-undef
        const defaultDoubleCheckType = sessionStorage.getItem('defaultDoubleCheckType');
        // eslint-disable-next-line no-undef
        const { authEdit } = sessionStorage.getItem('PERMISSION') && JSON.parse(sessionStorage.getItem('PERMISSION'))['60200'] || {};

        return (
            <PageHeaderWrapper title="双录模板配置列表" >
                <GridContent>
                    <Card extra={<Button type="primary" onClick={this._search}>刷新页面</Button>}>
                        <div className={styles.container}>
                            {/* <div className={styles.filter}>
                                <Form name="basic" onFinish={this._onFinish} ref={this.formRef} labelCol={{ span: 8 }}>
                                    <Row gutter={[8, 0]}>
                                        <Col span={8}>
                                            <FormItem label="双录类型" name="doubleType">
                                                <Select allowClear placeholder="请选择双录类型">
                                                    {
                                                        DOUBLE_RECORD_TYPE.map((item, index) => (<Select.Option key={index} value={item.value}>{item.label}</Select.Option>))
                                                    }
                                                </Select>
                                            </FormItem>
                                        </Col>
                                        <Col span={16} className={styles.btnGroup}>
                                            <Button type="primary" htmlType="submit">
                                                查询
                                            </Button>
                                            <Button onClick={this._reset}>重置</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </div> */}
                            <div className={styles.dataTable}>
                                <div className={styles.operationBtn}>
                                    {(defaultDoubleCheckType === '1' && authEdit) &&
                                        <Button type="primary" icon={<PlusOutlined />} onClick={() => this._onAdd(1)}>
                                            新建普通双录
                                        </Button>
                                    }

                                    {
                                        (defaultDoubleCheckType === '2' && authEdit) &&
                                        <Button type="primary" icon={<PlusOutlined />} onClick={() => this._onAdd(2)}>
                                            新建AI双录
                                        </Button>
                                    }

                                    {
                                        (defaultDoubleCheckType === '3' && authEdit) &&
                                        <Space>
                                            <Button type="primary" icon={<PlusOutlined />} onClick={() => this._onAdd(1)}>
                                                新建普通双录
                                            </Button>
                                            <Button type="primary" icon={<PlusOutlined />} onClick={() => this._onAdd(2)}>
                                                新建AI双录
                                            </Button>
                                        </Space>
                                    }

                                    <span className={styles.note}>注：同一时间仅有一个话术生效</span>
                                </div>
                                <Table
                                    loading={loading}
                                    columns={this.columns}
                                    rowKey="sysWordId"
                                    dataSource={dataSource.list || []}
                                    scroll={{ x: '100%', scrollToFirstRowOnChange:true }}
                                    pagination={paginationPropsback(
                                        dataSource.total,
                                        pageData.pageNum
                                    )}
                                    onChange={(p, e, s) => this._tableChange(p, e, s)}
                                // rowClassName={this.rowClassName}
                                />
                            </div>
                        </div>
                    </Card>
                </GridContent>
            </PageHeaderWrapper>

        );
    }
}


export default connect(({ DOUBLE_RECORD, loading }) => ({
    DOUBLE_RECORD,
    loading: loading.effects['DOUBLE_RECORD/templateList']
}))(List);

