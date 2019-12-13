//index.js
var amapFile = require('../../libs/amap-wx.js');
var util = require("../../utils/util.js")
const db = wx.cloud.database()
const _ = db.command;

var markersData = {
  latitude: '', //纬度
  longitude: '', //经度
  key: "86c8e6840a94eb957578d99bc1b165c6" //申请的高德地图key
};
//获取应用实例
const app = getApp()
const {
  $Toast
} = require('../../dist/base/index');

Page({
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    info: true,
    isWeather: "",
    imgHourly: [],
    imgflag: '',
    //地理位置参数
    city: '',
    latitude: '', //经度
    longitude: '', //纬度
    //天气信息参数
    weather: [], //即时天气数组
    hourly: [], //逐小时天气数组
    getWeather: false, //是否获取了即时天气信息
    today: '', //今日
    high_temperature: '', //最高温度
    now_temperature: '', //实时温度
    low_temperature: '', //最低温度
    cond_txt: '', //实况天气状况描述	晴
    wind_deg: '', //	风向360角度	305
    wind_dir: '', //风向	西北
    wind_sc: '', //风力	3 - 4
    wind_spd: '', //	风速，公里/小时	15
    hum: '', //相对湿度	40
    pcpn: '', //降水量	0
    pres: '', //	大气压强	1020
    vis: '', //能见度，默认单位：公里	10
    cloud: '', //云量	23
    sunny: 0,
    rainyA: 0,
    rainyB: 0,
    sandstorm: 0,
    cloudy: 0,
    weaInfo: [],
    motto: 'Hello World',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isiphone: app.globalData.isIphoneX,
    spinShow: false, //加载组件
    isNew: '', //是否为第一次进入
    isToast: false, //是否显示toast
    userInfo: '', //用户信息
    isRelease: false,
    isBlack: false,
    timer: '', //定时器名字
    countDownNum: '0', //计时器初始值
    swiperList: {
      "display-multiple-items": 1,
      "vertical": true,
      "autoplay": true,
      "circular": true,
      "easing-function": "easeInOutCubic",
      "duration": 500,
      "interval": 4000
    },
    handleTips: true
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  /*定时器*/
  countDown: function() {
    let that = this;
    let countDownNum = that.data.countDownNum;
    that.setData({
      timer: setInterval(function() {
        countDownNum++;
        that.setData({
          countDownNum: countDownNum
        })
        if (that.data.countDownNum == 5 && that.data.spinShow) {
          $Toast({
            content: '网络似乎出了点小差'
          });
        } else if (that.data.countDownNum == 10 && that.data.spinShow) {
          clearInterval(that.data.timer);
          $Toast({
            content: '请检查一下是否开启了微信地理位置授权'
          });
        } else if (that.data.countDownNum == 15 && that.data.spinShow) {
          clearInterval(that.data.timer);
          $Toast({
            content: '请联系客服反馈一下问题，非常抱歉！'
          });
        } else if (that.data.countDownNum > 15) {
          clearInterval(that.data.timer);
        }
      }, 1000)
    })
  },
  /*
  页面加载函数
  */
  onLoad: function(options) {
    var that = this;
    var detailCity = options.detailCity ? options.detailCity : null;
    if (options && options.detailCity) {
      that.setData({
        detailCity: detailCity
      })
    }
    that.setData({
      spinShow: true,
    })
    console.log("onload", detailCity)
    that.countDown();
    // that.getLocationInfo();
    // that.getLocationInfo();

    // //日期
    // let time = util.formatTime(new Date());
    // let date = util.getDates(7, time);
    // this.setData({
    //   date
    // })
    // console.log(date);
  },

  onShow() {
    var that = this;

    that.onServices();
    that.checkLocation();
    const switch1 = wx.getStorageSync('switch1')
    const isNew = wx.getStorageSync('isNew')
    let _userInfo = wx.getStorageSync('userInfo');
    if (_userInfo) {
      this.setData({
        userInfo: _userInfo
      })
    }
    //获取isNew信息
    this.setData({
      isNew: isNew,
      switch1: switch1
    })
  },
  onReady() {
    var that = this;
    this.login = this.selectComponent("#login");


  },

  onShareAppMessage: function(res) {
    return {
      title: '河马Shawn',
      path: '/pages/index/index',
      success: function() {},
      fail: function() {}
    }
  },
  onServices() {
    db.collection('services').get().then(res => {
      if (res.data.length) {
        this.setData({
          isRelease: res.data[0].isRelease
        })

      } else {
        this.setData({
          isRelease: false
        })
        console.log("1111111", res.data.length)
      }
    })
  },
  //s
  bgChange() {
    var that = this;
    console.log("现在的时间", that.data.time)
    if (that.data.weatherNow[0]) {
      if (that.data.weatherNow[0].wea.search("雨") != -1) {
        that.setData({
          bgImg: 'https://shawn-weather-1258489802.cos.ap-shenzhen-fsi.myqcloud.com/newWeather/night2.jpg',
          isBlack: true,
          isRain: true
        })
      } else {
        if ((that.data.time >= 0 && that.data.time < 6)) {
          that.setData({
            bgImg: 'https://shawn-weather-1258489802.cos.ap-shenzhen-fsi.myqcloud.com/newWeather/night.jpg',
            isBlack: true,
            isSleep: true
          })
        } else if ((that.data.time >= 6 && that.data.time < 9)) {
          that.setData({
            bgImg: 'https://shawn-weather-1258489802.cos.ap-shenzhen-fsi.myqcloud.com/newWeather/sunny2.jpg',
            isBlack: false,
            isSleep: true
          })
        } else if ((that.data.time >= 9 && that.data.time < 12)) {
          that.setData({
            bgImg: 'https://shawn-weather-1258489802.cos.ap-shenzhen-fsi.myqcloud.com/newWeather/sunny2.jpg',
            isBlack: false,
            isSun: true
          })
        } else if ((that.data.time >= 12 && that.data.time < 14)) {
          that.setData({
            bgImg: 'https://shawn-weather-1258489802.cos.ap-shenzhen-fsi.myqcloud.com/newWeather/sunny2.jpg',
            isBlack: false,
            isSun: true
          })
        } else if ((that.data.time >= 14 && that.data.time < 16)) {
          that.setData({
            bgImg: 'https://shawn-weather-1258489802.cos.ap-shenzhen-fsi.myqcloud.com/newWeather/sunny2.jpg',
            isBlack: false,
            isSun: true
          })
        } else if ((that.data.time >= 16 && that.data.time < 18)) {
          that.setData({
            bgImg: 'https://shawn-weather-1258489802.cos.ap-shenzhen-fsi.myqcloud.com/newWeather/sunny2.jpg',
            isBlack: false,
            isSun: true
          })
        } else if ((that.data.time >= 18 && that.data.time < 21)) {
          that.setData({
            bgImg: 'https://shawn-weather-1258489802.cos.ap-shenzhen-fsi.myqcloud.com/newWeather/night.jpg',
            isBlack: true,
            isMoon: true
          })
        } else if ((that.data.time >= 21 && that.data.time <= 24)) {
          that.setData({
            bgImg: 'https://shawn-weather-1258489802.cos.ap-shenzhen-fsi.myqcloud.com/newWeather/night.jpg',
            isBlack: true,
            isSleep: true
          })
        }
      }
    }
  },

  // 组件方法
  showLogin: function() {
    this.login.showLogin();
  },

  confirmEvent: function() {
    this.login.hideLogin();
  },
  //************Toast轻提示组件 */
  handleSuccess() {
    $Toast({
      content: '授权成功！',
      type: 'success'
    });
  },
  handleText() {
    $Toast({
      content: '这是文本提示'
    });
  },
  handleError() {
    $Toast({
      content: '错误的提示',
      type: 'error'
    });
  },
  handleLoading() {
    $Toast({
      content: '加载中',
      type: 'loading'
    });
  },
  handleMask() {
    $Toast({
      content: '5秒后自动关闭',
      icon: 'prompt',
      duration: 0,
      mask: false
    });
    setTimeout(() => {
      $Toast.hide();
    }, 5000);
  },
  checkLocation() {
    let that = this;
    //选择位置，需要用户授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              that.handleSuccess();
              that.getLocationInfo()
            },
            fail() {
              that.showSettingToast('需要授权位置信息');
            }
          })
        } else {
          that.getLocationInfo()
        }
      }
    })
  },
  showSettingToast: function(e) {
    var that = this;
    wx.showModal({
      title: '提示！',
      confirmText: '去设置',
      showCancel: false,
      content: e,
      success: function(res) {
        if (res.confirm) {
          // wx.navigateTo({
          //   url: '../setting/setting',
          // })
          wx.openSetting({
            success: function(data) {
              if (data.authSetting["scope.userLocation"] === true) {
                $Toast({
                  content: '授权成功！',
                  type: 'success'
                });
              } else {
                $Toast({
                  content: '授权失败！',
                  type: 'error'
                });
              }
            }
          })
        }
      }
    })
  },
  //获取地理位置-需授权
  getLocationInfo() {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        that.getCityInfo(latitude, longitude);
      }
    })
  },
  //获取城市信息
  getCityInfo(latitude, longitude) {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({
      key: markersData.key
    });
    myAmapFun.getRegeo({
      location: '' + longitude + ',' + latitude + '', //location的格式为'经度,纬度'
      success: function(data) {
        console.log("高德地图地理位置信息", data[0].regeocodeData.addressComponent.city);
        var localCity = data[0].regeocodeData.addressComponent.city;
        localCity = localCity.substring(0, localCity.length - 1);
        console.error(localCity)
        if (that.data.detailCity && that.data.detailCity != null) {
          that.setData({
            city: that.data.detailCity
          })
        } else {
          that.setData({
            city: localCity
          })
        }
        console.log("getCityInfo", that.data.city)
        that.getWeatherInfo();
      },
      fail: function(info) {}
    });
  },

  //获取天气信息
  getWeatherInfo() {
    var that = this;
    wx.request({
      url: 'https://free-api.heweather.net/s6/weather?location=' + that.data.city + '&key=42ca8385e1ac4360939a3ff8f584e619',
      success(res) {
        console.log("和风天气", res)
        that.setData({
            cond_txt: res.data.HeWeather6[0].now.cond_txt, //实况天气状况描述	晴
            now_temperature: res.data.HeWeather6[0].now.tmp, //实时温度  32
            wind_deg: res.data.HeWeather6[0].now.wind_deg, //	风向360角度	305
            wind_dir: res.data.HeWeather6[0].now.wind_dir, //风向	西北
            wind_sc: res.data.HeWeather6[0].now.wind_sc, //风力	3 - 4
            wind_spd: res.data.HeWeather6[0].now.wind_spd, //	风速，公里/小时	15
            hum: res.data.HeWeather6[0].now.hum, //相对湿度	40
            pcpn: res.data.HeWeather6[0].now.pcpn, //降水量	0
            pres: res.data.HeWeather6[0].now.pres, //	大气压强	1020
            vis: res.data.HeWeather6[0].now.vis, //能见度，默认单位：公里	10
            cloud: res.data.HeWeather6[0].now.cloud, //云量	23
            fl: res.data.HeWeather6[0].now.fl, //体感温度 30
            lifestyle: res.data.HeWeather6[0].lifestyle //生活指数
          },
          // setTimeout(function() {
          //   that.judgeWeather()
          // }, 50)
        )
        if (that.data.weaInfo == '') {
          that.data.weaInfo.push({
            'type': "体感温度",
            'data': that.data.fl + '℃'
          }, {
            'type': "风向360角度",
            'data': that.data.wind_deg + '°'
          }, {
            'type': "风向",
            'data': that.data.wind_dir
          }, {
            'type': "风力",
            'data': that.data.wind_sc + 'm/s'
          }, {
            'type': "风速",
            'data': that.data.wind_spd + 'km/h'
          }, {
            'type': "相对湿度",
            'data': that.data.hum + '%'
          }, {
            'type': "降水量",
            'data': that.data.pcpn + 'mm'
          }, {
            'type': "大气压强",
            'data': that.data.pres + 'hpa'
          }, {
            'type': "能见度",
            'data': that.data.vis + 'km'
          }, {
            'type': "云量",
            'data': that.data.cloud
          })
          that.setData({
            weaInfo: that.data.weaInfo
          })
          console.log("21121", that.data.weaInfo)
        }
      },
      fail(res) {
        console.log("天气请求失败")
      }
    })

    //新天气API-7日天气
    if (that.data.detailCity && that.data.detailCity != null) {
      console.log("!!!!", that.data.detailCity)
      wx.request({
        url: "https://www.tianqiapi.com/api/?version=v1" + "&city=" + that.data.detailCity + "&appid=" + "43917347" + "&appsecret=" + "67MQSDzj",
        success(res) {
          console.log("新天气api", res)
          var weatherChange = res.data.data;
          console.log("!!!!", that.data.detailCity)
          var weatherNow = weatherChange.slice(0, 1)
          weatherChange = weatherChange.slice(1, weatherChange.length)
          that.setData({
              weather: weatherChange,
              weatherNow: weatherNow,
              model: res.data.data,
              hourly: res.data.data[0].hours
            },
            setTimeout(function() {
              that.judgeWeather()
            }, 50))
          console.log("weatherNow", that.data.weatherNow)
          console.log("hourly", that.data.hourly)
          console.log("weather", that.data.weather)
          console.log("model", that.data.model)
        },
        fail(res) {
          console.log("fail", res)
        }
      })
      //一日天气
      wx.request({
        url: "https://www.tianqiapi.com/api/?version=v6" + "&city=" + that.data.detailCity + "&appid=" + "43917347" + "&appsecret=" + "67MQSDzj",
        success(res) {
          console.log("新天气api-一日天气", res)
          that.setData({
            air: res.data.air,
            air_level: res.data.air_level,
            air_pm25: res.data.air_pm25
          }, function() {
            that.setData({
              airReady: true
            })
          })
          console.log("air", that.data.air)
          console.log("air_level", that.data.air_level)
          console.log("air_pm25", that.data.air_pm25)
        },
        fail(res) {
          console.log("fail", res)
        }
      })
    } else {
      wx.request({
        url: "https://www.tianqiapi.com/api/?version=v1" + "&city=" + that.data.city + "&appid=" + "43917347" + "&appsecret=" + "67MQSDzj",
        success(res) {
          console.log("新天气api", res)
          console.log("!!!!@@@", that.data.city)
          var weatherChange = res.data.data;
          var weatherNow = weatherChange.slice(0, 1)
          weatherChange = weatherChange.slice(1, weatherChange.length)
          that.setData({
              weather: weatherChange,
              weatherNow: weatherNow,
              model: res.data.data,
              hourly: res.data.data[0].hours
            },
            setTimeout(function() {
              that.judgeWeather()
            }, 50))
          console.log("weatherNow", that.data.weatherNow)
          console.log("hourly", that.data.hourly)
          console.log("weather", that.data.weather)
          console.log("model", that.data.model)
        },
        fail(res) {
          console.log("fail", res)
        }
      })
      //一日天气
      wx.request({
        url: "https://www.tianqiapi.com/api/?version=v6" + "&city=" + that.data.city + "&appid=" + "43917347" + "&appsecret=" + "67MQSDzj",
        success(res) {
          console.log("新天气api-一日天气", res)
          that.setData({
            air: res.data.air,
            air_level: res.data.air_level,
            air_pm25: res.data.air_pm25
          }, function() {
            that.setData({
              airReady: true
            })
          })
          console.log("air", that.data.air)
          console.log("air_level", that.data.air_level)
          console.log("air_pm25", that.data.air_pm25)
        },
        fail(res) {
          console.log("fail", res)
        }
      })
    }

    console.log("getWeatherInfo", that.data.city)
  },

  /**
   * 天气判断*
   * 
   */
  judgeWeather() {
    let that = this;
    let flag = that.data.cond_txt
    var TIME = util.formatTime(new Date());
    TIME = TIME.slice(11, 13)
    this.setData({
      time: TIME,
    });
    console.error("现在的时间", flag)
    if (flag.search("雨") != -1) {
      that.setData({
        isWeather: '/static/images/rainy4.png'
      })
    } else if (flag.search("云") != -1) {
      if ((that.data.time >= 0 && that.data.time < 6) || (that.data.time >= 18 && that.data.time <= 24)) {
        that.setData({
          isWeather: '/static/images/sunny-night.png'
        })
      } else {
        that.setData({
          isWeather: '/static/images/cloudy-sun.png'
        })
      }
    } else if (flag.search("阴") != -1) {
      that.setData({
        isWeather: '/static/images/cloudy1.png'
      })
    } else if (flag.search("晴") != -1) {
      if ((that.data.time >= 0 && that.data.time < 6) || (that.data.time >= 18 && that.data.time <= 24)) {
        that.setData({
          isWeather: '/static/images/sunny-night.png'
        })
      } else {
        that.setData({
          isWeather: '/static/images/sun.png'
        })
      }
    } else {
      that.setData({
        isWeather: '/static/images/cloudy1.png'
      })
    }
    console.log("isWeather", that.data.isWeather)
    for (var i = 0; i < that.data.hourly.length; i++) {
      let wea = that.data.hourly[i].wea.slice(0, 4);
      console.log("wea", wea)
      if (wea.search("小雨") != -1) {
        that.setData({
          imgflag: '/static/images/rain-light.png'
        })
      } else if (wea.search("中雨") != -1) {
        that.setData({
          imgflag: '/static/images/rain.png'
        })
      } else if (wea.search("大雨") != -1) {
        that.setData({
          imgflag: '/static/images/rain-heavy.png'
        })
      } else if (wea.search("暴雨") != -1) {
        that.setData({
          imgflag: '/static/images/rain-storm.png'
        })
      } else if (wea.search("雨") != -1) {
        that.setData({
          imgflag: '/static/images/rain-storm.png'
        })
      } else if (wea.search("晴") != -1) {
        if (that.data.hourly.length == 4) {
          if (i >= 0 && i <= 3) {
            that.setData({
              imgflag: '/static/images/sunny-night.png'
            })
          } else {
            that.setData({
              imgflag: '/static/images/sunny.png'
            })
          }
        } else {
          if (i >= 4 && i <= 7) {
            that.setData({
              imgflag: '/static/images/sunny-night.png'
            })
          } else {
            that.setData({
              imgflag: '/static/images/sunny.png'
            })
          }
        }

      } else if (wea.search("云") != -1) {
        if (that.data.hourly.length == 4) {
          if (i >= 0 && i <= 3) {
            that.setData({
              imgflag: '/static/images/cloudy-sunny-night.png'
            })
          } else {
            that.setData({
              imgflag: '/static/images/cloudy-sunny.png'
            })
          }
        } else {
          if (i >= 4 && i <= 7) {
            that.setData({
              imgflag: '/static/images/cloudy-sunny-night.png'
            })
          } else {
            that.setData({
              imgflag: '/static/images/cloudy-sunny.png'
            })
          }
        }

      } else if (wea.search("阴") != -1) {
        if (that.data.hourly.length == 4) {
          if (i >= 0 && i <= 3) {
            that.setData({
              imgflag: '/static/images/cloudy-sunny-night.png'
            })
          } else {
            that.setData({
              imgflag: '/static/images/cloudy-sunny.png'
            })
          }
        } else {
          if (i >= 4 && i <= 7) {
            that.setData({
              imgflag: '/static/images/cloudy-sunny-night.png'
            })
          } else {
            that.setData({
              imgflag: '/static/images/cloudy-sunny.png'
            })
          }
        }

      } else if (wea.search("尘") != -1) {
        that.setData({
          imgflag: '/static/images/sandstorm.png'
        })
      } else if (wea.search("沙") != -1) {
        that.setData({
          imgflag: '/static/images/sandstorm.png'
        })
      } else if (wea.search("霾") != -1) {
        that.setData({
          imgflag: '/static/images/sandstorm.png'
        })
      }
      that.data.hourly[i].wea = that.data.imgflag;
    }
    that.setData({
      hourly: that.data.hourly
    })
    console.error("这里是hourly", that.data.hourly)
    for (var i = 0; i < that.data.weather.length; i++) {
      let wea = that.data.weather[i].wea.slice(0, 4);
      console.log("wea-weather", wea)
      if (wea.search("小雨") != -1) {
        that.setData({
          imgSix: '/static/images/rain-light.png'
        })
      } else if (wea.search("中雨") != -1) {
        that.setData({
          imgSix: '/static/images/rain.png'
        })
      } else if (wea.search("大雨") != -1) {
        that.setData({
          imgSix: '/static/images/rain-heavy.png'
        })
      } else if (wea.search("暴雨") != -1) {
        that.setData({
          imgSix: '/static/images/rain-storm.png'
        })
      } else if (wea.search("雨") != -1) {
        that.setData({
          imgSix: '/static/images/rain-storm.png'
        })
      } else if (wea.search("晴") != -1) {
        if ((that.data.time >= 0 && that.data.time < 6) || (that.data.time >= 18 && that.data.time <= 24)) {
          that.setData({
            imgSix: '/static/images/sunny-night.png'
          })
        } else {
          that.setData({
            imgSix: '/static/images/sunny.png'
          })
        }
      } else if (wea.search("云") != -1) {
        if ((that.data.time >= 0 && that.data.time < 6) || (that.data.time >= 18 && that.data.time <= 24)) {
          that.setData({
            imgSix: '/static/images/cloudy-sunny-night.png'
          })
        } else {
          that.setData({
            imgSix: '/static/images/cloudy-sunny.png'
          })
        }
      } else if (wea.search("阴") != -1) {
        if ((that.data.time >= 0 && that.data.time < 6) || (that.data.time >= 18 && that.data.time <= 24)) {
          that.setData({
            imgSix: '/static/images/cloudy-sunny-night.png'
          })
        } else {
          that.setData({
            imgSix: '/static/images/cloudy-sunny.png'
          })
        }
      } else if (wea.search("尘") != -1) {
        that.setData({
          imgSix: '/static/images/sandstorm.png'
        })
      } else if (wea.search("沙") != -1) {
        that.setData({
          imgSix: '/static/images/sandstorm.png'
        })
      } else if (wea.search("霾") != -1) {
        that.setData({
          imgSix: '/static/images/sandstorm.png'
        })
      }
      that.data.weather[i].wea = that.data.imgSix;
    }
    that.setData({
      weather: that.data.weather
    }, that.bgChange())
    setTimeout(function() {
      that.setData({
        spinShow: false,
        isReady: true
      })
    }, 1000)
  },
  onServices() {
    db.collection('services').get().then(res => {
      if (res.data.length) {
        this.setData({
          isRelease: res.data[0].isRelease
        })
      } else {
        this.setData({
          isRelease: false
        })
      }
    })
  },
  //点击头像昵称栏跳到我的页面
  goMine: function() {
    let that = this;
    wx.navigateTo({
      url: '/pages/mine/mine',
    });
    wx.setStorage({
      key: 'isNew',
      data: true
    })
  },

  //左侧标签衣服
  showtab1() {
    var that = this;
    this.setData({
      tab1: true,
      tab2: false
    })
  },
  closetab1() {
    this.setData({
      tab1: false
    })
  },
  //左侧标签口罩
  showtab2() {
    var that = this;
    this.setData({
      tab2: true,
      tab1: false
    })
  },
  closetab2() {
    this.setData({
      tab2: false
    })
  },
  //穿衣弹窗
  showModal1() {
    var that = this;
    that.setData({
      isShow1: true,
      tab1: false
    })
  },
  //关闭穿衣弹窗
  closeModal1() {
    var that = this;
    that.setData({
      isShow1: false
    })
  },
  //空气质量弹窗
  showModal2() {
    var that = this;
    that.setData({
      isShow2: true,
      tab2: false
    })
  },
  //关闭空气质量
  closeModal2() {
    var that = this;
    that.setData({
      isShow2: false
    })
  },
  //未完工
  onWorking() {
    $Toast({
      content: '河马努力赶工中!',
      image: '../../static/images/hema.png'
    });
  },
  //嘱咐
  asked() {
    var that = this;
    var random = Math.floor(Math.random() * 24);
    switch (random) {
      case 0:
        {
          $Toast({
            content: '不是没你不行，只是有你更好'
          });
          break;
        }
      case 1:
        {
          $Toast({
            content: '作者好帅啊'
          });
          break;
        }
      case 2:
        {
          $Toast({
            content: '出门总要带把伞，一是遮阳，二是避雨'
          });
          break;
        }
      case 3:
        {
          $Toast({
            content: '背景图片会随着时间的变化而变化哦'
          });
          break;
        }
      case 4:
        {
          $Toast({
            content: '月光不抱你，时光摧毁你，但是我爱你'
          });
          break;
        }
      case 5:
        {
          $Toast({
            content: '一定要养成良好的作息习惯，不然会像我一样秃头'
          });
          break;
        }
      case 6:
        {
          $Toast({
            content: '你是不是很无聊，所以才来点这个'
          });
          break;
        }
      case 7:
        {
          $Toast({
            content: '这个隐藏的功能都被你发现啦！'
          });
          break;
        }
      case 7:
        {
          $Toast({
            content: '心中有爱，才会人见人爱'
          });
          break;
        }
      case 8:
        {
          $Toast({
            content: '真正喜欢的人和事，都值得我们坚持'
          });
          break;
        }
      case 9:
        {
          $Toast({
            content: '从遇见你开始，凛冬散尽 ，星河长明'
          });
          break;
        }
      case 10:
        {
          $Toast({
            content: '你不开心就欺负我好咯，反正我喜欢你'
          });
          break;
        }
      case 11:
        {
          $Toast({
            content: '爱旅行就出发，大不了有多少钱走多远'
          });
          break;
        }
      case 12:
        {
          $Toast({
            content: '该出手时就出手，该分类时就分类'
          });
          break;
        }
      case 13:
        {
          $Toast({
            content: '遇见你很幸运，希望你也能这么觉得'
          });
          break;
        }
      case 14:
        {
          $Toast({
            content: '看到你出现，感觉全身在过电'
          });
          break;
        }
      case 15:
        {
          $Toast({
            content: '可乐要加冰，爱我要走心'
          });
          break;
        }
      case 16:
        {
          $Toast({
            content: '星河滚烫，你是人间理想'
          });
          break;
        }
      case 17:
        {
          $Toast({
            content: '愿有人懂你，可持心相对，能无语传情'
          });
          break;
        }
      case 18:
        {
          $Toast({
            content: '你就委屈一下，来我心里吧'
          });
          break;
        }
      case 19:
        {
          $Toast({
            content: '你一笑就跟着笑的人，不是傻就是爱你'
          });
          break;
        }
      case 20:
        {
          $Toast({
            content: '你站的方向，风吹过来都是暖的'
          });
          break;
        }
      case 21:
        {
          $Toast({
            content: '今夜太晚了，明天继续想你'
          });
          break;
        }
      case 22:
        {
          $Toast({
            content: '我只希望，爱我的人能够以我为豪'
          });
          break;
        }
      case 23:
        {
          $Toast({
            content: '你是我的今天，以及所有的明天'
          });
          break;
        }
      default:
        {
          break;
        }
    }

  },
  //跳转至版本信息页面
  showVersion() {
    wx.navigateTo({
      url: '../version/version',
    })
  },
  //点击左侧框跳转至底部
  goBottom() {
    wx.pageScrollTo({
      scrollTop: 1000,
      duration: 300
    })
    console.log("click")
  },
  //点击hourly跳转至hourly
  goHourly() {
    var that = this;
    var hourTem4 = [];
    var hourTem8 = [];
    for (var i = 0; i < that.data.hourly.length; i++) {
      if (that.data.hourly.length == 4) {
        hourTem4.push(that.data.hourly[i].tem)
        this.setData({
          hourTem4: hourTem4
        })
      }
      if (that.data.hourly.length == 8) {
        hourTem8.push(that.data.hourly[i].tem)
        this.setData({
          hourTem8: hourTem8
        })
      }
    }
    //处理weather数据
    for (var i = 0; i < that.data.weather.length; i++) {
      if (that.data.weather[i].wea.search("rain-storm") != -1) {
        that.setData({
          rainyB: that.data.rainyB + 1
        })
      } else if (that.data.weather[i].wea.search("rain-heavy") != -1) {
        that.setData({
          rainyB: that.data.rainyB + 1
        })
      } else if (that.data.weather[i].wea.search("rain-light") != -1) {
        that.setData({
          rainyA: that.data.rainyA + 1
        })
      } else if (that.data.weather[i].wea.search("rain") != -1) {
        that.setData({
          rainyA: that.data.rainyA + 1
        })
      } else if (that.data.weather[i].wea.search("cloudy") != -1) {
        that.setData({
          cloudy: that.data.cloudy + 1
        })
      } else if (that.data.weather[i].wea.search("sandstorm") != -1) {
        that.setData({
          sandstorm: that.data.sandstorm + 1
        })
      } else if (that.data.weather[i].wea.search("sunny") != -1) {
        that.setData({
          sunny: that.data.sunny + 1
        })
      }
    }
    that.setData({
      radarData: [that.data.sunny, that.data.rainyA, that.data.rainyB, that.data.cloudy, that.data.sandstorm]
    })

    that.makeData();
    // wx.navigateTo({
    //   url: '/pages/hourly/hourly',
    // })
  },
  goMode() {
    var that = this;
    wx.navigateTo({
      url: '../music/music',
    })
  },
  goCity() {
    var that = this;
    wx.navigateTo({
      url: '../search/search?city=' + that.data.city,
    })
  },
  //处理hourTem数据
  makeData() {
    var that = this;
    var flag = [];
    if (that.data.hourTem8) {
      for (var i = 0; i < that.data.hourTem8.length; i++) {
        flag[i] = this.data.hourTem8[i].slice(0, 2)
      }
      this.setData({
        hourTem8: flag
      })
    } else {
      for (var i = 0; i < that.data.hourTem4.length; i++) {
        flag[i] = this.data.hourTem4[i].slice(0, 2)
      }
      this.setData({
        hourTem4: flag
      })
    }
    console.log("打印hourTem4", this.data.hourTem4)
    console.log("打印hourTem8", this.data.hourTem8)
    console.log(that.data.radarData)
    wx.navigateTo({
      url: '/pages/hourly1/hourly1?hourTem4=' + encodeURIComponent(JSON.stringify(that.data.hourTem4)) + '&hourTem8=' + encodeURIComponent(JSON.stringify(that.data.hourTem8)) + '&barData=' + encodeURIComponent(JSON.stringify(that.data.radarData))
    })
  },

  //点击左侧框跳转至canvas
  goCanvas() {
    var that = this;
    wx.navigateTo({
      url: '/pages/public/public',
    })
    // that.goHourly();
    // var model = JSON.stringify(that.data.model);
    // wx.navigateTo({
    //   url: '/pages/canvas/canvas?model=' + model,
    // })
    // for (var i = 0; i < that.data.weather.length; i++) {
    //   if (that.data.weather[i].wea.search("rain-storm") != -1) {
    //     that.setData({
    //       rainyB: that.data.rainyB + 1
    //     })
    //   } else if (that.data.weather[i].wea.search("rain-heavy") != -1) {
    //     that.setData({
    //       rainyB: that.data.rainyB + 1
    //     })
    //   } else if (that.data.weather[i].wea.search("rain-light") != -1) {
    //     that.setData({
    //       rainyA: that.data.rainyA + 1
    //     })
    //   } else if (that.data.weather[i].wea.search("rain") != -1) {
    //     that.setData({
    //       rainyA: that.data.rainyA + 1
    //     })
    //   } else if (that.data.weather[i].wea.search("cloudy") != -1) {
    //     that.setData({
    //       cloudy: that.data.cloudy + 1
    //     })
    //   } else if (that.data.weather[i].wea.search("sandstorm") != -1) {
    //     that.setData({
    //       sandstorm: that.data.sandstorm + 1
    //     })
    //   } else if (that.data.weather[i].wea.search("sunny") != -1) {
    //     that.setData({
    //       sunny: that.data.sunny + 1
    //     })
    //   }
    // }
    // that.setData({
    //   radarData: [that.data.sunny, that.data.rainyA, that.data.rainyB, that.data.cloudy, that.data.sandstorm]
    // })
    // console.log(that.data.radarData)
    // $Toast({
    //   content: '还在施工中！'
    // });
  },
  /**生活指数 */
  shushi() {
    let that = this;
    $Toast({
      content: that.data.lifestyle[0].txt,
      icon: 'prompt',
      duration: 5,
      mask: false
    });
  },
  chuanyi() {
    let that = this;
    $Toast({
      content: that.data.lifestyle[1].txt,
      icon: 'prompt',
      duration: 5,
      mask: false
    });
  },
  ganmao() {
    let that = this;
    $Toast({
      content: that.data.lifestyle[2].txt,
      icon: 'prompt',
      duration: 5,
      mask: false
    });
  },
  yundong() {
    let that = this;
    $Toast({
      content: that.data.lifestyle[3].txt,
      icon: 'prompt',
      duration: 5,
      mask: false
    });

  },
  lvyou() {
    let that = this;
    $Toast({
      content: that.data.lifestyle[4].txt,
      icon: 'prompt',
      duration: 5,
      mask: false
    });
  },
  ziwaixian() {
    let that = this;
    $Toast({
      content: that.data.lifestyle[5].txt,
      icon: 'prompt',
      duration: 5,
      mask: false
    });
  },
  onShareAppMessage: function(res) {
    var that = this;
    var text = '这么好看的天气小程序，不来看一下嘛'
    return {
      title: text,
      path: '/pages/index/index'
    }
  },
  showVersionStart() {
    var that = this;
    that.setData({
      tap1: true
    })
  },
  showVersionEnd() {
    var that = this;
    that.setData({
      tap1: false
    })
  },
  goCanvasStart() {
    var that = this;
    that.setData({
      tap2: true
    })
  },
  goCanvasEnd() {
    var that = this;
    that.setData({
      tap2: false
    })
  },
  gridStart1() {
    var that = this;
    that.setData({
      grid1: true
    })
  },
  gridEnd1() {
    var that = this;
    that.setData({
      grid1: false
    })
  },
  gridStart2() {
    var that = this;
    that.setData({
      grid2: true
    })
  },
  gridEnd2() {
    var that = this;
    that.setData({
      grid2: false
    })
  },
  gridStart3() {
    var that = this;
    that.setData({
      grid3: true
    })
  },
  gridEnd3() {
    var that = this;
    that.setData({
      grid3: false
    })
  },
  gridStart4() {
    var that = this;
    that.setData({
      grid4: true
    })
  },
  gridEnd4() {
    var that = this;
    that.setData({
      grid4: false
    })
  },
  gridStart5() {
    var that = this;
    that.setData({
      grid5: true
    })
  },
  gridEnd5() {
    var that = this;
    that.setData({
      grid5: false
    })
  },
  gridStart6() {
    var that = this;
    that.setData({
      grid6: true
    })
  },
  gridEnd6() {
    var that = this;
    that.setData({
      grid6: false
    })
  },
  goHourlyStart() {
    var that = this;
    that.setData({
      tap3: true
    })
  },
  goHourlyEnd() {
    var that = this;
    that.setData({
      tap3: false
    })
  },
  goMineStart() {
    var that = this;
    that.setData({
      tap4: true
    })
  },
  goMineEnd() {
    var that = this;
    that.setData({
      tap4: false
    })
  },
  goModeStart() {
    var that = this;
    that.setData({
      tap5: true
    })
  },
  goModeEnd() {
    var that = this;
    that.setData({
      tap5: false
    })
  },
  goCityStart() {
    var that = this;
    that.setData({
      tap6: true
    })
  },
  goCityEnd() {
    var that = this;
    that.setData({
      tap6: false
    })
  },
  clickTip() {
    var that = this;
    that.setData({
      isClickTip: true
    })
    setTimeout(function() {
      that.setData({
        isClickTip: false
      })
    }, 500)
  },
  clickSunny() {
    var that = this;
    that.setData({
      handleSunny: true
    })
    setTimeout(function() {
      that.setData({
        handleSunny: false
      })
    }, 500)
  },
  clickWeather() {
    var that = this;
    that.asked();
    that.setData({
      handleWeather: true
    })
    setTimeout(function() {
      that.setData({
        handleWeather: false
      })
    }, 250)
  },
  clickTips() {
    var that = this;
    if (that.data.handleTips) {
      that.setData({
        handleTips: false
      })
    } else {
      that.setData({
        handleTips: true
      })
    }
  },

})