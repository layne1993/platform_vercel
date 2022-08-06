import { Card,Select ,Button,Table,Pagination ,Popconfirm,Form,Spin} from 'antd';

import React, { Component } from 'react';
import styles from './style.less';
import request from '@/utils/rest';




class OperateStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns:[ {
                title: '产品名称',
                dataIndex: 'productName',
                key: 'productName',
                align: 'center'
              }, {
                title: '产品系列',
                dataIndex: 'seriesTypeName',
                key: 'seriesTypeName',
                align: 'center'
              }, {
                title: '交易下单数',
                dataIndex: 'applyNum',
                key: 'applyNum',
                align: 'center'
              }, {
                title: '认申下单数',
                dataIndex: 'applyValue',
                key: 'applyValue',
                align: 'center'
              }, {
                title: '赎回下单数',
                dataIndex: 'applyRedeemNum',
                key: 'applyRedeemNum',
                align: 'center'
              }, {
                title: '认申下单金额',
                dataIndex: 'applyPurchaseMoney',
                key: 'applyPurchaseMoney', 
                align: 'center'
              }, {
                title: '赎回下单金额',
                dataIndex: 'applyRedeemMoney',
                key: 'applyRedeemMoney',
                align: 'center'
              }, {
                title: '交易确认数',
                dataIndex: 'tradeValue',
                key: 'tradeValue',
                align: 'center'
              }, {
                title: '认申确认数',
                dataIndex: 'applyValue',
                key: 'applyValue',
                align: 'center'
              }, {
                title: '确认赎回数',
                dataIndex: 'redeemValue',
                key: 'redeemValue',
                align: 'center'
              }, {
                title: '确认赎回金额',
                dataIndex: 'redeemMoney',
                key: 'redeemMoney',
                align: 'center'
              }, {
                title: '确认认申购金额',
                dataIndex: 'tradeMoney',
                key: 'tradeMoney',
                align: 'center'
              }],
              data :[{
                applyNum: 0,
                applyPurchaseMoney: 1,
                applyPurchaseNum: 2,
                applyRedeemMoney: 3,
                applyRedeemNum: 4,
                applyValue: 5,
                productId: 'string2',
                productName: 'string3',
                redeemMoney: 6,
                redeemValue: 7,
                seriesType: 'string4',
                seriesTypeName: 'string5',
                tradeMoney: 8,
                tradeValue: 9
              },{
                applyNum: 0,
                applyPurchaseMoney: 1,
                applyPurchaseNum: 22,
                applyRedeemMoney: 33,
                applyRedeemNum: 4,
                applyValue: 521,
                productId: 'string2',
                productName: 'string3',
                redeemMoney: 62,
                redeemValue: 73,
                seriesType: 'string4',
                seriesTypeName: 'string5',
                tradeMoney: 8,
                tradeValue: 9
              },{
                applyNum: 2,
                applyPurchaseMoney: 12,
                applyPurchaseNum: 2,
                applyRedeemMoney: 3,
                applyRedeemNum: 4,
                applyValue: 52,
                productId: 'string2',
                productName: 'string3',
                redeemMoney: 62,
                redeemValue: 72,
                seriesType: 'string4',
                seriesTypeName: 'string5',
                tradeMoney: 8,
                tradeValue: 9
              }],
              loading:false,
              NameOption:[{
                productId: 2173472,
                productName: "子基金",
              }],
              TypeOption:[{
                codeValue: 1810558,
                codeText: "哒哒哒哒哒哒"
              }],
              productIds:[],
              seriesTypes:[],
              total:0,
              timeRange:1
        };
    }

    componentDidMount() {
      this.getProductName()
      this.getProduceType()
        this.getInfo()
    }
    Insert = ()=>{
      console.log('111');
      this.props.showInsert('运营情况');
    }

    confirm =(e)=> {
        this.props.delete('YWFX_0012')
    }
    
    cancel = (e) => {

    }
    getProductName= async()=>{
      let res = await request.postJSON('/mrp_analysis/simuAnalysis/queryByProductName',{});
      console.log(res);
      if(res.message=="成功"){
         this.setState({
           NameOption:res.data
         })
      }
    }
    getProduceType= async()=>{
      let res = await request.postJSON('/mrp_analysis/simuAnalysis/querySeriesType',{});
      console.log(res);
      if(res.message=="成功"){
         this.setState({
          TypeOption:res.data
         })
      }
    }

    getInfo = async()=>{  
      this.setState({
        loading:true
      })
      
      let post ={
        pageNum: 1,
        pageSize: 10,
        productIds:[],
        seriesTypes:[],
        timeRange:1
      }
      post.timeRange = this.state.timeRange*=1
      post.productIds = this.state.productIds
      post.seriesTypes = this.state.seriesTypess
      let res =  await request.postJSON('/mrp_analysis/simuAnalysis/operateStat',post);
      if(res.message=="成功"){
        let arr= res.data.list
        for(let i=0;i<arr.length;i++){
          arr[i].applyValue = this.toLoacal(arr[i].applyValue)
          arr[i].redeemMoney = this.toLoacal(arr[i].redeemMoney)
          arr[i].redeemValue = this.toLoacal(arr[i].redeemValue)
          arr[i].tradeMoney = this.toLoacal(arr[i].tradeMoney)
          arr[i].tradeValue = this.toLoacal(arr[i].tradeValue)
          arr[i].seriesType = this.toLoacal(arr[i].seriesType)
          arr[i].applyNum = this.toLoacal(arr[i].applyNum)
          arr[i].applyRedeemNum = this.toLoacal(arr[i].applyRedeemNum)
          arr[i].applyPurchaseMoney = this.toLoacal(arr[i].applyPurchaseMoney)
          arr[i].applyRedeemMoney = this.toLoacal(arr[i].applyRedeemMoney)
          
          
          
          
        }
        this.setState({
          data:arr,
          total:res.data.total,
          loading:false
        })
      }
        
    }
    toLoacal(e){
      if(e==null){
        return 0
      }else{
        return e.toLocaleString()
      }
    }
    handleChange = (value)=> {
      if(value.length!==0){
        this.setState({
          productIds:value.toString().split(',').map(Number)
        })
      }else{
        this.setState({
          seriesTypes:[]
        })
      }
    }
    handleChangeTime = (value)=> {
      console.log(`selected ${value}`);
      this.setState({
        timeRange:value
      })
    }
    handleChangeType = (value)=> {
      console.log(value);
      if(value.length!==0){
        this.setState({
          seriesTypes:value.toString().split(',').map(Number)
        })
      }else{
        this.setState({
          seriesTypes:[]
        })
      }
      
    }
    onChange = async(pageNumber,pageSize)=> {
      this.setState({
        loading:true
      })
      let post ={
        pageNum: pageNumber,
        pageSize: pageSize
      }
      let res = await request.postJSON('/mrp_analysis/simuAnalysis/operateStat',post);
      if(res.message=="成功"){
        this.setState({
          loading:false
        })
         this.setState({
           data:res.data.list,
           total:res.data.total
         })
      }
    }

    render() {
        return (
               <Card
                    bordered={false}
                    title={
                        <span className={styles.cardTitle}>运营情况</span>
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
                <div className={styles.input}>
                         <Form >    
                            <Form.Item name={'customerName'} label="产品名称">
                            <Select  placeholder="请选择" style={{ width: 180 ,marginLeft:15,marginRight:30}} onChange={this.handleChange}>
                            {
                                  this.state.NameOption.map(item=>{
                                    return  <Option value={item.productId}>{item.productName}</Option>
                                  })
                                }
                            </Select>
                            产品系列：
                            {/* mode="multiple" */}
                            <Select  placeholder="请选择" style={{ width: 180 ,marginLeft:15,marginRight:30}} onChange={this.handleChangeType}>
                            {
                                  this.state.TypeOption.map(item=>{
                                    return  <Option value={item.codeValue}>{item.codeText}</Option>
                                  })
                                }
                            </Select>
                            <div
                                style={{
                                    float:'right'
                                }}>
                                  <Select defaultValue="本周" style={{ width: 100 ,marginRight:15}} onChange={this.handleChangeTime}>
                                            <Option value='1'>本周</Option>
                                            <Option value="2">本月</Option>
                                            <Option value="3">本季度</Option>
                                            <Option value="4">全年</Option>
                                            <Option value="5">全部</Option>
                                        </Select>
                                <Button
                                    type={'primary'}
                                    htmlType={'submit'}
                                    style={{ marginRight: 8 }}
                                    onClick={this.getInfo}>
                                    查询
                                </Button>
                                <Button htmlType={'reset'}>重置</Button>
                            </div>
                            </Form.Item>    
                          </Form>
                    </div>
                    <Spin spinning={this.state.loading}>
                <div className={styles.table}>
                <Table columns={this.state.columns} dataSource={this.state.data} pagination={ false } />
                </div>
                </Spin>
                <Pagination className={styles.pagin} showQuickJumper defaultCurrent={1} total={this.state.total} onChange={this.onChange} />
                

         
                </Card>
              
        );
    }
}

export default OperateStatus;
