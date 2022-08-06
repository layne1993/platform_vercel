import { Steps, Spin, notification, Card, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import moment from 'moment';
import { connect, history } from 'umi';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';
import Step5 from './components/Step5';
import Step6 from './components/Step6';
import Step7 from './components/Step7';
import Step8 from './components/Step8';
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

const processSteps = [
    {
        id: 0,
        title: '填写基本信息表',
        code: 1010,
        component: (props)=> <Step1 codeValue={1010} {...props} />
    },
    {
        id: 1,
        title: '专业投资者告知书',
        code: 1020,
        component: (props)=> <Step2 codeValue={1020} {...props} />
    },
    {
        id: 2,
        title: '税收文件证明',
        code: 1030,
        component: (props)=> <Step3 codeValue={1030} {...props} />
    },
    {
        id: 3,
        title: '证明材料',
        code: 1040,
        component: (props)=> <Step4 codeValue={1040} {...props} />
    },
    {
        id: 4,
        title: '合格投资者承诺函',
        code: 1050,
        component: (props)=> <Step5 codeValue={1050} {...props} />
    },
    {
        id: 5,
        title: '统一用印',
        code: 1060,
        component: (props)=> <Step6 codeValue={1060} {...props} />
    },
    {
        id: 6,
        title: '管理人审核',
        code: 1070,
        component: (props)=> <Step7 codeValue={1070} {...props} />
    },
    {
        id: 7,
        title: '认定完成',
        code: 1080,
        component: (props)=> <Step8 codeValue={1080} {...props} />
    }
];

class online extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0,
            operationInfo: [],
            flowData: {},
            nodeList: processSteps,
            doneStepIndex:0
        };
    }

    componentDidMount() {
        this.getAllInfo();
    }


    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({type: 'IDENTIFYFLOW_ONLINE/resetModel'});
    }

    getAllInfo = ()=>{
        const {
            match: { params }
        } = this.props;
        const _this = this;
        if (params.identifyFlowId !== '0') {

            Promise
                .all([this.getFlowInfo(params.identifyFlowId),

                    this.getFlowNodeDate(params.identifyFlowId)])
                .then(function(results){
                    console.log(results);
                    _this.getNode(results[1]);
                    _this.getNextNode(results[0].codeValue, results[1]);
                });


        }
    }


    /**
     * @description 当参数不为零时 获取认定流程数据
     */
    getFlowInfo = (id) => {
        return new Promise((resolve, reject) => {
            const {dispatch} = this.props;
            dispatch({
                type: 'IDENTIFYFLOW_ONLINE/getDetail',
                payload: {identifyFlowId: id},
                callback: (res) => {
                    if(res.code !==1008) {
                        reject({});
                        const warningText = res.message || res.data || '流程详情查询失败！';
                        openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                    } else {
                        let data = res.data || {};
                        resolve(res.data);
                        // eslint-disable-next-line react/no-direct-mutation-state
                        this.state.flowData = data;
                        // this.getNode(data);
                    }
                }
            });

        });

    }

    /**
     * 获取节点时间及操作人
     * @param {*} id
     */
         getFlowNodeDate = (id) => {
             return new Promise((resolve, reject)=>{
                 const {dispatch} = this.props;
                 dispatch({
                     type: 'IDENTIFYFLOW_ONLINE/queryProcessByFlowId',
                     payload: {flowId: id},
                     callback: (res) => {
                         if(res.code !==1008) {
                             reject([]);
                             const warningText = res.message || res.data || '流程详情查询失败！';
                             openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                         }else {
                             resolve(res.data);
                             this.setState({operationInfo: res.data || []});
                         }
                     }
                 });
             });

         }


    // 获取节点
    getNode = (data) => {
        let res = [];
        // if(data.investorType === 1) {
        //     res = [];
        //     res =  processSteps.filter((item) => item.code !== 1020  );
        // }

        // if(data.investorType === 2 && data.customerType === 3) {
        //     res = [];
        //     res = processSteps.filter((item) => item.code !== 1050);
        // }
        processSteps.map((item)=>{
            data.map((items)=>{
                items.codeValue === item.code && res.push(item);
            });
        });
        this.setState({nodeList: res});
    }

    /**
     * @description 获取下一节点
     * @param {*} code
     * @param {*} arr
     */
    getNextNode = (code, arr = []) => {
        console.log(code, arr);
        let currentIndex = 0;
        arr.map((item, index) => {
            if(item.codeValue === code) {
                // console.log(index)
                currentIndex = index;
            }
        });
        if(code === 1060) {
            currentIndex = currentIndex + 1;
        }
        // console.log(currentIndex)
        this.setState({doneStepIndex: currentIndex});
        this.setSteps(currentIndex);
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





    renderDescription = (index, code) => {
        const { operationInfo } = this.state;

        if (operationInfo[index] && operationInfo[index].isDelete === 0) {
            return (
                <div style={{ fontSize: 12, textIndent: '-1em' }}>
                    <div>
                        {[1070, 1080].includes(code) ? ' 审核员:' : ' 投资者:'}
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


    // 返回上一步
    goback = () => {
        history.go(-1);
    };

    render() {
        const { currentIndex, nodeList } = this.state;
        const {
            loading,
            match: { params },
            IDENTIFYFLOW_ONLINE : {flowData}
        } = this.props;


        let element = nodeList[currentIndex].component;


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
                    {/* <Spin> */}
                    <Steps current={currentIndex} onChange={this.setSteps} size="small">
                        {nodeList.map((item, index) => (
                            <Step
                                key={item.id}
                                title={item.title}
                                description={this.renderDescription(index, item.code)}
                            />
                        ))}
                    </Steps>
                    {element({params, getAllInfo:this.getAllInfo, getFlowInfo: this.getFlowInfo, getFlowNodeDate: this.getFlowNodeDate})}
                    {/* </Spin> */}
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default connect(({ IDENTIFYFLOW_ONLINE, loading }) => ({
    IDENTIFYFLOW_ONLINE,
    data: IDENTIFYFLOW_ONLINE.flowData,
    loading: loading.effects['IDENTIFYFLOW_ONLINE/getDetail']
}))(online);
