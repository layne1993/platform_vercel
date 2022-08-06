// data-set 可以按需引入，除此之外不要引入别的包
import React from 'react';
import { Chart, Axis, Tooltip, Geom, Legend, View } from 'bizcharts';
import DataSet from '@antv/data-set';

console.log(DataSet)


// 下面的代码会被作为 cdn script 注入 注释勿删
// CDN START
const data = [
  { label: '市场中性', 收益率: 180, 最大回撤: 230, 夏普比率: 330,   },
  { label: '股票多头', 收益率: 180, 最大回撤: 280, 夏普比率: 130,   },
  { label: '股票策略', 收益率: 95, 最大回撤: 65,  夏普比率: 110, },
  { label: '管理期货', 收益率: 50, 最大回撤: 89,  夏普比率: 280,  },
  { label: '债券基金', 收益率: 50, 最大回撤: 89,  夏普比率: 20,  }
];
const ds = new DataSet();
ds.setState('type', '');
const dv = ds.createView().source(data);

dv.transform({
  type: 'fold',
  fields: ['收益率', '最大回撤','夏普比率' ], // 展开字段集
  key: 'type', // key字段
  value: 'value', // value字段
})
.transform({
  type: 'filter',
  callback: (d) => { 
    console.log(ds.state.type);
    return d.type !== ds.state.type;
  }
});
const scale = {
  总收益率: {
    type: 'linear',
    min: 0,
    max: 10,
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
 	{ value: '收益率', marker: { symbol: 'square', fill: '#3182bd', radius: 5 } },
  { value: '最大回撤', marker: { symbol: 'square', fill: '#41a2fc', radius: 5 } },
  { value: '夏普比率', marker: { symbol: 'square', fill: '#54ca76', radius: 5 } }
];

class Demo extends React.Component {
  render() {
    console.log(dv)
    return (<Chart height={400} width={500} forceFit data={dv} scale={scale} padding="auto" onGetG2Instance={(c) => {
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
              if (value === '最大回撤') {
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
                // console.log(this.view)
              },0)
        }}
      />
      <Axis name="label"
       />
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
          if (value === '收益率') {
            return '#2b6cbb';
          }
          if (value === '最大回撤') {
            return '#41a2fc';
          }
          if (value === '最大回撤') {
            return '#54ca76';
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
    );
  }
}

// CDN END
export default Demo;