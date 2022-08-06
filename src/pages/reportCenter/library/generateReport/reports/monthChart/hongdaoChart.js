import * as echarts from 'echarts';

// 产品走势图
export const setHongDaoTrend = (data, title) => {
    const xAxisData = [];
    const arrF = [];
    const arrHs = [];
    let min = 0,
        max = 0;
    data.relativeNetValue?.forEach((item) => {
        const netDate = item.date ? item.date.replace(/-/g, '/') : '';
        xAxisData.push(netDate);
        arrF.push(item.value);
        arrHs.push(item.baseValue);
    });

    // 计算纵轴最小值
    if (arrHs.length) {
        min = Math.min(...arrF) < Math.min(...arrHs) ? Math.min(...arrF) : Math.min(...arrHs);
    } else {
        min = Math.min(...arrF);
    }

    if (arrHs.length) {
        max = Math.max(...arrF) < Math.max(...arrHs) ? Math.max(...arrHs) : Math.max(...arrF);
    } else {
        max = Math.max(...arrF);
    }

    min = parseFloat((Math.floor((min * 10) / 5) / 2).toFixed(1));
    max = parseFloat((Math.ceil((max * 10) / 5) / 2).toFixed(1));

    let series = [
        {
            name: title,
            showSymbol: false,
            type: 'line',
            connectNulls: true,
            data: arrF,
            lineStyle: {
                width: 1.5
            }
        },
        {
            name: '沪深300指数',
            showSymbol: false,
            type: 'line',
            connectNulls: true,
            data: arrHs,
            lineStyle: {
                width: 1.5
            }
        }
    ];
    const echartsDom = document.createElement('div');
    echartsDom.style.width = '442px';
    echartsDom.style.height = '188px';
    const myChartO = echarts.init(echartsDom);
    return new Promise((resolve, reject) => {
        myChartO.clear();
        // 绘制图表
        myChartO.setOption(
            {
                title: { show: false },
                tooltip: {},
                legend: {
                    bottom: 8,
                    itemWidth: 14,
                    itemHeight: 1,
                    left: 'center',
                    icon: 'roundRect',
                    textStyle: {
                        fontSize: 8
                    },
                    data: [title, '沪深300指数']
                },
                grid: {
                    top: '8%',
                    left: '8%',
                    bottom: '30%'
                },
                color: ['#cf4949', '#6f9dff', '#b3b5b8'],
                xAxis: {
                    data: xAxisData,
                    boundaryGap: false,
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: 'rgba(6, 6, 6, 0.7)'
                        }
                    },
                    axisLabel: {
                        rotate: 40, //40//
                        textStyle: {
                            fontSize: 6
                        },
                        showMaxLabel: true
                    },
                    axisTick: {
                        length: 2,
                        lineStyle: {
                            color: 'rgba(6, 6, 6, 0.3)'
                        }
                    }
                },
                yAxis: {
                    nameTextStyle: {
                        fontSize: 6,
                        color: 'rgba(6, 6, 6, 0.5)'
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: 'rgba(6, 6, 6, 0.7)'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            fontSize: 6
                        }
                    },
                    // min: min,
                    min: function (value) {
                        return (Math.floor(value.min * 10) / 10).toFixed(1);
                    }
                    // max: max,
                    // interval: parseFloat(((+max - min) / 5).toFixed(1))
                    // interval: 0.07
                    // splitNumber: 8
                },
                series: series
            },
            true,
        );
        setTimeout(() => {
            console.info(dispatchExportWord(myChartO), 'dispatchExportWord(myChartO)');
            resolve(dispatchExportWord(myChartO));
        }, 1500);
        // myChartO.on('finished', function () {
        //     console.info(dispatchExportWord(myChartO), 'dispatchExportWord(myChartP)');
        //     resolve(dispatchExportWord(myChartO));
        // });
    });
};

const dispatchExportWord = async (myChart) => {
    let url = myChart.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff'
    });
    return url.replace('data:image/png;base64,', '');
};
