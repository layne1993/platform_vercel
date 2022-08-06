import { Card,Select,Popconfirm  } from 'antd';

import React, { Component } from 'react';
import addIcon from '@/assets/addIcon.png';
 import styles from './style.less';


 import {
    G2,
    Chart,
    Geom,
    Tooltip,
    Coord,
    Label,
  } from "bizcharts";


class HeavyAsset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data2:[
                {
                  type: "自有产品",
                  value: 27
                },
                {
                  type: "投顾产品",
                  value: 25
                },
              ]
        };
    }

    componentDidMount() {

    }
    Insert = ()=>{
        this.props.showInsert('重仓资产情况');
    }

    confirm =(e)=> {
        this.props.delete('YWFX_0009')
    }
    
    cancel = (e) => {

    }
    handleChange = (value)=> {
      }

    render() {
        const Option = Select.Option;
        const width = 430
        const height = 400
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
                        <span className={styles.cardTitle}>重仓资产情况（敬请期待）</span>
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
                    style={{height:'458px', verticalAlign:'top', marginBottom:20,width:'47%',display:'inline-block',margin:'1%',}}
                    className={styles.card}
                >    
                {/* <div style={{textAlign:'center',margin:'auto',}}>
                        敬请期待...
                </div>  */}
                <div className={styles.wait}>
                   
                 <div className={styles.chart}>
                   {/* <PieChart  width={430} height={400} data={this.state.data2}/> */}
                   <Chart data={data} height={height} width={width} forceFit>
                            <Coord type="theta" radius={0.8} />
                            <Tooltip />
                            <Geom
                            type="intervalStack"
                            position="value"
                            color="type"
                            shape="sliceShape"
                            >
                            <Label content="type" />
                            </Geom>
                        </Chart>
                 </div>
                 </div>
                </Card>
              
        );
    }
}

export default HeavyAsset;
