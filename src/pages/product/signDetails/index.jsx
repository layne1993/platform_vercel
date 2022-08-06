
/**
 * @description: 产品详情-认申赎流程step
 * @param {*}
 */
import React, { Component } from 'react';
import ContractSignDetails from '@/pages/components/MXSignInfo/Details';

class SignDetails extends Component {
    render() {
        const { match: { params } } = this.props;
        return (
            <div>
                <ContractSignDetails params={params} />
            </div>
        );
    }
}

export default SignDetails;
