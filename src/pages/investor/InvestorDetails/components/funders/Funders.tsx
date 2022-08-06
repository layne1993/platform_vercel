/*
 * @Descripttion: 出资方信息
 * @version:
 * @Author: yezi
 * @Date: 2021-04-14 14:20:33
 * @LastEditTime: 2021-04-14 14:55:05
 */
import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { notification } from 'antd';
import MXTable from '@/pages/components/MXTable';
import { connect } from 'umi';
import type { PageData, TableListData } from './data.d';


const openNotification = (type, message, description, placement?, duration = 3) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};


interface FoundersProps {
    loading: Boolean,
    dispatch: any,
}

const initListData = {
    list: [],
    total: 0,
    pageSize: 20,
    pages: 1,
    pageNum: 1
};

const Founders: FC<FoundersProps> = (props) => {
    const { loading, dispatch } = props;
    const [listData, setListData] = useState<TableListData>(initListData);
    const [pageData, setPageData] = useState<PageData>({ pageNum: 1, pageSize: 20 });            // 分页信息
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);                        // 选中行

    // 查询数据
    const getListData = (pageData = { pageNum: 1, pageSize: 20 }) => {
        dispatch({
            type: 'INVESTOR_DETAIL/getListData',
            payload: {
                ...pageData
            },
            callback: ({ code, data, message }) => {
                if (code === 1008) {
                    setListData(data || {});
                } else {
                    const txt = message || data || '查询失败！';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };


    useEffect(getListData, []);

    /**
    * @description: 表格变化
    */
    const _tableChange = (p, e, s) => {
        setPageData({ pageNum: p.current, pageSize: p.pageSize });
        getListData({ pageNum: p.current, pageSize: p.pageSize });
    };

    const _onSelectChange = (selectedRowKeys: number[]) => {
        setSelectedRowKeys(selectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: _onSelectChange,
        getCheckboxProps: (record: any) => ({
            disabled: record.signedProgress !== 2 // Column configuration not to be checked
        })
    };

    // 表头
    const columns = [
        {
            title: '汇总信息',
            dataIndex: 'customerName',
            width: 200
        },
        {
            title: '出资方名称',
            dataIndex: 'productName',
            width: 200
        },
        {
            title: '是否为自有资金',
            dataIndex: 'agreementType',
            width: 100,
            render: (val: number) => val ? '是' : '否'
        },
        {
            title: '为配售对象的第几层出资方',
            dataIndex: 'agreementName',
            width: 150
        },
        {
            title: '出资方身份证明号码（组织机构代码证号/身份证号）',
            dataIndex: 'signedProgress',
            width: 300
        }
    ];

    return (
        <>
            <MXTable
                loading={loading}
                columns={columns}
                dataSource={listData.list || []}
                rowKey="agreementId"
                scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
                sticky
                total={listData.total}
                pageNum={pageData.pageNum}
                onChange={_tableChange}
            />
        </>
    );
};


export default connect(({ loading }) => ({
    loading: loading.effects['INVESTOR_DETAIL/getListData']
}))(Founders);

Founders.defaultProps = {
    loading: false
};
