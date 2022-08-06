// data-set 可以按需引入，除此之外不要引入别的包
import React from 'react';
import { Chart, Axis, Tooltip, Geom, Legend, View } from 'bizcharts';
import DataSet from '@antv/data-set';



// 下面的代码会被作为 cdn script 注入 注释勿删
// CDN START
const data = [
    { label: '2013', 收益率: 20, 夏普比率: 23    },
    { label: '2014', 收益率: 18, 夏普比率: 28    },
    { label: '2015', 收益率: 95, 夏普比率: 65   },
    { label: '2016', 收益率: 50, 夏普比率: 89    },
    { label: '2017', 收益率: 12, 夏普比率: 13    },
    { label: '2018', 收益率: 16, 夏普比率: 22    },
    { label: '2019', 收益率: 45, 夏普比率: 35   },
    { label: '2020', 收益率: 68, 夏普比率: 48    }
];
const ds = new DataSet();
ds.setState('type', '');
const dv = ds.createView().source(data);

dv.transform({
    type: 'fold',
    fields: ['收益率', '夏普比率'], // 展开字段集
    key: 'type', // key字段
    value: 'value' // value字段
})
    .transform({
        type: 'filter',
        callback: (d) => {
            return d.type !== ds.state.type;
        }
    });
const scale = {
    总收益率: {
        type: 'linear',
        min: 0,
        max: 10
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
    { value: '夏普比率', marker: { symbol: 'square', fill: '#41a2fc', radius: 5 } }
];

class Demo extends React.Component {
    render() {

        return (<Chart height={400} width={500} forceFit data={dv} scale={scale} padding="auto" onGetG2Instance={(c) => {
            this.chart = c;
        }}
        >
            <Legend
                custom
                allowAllCanceled
                items={legendItems}
                onClick={(ev) => {
                    setTimeout(() => {
                        const checked = ev.checked;
                        const value = ev.item.value;
                        if (value === '总收益率') {
                            if (checked) {
                                this.chart.get('views')[0].get('geoms')[0].hide();
                            } else {
                                this.chart.get('views')[0].get('geoms')[0].show();
                            }
                        }
                        const newLegend = legendItems.map((d) => {
                            if (d.value === value) {
                                d.checked = checked;
                            }
                            return d;
                        });
                        this.chart.filter('type', (t) => {
                            const legendCfg = newLegend.find((i) => i.value == t);
                            return legendCfg && legendCfg.checked;
                        });

                        this.chart.legend({
                            items: newLegend
                        });
                        this.chart.repaint();

                    }, 0);
                }}
            />
            <Axis name="label" />

            <Tooltip />
            <Geom
                type="interval"
                position="label*value"
                color={['type', (value) => {
                    if (value === '收益率') {
                        return '#2b6cbb';
                    }
                    if (value === '夏普比率') {
                        return '#41a2fc';
                    }
                    if (value === '收益') {
                        return '#54ca76';
                    }
                }]}
                adjust={[{
                    type: 'dodge',
                    marginRatio: 1 / 32
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
