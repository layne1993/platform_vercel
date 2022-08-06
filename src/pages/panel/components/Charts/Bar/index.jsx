import { Axis, Chart, Geom, Tooltip } from 'bizcharts';
import React, { Component } from 'react';
import Debounce from 'lodash.debounce';
import autoHeight from '../autoHeight';
import styles from '../index.less';
import { history } from 'umi';
import moment from 'moment';

class Bar extends Component {
    state = {
        autoHideXLabels: false
    };
    root = undefined;

    node = undefined;

    resize = Debounce(() => {
        if (!this.node || !this.node.parentNode) {
            return;
        }

        const canvasWidth = this.node.parentNode.clientWidth;
        const { data = [], autoLabel = true } = this.props;

        if (!autoLabel) {
            return;
        }

        const minWidth = data.length * 30;
        const { autoHideXLabels } = this.state;

        if (canvasWidth <= minWidth) {
            if (!autoHideXLabels) {
                this.setState({
                    autoHideXLabels: true
                });
            }
        } else if (autoHideXLabels) {
            this.setState({
                autoHideXLabels: false
            });
        }
    }, 500);

    componentDidMount() {
        window.addEventListener('resize', this.resize, {
            passive: true
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    handleRoot = (n) => {
        this.root = n;
    };

    handleRef = (n) => {
        this.node = n;
    };

    // 点击柱状图跳转
    onIntervalClick = (ev) => {
        const data = ev.data;
        // console.log(data)
        // return;
        if (data) {
            const time = data._origin['time'];
            const date = data._origin['date'];
            let rangeDate = '';
            if (time) {
                rangeDate = `${moment(time).valueOf()}-${moment(time).endOf('day').valueOf()}`;
            } else {
                rangeDate = `${moment(date).startOf('month').valueOf()}-${moment(date).endOf('month').valueOf()}`;
            }
            history.push(`/operation/transactionInfo/TransactionList/${moment().valueOf()}?rangeDate=${rangeDate}&tradeTypes=1,2`);
        }
    }

    render() {
        const {
            height = 1,
            title,
            forceFit = true,
            data,
            color = 'rgba(24, 144, 255, 0.85)',
            padding
        } = this.props;
        const { autoHideXLabels } = this.state;
        // console.log('data', data);
        const scale = {
            x: {
                type: 'cat'
            },
            y: {
                min: 0,
                minTickInterval: 1
            }
        };
        const tooltip = [
            'x*y',
            (x, y) => ({
                name: x,
                value: y
            })
        ];
        const cols = {
            tradeTimes: {
                minTickInterval: 1
            }
        };
        return (
            <div
                className={styles.chart}
                style={{
                    height
                }}
                ref={this.handleRoot}
            >
                <div ref={this.handleRef}>
                    {title && (
                        <h4
                            style={{
                                marginBottom: 20
                            }}
                        >
                            {title}
                        </h4>
                    )}
                    <Chart
                        scale={cols}
                        height={title ? height - 41 : height}
                        forceFit={forceFit}
                        data={data}
                        padding={padding || 'auto'}
                        onIntervalClick={this.onIntervalClick}
                    >
                        {/* tangsc:TODO（假数据待修改） */}
                        {/* <Axis
                          name="x"
                          title={false}
                          label={autoHideXLabels ? undefined : {}}
                          tickLine={autoHideXLabels ? undefined : {}}
                      />
                      <Axis name="y" min={0} /> */}
                        <Axis name="date" other="date" />
                        <Axis name="tradeTimes" />
                        <Tooltip showTitle={false} crosshairs={false} />
                        {/* <Geom type="interval" position="x*y" color={color} tooltip={tooltip} /> */}
                        <Geom
                            type="interval"
                            position="date*tradeTimes"
                            color="#3D7FFF"
                            tooltip={['text*tradeTimes', (text, tradeTimes) => {
                                return {
                                    name: '交易次数',
                                    value: tradeTimes
                                };
                            }]}
                        />
                    </Chart>
                </div>
            </div>
        );
    }
}

export default autoHeight()(Bar);
