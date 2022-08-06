import { Modal, Table, notification, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { XWAppointmentType, paginationPropsback } from '@/utils/publicData';
import { listToMap, getCookie, exportExcel } from '@/utils/utils';
import moment from 'moment';



const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};




const productRecord = (props) => {
    const { flag, loading, params } = props;
    const [data, setData] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    /**
     * @description 获取变更记录
     */
    const queryRecord = () => {
        const {dispatch} = props;
        dispatch({
            type: 'INVESTOR_BANKINFO/viewChangeHistory',
            payload: {productId: params.productId, customerId: params.customerId, customerBankId: params.customerBankId, pageNum, pageSize},
            callback: (res) => {
                if(res.code === 1008){
                    setData(res.data || []);
                }
            }
        });
    };

    useEffect(queryRecord, [pageNum, pageSize]);

    // 关闭模态框
    const closeModal = () => {
        props.closeModal();
    };


    // 变更记录表头
    const record_data_columns = [
        {
            title:'产品名称',
            dataIndex: 'productFullName'
        },
        {
            title: '产品编号',
            dataIndex: 'fundRecordNumber'
        },
        {
            title: '上次交易类型',
            dataIndex: 'transactionType',
            render: (val) => listToMap(XWAppointmentType)[val]
        },
        {
            title: '上次交易金额',
            dataIndex: 'tradeMoney',
            render: (val) => val || '--'
        },
        {
            title: '更新后交易金额',
            dataIndex: 'updateTradeMoney',
            render: (val) => val || '--'
        },
        {
            title: '更新日期',
            dataIndex: 'updateTime',
            render: (val) => val ? moment(val).format('YYYY/MM/DD') : '--'
        }
    ];

    /**
    * @description: 表格变化
    */
    const _tableChange = (p, e, s) => {
        setPageNum(p.current);
        setPageSize(p.pageSize);
        setSelectedRowKeys([]);
        setSelectedRows([]);
    };

    // 下载文档
    const _batchDownload = () => {
        selectedRows;
        let data = selectedRows.map((item) =>({
            ...item,
            transactionType: listToMap(XWAppointmentType)[item.transactionType],
            updateTime: item.updateTime && moment(item.updateTime).format('YYYY/MM/DD')
        }) );
        const option = {
            fileName: new Date().getTime(),
            datas: [
                {
                    sheetData: data,
                    sheetName: 'sheet',
                    sheetFilter: [
                        'productFullName',
                        'fundRecordNumber',
                        'transactionType',
                        'tradeMoney',
                        'updateTradeMoney',
                        'updateTime'
                    ],
                    sheetHeader: [
                        '产品名称',
                        '产品编号',
                        '上次交易类型',
                        '上次交易金额',
                        '更新后交易金额',
                        '更新日期'
                    ]
                // columnWidths: [20, 20],
                }
            ]
        };
        exportExcel(option);
        return true;
    };

    const _onSelectChange = (selectedRowKeys, selectedRows) => {
        setSelectedRowKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: _onSelectChange
    };


    // console.log(selectedRowKeys, 'selectedRowKeys');

    return (
        <Modal
            title="变更记录"
            visible={flag}
            onCancel={closeModal}
            footer={null}
            width={800}
        >
            <Table
                loading={loading}
                rowKey={(record, index) => index}
                columns={record_data_columns}
                dataSource={data.list || []}
                rowSelection={rowSelection}
                pagination={paginationPropsback(
                    data.total,
                    pageNum
                )}
                scroll={{x: '100%', y: 500}}
                title={() => <Button disabled={selectedRowKeys.length === 0} onClick={_batchDownload} >批量导出</Button>}
                onChange={_tableChange}
            />
        </Modal>
    );
};

export default connect(({ SIGN_REDEMING, loading }) => ({
    SIGN_REDEMING,
    loading: loading.effects['INVESTOR_BANKINFO/viewChangeHistory']
}))(productRecord);

productRecord.defaultProps = {
    params: {},
    flag: false,
    closeModal: () => {},
    onSuccess: () => {}
};
