import React from 'react';
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
    Util,
    LineAdvance
} from 'bizcharts';

class LineChart extends React.Component {
    render() {
        const height=this.props.height;
        // const data = [
        //     {
        //         date: "Jan",

        //         customerTimes: 7
        //     },
        //     {
        //         date: "Feb",

        //         customerTimes: 13
        //     },
        //     {
        //         date: "Mar",

        //         customerTimes: 16.5
        //     },
        //     {
        //         date: "Apr",

        //         customerTimes: 8.5
        //     },
        //     {
        //         date: "May",

        //         customerTimes: 11.9
        //     },
        //     {
        //         date: "Jun",

        //         customerTimes: 15.2
        //     },
        //     {
        //         date: "Jul",

        //         customerTimes: 17
        //     },
        //     {
        //         date: "Aug",

        //         customerTimes: 16.6
        //     },
        //     {
        //         date: "Sep",

        //         customerTimes: 14.2
        //     },
        //     {
        //         date: "Oct",

        //         customerTimes: 10.3
        //     },
        //     {
        //         date: "Nov",

        //         customerTimes: 5.6
        //     },
        //     {
        //         date: "Dec",

        //         customerTimes: 9.8
        //     }
        // ];
        const data = this.props.data;
        const cols = {
            date: {

            }
        };
        return (
            <div>
                <Chart height={height} data={data} scale={cols} forceFit>
                    {/* <Legend /> */}
                    <Axis name="date" />
                    <Axis
                        name="customerTimes"
                        label={{
                            formatter: (val) => `${val}`
                        }}
                    />
                    <Tooltip
                        useHtml
                        g2-tooltip={{
                            boxShadow:'none',
                            color:'#fff',
                            backgroundColor:'#222'
                        }}
                        crosshairs={{
                            type: 'y'
                        }}
                        style={{
                            color:'red'
                        }}
                    />
                    <Geom
                        type="line"
                        position="date*customerTimes"
                        size={2}
                        color={'customerTimes'}
                        shape={'smooth'}
                        tooltip={['text*value*date*customerTimes', (text, value, date, customerTimes) => {
                            return {
                                name:date,
                                value: customerTimes
                            };
                        }]}
                    />
                    <Geom
                        type="point"
                        position="date*customerTimes"
                        size={4}
                        shape={'circle'}
                        color={'customerTimes'}
                        style={{
                            stroke: '#fff',
                            lineWidth: 1
                        }}
                        tooltip={['text*value*date*customerTimes', (text, value, date, customerTimes) => {
                            return {
                                name:date,
                                value: customerTimes
                            };
                        }]}
                    />
                </Chart>
            </div>
        );
    }
}

export default LineChart;
