import React, { useEffect, useState } from 'react';
import { Table } from 'antd';

interface propsTs {
    dataSource: array;
}

const MonthTable: React.FC<propsTs> = (props) => {
    const { dataSource } = props;

    const [dataHistory, setdataHistory] = useState<array>([]);

    //历史指标表格数据
    const columnsHistory = [
        {
            title: '年度',
            dataIndex: 'year',
            width: 120,
            align: 'center',
            render: (value, row, index) => {
                const obj = {
                    children: value,
                    props: {},
                };
                if (index % 2) {
                    obj.props.rowSpan = 0;
                } else {
                    obj.props.rowSpan = 2;
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
            title: '1月',
            width: 120,
            dataIndex: 'm1',
        },
        {
            title: '2月',
            width: 120,
            dataIndex: 'm2',
        },
        {
            title: '3月',
            width: 120,
            dataIndex: 'm3',
        },
        {
            title: '4月',
            width: 120,
            dataIndex: 'm4',
        },
        {
            title: '5月',
            width: 120,
            dataIndex: 'm5',
        },
        {
            title: '6月',
            width: 120,
            dataIndex: 'm6',
        },
        {
            title: '7月',
            width: 120,
            dataIndex: 'm7',
        },
        {
            title: '8月',
            width: 120,
            dataIndex: 'm8',
        },
        {
            title: '9月',
            width: 120,
            dataIndex: 'm9',
        },
        {
            title: '10月',
            width: 120,
            dataIndex: 'm10',
        },
        {
            title: '11月',
            width: 120,
            dataIndex: 'm11',
        },
        {
            title: '12月',
            width: 120,
            dataIndex: 'm12',
        },
        {
            title: '年度收益',
            width: 120,
            dataIndex: 'yearTotal',
        },
        {
            title: '累计收益',
            width: 120,
            dataIndex: 'total',
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
                scroll={{ x: 2000 }}
            />
        </div>
    );
};

export default MonthTable;
