/*
 * @description:表格数据展示
 * @Author: tangsc
 * @Date: 2021-03-29 14:34:08
 */
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Card, Table, Modal } from 'antd';
import styles from '../index.less';
import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash-es';

const { confirm } = Modal;
const ShowTableData = (props) => {

    const { dispatch, createReportForm } = props;
    const { isShowa, customFormData = {} } = createReportForm;
    const { yieldOfYears } = customFormData;

    const [dataSource, setDataSource] = useState([]);
    const columns = [
        {
            title: '月度收益',
            dataIndex: 'year',
            width: 100,
            align: 'center'
            // render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '一月',
            dataIndex: 'jan',
            width: 80,
            align: 'center'
        },
        {
            title: '二月',
            dataIndex: 'feb',
            width: 80,
            align: 'center'
        },
        {
            title: '三月',
            dataIndex: 'mar',
            width: 80,
            align: 'center'
        },
        {
            title: '四月',
            dataIndex: 'apr',
            width: 80,
            align: 'center'
        },
        {
            title: '五月',
            dataIndex: 'may',
            width: 80,
            align: 'center'
        },
        {
            title: '六月',
            dataIndex: 'jun',
            width: 80,
            align: 'center'
        },
        {
            title: '七月',
            dataIndex: 'jul',
            width: 80,
            align: 'center'
        },
        {
            title: '八月',
            dataIndex: 'aug',
            width: 80,
            align: 'center'
        },
        {
            title: '九月',
            dataIndex: 'sep',
            width: 80,
            align: 'center'
        },
        {
            title: '十月',
            dataIndex: 'oct',
            width: 80,
            align: 'center'
        },
        {
            title: '十一月',
            dataIndex: 'nov',
            width: 80,
            align: 'center'
        },
        {
            title: '十二月',
            dataIndex: 'dec',
            width: 80,
            align: 'center'
        },
        {
            title: '年度累计',
            dataIndex: 'annualCumulative',
            width: 100,
            align: 'center'
        }
    ];


    /**
     * @description: 删除模块
     */
    const _deleteModule = () => {
        confirm({
            title: '请您确认是否删除该模块?',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'createReportForm/updateState',
                    payload: {
                        isStatisticalTable: false
                    }
                });
            },
            onCancel() {
                console.log('Cancel');
            }
        });
    };

    useEffect(() => {
        let tempArr = [];
        if (!isEmpty(yieldOfYears)) {
            yieldOfYears.forEach((item, i) => {
                tempArr.push({
                    key: i,
                    annualCumulative: item.annualCumulative,
                    year: item.year,
                    ...item.yieldOfMonth
                });
            });
            setDataSource(tempArr);
        }
    }, [customFormData]);
    return (
        <Card className={styles.showTableDataBox}>
            <Table
                columns={columns}
                dataSource={dataSource}
                bordered
                pagination={false}
            />
            {
                isShowa && <CloseOutlined className={styles.operateIcon} onClick={_deleteModule} />
            }
        </Card>
    );
};

export default connect(({ createReportForm }) => ({
    createReportForm
}))(ShowTableData);