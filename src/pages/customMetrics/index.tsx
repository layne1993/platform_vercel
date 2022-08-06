/*
 * @Author: your name
 * @Date: 2021-04-01 13:14:02
 * @LastEditTime: 2021-04-08 16:24:07
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \vip-manager\src\pages\customMetrics\index.tsx
 */
import React, { useState, useRef, useEffect } from 'react';
import { Card, Row, Col, Tabs } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SelectTree from './components/SelectTree/index';
import QueryForm from './components/QueryForm';
import TableContent from './components/TableContent';
import { connect } from 'dva';

const { TabPane } = Tabs;

const CustomMetrics: React.FC<any> = (props) => {
    const [tableData, setTableData] = useState<any[]>([]);
    const formRef: React.MutableRefObject<any> = useRef();
    useEffect(() => {
        return () => {
            const { dispatch } = props;
            dispatch({
                type: 'queryForm/clearData'
            });
            dispatch({
                type: 'customMetricsTable/clearData'
            });
            dispatch({
                type: 'customMetricsSelectTree/clearData'
            });
        };
    }, []);
    return (
        <PageHeaderWrapper title="数据指标报表">
            <Row gutter={24}>
                <Col span={6} style={{ display: 'flex' }}>
                    <Card style={{ width: '100%' }}>
                        <Tabs type="card">
                            <TabPane tab="待选指标" key="1">
                                <SelectTree />
                            </TabPane>
                        </Tabs>
                    </Card>
                </Col>
                <Col span={18} style={{ display: 'flex' }}>
                    <Card style={{ width: '100%' }}>
                        <QueryForm forwardRef={formRef} />
                        <TableContent formRef={formRef} />
                    </Card>
                </Col>
            </Row>
        </PageHeaderWrapper>
    );
};

export default connect()(CustomMetrics);
