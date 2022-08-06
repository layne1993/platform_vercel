/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-03-29 09:47:47
 * @LastEditTime: 2021-04-15 19:56:24
 */
import React from 'react';
import { Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Filter from './components/filter/Filter';
import List from './components/list/List';
import { getPermission } from '@/utils/utils';


const separateAgreement: React.FC<any> = (props) => {

    const filterRef = React.createRef();

    return (
        <PageHeaderWrapper>
            <Card>
                <Filter forwardRef={filterRef} />
                <List forwardRef={filterRef} {...getPermission(20300)} />
            </Card>
        </PageHeaderWrapper>
    );
};


export default separateAgreement;
