import * as echarts from 'echarts';

const standardTitle = {
    3145: '沪深300',
    4978: '中证500',
    39144: '中证1000'
};

// 产品走势图
export const setMingShiTrend = (data, params, title) => {
    let key = params.standard;
    const xAxisData = [];
    const arrF = [];
    const arrHs = [];
    let min = 0, max = 0;
    data.mingshiTrend?.forEach((item) => {
        const netDate = item.NetDate ? item.NetDate.slice(2).replace(/-/g, '/') : '';
        xAxisData.push(netDate);
        arrF.push(item.acumulateNetValue);
        if (item.base_rv) arrHs.push(item.base_rv);
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
    console.info(min, max, 'cccc');
    min = ((Math.floor(min * 10 / 5)) / 2).toFixed(1);
    max = ((Math.ceil(max * 10 / 5)) / 2).toFixed(1);
    console.info(max, min,  max-min, 'fff');

    let name = standardTitle[key];

    let series = [
        {
            name: '基金累计净值',
            showSymbol: false,
            type: 'line',
            connectNulls: true,
            data: arrF,
            lineStyle: {
                width: 1.5
            }
        }
    ];
    if (arrHs.length) {
        series.push({
            name: `${name}累计收益`,
            showSymbol: false,
            type: 'line',
            connectNulls: true,
            data: arrHs,
            lineStyle: {
                width: 1.5
            }
        });
    }
    const echartsDom = document.createElement('div');
    echartsDom.style.width = '500px';
    echartsDom.style.height = '268px';
    const myChartO = echarts.init(echartsDom);
    return new Promise((resolve, reject) => {
        myChartO.clear();
        // 绘制图表
        myChartO.setOption(
            {
                title: {
                    text: title,
                    left: 'center',
                    textStyle: {
                        fontFamily: 'Microsoft YaHei',
                        fontSize: 14
                    },
                    padding: 14
                },
                tooltip: {},
                legend: {
                    bottom: 8,
                    left: 'center',
                    textStyle: {
                        fontSize: 8
                    },
                    data: [`${name}累计收益`, '基金累计净值']
                },
                grid: {
                    top: '10%',
                    left: '12%',
                    bottom: '28%'
                },
                color: ['#cf4949', '#2c88c9', '#f09f6a'],
                xAxis: {
                    data: xAxisData,
                    boundaryGap: false,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#000'
                        }
                    },
                    axisLabel: {
                        rotate: 90,
                        textStyle: {
                            fontSize: 8
                        },
                        showMaxLabel: true
                    }
                },
                yAxis: {
                    nameTextStyle: {
                        fontSize: 14
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#000'
                        }
                    },
                    axisLabel: {
                        formatter: '{value}'
                    },
                    min: min,
                    max: max,
                    interval: parseFloat(((+max - min) / 5).toFixed(1))
                },
                series: series
            },
            true,
        );
        myChartO.on('finished', function () {
            resolve(dispatchExportWord(myChartO));
        });
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
