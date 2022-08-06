import React, { useEffect, useState } from 'react';
import { Table } from 'antd';

interface propsTs {
    dataSource: array;
}

const HistoryTable: React.FC<propsTs> = (props) => {
    const { dataSource } = props;

    const [dataHistory, setdataHistory] = useState<array>([]);

    //历史指标表格数据
    const columnsHistory = [
        {
            title: '类型',
            dataIndex: 'type',
            width: 120,
            align: 'center',
            render: (value, row, index) => {
                const obj = {
                    children: value,
                    props: {},
                };
                if (index === 0) {
                    obj.props.rowSpan = 4;
                }
                if (index > 0 && index < 4) {
                    obj.props.rowSpan = 0;
                }
                if (index === 4) {
                    obj.props.rowSpan = 3;
                }
                if (index > 4 && index < 7) {
                    obj.props.rowSpan = 0;
                }
                if (index === 7) {
                    obj.props.rowSpan = 4;
                }
                if (index > 7) {
                    obj.props.rowSpan = 0;
                }
                return obj;
            },
        },
        {
            title: '指标',
            width: 120,
            dataIndex: 'index',
        },
        {
            title: '当前区间',
            width: 120,
            dataIndex: 'current',
        },
        {
            title: '近一月',
            width: 120,
            dataIndex: 'm1',
        },
        {
            title: '近三月',
            width: 120,
            dataIndex: 'm3',
        },
        {
            title: '近六月',
            width: 120,
            dataIndex: 'm6',
        },
        {
            title: '近一年',
            width: 120,
            dataIndex: 'y1',
        },
        {
            title: '近二年',
            width: 120,
            dataIndex: 'y2',
        },
        {
            title: '近三年',
            width: 120,
            dataIndex: 'y3',
        },
        {
            title: '近五年',
            width: 120,
            dataIndex: 'y5',
        },
        {
            title: '成立以来',
            width: 120,
            dataIndex: 'fromSet',
        },
    ];

    useEffect(() => {}, []);

    return (
        <div>
            <Table
                columns={columnsHistory}
                dataSource={dataSource}
                bordered
                pagination={false}
                scroll={{ x: 1500 }}
            />
        </div>
    );
};

export default HistoryTable;
