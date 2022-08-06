import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
interface propsTs {
    dataSource: array;
}

const YearTable: React.FC<propsTs> = (props) => {
    const { dataSource, titleArr } = props;

    const [dataHistory, setdataHistory] = useState<array>([]);
    const [columns, setcolumns] = useState<array>([]);

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
                    props: {}
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
            }
        },
        {
            title: '指标',
            dataIndex: 'index',
            width: 120
        }
    ];

    const columnsTwo = [
        {
            title: '今年以来',
            dataIndex: 'sinceYear',
            width: 120
        },
        {
            title: '成立以来',
            dataIndex: 'fromSet',
            width: 120
        }
    ];

    useEffect(() => {
        // 处理dataSource 得到表头
        const noStrArr = ['index', 'type'];
        if (titleArr && titleArr.length) {
            titleArr.forEach((item) => {
                const titleRender = () => {
                    if (item == 'sinceYear') {
                        return '今年以来';
                    }
                    if (item == 'fromSet') {
                        return '成立以来';
                    } else return item;
                };
                !noStrArr.includes(item) &&
                    columnsHistory.push({
                        title: titleRender(),
                        dataIndex: item,
                        width: 120
                    });
            });
        }

        setcolumns([...columnsHistory]);
    }, [dataSource, titleArr]);

    return (
        <div>
            <Table
                columns={columns}
                dataSource={dataSource}
                bordered
                pagination={false}
                scroll={{ x: 1500 }}
            />
        </div>
    );
};

export default YearTable;
