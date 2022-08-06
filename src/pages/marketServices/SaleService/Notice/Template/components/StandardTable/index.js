import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';
function initTotalList(columns) {
    const totalList = [];
    columns.forEach((column) => {
        if (column.needTotal) {
            totalList.push({ ...column, total: 0 });
        }
    });
    return totalList;
}

class StandardTable extends PureComponent {
    constructor(props) {
        super(props);
        const { columns, selectedRowKeys = [] } = props;
        const needTotalList = initTotalList(columns);
        this.state = {
            selectedRowKeys,
            needTotalList
        };
    }

    static getDerivedStateFromProps(nextProps) {
    // clean state
        if (nextProps.selectedRows.length === 0 && nextProps.selectedRowKeys.length === 0) {
            const needTotalList = initTotalList(nextProps.columns);
            return {
                selectedRowKeys: [],
                needTotalList
            };
        }
        return null;
    }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
      let { needTotalList } = this.state;

      needTotalList = needTotalList.map((item) => ({
          ...item,
          total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0)
      }));
      const { onSelectRow } = this.props;
      if (onSelectRow) {
          onSelectRow(selectedRowKeys, selectedRows);
      }
      this.setState({ selectedRowKeys, needTotalList });
  };

  handleTableChange = (pagination, filters, sorter) => {
      const { onChange } = this.props;
      if (onChange) {
          onChange(pagination, filters, sorter);
      }
  };

  cleanSelectedKeys = () => {
      this.handleRowSelectChange([], []);
  };

  render() {
      const { selectedRowKeys, needTotalList } = this.state;
      const { data = {}, rowKey, pageData, ...rest } = this.props;
      const { list = [], total, pageNum, pages } = data;
      const paginationProps = {
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '50', '100', '200', '300', '400', '500', '1000', '999999'],
          total,
          defaultPageSize:'20',
          current:pageData.pageNum
          //   showTotal: (total, range) => `共 ${total} 条记录 第${pageNum} - ${pages} 页`
      };
      const rowSelection = {
          selectedRowKeys,
          onChange: this.handleRowSelectChange,
          getCheckboxProps: (record) => ({
              disabled: record.disabled
          }),
          preserveSelectedRowKeys:true
      };
      console.log('props', this.props);
      return (
          <div className={styles.standardTable}>
              <div className={styles.tableAlert}>
                  <Alert
                      message={
                          <Fragment>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                              {needTotalList.map((item) => (
                                  <span style={{ marginLeft: 8 }} key={item.dataIndex}>
                                      {item.title}
                    总计&nbsp;
                                      <span style={{ fontWeight: 600 }}>
                                          {item.render ? item.render(item.total) : item.total}
                                      </span>
                                  </span>
                              ))}
                              <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                  清空
                              </a>
                          </Fragment>
                      }
                      type="info"
                      showIcon
                  />
              </div>
              <Table
                  rowKey={rowKey || 'key'}
                  rowSelection={rowSelection}
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