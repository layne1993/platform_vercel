import React from "react";
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";
import DataSet from "@antv/data-set";

class PieChart extends React.Component {
  render() {
    const { DataView } = DataSet;
    const data = [
      {
        item: "事例一",
        count: 40
      },
      {
        item: "事例二",
        count: 21
      },
      {
        item: "事例三",
        count: 17
      },
      {
        item: "事例四",
        count: 13
      },
      {
        item: "事例五",
        count: 9
      }
    ];
    const title = this.props.title
    const tipOne = this.props.tipOne
    const tipTwo = this.props.tipTwo
    const dv = new DataView();
    dv.source(this.props.customerNumber).transform({
      type: "percent",
      field: "count",
      dimension: "item",
      as: "percent"
    });
    const cols = {
      percent: {
        formatter: val => {
          //val = (val * 100).toFixed(2) + "%";
          
          if(val.toString().length==2){
            val = val * 100 + "%";
          }else{
            val = (val * 100).toFixed(2) + "%";
          }
          return val;
        }
      }
    };
    return (
      <div>
        <Chart
          height={this.props.height}
          data={dv}
          scale={cols}
          padding={[5, 250, 0, 0]}
          forceFit
        >
          <Coord type="theta" radius={0.75} />
          <Axis name="percent" title  />
          <Legend
            position="right-center"
            //offsetY={-window.innerHeight / 2 + 380}
            
          />
          
          <Tooltip
            showTitle={false}
            itemTpl="<li>
            {name}<br/>
            {tipOne}：{value}
            <br/>
            {tipTwo}：
            </li>"
          />
          <Geom
            type="intervalStack"
            position="percent"
            color="item"
            tooltip={[
              "item*percent",
              (item, percent) => {
              //  percent = percent * 100 + "%";
                if(percent.toString().length==2){
                  percent = percent * 100 + "%";
                }else{
                  percent = (percent * 100).toFixed(2) + "%";
                }
                return {
                  name: item,
                  value: percent,
                  tipOne:tipOne,
                  tipTwo:tipTwo
                };
              }
            ]}
            style={{
              lineWidth: 1,
              stroke: "#fff"
            }}
          >
            {
                this.props.count==1?
                <Label
                content="count"
                offset={-40}
                textStyle={{
                  textAlign: "center",
                  shadowBlur: 2,
                  shadowColor: "rgba(0, 0, 0, .45)"
                }}
              />
              :<Label
              content="percent"
              offset={-40}
              textStyle={{
                textAlign: "center",
                shadowBlur: 2,
                shadowColor: "rgba(0, 0, 0, .45)"
              }}
            />
            }
          </Geom>
          <Guide>
            {/* tips为1时展示灰色提示文字，不穿时默认黑色文字 ，但是文字太长的话就不要用这个了，重新写吧*/}
            {
              this.props.tips==1?<Guide.Text
              top
              position={['50%', '95%']}
              content={title}
              style={{ textAlign: 'center', fontSize: 12 , fill:'#999999'}}
            />:
            <Guide.Text
            top
            position={['50%', '95%']}
            content={title}
            style={{ textAlign: 'center', fontSize: 15 , fill:'#333333'}}
          />
            }
          </Guide>
        </Chart>
        
      </div>
    );
  }
}

export default PieChart;
