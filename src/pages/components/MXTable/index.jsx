import React, { useState, Fragment, useEffect, useMemo } from 'react';
import { Table, Button, Tree, Alert, Row, Col } from 'antd';
import { paginationPropsback } from '@/utils/publicData';
import { DownOutlined } from '@ant-design/icons';
import _styles from './styles.less';

const MXTable = (props) => {
    const { total, pageNum, columns, rowSelection, showColumnsConfig } = props;
    const [currentColumns, setCurrentColumns] = useState([]);             // 表头
    const [filterFlag, setFilterFlag] = useState(false);                       //列设置模态框
    const [checkedKeys, setCheckedKeys] = useState([]);                        // 列设置选择的列
    const [treeData, setTreeData] = useState([]);                              // 列设置数据

    /**
     * @description 获取树data
     */
    const getTreeData = (arr = []) => {
        let treeData = [];
        let checkedKeys = [];
        let newColumns = [];
        arr.map((item) => {
            if (item.dataIndex) {
                treeData.push({
                    title: item.title,
                    key: item.dataIndex
                });
                if (!item.defaultHide) {
                    checkedKeys.push(item.dataIndex);
                }
            }
            if (!item.defaultHide) {
                newColumns.push(item);
            }
        });
        setTreeData(treeData);
        setCheckedKeys(checkedKeys);
        setCurrentColumns(newColumns);
    };

    // const [checkedKeys, setCheckedKeys] = useState(getTreeData(columns).checkedKeys);

    // const treeData = getTreeData(columns).treeData;

    useEffect(() => {
        getTreeData(columns);
        // console.log('useEffect------更新');
    }, [columns]);


    /**
     * @description 获取表头
     * @param {*} checkedKeys 树选中的key
     */
    const getCurrentColumns = (checkedKeys = []) => {
        let currentColumns = [];
        columns.map((item) => {
            if (checkedKeys.includes(item.dataIndex)) {
                currentColumns.push(item);
            }
            if (!item.dataIndex) {
                currentColumns.push(item);
            }
        });
        setCurrentColumns(currentColumns);
        setCheckedKeys(checkedKeys);
    };

    /**
     * @description 获取tableHeader 节点t
     */
    const tableHeaderFilter = () => {
        return (
            <div className={_styles.tableTitle}>
                <div className={_styles.tableTitleleft}>
                    {!!rowSelection &&
                        Array.isArray(rowSelection.selectedRowKeys) &&
                        showColumnsConfig && (
                        <Alert
                            style={{ marginTop: 12 }}
                            message={
                                <Fragment>
                                    <Row align="middle">
                                        <Col span={20}>
                                                已选择{' '}
                                            <a style={{ fontWeight: 600 }}>
                                                {rowSelection.selectedRowKeys.length}
                                            </a>{' '}
                                                项&nbsp;&nbsp;
                                        </Col>
                                        <Col span={4}>
                                            <div
                                                style={{ width: '150px', position: 'relative' }}
                                            >
                                                <Button
                                                    onClick={() => setFilterFlag(!filterFlag)}
                                                    style={{ width: '100%' }}
                                                >
                                                        列设置 <DownOutlined />
                                                </Button>
                                                {/* <div style={{ position: 'absolute', zIndex: 999, width: '100%' }}> */}
                                                {filterFlag && (
                                                    <Tree
                                                        // style={{ width: '100%', border: '1px solid #ccc', zIndex:999,position:'absolute' }}
                                                        checkable
                                                        checkedKeys={checkedKeys}
                                                        onCheck={getCurrentColumns}
                                                        // onCheck={onCheck}
                                                        treeData={treeData}
                                                    />
                                                )}
                                                {/* </div> */}
                                            </div>
                                        </Col>
                                    </Row>
                                </Fragment>
                            }
                            type="info"
                            showIcon
                        />
                    )}
                </div>
            </div>
        );
    };

    return (
        <Table
            className={_styles.MXtable}
            title={() => tableHeaderFilter()}
            pagination={paginationPropsback(total, pageNum)}
            {...props}
            sticky
            columns={currentColumns}
            // rowKey={(record) => record.personId}
        />
    );
};

export default MXTable;

MXTable.defaultProps = {
    dataSource: [],
    total: 0,
    pageNum: 1,
    columns: [],
    // rowSelection: {},
    rowKey: 'id',
    onChange: () => {},
    scroll: {},
    showColumnsConfig: true,
    sticky: true
};
