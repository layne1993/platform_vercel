import { Card,Popconfirm ,Spin,Tooltip as AntdTooltip} from 'antd';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { connect } from 'umi';
 import styles from './style.less';
 import request from '@/utils/rest';
import products from '@/assets/businessAnalysis/product_count.png';
import own from '@/assets/businessAnalysis/own_product.png';
import tou from '@/assets/businessAnalysis/tou_product.png';

import PieChart from '../pieChart/index'
import {
    G2,
    Chart,
    Geom,
    Tooltip,
    Coord,
    Label,
  } from "bizcharts";


class OperateView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            holdProductNum: 0,
            holdRaiseNum: 0,
            holdSubsistNum: 0,
            holdTerminalNum: 0,
            investProductNum: 0,
            investRaiseNum: 0,
            investSubsistNum: 0,
            investTerminalNum: 0,
            productNum: 0,
            raiseNum: 0,
            subsistNum: 0,
            otherNum:0,
            terminalNum: 3,
            loading:false,
            data2:[{
                type:'',
                value:''
            }],
            dataTag:false,
            show:true
        };
    }

    componentWillMount() {
       
        this.getCurrent()
        // let that = this
        // that.setState({
        //     show:false
        // },function(){
        //     setTimeout(function(){
        //         that.setState({
        //             show:true
        //         })
        //     },1000)
        // })
    }
    Insert = ()=>{
            this.props.showInsert('产品运营情况');
           
    }

    confirm =(e)=> {

        this.props.delete('YWFX_0001')
    }
      
    cancel = (e) => {
        console.log('cancel');

    }
    getCurrent = async()=>{
        this.setState({
            loading:true,
          })
        let res = await request.post('/mrp_analysis/simuAnalysis/productStat');
        console.log(res);
        console.log(res.holdProductNum);
        this.setState({
            holdProductNum: res.holdProductNum,
            holdRaiseNum: res.holdRaiseNum,
            holdSubsistNum: res.holdSubsistNum,
            holdTerminalNum: res.holdTerminalNum,
            investProductNum: res.investProductNum,
            investRaiseNum: res.investRaiseNum,
            investSubsistNum: res.investSubsistNum,
            investTerminalNum: res.investTerminalNum,
            productNum: res.productNum,
            raiseNum: res.raiseNum,
            subsistNum: res.subsistNum,
            terminalNum: res.terminalNum,

           // otherNum:res.otherNum
    
        })
        this.setState({
            loading:false,
          })
        let arr=[
              {
                type: "自有产品",
                value: 4,
                percent:0
              },
              {
                type: "投顾产品",
                value: 0,
                percent:0
              },
            ]
        arr[0].value = res.holdProductNum
        arr[1].value = res.investProductNum
        arr[0].percent = arr[0].value/(arr[0].value+arr[1].value)
        arr[1].percent = arr[1].value/(arr[0].value+arr[1].value)
        arr[0].percent =  (arr[0].percent*100).toFixed(2)
        arr[1].percent =  (arr[1].percent*100).toFixed(2)
        if(arr[1].percent==1){
            arr[1].percent = 100
        }
        if(arr[0].percent==1){
            arr[0].percent = 100
        }

        this.setState({

            data2:arr,
        })
    }
    componentWillReceiveProps(nextProps){
       if(nextProps==this.props){
        this.forceUpdate();
       }
       let that = this
        that.setState({
            show:false
        },function(){
            setTimeout(function(){
                that.setState({
                    show:true
                })
            },100)
        })
    }



    render() {
        const width = 300
        const height = 300
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
                        <span className={styles.cardTitle}>产品运营情况总览</span>
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
                 <div className={styles.content}>
                     <div className={styles.left}>
                        <div className={styles.item}>
                           <div className={styles.top}>
                                <img src={products} alt="" />
                                <div className={styles.right}>
                                    <div className={styles.product}>产品总数</div>
                                    <div>
                                        <span className={styles.allCount}>{this.state.productNum}</span>只
                                    </div>
                                </div>
                           </div>
                           <div className={styles.bottom}>
                               <div>
                                   <span style={{color:'#999999',marginRight:20}}>募集中:</span>
                                   <span style={{marginBottom:8}}>{this.state.raiseNum}</span>
                               </div>
                               <div>
                                   <span style={{color:'#999999'}}>存续/封闭中:</span>
                                   <span style={{marginBottom:8}}>{this.state.subsistNum}</span>
                               </div>
                               <div>
                                   <span style={{color:'#999999'}}>已终止/结束:</span>
                                   <span style={{marginBottom:8}}>{this.state.terminalNum}</span>
                               </div>
                               <AntdTooltip title="其它是指您未维护产品的状态信息">
                               <div>
                                   <span style={{color:'#999999'}}>其它:</span>
                                   <span style={{marginBottom:8}}>{this.state.otherNum}</span>
                               </div>
                                </AntdTooltip>
                                {/* <div>
                                   <span style={{color:'#999999'}}>其它:</span>
                                   <span style={{marginBottom:8}}>{this.state.otherNum}</span>
                               </div> */}
                               
                           </div>
                        </div>
                        <div className={styles.item}>
                           <div className={styles.top}>
                                <img src={own} alt="" />
                                <div className={styles.right}>
                                    <div className={styles.product}>自有产品</div>
                                    <div>
                                        <span className={styles.allCount}>{this.state.holdProductNum}</span>只
                                    </div>
                                </div>
                           </div>
                           <div className={styles.bottom}>
                               <div>
                                   <span style={{color:'#999999'}}>募集中:</span>
                                   <span style={{marginBottom:8}}>{this.state.holdRaiseNum}</span>
                               </div>
                               <div>
                                   <span style={{color:'#999999'}}>存续封闭中:</span>
                                   <span style={{marginBottom:8}}>{this.state.holdSubsistNum}</span>
                               </div>
                               <div>
                                   <span style={{color:'#999999'}}>已终止结束:</span>
                                   <span style={{marginBottom:8}}>{this.state.holdTerminalNum}</span>
                               </div>
                           </div>
                        </div>
                        <div className={styles.item}>
                           <div className={styles.top}>
                                <img src={tou} alt="" />
                                <div className={styles.right}>
                                    <div className={styles.product}>投顾产品</div>
                                    <div>
                                        <span className={styles.allCount}>{this.state.investProductNum}</span>只
                                    </div>
                                </div>
                           </div>
                           <div className={styles.bottom}>
                               <div>
                                   <span style={{color:'#999999'}}>募集中:</span>
                                   <span style={{marginBottom:8}}>{this.state.investRaiseNum}</span>
                               </div>
                               <div>
                                   <span style={{color:'#999999'}}>存续封闭中:</span>
                                   <span style={{marginBottom:8}}>{this.state.investSubsistNum}</span>
                               </div>
                               <div>
                                   <span style={{color:'#999999'}}>已终止结束:</span>
                                   <span style={{marginBottom:8}}>{this.state.investTerminalNum}</span>
                               </div>
                           </div>
                        </div>
                        
                        </div>
                     <div className={styles.right}>
                        {
                            this.state.show? <PieChart  width={300} height={300} data={this.state.data2}/>:''
                        }
                         {/* <Chart data={data} height={height} width={width} >
                             <Coord type="theta" radius={0.8} />
                             <Tooltip />
                             <Geom
                             type="intervalStack"
                             position="value"
                             color="type"
                             shape="sliceShape"
                             
                             tooltip={['text*percent*type', (text, percent,type) => {
                                 return {
                                     title:type,
                                     name:'百分比',
                                     value: percent + '%'
                                 };
                             }]}
                             >
                             <Label content="type" />
                             </Geom>
                         </Chart> */}
                         
                     </div>
                 </div>
                 </Spin>
                </Card>
              
        );
    }
}

export default OperateView;
