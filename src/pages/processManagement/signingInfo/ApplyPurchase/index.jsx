
import React, { Component } from 'react';
import ApplyPurchaseDetails from '@/pages/components/MXSignInfo/ApplyPurchase';
class ContractSign extends Component {

    render() {
        const { match: { params } } = this.props;
        return (
            <div>
                <ApplyPurchaseDetails params={params} />
            </div>
        );
    }
}

export default ContractSign;
