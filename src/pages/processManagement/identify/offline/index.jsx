/*
 * @Descripttion: 线下认定
 * @version:
 * @Author: yezi
 * @Date: 2020-11-17 16:46:56
 * @LastEditTime: 2021-09-18 13:29:31
 */
import React, { Component } from 'react';
import { Steps, Spin, notification, Card, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { connect, history } from 'umi';

import OffStep1 from './components/Step1';
import OffStep2 from './components/Step2';
import OffStep3 from './components/Step3';
import styles from './style.less';

const { Step } = Steps;

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};



class offline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0,
            standardCurrent: 0,
            operationInfo: [],
            infomation: {},
            doneStepIndex: 0

        };
    }

    componentDidMount() {
        const { match: { params }} = this.props;
        // console.log(params, 'params');
        if (params.identifyFlowId !== '0') {
            this.getFlowInfo(params.identifyFlowId);
            this.getFlowNodeDate(params.identifyFlowId);
        }
    }

    componentWillUnmount() {
        this.initData();
    }

    initData =() => {
        const {dispatch} = this.props;
        dispatch({type: 'IDENTIFYFLOW_OFFLINE/initModel'});
    }


    /**
     * @description 当参数不为零时 获取认定流程数据
     */
    getFlowInfo = (id) => {
        const {dispatch} = this.props;
        dispatch({
            type: 'IDENTIFYFLOW_OFFLINE/getDetail',
            payload: {identifyFlowId: id},
            callback: (res) => {
                if(res.code !==1008) {
                    const warningText = res.message || res.data || '流程详情查询失败！';
                    openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                }else {
                    this.getNextNode(res.data);
                }
            }
        });

    }

    /**
     * 获取节点时间及操作人
     * @param {*} id
     */
    getFlowNodeDate = (id) => {
        const {dispatch} = this.props;
        dispatch({
            type: 'IDENTIFYFLOW_OFFLINE/queryProcessByFlowId',
            payload: {flowId: id},
            callback: (res) => {
                if(res.code !==1008) {
                    const warningText = res.message || res.data || '流程详情查询失败！';
                    openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                }else {
                    this.setState({operationInfo: res.data || []});
                }
            }
        });
    }


    renderDescription = (index, code) => {
        const { operationInfo } = this.state;

        if (operationInfo[index]) {
            return (
                <div style={{ fontSize: 12, textIndent: '-1em' }}>
                    <div>
                        {[1060, 1070, 1080].includes(code) ? ' 审核员:' : ' 投资者:'}
                        {operationInfo[index].userName || '--'}
                    </div>
                    <div>
                        {operationInfo[index].updateTime
                            ? moment(operationInfo[index].updateTime).format('YYYY-MM-DD HH:mm')
                            : ''}
                    </div>
                </div>
            );
        }
        return (
            <div style={{ fontSize: 12 }}>
                <div>--：--</div>
                <div>--</div>
            </div>
        );
    };

    /**
     * @description 获取下一节点
     * @param {*} code
     * @param {*} arr
     */
    getNextNode = (data) => {

        let nodeIndex = 0;
        let doneStepIndex = 0;

        if(data.codeValue === 1040) {
            nodeIndex = 1;
            doneStepIndex = 1;
        }

        if(data.codeValue === 1070) {
            if(data.flowStatus === 2) {
                nodeIndex = 2;
            } else {
                if(data.checkStatus === 2) {
                    nodeIndex = 1;
                }
            }
            doneStepIndex = 1;
        }

        if(data.codeValue === 1080) {
            nodeIndex = 2;
            doneStepIndex = 2;
        }

        this.setState({doneStepIndex: doneStepIndex}, ()=> {this.setSteps(nodeIndex);});
    }


    /**
    * @description 设置当前步
    * @param {*} index 当前步索引
    */
    setSteps = (index) => {
        if (index > this.state.doneStepIndex) {
            const warningText = '暂未进行到该步骤，无法查看';
            return openNotification('warning', '提示错误信息', warningText, 'topRight');
        }
        this.setState({currentIndex: index});
    }

    calllback = (id) => {
        this.getFlowInfo(id);
        this.getFlowNodeDate(id);
    }

    // 返回上一步
    goback = () => {
        history.go(-1);
    };

    render() {
        const { currentIndex} = this.state;
        const {
            loading,
            match: { params }
        } = this.props;


        const Offline = [
            {
                id: 0,
                title: '合格投资者材料',
                codeValue:1040,
                components: <OffStep1 codeValue={1040} setSteps={this.setSteps} params={params} calllback={this.calllback}/>
            },
            {
                id: 1,
                title: '管理人审核',
                codeValue:1070,
                components: <OffStep2 codeValue={1070} setSteps={this.setSteps} params={params} calllback={this.calllback}/>
            },
            {
                id: 2,
                title: '认定完成',
                codeValue:1080,
                components: <OffStep3 codeValue={1080} setSteps={this.setSteps} params={params} calllback={this.calllback}/>
            }
        ];


        return (
            <PageHeaderWrapper
                title="合格投资者认定流程详情"
                className={styles.pageHeader}
                // extra={
                //     <Button type="primary" onClick={this.goback}>
                //         返回上一步
                //     </Button>
                // }
            >
                <Card bordered={false}>
                    <Spin spinning={params.identifyFlowId === '0' ? false : loading}>
                        <Steps current={currentIndex} onChange={this.setSteps} size="small">
                            {Offline.map((item) => (
                                <Step
                                    key={item.id}
                                    title={item.title}
                                    description={this.renderDescription(item.id, item.codeValue)}
                                />
                            ))}
                        </Steps>
                        {Offline[currentIndex].components}
                    </Spin>
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default connect(({ IDENTIFYFLOW_OFFLINE, loading }) => ({
    IDENTIFYFLOW_OFFLINE,
    flowData: IDENTIFYFLOW_OFFLINE.flowData,
    loading: loading.effects['IDENTIFYFLOW_OFFLINE/getDetail']
}))(offline);
