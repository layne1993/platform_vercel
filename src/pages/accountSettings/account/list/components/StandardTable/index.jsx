import { Table } from 'antd';
import React, { Component } from 'react';
import styles from './index.less';

function initTotalList(columns) {
    if (!columns) {
        return [];
    }

    const totalList = [];
    columns.forEach((column) => {
        if (column.needTotal) {
            totalList.push({ ...column, total: 0 });
        }
    });
    return totalList;
}

class StandardTable extends Component {
    constructor(props) {
        super(props);
        const { columns } = props;
        const needTotalList = initTotalList(columns);
        this.state = {
            // selectedRowKeys: [],
            needTotalList
        };
    }


    handleTableChange = (pagination, filters, sorter, ...rest) => {
        const { onChange } = this.props;
        // console.log(pagination, filters, sorter);
        if (onChange) {
            onChange(pagination, filters, sorter, ...rest);
        }
    };

    render() {
        // const { selectedRowKeys } = this.state;
        const { data, pagination, rowKey, ...rest } = this.props;
        const { list = []} = data || {};
        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            // showTotal: (total, range) => `共 ${total} 条记录 第${range[1]/(range[1]-range[0]+1)}/${Math.ceil(total/(range[1]-range[0]+1))} `,

            pageSizeOptions: ['10', '20', '50', '100', '200', '300', '400', '500', '1000', '999999'],
            ...pagination,
            defaultPageSize:'20',
            showTotal: (total, range) => `共 ${total} 条记录 第${pagination.current} - ${pagination.allPage} 页`
        };

        return (
            <div className={styles.standardTable}>
                <Table
                    rowKey={rowKey || 'managerUserId'}
                    scroll={{ x: '100%', scrollToFirstRowOnChange:true }}
                    dataSource={list}
                    pagination={paginationProps}
                    onChange={this.handleTableChange}
                    {...rest}
                />
            </div>
        );
    }
}

export default StandardTable;
