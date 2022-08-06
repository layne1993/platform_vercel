import * as echarts from 'echarts';

// 产品走势图
export const setNingquanTrend = (data, title) => {
    const xAxisData = [];
    const arrF = [];
    const arrHs = [];
    let min = 0,
        max = 0;
    data.ningquanTrend?.forEach((item) => {
        const netDate = item.NetDate ? item.NetDate.replace(/-/g, '/') : '';
        xAxisData.push(netDate);
        arrF.push(item.w_fundar);
        arrHs.push(item.w_Hs300);
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
                width: 1.5,
            },
        },
        {
            name: '沪深300指数',
            showSymbol: false,
            type: 'line',
            connectNulls: true,
            data: arrHs,
            lineStyle: {
                width: 1.5,
            },
        },
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
                        fontSize: 8,
                    },
                    data: [title, '沪深300指数'],
                },
                grid: {
                    top: '8%',
                    left: '8%',
                    bottom: '30%',
                },
                color: ['#cf4949', '#6f9dff', '#b3b5b8'],
                xAxis: {
                    data: xAxisData,
                    boundaryGap: false,
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: 'rgba(6, 6, 6, 0.7)',
                        },
                    },
                    axisLabel: {
                        rotate: 40,
                        textStyle: {
                            fontSize: 6,
                        },
                        showMaxLabel: true,
                    },
                    axisTick: {
                        length: 2,
                        lineStyle: {
                            color: 'rgba(6, 6, 6, 0.3)',
                        },
                    },
                },
                yAxis: {
                    nameTextStyle: {
                        fontSize: 6,
                        color: 'rgba(6, 6, 6, 0.5)',
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: 'rgba(6, 6, 6, 0.7)',
                        },
                    },
                    axisLabel: {
                        textStyle: {
                            fontSize: 6,
                        },
                    },
                    min: min,
                    max: max,
                    interval: parseFloat(((+max - min) / 5).toFixed(1)),
                },
                series: series,
            },
            true,
        );
        myChartO.on('finished', function () {
            resolve(dispatchExportWord(myChartO));
        });
    });
};

// 行业
export const setIndustryBar = (data) => {
    const xAxisData = [];
    const arrF = [];
    data.ningquanIndustry?.forEach((item) => {
        xAxisData.push(item.industryName);
        arrF.push(parseFloat(item.industryProportion));
    });

    const echartsDom = document.createElement('div');
    echartsDom.style.width = '888px';
    echartsDom.style.height = '248px';
    const myChartT = echarts.init(echartsDom);
    return new Promise((resolve, reject) => {
        myChartT.clear();
        // 绘制图表
        myChartT.setOption({
            title: {
                show: false,
            },
            grid: {
                top: '10%',
                left: '12%',
                bottom: '20%',
            },
            color: '#1283D5',
            xAxis: [
                {
                    type: 'category',
                    data: xAxisData,
                    axisLabel: {
                        rotate: 45,
                        textStyle: {
                            fontSize: 8,
                        },
                    },
                },
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}%',
                    },
                },
            ],
            series: [
                {
                    type: 'bar',
                    data: arrF,
                    barMaxWidth: '24px',
                    itemStyle: {
                        normal: {
                            label: {
                                show: true, //开启显示
                                position: 'top', //在上方显示
                                formatter: function (val) {
                                    if (val.value !== 0) {
                                        return val.value + '%';
                                    } else {
                                        return '';
                                    }
                                },
                                textStyle: {
                                    //数值样式
                                    fontSize: 10,
                                    color: '#000000',
                                },
                            },
                        },
                    },
                },
            ],
        });
        myChartT.on('finished', function () {
            resolve(dispatchExportWord(myChartT));
        });
    });
};

// positon
export const setPositionPie = (data) => {
    const arrT = [];
    data.ningquanPosition?.forEach((item) => {
        arrT.push({
            value: item.endNetValue,
            name: item.positionType,
        });
    });

    let series = [
        {
            type: 'pie',
            radius: '80%',
            grid: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            },
            label: {
                position: 'outside',
                formatter: '{d}%',
                fontSize: 8,
            },
            labelLine: {
                length: 4,
                length2: 8,
                smooth: true,
            },
            data: arrT,
        },
    ];
    const echartsDom = document.createElement('div');
    echartsDom.style.width = '374px';
    echartsDom.style.height = '256px';
    const myChartP = echarts.init(echartsDom);
    return new Promise((resolve, reject) => {
        myChartP.clear();
        // 绘制图表
        myChartP.setOption({
            color: ['#1283D5', '#FF9845', '#706c69', '#F6BD16', '#2DCACF', '#D93A2B', '#6B64AF'],
            series,
        });
        myChartP.on('finished', function () {
            resolve(dispatchExportWord(myChartP));
        });
    });
};

const dispatchExportWord = async (myChart) => {
    let url = myChart.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff',
    });
    return url.replace('data:image/png;base64,', '');
};
