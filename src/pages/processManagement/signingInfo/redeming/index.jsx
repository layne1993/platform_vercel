
import React, { Component } from 'react';
import Redeming from '@/pages/components/MXSignInfo/Redeming';
class ContractSign extends Component {

    render() {
        const { match: { params } } = this.props;
        return (
            <div>
                <Redeming params={params} />
            </div>
        );
    }
}

export default ContractSign;
