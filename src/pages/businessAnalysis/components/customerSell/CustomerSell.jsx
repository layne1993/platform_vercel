import { Card ,Select,Popconfirm,Spin} from 'antd';
import React, { Component } from 'react';
import request from '@/utils/rest';
 import styles from './style.less';

import new_people from '@/assets/businessAnalysis/new_people.png'
import add_people from '@/assets/businessAnalysis/add_people.png'
import jiantou from '@/assets/businessAnalysis/jiantou.png'
import back_people from '@/assets/businessAnalysis/back_people.png'
import message from '@/assets/businessAnalysis/message.png'



class CustomerSell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newSellingNum: 10,
            addNum: 10,
            redeemNum: 10,
            needVisitNum: 10,
            unfinishNum: 10,
            timeRange:1,
            loading:false
        };
    }

    componentDidMount() {
       this.getInfo()
    }
    Insert = ()=>{
        this.props.showInsert('网上直销客户情况');
    }

    confirm =(e)=> {

        this.props.delete('YWFX_0003')
    }
      
    cancel = (e) => {

    }

    getInfo= async(e)=>{
        this.setState({
            loading:true
        })
        let post ={
            timeRange: this.state.timeRange*=1
        }
        if(e!==undefined){
            post.timeRange = (e*=1)
        }
        let res = await request.postJSON('/mrp_analysis/simuAnalysis/sellingStat',post);
           this.setState({
            loading:false,
            newSellingNum: res.newSellingNum,
            addNum: res.addNum,
            redeemNum: res.redeemNum,
            needVisitNum: res.needVisitNum,
            unfinishNum: res.unfinishNum,
           })
    }

    handleChange = (value)=> {
        this.getInfo(value)
      }
    render() {
    
        return (
               <Card
                    bordered={false}
                    title={
                        <span className={styles.cardTitle}>网上直销客户情况</span>
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
                    style={{height:'395px',verticalAlign:'top', marginBottom:20,width:'47%',display:'inline-block',margin:'1%',verticalAlign: 'top',}}
                >
                    <div className={styles.btn}>
                        <Select defaultValue="本周" style={{ width: 120 }} onChange={this.handleChange}>
                            <Option value="1">本周</Option>
                            <Option value="2">本月</Option>
                            <Option value="3">本季度</Option>
                            <Option value="4">本年</Option>
                            <Option value="5">全部</Option>
                        </Select>
                    </div>
                    <Spin spinning={this.state.loading}>
                <div className={styles.Top}>
                    <div className={styles.items}>
                        <img src={new_people} alt="" />
                        <div className={styles.text}>新开直销人数</div>
                        <div style={{marginTop:-5}}>
                                    <span className={styles.allCount}>{this.state.newSellingNum}</span>个
                                </div>
                    </div>
                    <div className={styles.items}>
                        <img src={add_people} alt="" />
                        <div className={styles.text}>追加人数</div>
                        <div style={{marginTop:-5}}>
                                    <span className={styles.allCount}>{this.state.addNum }</span>个
                                </div>
                    </div>
                    <div className={styles.items}>
                        <img src={jiantou} alt="" />
                        <div className={styles.text}>赎回人数</div>
                        <div style={{marginTop:-5}}>
                                    <span className={styles.allCount}>{this.state.redeemNum }</span>个
                                </div>
                    </div>
                </div>
                <div className={styles.bottom}>
                    <div className={styles.item}>
                        <img src={back_people} alt="" />
                        <div className={styles.right}>
                            <div className={styles.product}>待回访人数</div>
                            <div style={{marginTop:-5}}>
                                <span className={styles.allCount}>{this.state.needVisitNum }</span>个
                            </div>
                        </div>
                    </div>
                    <div className={styles.item}>
                        <img src={message} alt="" />
                        <div className={styles.right}>
                            <div className={styles.product}>网上销售未完成</div>
                            <div style={{marginTop:-5}}>
                                <span className={styles.allCount}>{this.state.unfinishNum }</span>个
                            </div>
                        </div>
                    </div>
                </div>
                 </Spin>
                </Card>
                
              
        );
    }
}

export default CustomerSell;
