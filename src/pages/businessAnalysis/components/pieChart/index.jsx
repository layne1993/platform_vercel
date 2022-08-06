import React from "react";
import {
  G2,
  Chart,
  Geom,
  Tooltip,
  Coord,
  Label,
} from "bizcharts";



class PieChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        show:true
    };
}

componentWillMount() {
   
    let that = this
    that.setState({
        show:false
    },function(){
        setTimeout(function(){
            that.setState({
                show:true
            })
        },200)
    })
}
  render() {
    const width = this.props.width
    const height = this.props.height
    var data = this.props.data
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

    

    class SliderChart extends React.Component {
      shouldComponentUpdate(nextProps, nextState) {
        console.log(nextState);
        return true;
      }
      render() {
        
        return (
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
        );
      }
    }
    return (
      <div>
        {
          this.state.show?<SliderChart />:''
        }
      </div>
    );
  }
}
export default PieChart;
