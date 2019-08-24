import * as echarts from '../../ec-canvas/echarts'; //引入echarts.js
var dataList = [];
var dataList2 = [];
var k = 0;
var Chart = [];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    ec1: {
      lazyLoad: true // 延迟加载
    },
    ec2: {
      lazyLoad: true // 延迟加载
    },
    ec3: {
      lazyLoad: true // 延迟加载
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (options.hourTem4 != 'undefined') {
      this.setData({
        hourTem4: JSON.parse(decodeURIComponent(options.hourTem4)),
        barData: JSON.parse(decodeURIComponent(options.barData))
      })
    } else {
      this.setData({
        hourTem8: JSON.parse(decodeURIComponent(options.hourTem8)),
        barData: JSON.parse(decodeURIComponent(options.barData))
      })
    }
    console.log("!!!888", that.data.barData)
    console.log("!!!888", that.data.hourTem8)
    this.echartsComponnet1 = this.selectComponent('#mychart1');
    this.echartsComponnet2 = this.selectComponent('#mychart2');
    this.echartsComponnet3 = this.selectComponent('#mychart3');
    this.getData(); //获取数据
  },
  getData: function() {
    /**
     * 此处的操作：
     * 获取数据json
     */
    // if (k % 2) {
    //   dataList = [1, 2, 3, 4, 5, 6];
    // } else {
    //   dataList = [7, 6, 9, 2, 5, 6];
    // }
    // k++;
    if (this.data.hourTem8) {
      dataList = this.data.hourTem8
    } else {
      dataList = this.data.hourTem4
    }
    dataList2 = this.data.barData
    this.init_echarts(1); //初始化图表
    this.init_echarts(2); //初始化图表
    this.init_echarts(3); //初始化图表_bar

  },
  //初始化图表
  init_echarts: function(i) {
    this['echartsComponnet'+i].init((canvas, width, height) => {
      // 初始化图表
      Chart[i-1] = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      // Chart.setOption(this.getOption());
      this.setOption(i);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart[i-1];
    });
  },
  
  setOption: function(i) {
    // Chart.clear();  // 清除
    if (this.data.hourTem4) {
      Chart[i-1].setOption(this['getOption'+i]()); //获取新数据
    } else {
      Chart[i-1].setOption(this['getOption'+i]()); //获取新数据
    }
    Chart[i - 1].setOption(this['getOption' + i]()); //获取新数据
  },

  getOption1: function() {
    // 指定图表的配置项和数据
    var option = {
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      title: {
        id: 'line',
        text: '气温折线图',
        textStyle: {
          fontSize: 16,
          lineHeight: 16
        },
        subtext: '24小时气温变化',
        left: '15'
      },
      xAxis: {
        type: 'category',
        data: ['20:00', '23:00', '02:00', '05:00'],
        axisLine: {
          lineStyle: {
            shadowBlur: 2,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          }
        },
        axisTick: {
          alignWithLabel: true //刻度显示
        },
        axisPointer: { //直线指示器
          type: 'line'
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            shadowBlur: 2,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          }
        },
        axisTick: {
          show: false
        }
      },
      series: [{
        data: dataList,
        type: 'line'
      }]
    }
    return option;
  },
  getOption2: function() {
    // 指定图表的配置项和数据
    var option = {
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      title: {
        id: 'line',
        text: '气温折线图',
        textStyle: {
          fontSize: 16,
          lineHeight: 16
        },
        subtext: '24小时气温变化',
        left: '15'
      },
      xAxis: {
        type: 'category',
        data: ['8:00', '11:00', '14:00', '17:00', '20:00', '23:00', '02:00', '05:00'],
        axisLine: {
          lineStyle: {
            shadowBlur: 2,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          }
        },
        axisLabel: {
          interval: 0 //坐标轴刻度地显示，0为强制显示所有标签
        },
        axisTick: {
          alignWithLabel: true, //刻度显示
          interval: 0 //坐标轴刻度地显示，0为强制显示所有标签
        },
        axisPointer: { //直线指示器
          type: 'line'
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: dataList,
        type: 'line'
      }]
    }
    return option;
  },
  getOption3: function() {
    // 指定图表的配置项和数据
    var option = {
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      title: {
        id: 'line',
        text: '未来6日天气柱状图',
        textStyle: {
          fontSize: 16,
          lineHeight: 16
        },
        subtext: '可能会出现的天气次数',
        left: '15'
      },
      xAxis: {
        type: 'category',
        data: ['晴天', '小雨', '大雨', '阴天', '雾霾'],
        axisLine: {
          lineStyle: {
            shadowBlur: 2,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          }
        },
        axisLabel: {
          interval: 0 //坐标轴刻度地显示，0为强制显示所有标签
        },
        axisTick: {
          interval: 0 //坐标轴刻度地显示，0为强制显示所有标签
        },
        axisPointer: { //直线指示器
          type: 'shadow'
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: dataList2,
        type: 'bar'
      }]
    }
    return option;
  },
  goback() {
    wx.navigateBack({

    })
  }

})