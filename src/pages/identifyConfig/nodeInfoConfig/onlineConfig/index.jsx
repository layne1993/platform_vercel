import React, { PureComponent } from 'react';
import { connect, Link, history } from 'umi';
import { Card, Tabs, Checkbox, Row, Col  } from 'antd';
import _styles from './styles.less';
import Evidence from './conponents/evidence'; // 证明材料
// import ProfessionalInvestorApplicationForm from './conponents/professionalInvestorApplicationForm'; //  专业投资者申请表
import QualifiedInvestorCommitmentLetter from './conponents/qualifiedInvestorCommitmentLetter'; // 合格投资者承诺函
import ProfessionalInvestorNotice from './conponents/professionalInvestorNotice'; // 专业投资者告知书
import TaxCertificate from './conponents/taxCertificate'; // 税收证明
// import InvestorCapitalCommitmentLetter from './conponents/investorCapitalCommitmentLetter'; // 客户资金来源合法性及资产合格承诺书



class OnlineConfig extends PureComponent {

    state = {
        tabKey: 0,
        checkedList:[]
    };

    renderTabBar = (props) => {
        const { panes = [] } = props;
        // console.log(panes, 'panels', props);
        return panes.map((item, index) => <div key={index} className={_styles.tabNode}>{item.props.tab}</div> );
    }


    render() {
        return (
            <Tabs
                tabPosition="left"
                defaultActiveKey="2"
            >
                <Tabs.TabPane
                    key="1"
                    disabled
                    forceRender
                    tab={<p className={_styles.tabNode}>节点1：基本信息表基本信息表认定信息</p>}
                >
                            暂无数据
                </Tabs.TabPane>
                <Tabs.TabPane
                    key="2"
                    // forceRender
                    tab={<p className={_styles.tabNode}>节点2：专业投资者告知书可自定义该内容</p>}
                >
                    <ProfessionalInvestorNotice/>
                </Tabs.TabPane>
                <Tabs.TabPane
                    key="3"
                    // forceRender
                    tab={<p className={_styles.tabNode}>节点3：税收证明可选择税收模板</p>}
                >
                    <TaxCertificate/>
                </Tabs.TabPane>
                <Tabs.TabPane
                    key="4"
                    // forceRender
                    tab={<p className={_styles.tabNode}>节点4：相关证明材料可自定义相关材料文件</p>}
                >
                    <Evidence/>
                </Tabs.TabPane>
                <Tabs.TabPane
                    key="5"
                    // forceRender
                    tab={<p className={_styles.tabNode}>节点5：合格投资者承诺函可自定义该内容</p>}
                >
                    <QualifiedInvestorCommitmentLetter/>
                </Tabs.TabPane>
                <Tabs.TabPane
                    key="6"
                    disabled
                    forceRender
                    tab={<p className={_styles.tabNode}>步骤6：统一用印固定步骤</p>}
                >
                            暂无数据
                </Tabs.TabPane>
                <Tabs.TabPane
                    key="7"
                    disabled
                    forceRender
                    tab={<p className={_styles.tabNode}>步骤7：管理人审核固定步骤</p>}
                >
                            暂无数据
                </Tabs.TabPane>
                <Tabs.TabPane
                    key="8"
                    disabled
                    forceRender
                    tab={<p className={_styles.tabNode}>步骤8：统一用印固定步骤</p>}
                >
                            暂无数据
                </Tabs.TabPane>
                <Tabs.TabPane
                    key="9"
                    disabled
                    forceRender
                    tab={<p className={_styles.tabNode}>步骤11：认定完成固定步骤</p>}
                >
                            暂无数据
                </Tabs.TabPane>
            </Tabs>
        );
    }

}

export default connect(({ loading }) => ({
    loading: loading.effects['NODE_INFO_CONFIG/queryQualifiedList']
}))(OnlineConfig);
