import { Card,Select,Popconfirm,Spin  } from 'antd';

import React, { Component } from 'react';
import addIcon from '@/assets/addIcon.png';
 import styles from './style.less';
 import BarChat from '../barChat/BarChat'
 import request from '@/utils/rest';




class IncomeRange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeRange:1,
            dataChart:[{
                       rangeName: "",
                       ratio: 0
                     }],
            loading:false
        };
    }

    componentDidMount() {
       this.getData()
    }
    Insert = ()=>{
      this.props.showInsert('收益分布区间');
    }

    confirm =(e)=> {
        this.props.delete('YWFX_0007')
    }
    
    cancel = (e) => {

    }
    getData= async()=>{
        this.setState({
            loading:true
          })
        let post={
            timeRange:1
        }
        post.timeRange = this.state.timeRange*=1
        let res = await request.postJSON('/mrp_analysis/simuAnalysis/profitDistributionStat',post);
        if(res.message=="成功"){
           if(res.data.length==0){
            this.setState({
                loading:false
               })
           }else{
            this.setState({
                dataChart:res.data.reverse(),
                loading:false
               })
           }
        }
    }
    handleChange = (value)=> {
        this.setState({
            timeRange:value
          },function(){
            this.getData()
          })
          
      }

    render() {
        const Option = Select.Option;
        return (
               <Card
                    bordered={false}
                    title={
                        <span className={styles.cardTitle}>收益分布区间</span>
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
                    style={{height:'458px',verticalAlign:'top', marginBottom:20,width:'47%',display:'inline-block',margin:'1%',}}
                >
                    <Spin spinning={this.state.loading}>
                  <div className={styles.btn}>

                    <Select defaultValue="周收益" style={{ width: 120 ,marginLeft:20,}} onChange={this.handleChange}>
                        <Option value="1">周收益</Option>
                        <Option value="2">月收益</Option>
                        <Option value="3">季收益</Option>
                        <Option value="4">今年以来</Option>
                    </Select>
                 </div>
                
                 <div className={styles.chart}>
                   <BarChat height={400}  dataChart={this.state.dataChart}/>
                 </div>
                 </Spin>
                </Card>
              
        );
    }
}

export default IncomeRange;
