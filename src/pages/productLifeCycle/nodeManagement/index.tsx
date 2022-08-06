/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-03-17 15:35:42
 * @LastEditTime: 2021-03-18 11:09:31
 */
import React from 'react';
import { Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Filter from './components/filter/Filter';
import List from './components/list/List';


const NodeManagement: React.FC<any> = (props) => {

    const filterRef = React.createRef();


    const test = () => {
        // console.log(filterRef, 'filterRef');
    };





    return (
        <PageHeaderWrapper>
            <Card>
                <Filter forwardRef={filterRef} />
                <List forwardRef={filterRef} />

            </Card>
        </PageHeaderWrapper>
    );
};


export default NodeManagement;

