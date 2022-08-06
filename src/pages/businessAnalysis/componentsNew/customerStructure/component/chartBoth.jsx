// data-set 可以按需引入，除此之外不要引入别的包
import React from 'react';
import { Chart, Axis, Tooltip, Geom, Legend, View } from 'bizcharts';
import DataSet from '@antv/data-set';
import Slider from 'bizcharts-plugin-slider';


const ds = new DataSet({
    state: {
      start: 0,
      end: 1,
    },
  });
// 下面的代码会被作为 cdn script 注入 注释勿删
// CDN START
const data = [
  { label: '2019-01', 客户数量: 580, 持有产品规模: 230,    },
  { label: '2019-03', 客户数量: 180, 持有产品规模: 280,    },
  { label: '2019-06', 客户数量: 95, 持有产品规模: 65,   },
  { label: '2019-09', 客户数量: 50, 持有产品规模: 89,    },
  { label: '2020-01', 客户数量: 580, 持有产品规模: 230,    },
  { label: '2020-03', 客户数量: 95, 持有产品规模: 65,   },
  { label: '2020-06', 客户数量: 180, 持有产品规模: 280,    },
  { label: '2020-09', 客户数量: 50, 持有产品规模: 89,    },
  { label: '2020-12', 客户数量: 95, 持有产品规模: 65,   },
  { label: '2021-01', 客户数量: 180, 持有产品规模: 280,    },
  { label: '2021-03', 客户数量: 50, 持有产品规模: 89,    }
];
//const ds = new DataSet();
ds.setState('type', '');
const dv = ds.createView('origin').source(data);

dv.transform({
  type: 'fold',
  fields: ['客户数量', '持有产品规模', ], // 展开字段集
  key: 'type', // key字段
  value: 'value', // value字段
})
.transform({
  type: 'filter',
  callback: (d) => { 
    return d.type !== ds.state.type;
  }
  //下面这个可以让slider和图表联动起来，但是会有显示bug，所以暂时注释
  // type: 'filter',
  //     callback(item, idx) {
  //       const radio = idx / data.length;
  //       return radio >= ds.state.start && radio <= ds.state.end;
  //     },
});
const scale = {
  总收益率: {
    type: 'linear',
    min: 0,
    max: 300,
  },
  value:{
      alias:''
  }
};

let chartIns = null;

const getG2Instance = (chart) => {
  chartIns = chart;
};

const legendItems = [
 	{ value: '客户数量', marker: { symbol: 'square', fill: '#3182bd', radius: 5 } },
  { value: '持有产品规模（万元）', marker: { symbol: 'square', fill: '#41a2fc', radius: 5 } }
];

class Demo extends React.Component {
    handleSliderChange = e => {
        const { startRadio, endRadio } = e;
        ds.setState('start', startRadio);
        ds.setState('end', endRadio);
      };
  render() {

    return (
    <div>
    <Chart height={400} width={500} forceFit data={dv} scale={scale} padding="auto" onGetG2Instance={(c) => {
            this.chart = c;
          }}>
      <Legend
        custom
        allowAllCanceled
        items={legendItems}
        onClick={(ev) => {
            setTimeout(() => {
                const checked = ev.checked;
                const value = ev.item.value;
              if (value === '持有产品规模') {
                  if (checked) {
                    this.chart.get('views')[0].get('geoms')[0].hide()
                  } else {
                    this.chart.get('views')[0].get('geoms')[0].show()
                  }
              }
                const newLegend = legendItems.map((d) => {
                    if (d.value === value) {
                        d.checked = checked
                    }
                    return d;
                  })
                  this.chart.filter('type', (t) => {
                     const legendCfg = newLegend.find(i => i.value == t);
                     return legendCfg && legendCfg.checked;
                  });
                
                this.chart.legend({
                  items: newLegend
                })
                this.chart.repaint();
              },0)
        }}
      />
      <Axis name="label" />
      {/* <Axis name="value" title={{
          textStyle:{
              rotate:0
          }
      }} position={'left'} /> */}
      <Tooltip />
      <Geom
        type="interval"
        position="label*value"
        color={['type', (value) => {
          if (value === '客户数量') {
            return '#2b6cbb';
          }
          if (value === '持有产品规模') {
            return '#41a2fc';
          }
        }]}
        adjust={[{
          type: 'dodge',
          marginRatio: 1 / 32,
        }]}
      />
        <View data={data} >
          <Axis name="总收益率" position="right" />
          <Geom type="line" position="label*总收益率" color="#fad248" size={3} />
        </View>
    </Chart>
    <Slider
    data={data}
    padding={60}
    xAxis="label"
    yAxis="客户数量"
    onChange={this.handleSliderChange}
    styles={{marginTop:"20px"}}
  />
  </div>
    );
  }
}

// CDN END
export default Demo;