/*
 * @description: 智能双录列表
 * @Author: tangsc
 * @Date: 2020-12-01 15:35:06
 */
import React, { PureComponent, Fragment } from 'react';
import { history, connect, Link } from 'umi';
import { Button, Row, Col, Form, Input, Table, notification, Select, Card } from 'antd';
import {
    DOUBLE_RECORD_TYPE,
    paginationPropsback
} from '@/utils/publicData';
import styles from './style.less';
import { listToMap } from '@/utils/utils';
import moment from 'moment';

// 设置日期格式
const dateFormat = 'YYYY/MM/DD';


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
            title: '模板状态',
            dataIndex: 'isLatestVersion',
            render: (val, record) => (val === 1 && record.publishStatus === 1) ? '有效' : '失效'
        },
        {
            title: '系统双录版本号',
            dataIndex: 'versionNumber'
        },
        {
            title: '产品双录版本号',
            dataIndex: 'templateName'
        },
        {
            title: '使用次数',
            dataIndex: 'useNumber',
            render: (val) => (val || '--')
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
                    <a onClick={() => this.goEdit(record)}>编辑</a>
                </Fragment>


            )
        }
    ];


    /**
     * 编辑
     * @param {} data
     */
    goEdit = (data) => {
        if(this.props.setTab) {
            this.props.setTab(data);
        }
    }

    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = () => {
        this._search();
    };


    /**
     * @description: 列表查询
     */
    _search = () => {

        let formData = {};
        if(this.formRef.current) {
            formData = this.formRef.current.getFieldsValue();
        }
        const { pageData } = this.state;
        const { dispatch, params } = this.props;

        dispatch({
            type: 'PRODUCT_DOUBLE/templateList',
            payload: {
                ...params,
                ...formData,
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


    rowClassName = (record) => {
        if (record.isLatestVersion === 1 && record.publishStatus === 1) return styles.rowStyle;
        return null;
    }

    render() {
        const { pageData, dataSource } = this.state;
        const { loading } = this.props;

        return (
            <div className={styles.container}>
                <div className={styles.dataTable}>
                    <div className={styles.operationBtn}>
                        <span className={styles.note}>注：同一时间仅有一个话术生效</span>
                    </div>
                    <Button type="primary" onClick={this._search}>刷新页面</Button>
                    <Table
                        loading={loading}
                        columns={this.columns}
                        rowKey="productTemplateId"
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
        );
    }
}


export default connect(({ PRODUCT_DOUBLE, loading }) => ({
    PRODUCT_DOUBLE,
    loading: loading.effects['PRODUCT_DOUBLE/templateList']
}))(List);

