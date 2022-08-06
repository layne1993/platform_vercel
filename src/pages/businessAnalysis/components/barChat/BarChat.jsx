import React from "react";
import {
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
} from "bizcharts";
import DataSet from "@antv/data-set";

class BarChat extends React.Component {
  render() {
    const height = this.props.height
    // const data = [
    //     {
    //       rangeName: "中国",
    //       ratio: 131744
    //     },
    //     {
    //       rangeName: "印度",
    //       ratio: 104970
    //     },
    //     {
    //       rangeName: "美国",
    //       ratio: 29034
    //     },
    //     {
    //       rangeName: "印尼",
    //       ratio: 23489
    //     },
    //     {
    //       rangeName: "巴西",
    //       ratio: 18203
    //     }
    //   ];
    const data =this.props.dataChart
      const ds = new DataSet();
      const dv = ds.createView().source(data);
      dv.source(data).transform({
        type: "sort",
  
        callback(a, b) {
          // 排序依据，和原生js的排序callback一致
          return a.ratio - b.ratio > 0;
        }
      });
    return (
        <div>
          <Chart height={height} data={dv} forceFit>
            <Coord transpose />
            <Axis
              name="rangeName"
              label={{
                offset: 12
              }}
            />
            <Axis name="占比" />
            <Tooltip />
            <Geom type="interval" position="rangeName*ratio" />
         </Chart> 
        </div>
      );
  }
}

export default BarChat