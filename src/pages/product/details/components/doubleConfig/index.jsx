/*
 * @description: 协议模板信息
 * @Author: tangsc
 * @Date: 2020-11-02 11:23:35
 */
import React, { Component } from 'react';
import { connect } from 'umi';
import { Card } from 'antd';
import _styles from './styles.less';
import AI from './AI/';
import General from './general';
import List from './list';


const TabList = [
    {
        key: 0,
        tab: '双录模板使用情况',
        render: (props) => <List {...props} />
    },
    {
        key: 1,
        tab: '普通双录内容配置',
        render: (props) => <General {...props} />
    },
    {
        key: 2,
        tab: 'AI双录内容配置',
        render: (props) => <AI {...props} />
    }


];

// const TabList = [
//     {
//         key: 0,
//         tab: '双录模板使用情况',
//         render: (props) => <List {...props} />
//     },
//     {
//         key: 1,
//         tab: '普通双录内容配置',
//         render: (props) => <General {...props} />
//     }

// ];


class Tab11 extends Component {
    state = {
        tabIndex: 0,
        operationKey: '0',
        templateCode: '0',
        TabList: [TabList[0]]
        // TabList: TabList
    }

    componentDidMount() {
        this.getProductSetting();
    }

    getProductSetting = () => {
        // eslint-disable-next-line no-undef
        const defaultDoubleCheckType = sessionStorage.getItem('defaultDoubleCheckType');
        if (Number(defaultDoubleCheckType) === 1) {
            this.setState({
                TabList: TabList.filter((item, index) => index !== 2)
            });

        } else if (Number(defaultDoubleCheckType) === 2) {
            this.setState({
                TabList: TabList.filter((item, index) => index !== 1)
            });
        } else if (Number(defaultDoubleCheckType) === 3) {
            this.setState({
                TabList: TabList
            });
        }
    }

    /**
     * tab切换点击事件
     * @param {*} key
     */
    onOperationTabChange = (key) => {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.templateCode = '0';
        this.setState({
            operationKey: key,
            tabIndex: this.getTabIndex(key)
        });
    };

    setTab = (data = {}) => {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.templateCode = data.productTemplateId;
        this.setState({
            operationKey: data.doubleType + '',
            tabIndex: this.getTabIndex(data.doubleType)
        });
    }

    // 获取tab索引
    getTabIndex = (key) => {
        const { TabList } = this.state;
        let tabIndex = 0;
        TabList.map((item, index) => {
            if (item.key == key) {
                tabIndex = index;
            }
        });

        return tabIndex;

    }



    render() {
        const { operationKey, templateCode, tabIndex, TabList } = this.state;
        const { params, ...otherInfo } = this.props;
        let elementRender = TabList[tabIndex].render;
        return (
            <div className={_styles.doubleConf}>
                <Card
                    bordered={false}
                    tabList={TabList}
                    onTabChange={this.onOperationTabChange}
                    activeTabKey={operationKey}
                >
                    {elementRender({ params, templateCode, setTab: this.setTab, ...otherInfo })}
                </Card>
            </div>

        );
    }
}

export default connect(({ PRODUCT_DOUBLE, loading }) => ({
    PRODUCT_DOUBLE,
    loading: loading.effects['PRODUCT_DOUBLE/productSetting']
}))(Tab11);

Tab11.defaultProps = {
    params: {}
};


