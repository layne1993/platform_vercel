
import React, { Component } from 'react';
import TemplateDetails from '@/pages/components/MXTemplate/Details';
class TemplateDetailInfo extends Component {
    render() {
        const { match: { params } } = this.props;
        return (
            <TemplateDetails params={params} />
        );
    }
}

export default TemplateDetailInfo;
