
/**
 * @description: 产品详情-申购信息step
 * @param {*}
 */
import React, { Component } from 'react';
import ApplyPurchaseDetails from '@/pages/components/MXSignInfo/ApplyPurchase';

class ApplyDetails extends Component {
    render() {
        const { match: { params } } = this.props;
        return (
            <div>
                <ApplyPurchaseDetails params={params} />
            </div>
        );
    }
}

export default ApplyDetails;
