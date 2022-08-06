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
import Step1 from '@/pages/components/MXSignInfo/Details/Components/Step1';
import Step3 from '@/pages/components/MXSignInfo/Details/Components/Step3';
import Step4 from '@/pages/components/MXSignInfo/Details/Components/Step4';
import Step5 from '@/pages/components/MXSignInfo/Details/Components/Step5';
import Step6 from '@/pages/components/MXSignInfo/Details/Components/Step6';
import Step7 from '@/pages/components/MXSignInfo/Details/Components/Step7';
import Step8 from '@/pages/components/MXSignInfo/Details/Components/Step8';
import Step9 from '@/pages/components/MXSignInfo/Details/Components/Step9';
import Step10 from '@/pages/components/MXSignInfo/Details/Components/Step10';
import Step11 from '@/pages/components/MXSignInfo/Details/Components/Step11';
import Step12 from '@/pages/components/MXSignInfo/Details/Components/Step12';
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


class ContractSignDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            standardCurrent: 0,
            operationInfo: [],
            data: {},
            stepNum: 0,
            returnCodeList: [],       // 返回的节点列表
            showFlag: false

        };
        this.processStepsList = [
            {
                id: 0,
                codeValue: 2010,
                title: '风险匹配告知书',
                component: <Step1 params={this.props.params} />
            },
            {
                id: 2,
                codeValue: 2030,
                title: '产品合同/补充协议',
                component: <Step3 params={this.props.params} />
            },
            {
                id: 3,
                codeValue: 2040,
                title: '认申购单',
                component: <Step4 params={this.props.params} />
            },
            {
                id: 4,
                codeValue: 2050,
                title: '风险揭示双录',
                component: <Step5 params={this.props.params} />
            },
            {
                id: 5,
                codeValue: 2060,
                title: '统一用印',
                component: <Step6 params={this.props.params} />
            },
            {
                id: 6,
                codeValue: 2070,
                title: '管理人审核',
                component: <Step7 showFlag={this.state.showFlag} params={this.props.params} {...getPermission(getParams().type === 'productTab' ? 30106 : getParams().type === 'customerType' ? 10106 : 20200)} />
            },
            {
                id: 7,
                codeValue: 2080,
                title: '打款确权',
                component: <Step8 params={this.props.params} />
            },
            {
                id: 8,
                codeValue: 2090,
                title: '冷静期',
                component: <Step9 params={this.props.params} />
            },
            {
                id: 9,
                codeValue: 2100,
                title: '募集回访',
                component: <Step10 params={this.props.params} />
            },
            {
                id: 11,
                codeValue: 2105,
                title: '二次审核',
                component: <Step12 showFlag={this.state.showFlag} getInfo={this.getInfo} params={this.props.params} {...getPermission(getParams().type === 'productTab' ? 30106 : getParams().type === 'customerType' ? 10106 : 20200)} />
            },
            {
                id: 10,
                codeValue: 2110,
                title: '签约完成',
                component: <Step11 params={this.props.params} />
            }
        ];

    }

    componentDidMount() {
        const { dispatch } = this.props;
        this.getInfo();

    }



    componentWillUnmount() {
        const { dispatch } = this.props;
        const payload = {
            processDetail: {}
        };
        dispatch({
            type: 'signprocess/resetModel',
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
            type: 'signprocess/getProcessList',
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
                    // 1、如果流程出现缺失，风险揭示书 OR 基金合同， THEN 出现本选项
                    //2、本选项必填，否则无法审核通过
                    const showFlag = !tempList.includes(2030);
                    this.setState({ showFlag });
                    dispatch({
                        type: 'signprocess/updateState',
                        payload: {
                            operationInfo: res.data
                        }
                    });
                } else {
                    const warningText = res.message || res.data || '流程节点操作信息查询失败！';
                    openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                }
            }
        }).then(() => {
            dispatch({
                type: 'signprocess/getBaseInfo',
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
            if (operationInfo[id] && operationInfo[id].codeValue === 2110) {
                return null;
            }
            return (<div style={{ fontSize: 12, textIndent: '-1em', zIndex: 999 }}>
                <div style={{ width: 80 }}>{operationInfo[id] && ((operationInfo[id].codeValue === 2070) && '审核员:' || '投资者:')}{operationInfo[id] && operationInfo[id].userName || '--'}</div>
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
                if (codeValue === 2070 || codeValue === 2105) {
                    current = index;
                } else {
                    current = index-1;
                }
            }
        });
        let stepNum;
        if (current > 2 && current < 6) {
            stepNum = 4;
        } else if (current >= 6) {
            stepNum = 7;
        }
        console.log(stepNum)
        this.setState({
            stepNum,
            current,
            standardCurrent: current
        });
    }

    moveAction = (e, step) => {
        e.stopPropagation();
        e.preventDefault();
        
        let { stepNum } = this.state;
        console.log(stepNum)
        stepNum += step;
        if (stepNum < 8 && stepNum > -1) {
            this.setState({ stepNum });
        }
    }

    display(step) {
        let display = '';
        const { stepNum } = this.state;
        if (step - stepNum < 0) {
            display = 'none';
        }
        return { display };
    }

    render() {
        const { current, returnCodeList } = this.state;
        let processSteps = this.processStepsList.filter((item) => {
            return returnCodeList.includes(item.codeValue);
        });
        processSteps = processSteps.map((item)=>{
            if(item.codeValue === 2070){
                return {
                    ...item,
                    component: <Step7 showFlag={this.state.showFlag} params={this.props.params} {...getPermission(getParams().type === 'productTab' ? 30106 : getParams().type === 'customerType' ? 10106 : 20200)} />
                };
            }
            return item;
        });
        return (
            <PageHeaderWrapper
                title="认申赎流程"
                extra={<Button type="primary" onClick={this.goback}>返回上一步</Button>}
                className={styles.pageHeader}
            >
                <Card>
                    <div className={styles.longStep}>
                        <span className={styles.stepMove} onClick={(e) => this.moveAction(e, -1)}><LeftOutlined style={{ marginTop: 5, fontSize: 26, color: '#1890ff' }} /></span>
                        <Steps current={current} className={styles.steps} onChange={this.changeProcessStep}>
                            {processSteps.map((item, index) => (
                                <Step key={item.id} title={this.renderTitle(index)} style={this.display(item.id)} description={this.renderDescription(index)} />
                            ))}
                        </Steps>
                        <span className={styles.stepMove} onClick={(e) => this.moveAction(e, 1)}><RightOutlined style={{ marginTop: 5, fontSize: 26, color: '#1890ff' }} /></span>
                    </div>
                    {
                        processSteps[current] && processSteps[current].component
                    }
                </Card>

            </PageHeaderWrapper>
        );
    }
}

export default connect(({ signprocess, loading }) => ({
    signprocess,
    loading: loading.effects['signprocess/getBaseInfo']
}))(ContractSignDetails);
