import { Card,Select ,Popconfirm,Spin } from 'antd';
import React, { Component } from 'react';
 import styles from './style.less';
 import LineChart from '../lineChart/LineChart'
 import request from '@/utils/rest';
 import allPeople from '@/assets/businessAnalysis/youxiao.png'
 import youxiao from '@/assets/businessAnalysis/youxiao.png'
 import history from '@/assets/businessAnalysis/history.png'
 import noInvest from '@/assets/businessAnalysis/no_invest.png'



class HolderView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customerHolderm:{
                customerAlltNum: 0,
                effectiveInvestortNum: 0,
                historicalIhnvestortNum: 0,
                noInvestorstNum: 0
            },
            customerTimes:[{
                date: "",
                customerTimes: 0
            }],
            lineDate:[
                {
                  date: "",
                  customerTimes: 0
                },],
                dataType:1,
                period:1,
                typeSelection:1,
                loading:false
        };
    }

    componentDidMount() {
        this.getInfo()
    }
    Insert = ()=>{
        this.props.showInsert('持有人总览');
    }

    confirm =(e)=> {

        this.props.delete('YWFX_0002')
    }
    getInfo = async() =>{
        this.setState({
            loading:true
          })
        let post ={
            "dataType": 1,
            "period": 1,
            "typeSelection": 1
          }
          post.dataType = this.state.dataType*=1
          post.period = this.state.period*=1
          post.typeSelection = this.state.typeSelection*=1
        let res = await request.postJSON('/mrp_analysis/simuAnalysis/holderStat',post);

        if(res.code!==1009){
            
            if(res.customerTimes.length==0){
                this.setState({
                    customerHolderm:res.customerHolderm,
                    customerTimes:res.customerTimes,
                    loading:false
                })
            }else{
                this.setState({
                    customerHolderm:res.customerHolderm,
                    customerTimes:res.customerTimes,
                    lineDate:res.customerTimes,
                    loading:false
                })
            }
        }else{
            this.setState({
                loading:false
            })
        }
    }
      
    cancel = (e) => {

    }
    handleChangeData = (value)=> {
        this.setState({
            dataType:value
        },function(){
            this.getInfo()
        })
    }
    handleChangeType = (value)=> {
        this.setState({
            typeSelection:value
        },function(){
            this.getInfo()
        })
    }
    handleChangeTime = (value)=> {
        this.setState({
            period:value
        },function(){
            this.getInfo()
        })
    }

    render() {
        const Option = Select.Option;
        return (
               <Card
                    bordered={false}
                    title={
                        <span className={styles.cardTitle}>持有人总览</span>
                    }
                    extra={<div>
                        <span onClick={this.Insert} style={{color:'#3D7FFF',cursor:'pointer'}}>插入</span>
                                <Popconfirm
                                    title="是否确认删除该组件?"
                                    onConfirm={this.confirm}
                                    onCancel={this.cancel}
                                    okText="是"
                                    cancelText="否"
                                >
                                <span style={{color:'#3D7FFF',cursor:'pointer',marginLeft:10}}>删除</span>
                            </Popconfirm>
                        </div>}
                    style={{marginBottom:20,marginLeft:'1%',marginRight:'3%'}}
                >
                    <Spin spinning={this.state.loading}>
                 <div className={styles.Top}>
                     <div className={styles.item}>
                         <img src={allPeople} alt="" />
                         <div className={styles.right}>
                            <div className={styles.product}>总客户数</div>
                            <div style={{marginTop:-5}}>
                                <span className={styles.allCount}>{this.state.customerHolderm.customerAlltNum }</span>人
                            </div>
                        </div>
                     </div>
                     <div className={styles.item}>
                         <img src={youxiao} alt="" />
                         <div className={styles.right}>
                            <div className={styles.product}>有效投资者总数</div>
                            <div style={{marginTop:-5}}>
                                <span className={styles.allCount}>{this.state.customerHolderm.effectiveInvestortNum  }</span>人
                            </div>
                        </div>
                     </div>
                     <div className={styles.item}>
                         <img src={history} alt="" />
                         <div className={styles.right}>
                            <div className={styles.product}>历史投资者</div>
                            <div style={{marginTop:-5}}>
                                <span className={styles.allCount}>{this.state.customerHolderm.historicalIhnvestortNum  }</span>人
                            </div>
                        </div>
                     </div>
                     <div className={styles.item}>
                         <img src={noInvest} alt="" />
                         <div className={styles.right}>
                            <div className={styles.product}>非投资者</div>
                            <div style={{marginTop:-5}}>
                                <span className={styles.allCount}>{this.state.customerHolderm.noInvestorstNum  }</span>人
                            </div>
                        </div>
                     </div>
                 </div>
                 <div className={styles.btn}>
                    <Select defaultValue="新增数" style={{ width: 120 }} onChange={this.handleChangeData}>
                        <Option value="1">新增数</Option>
                        <Option value="2">总数</Option>
                    </Select>
                    <Select defaultValue="总客户数" style={{ width: 120 ,marginLeft:20}} onChange={this.handleChangeType}>
                        <Option value="1">总客户数</Option>
                        <Option value="2">有效投资者</Option>
                        <Option value="3">历史投资者</Option>
                        <Option value="4">非投资者</Option>
                    </Select>
                    <Select defaultValue="本周" style={{ width: 120 ,marginLeft:20}} onChange={this.handleChangeTime}>
                        <Option value="1">本周</Option>
                        <Option value="2">本月</Option>
                        <Option value="3">本季度</Option>
                        <Option value="4">本年度</Option>
                        <Option value="5">全部</Option>
                    </Select>
                 </div>
                
                 <div className={styles.chart}>
                   <LineChart height={380} data={this.state.lineDate}/>
                 </div>
                 </Spin>
                </Card>
              
        );
    }
}

export default HolderView;
