import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

function setOptionRadar(chart,data) {
 
  const option = {

    // tooltip: {},
    xAxis: {
      show: false
    },
    yAxis: {
      show: false
    },
    radar: {
      // shape: 'circle',   // 雷达图绘制类型，支持 'polygon' 和 'circle'
      name: {
        textStyle: {
          fontSize: 14,
          color: '#838497',
          lineHeight: 20, // 行高
          rich: {}, // 加这个是因为在安卓上字会变小，需要加这个兼容，而且加上这个设置字体样式才会生效
        }
      },
      center: ['50%', '55%'],
      radius: 120 * (app.globalData.screenWidth / 400),
      indicator: [{
        name: `晴天\n${data[0]}`,
          max: 7
        },
        {
          name: `雨天\n${data[1]}`,
          max: 7
        },
        {
          name: `阴天\n${data[2]}`,
          max: 7
        },
        {
          name: `雷暴\n${data[3]}`,
          max: 7
        },
        {
          name: `下雪\n${data[4]}`,
          max: 7
        }
      ]
    },
    series: [{
      name: '天气情况',
      type: 'radar',
      symbol: 'circle', // 拐点的样式，还可以取值'rect','angle'等
      symbolSize: 5, // 拐点的大小
      data: [{
        // value: data,
        value: [0,1,0,6,0],
        name: `晴天:${data[0]}\n雨天:${data[1]}\n阴天:${data[2]}\n雷暴:${data[3]}\n下雪:${data[4]}\n`,
        areaStyle: {
          color: '#1e00ff'
        },
        // 设置拐点和阴影边框线颜色
        itemStyle: {
          color: 'rgba(22, 21, 196, 1)',
        },
        lineStyle: {
          color: 'rgba(22, 21, 196, 0)',
        },
      }, ]
    }]
  };

  chart.setOption(option);
  // return chart;
}

Page({
  onShareAppMessage: function(res) {
    return {
      title: '天气预警可以用雷达图显示啦',
      path: '/pages/index/index',
      success: function() {},
      fail: function() {}
    }
  },
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    qing: 0,
    yu: 0,
    yin: 0,
    baoyu: 0,
    shachen: 0,
    wu: 0,
    lei: 0,
    //雷达图数据
    sunny:0,
    rainy:0,
    cloudy:0,
    thunder:0,
    snow:0,
    ecRadar: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },
  },

  onLoad(options) {
    var that = this;
  
    var weather = JSON.parse(options.model);
    console.log(weather)
    this.setData({
      weather: weather
    })
    for (var i = 0; i < weather.length; i++) {
      if (weather[i].wea_img == 'qing') {
        that.setData({
          qing: that.data.qing + 1
        })
      } else if (weather[i].wea_img == 'yu'){
        that.setData({
          yu: that.data.yu + 1
        })
      } else if (weather[i].wea_img == 'yin') {
        that.setData({
          yin: that.data.yin + 1
        })
      } else if (weather[i].wea_img == 'baoyu') {
        that.setData({
          baoyu: that.data.baoyu + 1
        })
      } else if (weather[i].wea_img == 'shachen') {
        that.setData({
          shachen: that.data.shachen + 1
        })
      } else if (weather[i].wea_img == 'wu') {
        that.setData({
          wu: that.data.wu + 1
        })
      } else if (weather[i].wea_img = 'lei') {
        that.setData({
          lei: that.data.lei + 1
        })
      }
    }
    this.setData({
      sunny :that.data.qing,
      rainy :that.data.yu + that.data.baoyu,
      cloudy : that.data.yin + that.data.wu + that.data.shachen,
      thunder:that.data.lei,
      snow : 0
    }, () => {this.setData({
        radarData: [that.data.sunny, that.data.rainy, that.data.cloudy, that.data.thunder, that.data.snow],  //五维数据
    },()=>{
      console.log(that.data.radarData)
      this.ecRadarComponent = this.selectComponent('#mychart-dom-radar');
      this.ecRadarInit(this.data.radarData)  //所有数据到位后开始调用ecRadarInit函数
    })})
    
  },


  // 初始化五维画像预测图表
  ecRadarInit(radarData) {
    this.ecRadarComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: app.globalData.screenWidth,
        height: 350 * (app.globalData.screenWidth / 350),
      });
      setOptionRadar(chart, radarData);

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },

  onReady() {
  var that = this;
    
  },
  goback() {
    var that = this;
    wx.navigateBack({})

  },
});