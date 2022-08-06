import { Card ,Table,Popconfirm } from 'antd';
import React, { Component } from 'react';
 import styles from './style.less';
 import request from '@/utils/rest';


class CustomerShare extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns:[{
                title: '',
                dataIndex: 'name',
                key: 'name',
                
              }, {
                title: '资产净值',
                dataIndex: 'netValue',
                key: 'netValue',
                align: 'center',
                render: (text,record,index) => 
                  {
                    if(index==2){
                      return parseFloat(text) > 0 ? <div style={{color:'red'}}>{text}</div> : <div style={{color:'green'}}>{text}</div>
                    }else{
                      return <div >{text}</div>
                    }
                  }
              }, {
                title: '份额',
                dataIndex: 'tradeShare',
                key: 'tradeShare',
                align: 'center',
                render: (text,record,index) => 
                  {
                    if(index==2){
                      return parseFloat(text)>0?<div style={{color:'red'}}>{text}</div>:<div style={{color:'green'}}>{text}</div>
                    }else{
                      return <div >{text}</div>
                    }
                  }
              }, {
                title: '客户总数',
                dataIndex: 'customerNum',
                key: 'customerNum',
                align: 'center',
                render: (text,record,index) => 
                  {
                    if(index==2){
                      return parseFloat(text)>0?<div style={{color:'red'}}>{text}</div>:<div style={{color:'green'}}>{text}</div>
                    }else{
                      return <div >{text}</div>
                    }
                  }
                
              }, {
                title: '有效客户总数',
                dataIndex: 'effectiveCustomerNum',
                key: 'effectiveCustomerNum',
                align: 'center',
                render: (text,record,index) => 
                  {
                    if(index==2){
                      return parseFloat(text)>0?<div style={{color:'red'}}>{text}</div>:<div style={{color:'green'}}>{text}</div>
                    }else{
                      return <div >{text}</div>
                    }
                  }
              }],
              data :[{key: '1',name: '年初',netValue:'',tradeShare:'',customerNum:'',effectiveCustomerNum:''},
              {key: '2',name: '最新',netValue:'',tradeShare:'',customerNum:'',effectiveCustomerNum  :''},
              {key: '3',name: '变化',netValue:'',tradeShare:'',customerNum:'',effectiveCustomerNum:''}],
        };
    }

    componentDidMount() {
           this.getInfo()
    }
    Insert = ()=>{
        this.props.showInsert('客户份额');
    }
    confirm =(e)=> {

        this.props.delete('YWFX_0004')
    }
      
    cancel = (e) => {

    }

    getInfo = async()=>{
      let res = await request.postJSON('/mrp_analysis/simuAnalysis/tradeShareStat');
      let arr=[{key: '1',name: '年初',netValue:'',tradeShare:'',customerNum:'',effectiveCustomerNum:''},
      {key: '2',name: '最新',beginNetValue:'',beginTradeShare:'',beginCustomerNum:'',beginEffectiveCustomerNum  :''},
      {key: '3',name: '变化',increaseNetValue:'',increaseTradeShare:'',increaseCustomerNum:'',increaseEffectiveCustomerNum:''}]
      if(res.netValue){
        arr[0].netValue = this.toLoacal(res.beginNetValue)
        arr[0].tradeShare = this.toLoacal(res.beginTradeShare)
        arr[0].customerNum = this.toLoacal(res.beginCustomerNum)
        arr[0].effectiveCustomerNum = this.toLoacal(res.beginEffectiveCustomerNum)
        arr[1].netValue = this.toLoacal(res.netValue)
        arr[1].tradeShare = this.toLoacal(res.tradeShare)
        arr[1].customerNum = this.toLoacal(res.customerNum)
        arr[1].effectiveCustomerNum = this.toLoacal(res.effectiveCustomerNum)
        arr[2].netValue = this.toLoacal(res.increaseNetValue)
        arr[2].tradeShare = this.toLoacal(res.increaseTradeShare)
        arr[2].customerNum = this.toLoacal(res.increaseCustomerNum)
        arr[2].effectiveCustomerNum = this.toLoacal(res.increaseEffectiveCustomerNum)
          this.setState({
            data:arr
          })
      }
    
    }
    toLoacal(e){
      if(e==null){

        return e
      }else{
        return e.toLocaleString()
      }
    }

    handleChange = (value)=> {
      }
    render() {

        return (
               <Card
                    bordered={false}
                    title={
                        <span className={styles.cardTitle}>客户份额</span>
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
                    style={{height:'395px', verticalAlign:'top', marginBottom:20,width:'47%',display:'inline-block',margin:'1%',verticalAlign: 'top',}}
                >
                    <div className={styles.table}>
                       <Table columns={this.state.columns} dataSource={this.state.data} pagination={ false } />
                    </div>
                    <div className={styles.tag}>
                        数据源：认申赎流程表
                    </div>
                </Card>
                
              
        );
    }
}

export default CustomerShare;
