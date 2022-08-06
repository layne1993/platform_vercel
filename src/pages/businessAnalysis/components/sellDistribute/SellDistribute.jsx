import { Card ,Table,Input,Select,Button,Popconfirm,Tooltip as AntTooltip,Spin,Form, Row,Col ,Pagination} from 'antd';
const FormItem = Form.Item;
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { connect } from 'umi';
 import styles from './style.less';
import { get, size } from 'lodash-es';
import addIcon from '@/assets/addIcon.png';
import PieChart from '../pieChart/index'
import request from '@/utils/rest';
import {
  G2,
  Chart,
  Geom,
    Tooltip,
  Coord,
  Label,
} from "bizcharts";

class SellDistribute extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns:[{
                title: '销售渠道',
                dataIndex: 'dealer',
                key: 'dealer',
                onCell: () => {
                  return {
                    style: {
                      minWidth: 50,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow:'ellipsis',
                      cursor:'pointer'
                    }
                  }
                },
                render: (text) => <AntTooltip placement="topLeft" title={text}>{text}</AntTooltip>
              }, {
                title: '当前合作产品总数',
                dataIndex: 'productNum',
                key: 'productNum',
                onCell: () => {
                  return {
                    style: {
                      minWidth: 110,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow:'ellipsis',
                      cursor:'pointer'
                    }
                  }
                },
                render: (text) => <AntTooltip placement="topLeft" title={text}>{text}</AntTooltip>
              }, {
                title: '历史合作产品总数',
                dataIndex: 'productHisNum',
                key: 'productHisNum',
                onCell: () => {
                  return {
                    style: {
                      minWidth: 110,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow:'ellipsis',
                      cursor:'pointer'
                    }
                  }
                },
                render: (text) => <AntTooltip placement="topLeft" title={text}>{text}</AntTooltip>
              }, {
                title: '最新份额总计（万）',
                dataIndex: 'shareValue',
                key: 'shareValue',
                width:120,
                onCell: () => {
                  return {
                    style: {
                      minWidth: 110,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow:'ellipsis',
                      cursor:'pointer'
                    }
                  }
                },
                render: (text) => <AntTooltip placement="topLeft" title={text}>{text}</AntTooltip>
              }, {
                title: '最新市值总计（万）',
                dataIndex: 'netValue',
                key: 'netValue',
                width:120,
                onCell: () => {
                  return {
                    style: {
                      minWidth: 110,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow:'ellipsis',
                      cursor:'pointer'
                    }
                  }
                },
                render: (text) => <AntTooltip placement="topLeft" title={text}>{text}</AntTooltip>
              }, {
                title: '市值占比',
                dataIndex: 'ratio',
                key: 'ratio',
                onCell: () => {
                  return {
                    style: {
                      maxWidth: 70,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow:'ellipsis',
                      cursor:'pointer'
                    }
                  }
                },
                render: (text) => <AntTooltip placement="topLeft" title={text}>{text}</AntTooltip>
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
              data2:[
                {
                  type: "自有产品",
                  value: 27
                },
                {
                  type: "投顾产品",
                  value: 25
                },
              ],
              total:0,
              loading:false,
              dealer:"",//销售渠道名称
              timeRange:1,
              paginationProps:{
                pageSize:5,
              },
              show:true
        };
    }
    searchFormRef = React.createRef();
    componentDidMount() {
       this.get()
       let that = this
        that.setState({
            show:false
        },function(){
            setTimeout(function(){
                that.setState({
                    show:true
                })
            },600)
        })
    }
    componentWillReceiveProps(nextProps) {
      let that = this
      that.setState({
          show:false
      },function(){
          setTimeout(function(){
              that.setState({
                  show:true
              })
          },600)
      })
    }
    
    Insert = ()=>{
      console.log('111');
      this.props.showInsert('销售分布情况');
    }

    confirm =(e)=> {

        this.props.delete('YWFX_0014')
    }
      
    cancel = (e) => {

    }
    get = async()=>{
      this.setState({
        loading:true
      })
      console.log(this.state.dealer);
      let post ={

        timeRange:1,
      }
      if(this.state.dealer!==''){
         post.dealer = this.state.dealer
      }
      post.timeRange = this.state.timeRange*=1
      let res = await request.postJSON('/mrp_analysis/simuAnalysis/dealerStat',post);
      console.log(res);
      if(res.message=="成功"){
        let arr = []
        for(let i=0;i<res.data.length;i++){
            let item={}
            item.type = res.data[i].dealer
            item.value = res.data[i].ratioPercent
            arr.push(item)
        }
        console.log(arr);
         this.setState({
           data:res.data,
           loading:false,
           data2:arr
         })
      }
    }
    handleChange = (value)=> {
        this.setState({
          timeRange:value
        })
    }
    getCustomer = (e)=>{
       this.setState({
        dealer:e.target.value
       })
    }
    clear = ()=>{
      const { resetFields } = this.searchFormRef.current;
      resetFields();
    }
    
    render() {
      const width = 460
      const height = 260
      var data = this.state.data2
      let max = 0;
      data.forEach(function(obj) {
        if (obj.value > max) {
          max = obj.value;
        }
      }); // 自定义 other 的图形，增加两条线
      G2.Shape.registerShape("interval", "sliceShape", {
        draw(cfg, container) {
          const points = cfg.points;
          const origin = cfg.origin._origin;
          const percent = origin.value / max;
          const xWidth = points[2].x - points[1].x;
          const width = xWidth * percent;
          let path = [];
          path.push(["M", points[0].x, points[0].y]);
          path.push(["L", points[1].x, points[1].y]);
          path.push(["L", points[0].x + width, points[2].y]);
          path.push(["L", points[0].x + width, points[3].y]);
          path.push("Z");
          path = this.parsePath(path);
          return container.addShape("path", {
            attrs: {
              fill: cfg.color,
              path: path
            }
          });
        }
      });
  
        return (
               <Card
                    bordered={false}
                    title={
                        <span className={styles.cardTitle}>销售分布情况</span>
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
                    <div className={styles.input}>
                           <Form >
                                <Row gutter={24}>
                                    <Col span={10}>
                                        <Form.Item name={'dealer'} label="销售渠道名称">
                                            <Input onChange={this.getCustomer} placeholder={'请输入'} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={14}>
                                        <div
                                            style={{
                                                textAlign: 'right'
                                            }}
                                        >
                                        <Select defaultValue="本周" style={{ width: 100 ,marginRight:15}} onChange={this.handleChange}>
                                            <Option value='1'>本周</Option>
                                            <Option value="2">本月</Option>
                                            <Option value="3">本季度</Option>
                                            <Option value="4">全年</Option>
                                        </Select>
                                            <Button
                                                type={'primary'}
                                                htmlType={'submit'}
                                                style={{ marginRight: 8 }}
                                                onClick={this.get}
                                            >
                                                查询
                                            </Button>
                                            <Button onClick={this.getCustomer} htmlType={'reset'}>重置</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                    </div>

                        <div className={styles.table}>
                          <Table 
                              style={{marginBottom:10}}
                              columns={this.state.columns}
                              dataSource={this.state.data}
                              pagination={ this.state.paginationProps}
                          />
                          {/* <Pagination className={styles.pagin} showQuickJumper defaultCurrent={1} total={this.state.total} onChange={this.onChange} /> */}
                        </div>
                 
                        <div className={styles.right}>
                     <div style={{marginTop:40}}>
                     {/* <PieChart  style={{marginRight:30,marginTop:30}}  width={460} height={260} data={this.state.data2}/> */}
                     <Chart data={data} height={height} width={width} forceFit>
                            <Coord type="theta" radius={0.8} />
                            <Tooltip />
                            <Geom
                            type="intervalStack"
                            position="value"
                            color="type"
                            shape="sliceShape"
                            
                            tooltip={['text*value*type', (text, value,type) => {
                                return {
                                    title:type,
                                    name:'百分比',
                                    value: value + '%'
                                };
                            }]}
                            >
                            <Label content="type" />
                            </Geom>
                        </Chart>
                     </div>
                     </div>
                    
            
                    </Spin>
                </Card>
                
              
        );
    }
}

export default SellDistribute;
