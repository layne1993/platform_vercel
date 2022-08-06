import { Card,Select ,Button,Table,Pagination,Popconfirm ,Form, Spin,Tooltip as AntTooltip} from 'antd';
import React, { Component } from 'react';
 import styles from './style.less';
 import request from '@/utils/rest';
import { rearg } from 'lodash-es';
import { throttleSetter } from 'lodash-decorators';





class IncomeShow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns:[ {
                title: '产品名称',
                dataIndex: 'productName',
                key: 'productName',
                align: 'center',
                onCell: () => {
                  return {
                    style: {
                      maxWidth: 100,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow:'ellipsis',
                      cursor:'pointer'
                    }
                  }
                },
                render: (text) => <AntTooltip placement="topLeft" title={text}>{text}</AntTooltip>
              }, {
                title: '产品系列',
                dataIndex: 'seriesTypeName',
                key: 'seriesTypeName',
                align: 'center',
                onCell: () => {
                  return {
                    style: {
                      minWidth: 70,
                      maxWidth: 100,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow:'ellipsis',
                      cursor:'pointer'
                    }
                  }
                },
                render: (text) => <AntTooltip placement="topLeft" title={text}>{text}</AntTooltip>
              }, {
                title: '净值',
                dataIndex: 'netValue',
                key: 'netValue',
                align: 'center',
                onCell: () => {
                  return {
                    style: {
                      maxWidth: 100,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow:'ellipsis',
                      cursor:'pointer'
                    }
                  }
                },
                render: (text) => 
                {
                  if(parseFloat(text)>0){
                    return <div style={{color:'red'}}>{text}</div>
                  }else if(text<0){
                    return <div style={{color:'green'}}>{text}</div>
                  }else{
                    return  <div >{text}</div>
                  }
                }
              }, {
                title: '累计净值',
                dataIndex: 'acumulateNetValue',
                key: 'acumulateNetValue',
                align: 'center',
                onCell: () => {
                  return {
                    style: {
                      minWidth: 70,
                      maxWidth: 100,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow:'ellipsis',
                      cursor:'pointer'
                    }
                  }
                },
                render: (text) => 
                  {
                    if(parseFloat(text)>0){
                      return <div style={{color:'red'}}>{text}</div>
                    }else if(text<0){
                      return <div style={{color:'green'}}>{text}</div>
                    }else{
                      return  <div >{text}</div>
                    }
                  }
              }, {
                title: '近一周',
                dataIndex: 'weekProfitPercent',
                key: 'weekProfitPercent',
                align: 'center',
                onCell: () => {
                  return {
                    style: {
                      minWidth: 70,
                      maxWidth: 100,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow:'ellipsis',
                      cursor:'pointer'
                    }
                  }
                },
                render: (text) => 
                  {
                    if(parseFloat(text)>0){
                      return <div style={{color:'red'}}>{text}%</div>
                    }else if(text<0){
                      return <div style={{color:'green'}}>{text}%</div>
                    }else{
                      return  <div >{text}</div>
                    }
                  }
              }, {
                title: '近一月',
                dataIndex: 'monthProfitPercent',
                key: 'monthProfitPercent',
                align: 'center',
                onCell: () => {
                  return {
                    style: {
                      minWidth: 70,
                      maxWidth: 100,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow:'ellipsis',
                      cursor:'pointer'
                    }
                  }
                },
                render: (text) => 
                  {
                    if(parseFloat(text)>0){
                      return <div style={{color:'red'}}>{text}%</div>
                    }else if(text<0){
                      return <div style={{color:'green'}}>{text}%</div>
                    }else{
                      return  <div >{text}</div>
                    }
                  }
              }, {
                title: '近一季',
                dataIndex: 'quarterProfitPercent',
                key: 'quarterProfitPercent',
                align: 'center',
                onCell: () => {
                  return {
                    style: {
                      minWidth: 70,
                      maxWidth: 100,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow:'ellipsis',
                      cursor:'pointer'
                    }
                  }
                },
                render: (text) => 
                  {
                    if(text>0){
                      return <div style={{color:'red'}}>{text}%</div>
                    }else if(text<0){
                      return <div style={{color:'green'}}>{text}%</div>
                    }else{
                      return  <div >{text}</div>
                    }
                  }
              }, {
                title: '近半年',
                dataIndex: 'halfYearProfitPercent',
                key: 'halfYearProfitPercent',
                align: 'center',
                onCell: () => {
                  return {
                    style: {
                      minWidth: 70,
                      maxWidth: 100,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow:'ellipsis',
                      cursor:'pointer'
                    }
                  }
                },
                render: (text) => 
                  {
                    if(text>0){
                      return <div style={{color:'red'}}>{text}%</div>
                    }else if(text<0){
                      return <div style={{color:'green'}}>{text}%</div>
                    }else{
                      return  <div >{text}</div>
                    }
                  }
              }, {
                title: '近一年',
                dataIndex: 'yearProfitPercent',
                key: 'yearProfitPercent',
                align: 'center',
                onCell: () => {
                  return {
                    style: {
                      minWidth: 70,
                      maxWidth: 100,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow:'ellipsis',
                      cursor:'pointer'
                    }
                  }
                },
                render: (text) => 
                  {
                    if(text>0){
                      return <div style={{color:'red'}}>{text}%</div>
                    }else if(text<0){
                      return <div style={{color:'green'}}>{text}%</div>
                    }else{
                      return  <div >{text}</div>
                    }
                  }
              }, {
                title: '成立以来',
                dataIndex: 'totalProfitPercent',
                key: 'totalProfitPercent',
                align: 'center',
                onCell: () => {
                  return {
                    style: {
                      minWidth: 70,
                      maxWidth: 100,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow:'ellipsis',
                      cursor:'pointer'
                    }
                  }
                },
                render: (text) => 
                  {
                    if(text>0){
                      return <div style={{color:'red'}}>{text}%</div>
                    }else if(text<0){
                      return <div style={{color:'green'}}>{text}%</div>
                    }else{
                      return  <div >{text}</div>
                    }
                  }
              }, {
                title: '成立时间',
                dataIndex: 'setDate',
                key: 'setDate',
                align: 'center',
                
              }, {
                title: '运营时间',
                dataIndex: 'operateDate',
                key: 'operateDate',
                align: 'center',
        
              }],
              data :[{
                key: '1',
                name: '年初',
                age: 32,
                address: '西湖区湖底公园1号',
              }, {
                key: '2',
                name: '最新',
                age: 42,
                address: '西湖区湖底公园1号',
              }, {
                key: '3',
                name: '年初',
                age: 32,
                address: '西湖区湖底公园1号',
              }],
              total:0,
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
        };
    }

    componentDidMount() {
      this.getProductName()
      this.getProduceType()
           this.getInfo()
    }

    Insert = ()=>{
        this.props.showInsert('收益表现情况');
    }

    confirm =(e)=> {
        this.props.delete('YWFX_0011')
    }
    
    cancel = (e) => {

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
      }
      post.productIds = this.state.productIds
      post.seriesTypes = this.state.seriesTypes
      let res = await request.postJSON('/mrp_analysis/simuAnalysis/profitStat',post);

      if(res.message=="成功"){
        let arr= res.data.list
        for(let i=0;i<arr.length;i++){
          arr[i].seriesTypeName = this.toLoacal(arr[i].seriesTypeName)
          arr[i].netValue = this.toLoacal(arr[i].netValue)
          arr[i].acumulateNetValue = this.toLoacal(arr[i].acumulateNetValue)
          arr[i].weekProfitPercent = this.toLoacal(arr[i].weekProfitPercent)
          arr[i].monthProfit = this.toLoacal(arr[i].monthProfit)
          arr[i].monthProfitPercent = this.toLoacal(arr[i].monthProfitPercent)
          arr[i].quarterProfitPercent = this.toLoacal(arr[i].quarterProfitPercent)
          arr[i].halfYearProfitPercent = this.toLoacal(arr[i].halfYearProfitPercent)
          arr[i].yearProfitPercent = this.toLoacal(arr[i].yearProfitPercent)
          arr[i].totalProfitPercent = this.toLoacal(arr[i].totalProfitPercent)
         // arr[i].setDate = this.dateFormat(arr[i].setDate)
          }
         this.setState({
           data:res.data.list,
           total:res.data.total,
           loading:false
         })
      }
    }
    dateFormat(e) {
      e.replace(/-/,"/")
      return e;
  }
    toLoacal(e){
      if(e==null){
        return 0
      }else{
        return e.toLocaleString()
      }
    }
    getProductName= async()=>{
      let res = await request.postJSON('/mrp_analysis/simuAnalysis/queryByProductName',{});

      if(res.message=="成功"){
         this.setState({
           NameOption:res.data
         })
      }
    }
    getProduceType= async()=>{
      let res = await request.postJSON('/mrp_analysis/simuAnalysis/querySeriesType',{});

      if(res.message=="成功"){
         this.setState({
          TypeOption:res.data
         })
      }
    }
    handleChange = (value)=> {
      if(value.length!==0){
        this.setState({
          productIds:value.toString().split(',').map(Number)
        })
      }else{
        this.setState({
          productIds:[]
        })
      }
    }
    init=()=>{
      this.handleChange([])
      this.handleChangeType([])
    }
    handleChangeType = (value)=> {
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
      let res = await request.postJSON('/mrp_analysis/simuAnalysis/profitStat',post);
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
                        <span className={styles.cardTitle}>收益表现情况</span>
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
                            <Select  placeholder="请选择"   style={{ width: 180 ,marginLeft:15,marginRight:30}} onChange={this.handleChange}>
                                {
                                  this.state.NameOption.map(item=>{
                                    return  <Option value={item.productId} key={item.productId}>{item.productName}</Option>
                                  })
                                }
                            </Select>
                            产品系列：
                            <Select  placeholder="请选择"  style={{ width: 180 ,marginLeft:15,marginRight:30}} onChange={this.handleChangeType}>
                                 {
                                  this.state.TypeOption.map(item=>{
                                    return  <Option value={item.codeValue} key={item.productId}>{item.codeText}</Option>
                                  })
                                }
                            </Select>
                            <div
                                style={{
                                    float:'right'
                                }}>
                                <Button
                                    type={'primary'}
                                    htmlType={'submit'}
                                    style={{ marginRight: 8 }}
                                    onClick={this.getInfo}>
                                    查询
                                </Button>
                                <Button htmlType={'reset'} onClick={this.init}>重置</Button>
                            </div>
                            </Form.Item>    
                          </Form>
                    </div>
                    <Spin spinning={this.state.loading}>
                <div className={styles.table}>
                  <Table columns={this.state.columns} dataSource={this.state.data} pagination={ false } />
                </div>
                <Pagination className={styles.pagin} showQuickJumper defaultCurrent={1} total={this.state.total} onChange={this.onChange} />
                </Spin>

         
                </Card>
              
        );
    }
}

export default IncomeShow;
