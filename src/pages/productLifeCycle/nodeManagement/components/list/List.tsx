/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-03-17 20:04:08
 * @LastEditTime: 2021-05-20 16:41:33
 */
import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Tag } from 'antd';
import MXTable from '@/pages/components/MXTable';
import moment from 'moment';
import { connect } from 'umi';
import type { PageData, TableListData } from './data.d';

const DATE_FORMAT = 'YYYY-MM-DD';

interface ListProps {
    loading: Boolean,
    dispatch: any,
    forwardRef: any,
    data: TableListData
}

const List: FC<ListProps> = (props) => {
    const { loading, data, forwardRef, dispatch } = props;
    const [pageData, setPageData] = useState<PageData>({ pageNum: 1, pageSize: 20 }); // 分页信息

    const columns = [
        {
            title: '关联产品',
            dataIndex: ''
        },
        {
            title: '节点状态',
            dataIndex: '',
            filters: [
                { text: '未开始', value: '1' },
                { text: '进行中', value: '2' },
                { text: '成功', value: '3' },
                { text: '延期', value: '4' }

            ],
            render: (val) => {
                const status = {
                    1: <Tag color="gray">未开始</Tag>,
                    2: <Tag color="#108ee9">进行中</Tag>,
                    3: <Tag color="#87d068">成功</Tag>,
                    4: <Tag color="red">延期</Tag>
                };
                return status[val] || '--';
            }
        },
        {
            title: '节点名称',
            dataIndex: ''
        },
        {
            title: '节点发起时间',
            dataIndex: '',
            render: (val) => val ? moment(val).format(DATE_FORMAT) : '--',
            sorter: (a, b) => a.age - b.age,
            ellipsis: true
        },
        {
            title: '流程标题',
            dataIndex: '',
            render: (val) => <a>{val}</a>
        },
        {
            title: '流程类型',
            dataIndex: ''
        },
        {
            title: '等待时间',
            dataIndex: ''
        },
        {
            title: '处理人',
            dataIndex: ''
        },
        {
            title: '操作',
            render: () => <a>详情</a>
        }
    ];

    // 查询数据
    const getListData = (pageData = { pageNum: 1, pageSize: 20 }) => {
        let params = {};
        if (forwardRef) {
            params = forwardRef.current.getFieldsValue();
        }
        dispatch({
            type: 'NODE_MANAGEMENT/getListData',
            payload: {
                ...params,
                ...pageData
            }
        });
    };

    // useEffect(getListData, []);

    /**
    * @description: 表格变化
    */
    const _tableChange = (p, e, s) => {
        setPageData({ pageNum: p.current, pageSize: p.pageSize });
        getListData({ pageNum: p.current, pageSize: p.pageSize });
    };



    return (
        <MXTable
            loading={loading}
            // rowSelection={rowSelection}
            columns={columns}
            dataSource={data.list || []}
            rowKey="identifyFlowId"
            scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
            sticky
            total={data.total}
            pageNum={pageData.pageNum}
            onChange={_tableChange}
        />
    );
};


export default connect(({ NODE_MANAGEMENT, loading }) => ({
    loading: loading.effects['NODE_MANAGEMENT/getListData'],
    data: NODE_MANAGEMENT.listData
}))(List);

List.defaultProps = {
    data: {
        list: [],
        pageSize: 0,
        pages: 0,
        total: 0
    },
    loading: false
};
