import * as echarts from 'echarts';

// 产品走势图
export const setProductTrend =(data)=>{
  const xAxisData = []
        const arrT = []
        const arrTh = []
        const arrF = []
        data.productTrend?.forEach(item => {
            const netDate = item.netDate ? item.netDate.slice(2).replace(/-/g,'/') : ''
            xAxisData.push(netDate)
            arrT.push(item.excessEarnings*100)
            arrTh.push(item.productGrowthRate*100)
            arrF.push(item.hs300GrowthRate*100)
        })

        let series = [
            {
                name: '超额收益',
                showSymbol: false,
                type: 'line',
                connectNulls: true,
                areaStyle: {},
                data: arrT,
                lineStyle: {
                    width: 1.5
                }
            },
            {
                name: '本产品增长率',
                showSymbol: false,
                type: 'line',
                connectNulls: true,
                data: arrTh,
                lineStyle: {
                    width: 1.5
                }
            },
            {
                name: '沪深300增长率',
                showSymbol: false,
                type: 'line',
                connectNulls: true,
                data: arrF,
                lineStyle: {
                    width: 1.5
                }
            },
        ];

        const echartsDom = document.createElement('div');
        echartsDom.style.width = '960px'
        echartsDom.style.height = '328px'
        const myChartO = echarts.init(echartsDom);
        return new Promise((resolve, reject) => {
        myChartO.clear();
        // 绘制图表
        myChartO.setOption(
          {
              title: { show: false },
              tooltip: {},
              legend: {
                    padding:20,
                  data: ['超额收益', '本产品增长率', '沪深300增长率'],
              },
              grid:{
                left: '12%',  
                right: '4%',  
                bottom: '20%' 
              },
              color: ['#cf4949', '#2c88c9', '#f09f6a'],
              xAxis: {
                  data: xAxisData,
                  boundaryGap: false,
                  axisLine: {
                      show: true,
                      lineStyle: {
                          color: '#000',
                      },
                  },
                  axisLabel: {
                      rotate: 270,
                      textStyle: {
                          fontSize: 12
                      },
                      showMaxLabel: true
                  }
              },
              yAxis: {
                  nameTextStyle: {
                      fontSize: 14,
                  },
                  axisLine: {
                      show: true,
                      lineStyle: {
                          color: '#000',
                      },
                  },
                  axisLabel: {
                      formatter: '{value} %',
                  },
              },
              series: series,
          },
          true,
      );
      myChartO.on('finished', function () {
          resolve(dispatchExportWord(myChartO));
      });
  })
}

// 资产配置
// 持仓分步
export const setPositionStepPie =(data)=>{
    const arrT = []
    data.asset?.forEach(item => {
        arrT.push({
            value:item.quotationProportion,name:item.assets
        })
    })

    let series = [
        {
            type:'pie',
            radius: '50%',
            data:arrT,
            labelLine:{
                lineStyle:{
                    color:'#b0b0b0'
                }
            }
        }
    ]
    const echartsDom = document.createElement('div');
    echartsDom.style.width = '488px'
    echartsDom.style.height = '318px'
    const myChartT = echarts.init(echartsDom);
    return new Promise((resolve, reject) => {
        myChartT.clear();
        // 绘制图表
        myChartT.setOption({
            color: ['#f07c82','#fcd9db','#ca1e32','#fee8ee','#b6b6b6'],
            series
        })
        myChartT.on('finished', function () {
            resolve(dispatchExportWord(myChartT));
        });
    })

}

// 行业前十
export const setTopTenPie =(data)=>{
    const arrT = []
    data.asset?.forEach(item => {
        arrT.push({
            value:item.quotationProportion,name:item.assets
        })
    })

    let series = [
        {
            type:'pie',
            radius: '50%',
            data:arrT,
            labelLine:{
                lineStyle:{
                    color:'#b0b0b0'
                }
            }
        }
    ]
    const echartsDom = document.createElement('div');
    echartsDom.style.width = '488px'
    echartsDom.style.height = '318px'
    const myChartT = echarts.init(echartsDom);
    return new Promise((resolve, reject) => {
        myChartT.clear();
        // 绘制图表
        myChartT.setOption({
            color: ['#f07c82','#fcd9db','#ca1e32','#fee8ee','#b6b6b6'],
            series
        })
        myChartT.on('finished', function () {
            resolve(dispatchExportWord(myChartT));
        });
    })

}

const dispatchExportWord = async (myChart) => {
    let url = myChart.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff',
    });
    return url.replace('data:image/png;base64,', '')
};
