import { Card, Select, Popconfirm, Spin} from 'antd';

import React, { Component } from 'react';
import addIcon from '@/assets/addIcon.png';
import styles from './style.less';
import LineChart from '../lineChart/LineChart';
import request from '@/utils/rest';
import { Item } from 'gg-editor';




class ManageScale extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lineDate:[
                {
                    date: '星期一',
                    customerTimes: 0
                }],
            loading:false,
            period:1,
            productType:1,
            StatisticalDimension:1,
            chooseDay:[{value:1, name:'天'}, {value:2, name:'周'}, {value:3, name:'月'}]
        };
    }

    componentDidMount() {
        this.getInfo();
    }
    Insert = ()=>{
        this.props.showInsert('管理规模');
    }

    confirm =(e)=> {
        this.props.delete('YWFX_0006');
    }
    getInfo = async()=>{
        this.setState({
            loading:true
        });
        let post={
            period:1,
            productType:1,
            StatisticalDimension:1
        };
        post.period = this.state.period*=1;
        post.productType = this.state.productType*=1;
        post.StatisticalDimension = this.state.StatisticalDimension*=1;
        let res = await request.postJSON('/mrp_analysis/simuAnalysis/managementScale', post);

        if(res.code===1008){
            let arr= res;
            for(let i=0;i<arr.length;i++){
                arr[i].date = arr[i].shareDate;
                arr[i].customerTimes = arr[i].totalAllvalue;
            }
            if(res && res.length>0){
                this.setState({
                    lineDate:arr
                });
            }
        }
        this.setState({
            loading:false
        });
    }
    cancel = (e) => {

    }
    handleChangeType = (value)=> {

        this.setState({
            productType:value
        }, function(){
            this.getInfo();
        });
    }
    handleChangeDay = (value)=> {

        this.setState({
            StatisticalDimension:value
        }, function(){
            this.getInfo();
        });

    }
    handleChangeTime = (value)=> {
        let arr=[];
        if(value==4 ||value==5){
            arr=[{value:3, name:'月'}];
        }else if(value ==1){
            arr=[{value:1, name:'天'}];
        }else if(value ==2){
            arr=[{value:1, name:'天'}, {value:2, name:'周'}];
        }else{
            arr=[{value:1, name:'天'}, {value:2, name:'周'}, {value:3, name:'月'}];
        }
        this.setState({
            period:value,
            chooseDay:arr
        }, function(){
            this.getInfo();
        });
    }

    render() {
        const Option = Select.Option;
        return (
            <Card
                bordered={false}
                title={
                    <span className={styles.cardTitle}>管理规模（敬请期待）</span>
                }
                extra={<div>
                    <span onClick={this.Insert} style={{color:'#3D7FFF', cursor:'pointer'}}>插入</span>
                    <Popconfirm
                        title="是否确认删除该组件?"
                        onConfirm={this.confirm}
                        onCancel={this.cancel}
                        okText="是"
                        cancelText="否"
                    >
                        <span style={{color:'#3D7FFF', cursor:'pointer', marginLeft:10}}>删除</span>
                    </Popconfirm>
                </div>}
                style={{height:'458px', verticalAlign:'top', marginBottom:20, width:'47%', display:'inline-block', margin:'1%'}}
                className={styles.card}
            >
                <div className={styles.wait}>
                    <Spin spinning={this.state.loading}>
                        <div className={styles.btn}>
                            <Select defaultValue="全部" style={{ width: 110 }} onChange={this.handleChangeType}>
                                <Option value="1">全部</Option>
                                <Option value="2">自发</Option>
                                <Option value="3">投顾</Option>
                            </Select>
                            <Select defaultValue="天" style={{ width: 110, marginLeft:20}} onChange={this.handleChangeDay}>
                                {
                                    this.state.chooseDay.map((item, index)=>{
                                        return <Option key={index} value={item.value}>{item.name}</Option>;
                                    })
                                }
                            </Select>
                            <Select defaultValue="本周" style={{ width: 110, marginLeft:20}} onChange={this.handleChangeTime}>
                                <Option value="1">本周</Option>
                                <Option value="2">本月</Option>
                                <Option value="3">本季度</Option>
                                <Option value="4">本年度</Option>
                                <Option value="5">全部</Option>

                            </Select>
                        </div>

                        <div className={styles.chart}>
                            <LineChart height={300} data={this.state.lineDate}/>
                        </div>
                    </Spin>
                </div>
            </Card>

        );
    }
}

export default ManageScale;
