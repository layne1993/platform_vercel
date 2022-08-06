import * as echarts from 'echarts';

// 产品业绩表现
export const setEchartsData = (data) => {
  const xAxisData = []
  const arrT = []
  const arrTh = []
  const arrF = []
  data.performance?.forEach(item => {
      xAxisData.push(item.netDate)
      arrT.push(item.fund_r*100)
      arrTh.push(item.hs300_r*100)
      arrF.push(item.zz500_r*100)
  })

  let series = [
      {
          name: '本产品',
          showSymbol: false,
          type: 'line',
          connectNulls: true,
          data: arrT,
          lineStyle: {
              width: 1.5,
              shadowColor: 'rgba(0,0,0,0.4)',
              shadowBlur: 4,
              shadowOffsetY: 5
          }
      },
      {
          name: '沪深300',
          showSymbol: false,
          type: 'line',
          connectNulls: true,
          data: arrTh,
          lineStyle: {
              width: 1.5,
              shadowColor: 'rgba(0,0,0,0.4)',
              shadowBlur: 4,
              shadowOffsetY: 5
          }
      },
      {
          name: '中证500',
          showSymbol: false,
          type: 'line',
          connectNulls: true,
          data: arrF,
          lineStyle: {
              width: 1.5,
              shadowColor: 'rgba(0,0,0,0.4)',
              shadowBlur: 4,
              shadowOffsetY: 5
          }
      },
  ];

  const echartsDom = document.createElement('div');
  echartsDom.style.width = '386px'
  echartsDom.style.height = '263px'
  // echartsDom.innerHTML = '<div id='+`echartsId${productId}industry`+' style="height: 100%;"></div>';
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
                  data: ['本产品', '沪深300', '中证500'],
              },
              grid:{
                left: '12%',  
                right: '4%',  
                bottom: '20%' 
              },
              color: ['#a60000', '#604a7b', '#9bbb59'],
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
                      rotate: 45,
                      textStyle: {
                          fontSize: 8
                      },
                      showMaxLabel: true
                  }
              },
              yAxis: {
                  axisLine: {
                      show: true,
                      lineStyle: {
                          color: '#000',
                      },
                  },
                  axisLabel: {
                      formatter: '{value} %',
                      textStyle:{
                         fontSize:8
                      }
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
};

// 持仓分布
export const setPositionStep = (data) => {
  const arrT = []
  const arrTh = []
  data.asset?.forEach(item => {
      arrT.push(item.assets)
      arrTh.push((item.quotationProportion * 100).toFixed(2))
  })
  // console.log(arrT,arrTh,'持仓分布的arrTh')

  const echartsDom = document.createElement('div');
  echartsDom.style.width = '384px'
  echartsDom.style.height = '245px'
  echartsDom.style.marginTop = '20px'
  const myChartT = echarts.init(echartsDom);
  return new Promise((resolve, reject) => {
      myChartT.clear();
      // 绘制图表
      myChartT.setOption(
          {
              title: {
                  text: '持仓分布',
                  left: 'center',
                  textStyle: {
                      fontFamily: 'Microsoft YaHei',
                      fontSize: 14
                  },
                  padding: 20,
              },
              grid: {
                  top: '60px'
              },
              color: '#df5052',
              xAxis: [
                  {
                      type: 'category',
                      data: arrT,
                      axisLabel: {
                          rotate: 45,
                          textStyle: {
                              fontSize: 8
                          }
                      }
                  }
              ],
              yAxis: [{
                  type: 'value',
                  axisLabel: {
                      formatter: '{value}%',

                  }
              }],
              series: [{
                  type: 'bar',
                  data: arrTh,
                  barWidth: '40%',
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
                              textStyle: { //数值样式
                                  fontSize: 10,
                                  color: '#000000'
                              }
                          }
                      }
                  }
              }],
          }
      );
      myChartT.on('finished', function () {
          resolve(dispatchExportWord(myChartT));
      });
  });
};

// 前十行业分布
export const setTopTen = (data) => {
  const arrT = []
  const arrTh = []
  data.industry?.forEach(item => {
      arrT.push(item.industry)
      arrTh.push((item.weight * 100).toFixed(2))
  })

  const echartsDomT = document.createElement('div');
  echartsDomT.style.width = '384px'
  echartsDomT.style.height = '245px'
  // echartsDom.innerHTML = '<div id='+`${productId}ten`+' style="height: 100%;"></div>';
  const myChartTh = echarts.init(echartsDomT);
  return new Promise((resolve, reject) => {
      myChartTh.clear();
      // 绘制图表
      myChartTh.setOption(
          {
              title: {
                  text: '前十行业分布(申万一级行业分类)',
                  left: 'center',
                  textStyle: {
                      fontFamily: 'Microsoft YaHei',
                      fontSize: 14
                  },
                  padding: 20
              },
              grid: {
                  top: '60px'
              },
              color: '#df5052',
              xAxis: [
                  {
                      type: 'category',
                      data: arrT,
                      axisLabel: {
                          rotate: 45,
                          textStyle: {
                              fontSize: 8
                          }
                      },

                  }
              ],
              yAxis: [{
                  type: 'value',
                  axisLabel: {
                      formatter: '{value}%'
                  }
              }],
              series: [{
                  type: 'bar',
                  data: arrTh,
                  barWidth: '40%',
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
                              textStyle: { //数值样式
                                  // color: '#df5052',
                                  fontSize: 8,
                                  color: '#000000'
                              }
                          }
                      }
                  }
              }],
          }
      );
      myChartTh.on('finished', function () {
          resolve(dispatchExportWord(myChartTh));
      });
  });
};

const dispatchExportWord = async (myChart) => {
  let url = myChart.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff',
  });
  return url.replace('data:image/png;base64,', '')
};