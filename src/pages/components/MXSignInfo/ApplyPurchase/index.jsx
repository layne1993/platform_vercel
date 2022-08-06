import {
    Steps,
    notification,
    Card,
    Button
} from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import Step1 from './Components/Step1';
import Step2 from './Components/Step2';
import Step3 from './Components/Step3';
import Step4 from './Components/Step4';
import Step5 from './Components/Step5';
import Step6 from './Components/Step6';
import Step7 from './Components/Step7';
import styles from './style.less';
import { isEmpty } from 'lodash';
import { getParams, getPermission } from '@/utils/utils';

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


class ApplyPurchaseDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            standardCurrent: 0,
            operationInfo: [],
            data: {},
            stepNum: 0,
            returnCodeList: []       // 返回的节点列表
        };
        this.processStepsList = [
            {
                id: 1,
                codeValue: 3010,
                title: '申购确认书',
                component: <Step1 params={this.props.params} />
            },
            {
                id: 2,
                codeValue: 3020,
                title: '管理人审核',
                component: <Step2 params={this.props.params} {...getPermission(getParams().type === 'productTab' ? 30106 : getParams().type === 'customerType' ? 10106 : 20200)} />
            },
            {
                id: 3,
                codeValue: 3030,
                title: '打款确权',
                component: <Step3 params={this.props.params} />
            },
            {
                id: 4,
                codeValue: 3032,
                title: '冷静期',
                component: <Step4 params={this.props.params} />
            },
            {
                id: 5,
                codeValue: 3035,
                title: '回访',
                component: <Step5 params={this.props.params} />
            },
            {
                id: 6,
                codeValue: 3037,
                title: '二次审核',
                component: <Step6  params={this.props.params} getInfo={this.getInfo} {...getPermission(getParams().type === 'productTab' ? 30106 : getParams().type === 'customerType' ? 10106 : 20200)}  />
            },
            {
                id: 7,
                codeValue: 3040,
                title: '签约完成',
                component: <Step7 params={this.props.params} />
            }
        ];

    }

    componentDidMount() {
        const { dispatch } = this.props;
        this.getInfo();
        // dispatch({
        //     type: 'applyPurchase/queryServer'
        // });

    }



    componentWillUnmount() {
        const { dispatch } = this.props;
        const payload = {
            processDetail: {}
        };
        dispatch({
            type: 'applyPurchase/resetModel',
            payload
        });
    }

    // 返回上一步
    goback = () => {
        const { type, key } = getParams();
        if (type) {
            if (type === 'customerType') {
                window.sessionStorage.setItem('customer', '3');
            } else {
                window.sessionStorage.setItem('product', 'tab6');
            }
        }
        if (key) window.sessionStorage.setItem('processTabKey', key);
        history.go(-1);
    }

    changeProcessStep = (e) => {
        const { standardCurrent } = this.state;
        if (e > standardCurrent) {
            const warningText = '暂未进行到该步骤，无法查看';
            return openNotification('warning', '提示', warningText, 'topRight');
        }
        this.setState({
            current: e
        });
        return true;
    }

    getInfo = () => {
        const { dispatch, params } = this.props;
        dispatch({
            type: 'applyPurchase/getProcessList',
            payload: params,
            callback: (res) => {
                if (res && res.code === 1008) {
                    let tempList = [];
                    !isEmpty(res.data) && res.data.forEach((item) => {
                        tempList.push(item.codeValue);
                    });
                    this.setState({
                        operationInfo: res.data,
                        returnCodeList: tempList
                    });
                } else {
                    const warningText = res.message || res.data || '流程节点操作信息查询失败！';
                    openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                }
            }
        }).then(() => {
            dispatch({
                type: 'applyPurchase/getBaseInfo',
                payload: params,
                callback: (res) => {
                    if (res.code === 1008) {
                        const { data } = res;
                        this.setState({
                            data
                        });
                        this.convertStep(data.nextCodeValue);
                    } else {
                        const warningText = res.message || res.data || '流程详情查询失败！';
                        openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                    }
                }
            });
        });
    }

    renderDescription = (id) => {
        const { operationInfo } = this.state;

        if (operationInfo.length > 0 && operationInfo[id] && operationInfo[id].isDelete === 0) {
            if (operationInfo[id] && operationInfo[id].codeValue === 3040) {
                return null;
            }
            return (<div style={{ fontSize: 12, textIndent: '-1em', zIndex: 999 }}>
                <div >{operationInfo[id] && ((operationInfo[id].codeValue === 3020 || operationInfo[id].codeValue === 3037) && '审核员:' || '投资者:')}{operationInfo[id] && operationInfo[id].userName || '--'}</div>
                <div style={{ textIndent: '-3em' }}>{operationInfo[id] && (operationInfo[id].updateTime ? moment(operationInfo[id].updateTime).format('YYYY/MM/DD HH:mm:ss') : '')}</div>
            </div>);
        }
        return true;
    }


    renderTitle = (id) => {
        const { operationInfo } = this.state;

        if (operationInfo.length > 0 && operationInfo[id]) {
            return operationInfo[id].codeText;
        }
        return true;
    }

    convertStep = (codeValue) => {
        const { returnCodeList } = this.state;
        let current = 0;
        returnCodeList.forEach((item, index) => {
            if(!codeValue){
                current=index
            }
            if (item === codeValue) {
                if (codeValue === 3020 || codeValue === 3037) {
                    current = index;
                } else {
                    current = index-1;
                }
            }
        });
        this.setState({
            current,
            standardCurrent: current
        });
    }


    render() {
        const { current, returnCodeList } = this.state;
        let processSteps = this.processStepsList.filter((item) => {
            return returnCodeList.includes(item.codeValue);
        });
        return (
            <PageHeaderWrapper
                title="认申赎流程"
                extra={<Button type="primary" onClick={this.goback}>返回上一步</Button>}
                className={styles.pageHeader}
            >
                <Card>
                    <div className={styles.longStep}>
                        <Steps current={current} className={styles.steps} onChange={this.changeProcessStep}>
                            {processSteps.map((item, index) => (
                                <Step key={item.id} title={this.renderTitle(index)} description={this.renderDescription(index)} />
                            ))}
                        </Steps>
                    </div>
                    {
                        processSteps[current] && processSteps[current].component
                    }
                </Card>

            </PageHeaderWrapper>
        );
    }
}

export default connect(({ applyPurchase, loading }) => ({
    applyPurchase,
    loading: loading.effects['applyPurchase/getBaseInfo']
}))(ApplyPurchaseDetails);
