
import React, { Component } from 'react';
import ContractSignDetails from '@/pages/components/MXSignInfo/Details';
class ContractSign extends Component {



    render() {
        const { match: { params } } = this.props;
        return (
            <div>
                <ContractSignDetails params={params} />
            </div>
        );
    }
}

export default ContractSign;
