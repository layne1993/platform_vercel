/*
 * @description:客户运营-客户信息管理-投资者认定信息tab标签
 * @Author: tangsc
 * @Date: 2020-10-20 11:18:24
 */
import React, { PureComponent } from 'react';
import QualifiedInvestor from '@/pages/processManagement/identify/list/Components/QualifiedInvestor';

class InvestorIdentification extends PureComponent {

    render() {
        const {params} = this.props;

        return (
            <QualifiedInvestor params={params}/>
        );
    }
}
export default InvestorIdentification;
