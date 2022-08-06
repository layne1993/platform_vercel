import { Card,Tabs, Radio ,Spin,Tooltip as AntdTooltip} from 'antd';
import React, { Component } from 'react';
 import styles from './customerStructure.less';
 import request from '@/utils/rest';
 import products from '@/assets/businessAnalysis/product_count.png';
import own from '@/assets/businessAnalysis/own_product.png';
import tou from '@/assets/businessAnalysis/tou_product.png';
import four from '@/assets/businessAnalysis/four.png';

import PieChart from '../../componentsNew/pieChart';



import ChartIndex from "./component/ChartIndex";
import { divide } from 'lodash';
import ChartBoth from './component/chartBoth'


class CustomerStructure extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 'top',
            holdProductNum: 126560,
            investProductNum: 126560,
            productNum: 126560,
            terminalNum: 3,
            loading:false,
            data2:[{
                type:'',
                value:''
            }],
            customerNumber :[
              {
                item: "长江证卷",
                count: 204,
                percent:'20%'
              },
              {
                item: "招商证券",
                count: 129,
                percent:'10%'
              },
              {
                item: "中信",
                count: 389,
                percent:'25%'
              },
              {
                item: "公司直销",
                count: 304,
                percent:'30%'
              }
            ],
             holdProduct : [
              {
                item: "销售渠道A",
                count: 25
              },
              {
                item: "销售渠道B",
                count: 850
              },
              {
                item: "销售渠道C",
                count: 205
              },
              {
                item: "销售渠道D",
                count: 973
              },
              {
                item: "销售渠道E",
                count: 816
              }
            ],
        };
    }

    componentWillMount() {
    }
    handleModeChange = e => {
        const mode = e.target.value;
        if(mode=="top"){
          let arr =[]
          if(this.props.left=="客户数量"){
             arr = [
              {
                item: "长江证卷",
                count: 204
              },
              {
                item: "招商证券",
                count: 129
              },
              {
                item: "中信",
                count: 389
              },
              {
                item: "公司直销",
                count: 304
              }
            ]
          }else{
            arr = [
              {
                item: "长江证卷",
                count: 204
              },
              {
                item: "招商证券",
                count: 129
              },
              {
                item: "中信",
                count: 389
              },
              {
                item: "公司直销",
                count: 304
              }
            ]
          }
          this.setState({customerNumber:arr})
        }
        if(mode=="company"){
          let arr=[]
          if(this.props.left=="客户数量"){
            arr = [
              {
                item: "某某资产精品4号",
                count: 10
              },
              {
                item: "某某资产精品1号",
                count: 20
              },
              {
                item: "某某资产精品2号",
                count: 15
              },
              {
                item: "某某资产精品3号",
                count: 15
              },
              {
                item: "某某资产精选策略云峰1号",
                count: 10
              },
              {
                item: "某某私募证券投资基金",
                count: 20
              },
              {
                item: "某某资产精选策略演示9号A",
                count: 10
              }
            ]
          }else{
            arr = [
              {
                item: "某某资产精品4号",
                count: 10
              },
              {
                item: "某某资产精品1号",
                count: 20
              },
              {
                item: "某某资产精品2号",
                count: 15
              },
              {
                item: "某某资产精品3号",
                count: 15
              },
              {
                item: "某某资产精选策略云峰1号",
                count: 10
              },
              {
                item: "某某私募证券投资基金",
                count: 20
              },
              {
                item: "某某资产精选策略演示9号A",
                count: 10
              }
            ]
          }
          this.setState({customerNumber:arr})
        }
        if(mode=="one"){
          let arr=[]
          if(this.props.left=="客户数量"){
            arr = [
              {
                item: "银行存款",
                count: 20
              },
              {
                item: "股票",
                count: 40
              },
              {
                item: "债卷",
                count: 15
              },
              {
                item: "期货",
                count: 15
              },
              {
                item: "基金",
                count: 10
              }
            ]
          }else{
            arr = [
              {
                item: "银行存款",
                count: 20
              },
              {
                item: "股票",
                count: 40
              },
              {
                item: "债卷",
                count: 15
              },
              {
                item: "期货",
                count: 15
              },
              {
                item: "基金",
                count: 10
              }
            ]
          }
          this.setState({customerNumber:arr})
        }
        this.setState({ mode });
    };


    render() {
         
        const doubleData= this.props.doubleData
        const left  = this.props.left
        const right = this.props.right
        const tabsa = this.props.tabs
        return (
               <Card
                    style={{marginBottom:"20px"}}
                    bordered={false}
                    title={
                        <span className={styles.cardTitle}>客户结构</span>
                    }
                >
                 <Spin spinning={this.state.loading}>
                    <div className={styles.content}>
                        <div className={styles.left}>
                            <div className={styles.item}>
                            <div className={styles.top}>
                                    <img src={products} alt="" />
                                    <div className={styles.right}>
                                        <div className={styles.product}>总客户数</div>
                                        <div>
                                            <span className={styles.allCount}>{this.state.productNum}</span>人
                                        </div>
                                    </div>
                            </div>
                            </div>
                            <div className={styles.item}>
                            <div className={styles.top}>
                                    <img src={own} alt="" />
                                    <div className={styles.right}>
                                        <div className={styles.product}>有效投资者总数</div>
                                        <div>
                                            <span className={styles.allCount}>{this.state.holdProductNum}</span>人
                                        </div>
                                    </div>
                            </div>
                            </div>
                            <div className={styles.item}>
                            <div className={styles.top}>
                                    <img src={tou} alt="" />
                                    <div className={styles.right}>
                                        <div className={styles.product}>新增客户数</div>
                                        <div>
                                            <span className={styles.allCount}>{this.state.investProductNum}</span>人
                                        </div>
                                    </div>
                            </div>
                            </div>
                            <div className={styles.item}>
                            <div className={styles.top}>
                                    <img src={four} alt="" />
                                    <div className={styles.right}>
                                        <div className={styles.product}>公司产品客户数</div>
                                        <div>
                                            <span className={styles.allCount}>{this.state.investProductNum}</span>人
                                        </div>
                                    </div>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.chart}>
                        <div>
                            <div className={styles.tabsStyle}>
                            <Radio.Group onChange={this.handleModeChange} value={this.state.mode} style={{ marginBottom: 8 }}>
                            {
                              left=="客户数量"?
                              <div>
                              <Radio.Button value="top">销售渠道</Radio.Button>
                              {/* <Radio.Button value="tops">销售区域</Radio.Button> */}
                              <Radio.Button value="company">公司产品</Radio.Button>
                              </div>
                              :<div>
                              <Radio.Button value="top">销售渠道</Radio.Button>
                              {/* <Radio.Button value="tops">销售区域</Radio.Button> */}
                              <Radio.Button value="one">策略类型</Radio.Button>
                              </div>
                            }
                            </Radio.Group>
                            </div>
                        </div>
                        <div className={styles.both}>
                            <div className={styles.left}>
                              {/* cont用来控制饼状图是否显示百分比，1显示数字，0显示百分比 */}
                                {
                                  left=="客户数量"?<PieChart height={300} customerNumber = {this.state.customerNumber} title={left} tipOne={'客户数量占比'} tipTwo={'客户数量（人）'} count={1}/>:<PieChart height={300} title={left} customerNumber = {this.state.customerNumber} count={0}/>
                                }
                                {/* <span className={styles.text}>{left}</span> */}
                            </div>
                            <div className={styles.right}>
                               
                                {
                                  left=="客户数量"?<PieChart height={300} title={right} customerNumber = {this.state.customerNumber} tipOne={'客户持有产品份额占比'} tipTwo={'客户持有产品份额规模（万元）'} count={1}/>:<PieChart height={300} title={right} customerNumber = {this.state.customerNumber} count={0}/>
                                }
                                {/* <span className={styles.text}>{right}</span> */}
                            </div>
                        </div>
                    </div>
                    <div className={styles.bottom}>
                        <div className={styles.top}>
                        <div className={styles.title} >指标规模</div>
                        <div className={styles.right}>
                          {/* <span className={styles.one}>客户数量</span>
                          <span className={styles.two}>持有产品规模（万元）</span> */}
                        </div>
                        </div>
                        <div>
                        {/* <ChartIndex doubleData={doubleData}/> */}
                        <ChartBoth/>
                        </div>
                    </div>
                 </Spin>
                </Card>
              
        );
    }
}

export default CustomerStructure;
