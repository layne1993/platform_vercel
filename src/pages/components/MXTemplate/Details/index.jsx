import {
    Card,
    Button
} from 'antd';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
// import { trusteeStatus } from '@/utils/publicData';
import React, { Component } from 'react';
import { connect, history } from 'umi';
import { getParams, getPermission } from '@/utils/utils';
import BaseInfo from './components/baseInfo';
import DocumentInfo from './components/documentInfo';
// import SignInfo from './components/signInfo';
import styles from './style.less';

const authority = window.localStorage.getItem('antd-pro-authority');
// console.log(authority)

const operationTabList = [
    {
        key: 'tab1',
        tab: '基本信息'
    },
    {
        key: 'tab2',
        tab: '文档信息'
    }
];
// if (authority.indexOf(311) !== -1) {
//     operationTabList.push({
//         key: 'tab1',
//         tab: '基本信息'
//     });
// }

// if (authority.indexOf(312) !== -1) {
//     operationTabList.push({
//         key: 'tab2',
//         tab: '文档信息'
//     });
// }



// const operationTabList = [
//   {
//     key: 'tab1',
//     tab: '基本信息',
//   },
//   {
//     key: 'tab2',
//     tab: '文档信息',
//   },
//   // {
//   //   key: 'tab3',
//   //   tab: '签署信息',
//   // },
// ];


class TemplateDetailInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            operationKey: 'tab1',
            templateName: ''
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'templateDetails/queryServer'
        });
    }

    componentWillReceiveProps(nextProps) {
        const { baseInfo } = nextProps;
        if (Object.keys(baseInfo).length > 0) {
            this.setState({
                templateName: baseInfo.documentName
            });
        }
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        const payload = {
            baseInfo: {}
        };
        dispatch({
            type: 'templateDetails/resetModel',
            payload
        });
        dispatch({
            type: 'templateDetails/updateState',
            payload: {
                lackDocumentType: undefined,
                documentType: undefined
            }
        });
    }

    onOperationTabChange = (key) => {
        this.setState({
            operationKey: key
        });
    };

    // 返回上一步
    goback = () => {
        const { type } = getParams();
        if (type === 'productTab') {
            window.sessionStorage.setItem('tabTemplate', 'tab10');
        }
        history.goBack();
    }

    render() {
        const { operationKey, templateName } = this.state;
        const { params } = this.props;
        // const url = window.location.search
        // let documentCode = '';
        // if (url.indexOf("?") !== -1) {
        //   [, documentCode] = url.split("=")
        // }

        const contentList = {
            tab1:
            <BaseInfo
                params={params}
                handleChange={this.onOperationTabChange}
                {...getPermission(getParams().type === 'productTab' ? 30111 : 60000)}
            />,
            tab2:
            <DocumentInfo
                params={params}
                handleChange={this.onOperationTabChange}
                {...getPermission(getParams().type === 'productTab' ? 30111 : 60000)}
            />
            // tab3: <SignInfo params={documentCode} />,
        };
        return (
            <PageHeaderWrapper
                className={styles.pageHeader}
                title={templateName}
                extra={<Button type="primary" onClick={this.goback}>返回上一步</Button>}
            >
                <div className={styles.main}>
                    <GridContent>
                        <Card
                            className={styles.tabsCard}
                            bordered={false}
                            tabList={operationTabList}
                            onTabChange={this.onOperationTabChange}
                            activeTabKey={operationKey}
                        >
                            {contentList[operationKey]}
                        </Card>
                    </GridContent>
                </div>
            </PageHeaderWrapper>
        );
    }
}

export default connect(({ templateDetails }) => ({
    templateDetails,
    baseInfo: templateDetails.baseInfo
}))(TemplateDetailInfo);
