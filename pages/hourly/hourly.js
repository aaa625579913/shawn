// pages/hourly/hourly.js
import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    //定义图标的标题和颜色
    title: {
      text: '最近气温',
      left: 'center'
    },
    color: ["#37A2DA"],
    //定义你图标的线的类型种类
    legend: {
      data: ['temperature'],
      top: 30,
      left: 'center',
      backgroundColor: 'red',
      z: 100
    },
    grid: {
      containLabel: true
    },
    //当你选中数据时的提示框
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    //	x轴
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['一', '二', '三', '四', '五', '六', '日'], //x轴数据
      // x轴的字体样式
      axisLabel: {
        show: true,
        textStyle: {
          color: '#000',
          fontSize: '14',
        }
      },
      // 控制网格线是否显示
      splitLine: {
        show: true,
        //  改变轴线颜色
        lineStyle: {
          // 使用深浅的间隔色
          color: ['#aaaaaa']
        }
      },
      // x轴的颜色和宽度
      axisLine: {
        lineStyle: {
          color: '#000',
          width: 1, //这里是坐标轴的宽度,可以去掉
        }
      }
      // show: false //是否显示坐标
    },
    yAxis: {
      x: 'center',
      type: 'value',
      //网格线
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      },
      // show: false
    },
    series: [{
      name: 'temperature',
      type: 'line',
      smooth: true,
      data: [15, 2, 30, 16, 10, 17, 15]
    }]
  };
  chart.setOption(option);
  return chart;
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    // ec: {
    //   lazyLoad: true
    // },
     ec: {
       onInit: initChart
    },
    tem: [820, 932, 901, 934, 1290, 1330, 1320]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // this.ecLineComponent = this.selectComponent('#mychart-dom-line');
    // this.ecLineInit(this.data.lineData) //所有数据到位后开始调用ecLineInit函数
  },
  // ecLineInit(tem) {
  //   this.ecLineComponent.init((canvas, width, height) => {
  //     const chart = echarts.init(canvas, null, {
  //       width: app.globalData.screenWidth,
  //       height: 350 * (app.globalData.screenWidth / 350),
  //     });
  //     initChart(chart, tem);

  //     // 注意这里一定要返回 chart 实例，否则会影响事件处理等
  //     return chart;
  //   });
  // },
})

// function initChart(chart,tem) {

//   var option = {
//     xAxis: {
//       type: 'category',
//       data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//     },
//     yAxis: {
//       type: 'value'
//     },
//     series: [{
//       data: [{
//         value: [820, 932, 901, 934, 1290, 1330, 1320]
//       }],
//       type: 'line'
//     }]
//   };
//   chart.setOption(option);
// }