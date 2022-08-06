/*
 * @description: 产品双录配置
 * @Author: tangsc
 * @Date: 2020-12-23 10:01:07
 */
import React, { Component } from 'react';
import DoubleConfig from './doubleConfig/index';
import { getPermission } from '@/utils/utils';
class Tab13 extends Component {


    render() {
        const { params } = this.props;
        return (
            <DoubleConfig params={params}  {...getPermission(30112)} />

        );
    }
}
export default Tab13;
