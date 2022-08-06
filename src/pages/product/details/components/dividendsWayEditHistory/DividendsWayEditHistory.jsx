/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-04-12 11:31:19
 * @LastEditTime: 2021-04-16 17:20:17
 */


import React, { useState, useEffect } from 'react';
import { Modal, notification, Button } from 'antd';
import { connect } from 'umi';
import MXTable from '@/pages/components/MXTable';
import { fileExport } from '@/utils/utils';

// 提示信息
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const HistoryRecord = (props) => {
    const { flag, cancel, params, loading, dispatch, rowKey, columns } = props;
    const [data, setData] = useState({});
    const [pageData, setPageData] = useState({ pageSize: 20, pageNum: 1 });
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    /**
     * @description 获取分红方式修改记录
     */
    const getDividendsWayEditHistory = (pageData={ pageSize: 20, pageNum: 1 }) => {
        dispatch({
            type: 'productDetails/dividendWayHistory',
            payload: { ...params, pageData },
            callback: ({res, code, data, message}) => {
                if (code === 1008) {
                    setData(data || {});
                } else {
                    const warningText = message || data || '开启失败！';
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

    useEffect(getDividendsWayEditHistory, []);

    const _tableChange = (p) => {
        setPageData({ pageNum: p.current, pageSize: p.pageSize });
        getDividendsWayEditHistory({ pageNum: p.current, pageSize: p.pageSize });
    };

    /**
     * @description 批量下载
     */
    const batchDownload = (ids) => {
        fileExport({
            method: 'post',
            url: '/dividendWayRecord/batchExport',
            data: { dividendWayRecordId: ids },
            callback: ({ status, message }) => {
                if (status === 'success') {
                    cancel();
                    openNotification('success', '提醒', message);
                }
                if (status === 'error') {
                    openNotification('error', '提醒', message);
                }
            }
        });
    };


    const rowSelection = {
        selectedRowKeys,
        onChange: setSelectedRowKeys,
        preserveSelectedRowKeys: true
    };

    return (
        <Modal
            title="分红方式修改记录"
            visible={flag}
            footer={null}
            onCancel={cancel}
            width={'80%'}
        >
            <Button disabled={selectedRowKeys.length === 0} onClick={()=> batchDownload(selectedRowKeys)} >批量下载</Button>
            <MXTable
                rowKey={rowKey}
                loading={loading}
                columns={columns}
                dataSource={data.list || []}
                total={data.total || []}
                pageNum={pageData.current}
                onChange={(p, e, s) => _tableChange(p, e, s)}
                rowSelection={rowSelection}
                scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
            />
        </Modal>
    );
};



export default connect(({ loading }) => ({
    loading: loading.effects['productDetails/dividendWayHistory']
}))(HistoryRecord);

HistoryRecord.defaultProps = {
    flag: false,
    rowKey: 'id',
    columns: [],
    cancel: () => { },
    onSubmit: () => { }
};
