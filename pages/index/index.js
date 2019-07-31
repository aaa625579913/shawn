//index.js
var amapFile = require('../../libs/amap-wx.js');
var util = require("../../utils/util.js")

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
    weaInfo: [],
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isiphone: app.globalData.isIphoneX,
    spinShow: false, //加载组件
    isNew: '' //是否为第一次进入
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  /*
  页面加载函数
  */
  onLoad: function() {
    var that = this;
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
    that.checkLocation();
    that.setData({
      spinShow: true
    })

    // if ((that.data.time > 18 && that.data.time <= 21)) {
    //   that.setData({
    //     bgImg: '../../static/images/2.png'
    //   })
    // } else if ((that.data.time >= 15 && that.data.time <= 18)) {
    //   that.setData({
    //     bgImg: 'https://shawn-weather-1258489802.cos.ap-shenzhen-fsi.myqcloud.com/1.png'
    //   })
    // } else if ((that.data.time >= 0 && that.data.time <= 6) || (that.data.time > 21 && that.data.time <= 24)) {
    //   that.setData({
    //     bgImg: '../../static/images/21-24.png'
    //   })
    // } else {
    //   that.setData({
    //     bgImg: '../../static/images/demo.png'
    //   })
    // }
    const isNew = wx.getStorageSync('isNew')
    //获取isNew信息
    this.setData({
      isNew: isNew
    })
  },
  onReady() {
    this.login = this.selectComponent("#login");
  },
  //s
  bgChange() {
    var that = this;
    console.log("现在的时间", that.data.time)
    if (that.data.weatherNow[0]) {
      if (that.data.weatherNow[0].wea.search("雨") != -1) {
        that.setData({
          bgImg: 'https://shawn-weather-1258489802.cos.ap-shenzhen-fsi.myqcloud.com/8.png'
        })
      } else {
        if ((that.data.time >= 0 && that.data.time < 6)) {
          that.setData({
            bgImg: 'https://shawn-weather-1258489802.cos.ap-shenzhen-fsi.myqcloud.com/3.png'
          })
        } else if ((that.data.time >= 6 && that.data.time < 9)) {
          that.setData({
            bgImg: 'https://shawn-weather-1258489802.cos.ap-shenzhen-fsi.myqcloud.com/7.png'
          })
        } else if ((that.data.time >= 9 && that.data.time < 12)) {
          that.setData({
            bgImg: 'https://shawn-weather-1258489802.cos.ap-shenzhen-fsi.myqcloud.com/6.png'
          })
        } else if ((that.data.time >= 12 && that.data.time < 14)) {
          that.setData({
            bgImg: 'https://shawn-weather-1258489802.cos.ap-shenzhen-fsi.myqcloud.com/4.png'
          })
        } else if ((that.data.time >= 14 && that.data.time < 16)) {
          that.setData({
            bgImg: 'https://shawn-weather-1258489802.cos.ap-shenzhen-fsi.myqcloud.com/5.png'
          })
        } else if ((that.data.time >= 16 && that.data.time < 18)) {
          that.setData({
            bgImg: 'https://shawn-weather-1258489802.cos.ap-shenzhen-fsi.myqcloud.com/2.png'
          })
        } else if ((that.data.time >= 18 && that.data.time < 21)) {
          that.setData({
            bgImg: 'https://shawn-weather-1258489802.cos.ap-shenzhen-fsi.myqcloud.com/9.png'
          })
        } else if ((that.data.time >= 21 && that.data.time <= 24)) {
          that.setData({
            bgImg: 'https://shawn-weather-1258489802.cos.ap-shenzhen-fsi.myqcloud.com/1.png'
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
  bindGetUserInfo: function() {
    // 用户点击授权后，这里可以做一些登陆操作
    // this.login();
    var that = this;
    console.log("点击成功")
    wx.getUserInfo({
      success: res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          loginYet: true
        })
        app.globalData.userInfo = that.data.userInfo;
        console.log("用户", app.globalData.userInfo)
        wx.setStorage({
          key: 'userInfo',
          data: that.data.userInfo,
        })
      }
    })
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
        that.setData({
          city: localCity
        })
        that.getWeatherInfo();
      },
      fail: function(info) {}
    });
  },

  //获取天气信息
  getWeatherInfo() {
    var that = this;
    //天气请求-深圳
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
    wx.request({
      url: "https://www.tianqiapi.com/api/?version=v1" + "&city" + that.data.city,
      success(res) {
        console.log("新天气api", res.data.data)
        var weatherChange = res.data.data;
        var weatherNow = weatherChange.slice(0, 1)
        weatherChange = weatherChange.slice(1, weatherChange.length)
        that.setData({
            weather: weatherChange,
            weatherNow: weatherNow,
            hourly: res.data.data[0].hours
          },
          setTimeout(function() {
            that.judgeWeather()
          }, 50))
        console.log("weatherNow", that.data.weatherNow)
        console.log("hourly", that.data.hourly)
        console.log("weather", that.data.weather)
      },
      fail(res) {
        console.log("fail", res)
      }
    })
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
    console.error("现在的时间", that.data.time)
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
    }
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
      }else if (wea.search("晴") != -1) {  
        if ((that.data.time >= 0 && that.data.time < 6) || (that.data.time >= 18 && that.data.time <= 24)) {
          that.setData({
            imgflag: '/static/images/sunny.png'
          }) 
        }else{
          that.setData({
            imgflag: '/static/images/sunny-night.png'
          })
        }               
      } else if (wea.search("云") != -1) {
        if ((that.data.time >= 0 && that.data.time < 6) || (that.data.time >= 18 && that.data.time <= 24)) {
          that.setData({
            imgflag: '/static/images/cloudy-sunny.png'
          })
        } else {
          that.setData({
            imgflag: '/static/images/cloudy-sunny-night.png'
          })
        }
      } else if (wea.search("阴") != -1) {
        if ((that.data.time >= 0 && that.data.time < 6) || (that.data.time >= 18 && that.data.time <= 24)) {
          that.setData({
            imgflag: '/static/images/cloudy-sunny.png'
          })
        } else {
          that.setData({
            imgflag: '/static/images/cloudy-sunny-night.png'
          })
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
    console.error(that.data.hourly)
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
            imgSix: '/static/images/sunny.png'
          })
        } else {
          that.setData({
            imgSix: '/static/images/sunny-night.png'
          })
        }
      } else if (wea.search("云") != -1) {
        if ((that.data.time >= 0 && that.data.time < 6) || (that.data.time >= 18 && that.data.time <= 24)) {
          that.setData({
            imgSix: '/static/images/cloudy-sunny.png'
          })
        } else {
          that.setData({
            imgSix: '/static/images/cloudy-sunny-night.png'
          })
        }
      } else if (wea.search("阴") != -1) {
        if ((that.data.time >= 0 && that.data.time < 6) || (that.data.time >= 18 && that.data.time <= 24)) {
          that.setData({
            imgSix: '/static/images/cloudy-sunny.png'
          })
        } else {
          that.setData({
            imgSix: '/static/images/cloudy-sunny-night.png'
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
      // switch (wea) {
      //   case "晴":
      //     {
      //       that.setData({
      //         imgSix: '/static/images/sun.png'
      //       })
      //       break;
      //     }
      //   case "小雨":
      //     {
      //       that.setData({
      //         imgSix: '/static/images/rainy1.png'
      //       })
      //       break;
      //     }
      //   case "中雨":
      //     {
      //       that.setData({
      //         imgSix: '/static/images/rainy2.png'
      //       })
      //       break;
      //     }
      //   case "中雨转雷阵雨":
      //     {
      //       that.setData({
      //         imgSix: '/static/images/rainy2.png'
      //       })
      //       break;
      //     }
      //   case "大雨":
      //     {
      //       that.setData({
      //         imgSix: '/static/images/rainy3.png'
      //       })
      //       break;
      //     }
      //   case "大雨转暴雨":
      //     {
      //       that.setData({
      //         imgSix: '/static/images/rainy3.png'
      //       })
      //       break;
      //     }
      //   case "阵雨":
      //     {
      //       that.setData({
      //         imgSix: '/static/images/rainy1.png'
      //       })
      //       break;
      //     }
      //   case "暴雨":
      //     {
      //       that.setData({
      //         imgSix: '/static/images/rainy4.png'
      //       })
      //       break;
      //     }
      //   case "大暴雨":
      //     {
      //       that.setData({
      //         imgSix: '/static/images/rainy4.png'
      //       })
      //       break;
      //     }
      //   case "暴雨转雷阵雨":
      //     {
      //       that.setData({
      //         imgSix: '/static/images/rainy4.png'
      //       })
      //       break;
      //     }
      //   case "暴雨转中雨":
      //     {
      //       that.setData({
      //         imgSix: '/static/images/rainy2.png'
      //       })
      //       break;
      //     }
      //   case "雷阵雨":
      //     {
      //       that.setData({
      //         imgSix: '/static/images/rainy4.png'
      //       })
      //       break;
      //     }
      //   case "多云":
      //     {
      //       that.setData({
      //         imgSix: '/static/images/cloudy.png'
      //       })
      //       break;
      //     }
      //   case "阴":
      //     {
      //       that.setData({
      //         imgSix: '/static/images/cloudy.png'
      //       })
      //       break;
      //     }
      //   case "雾":
      //     {
      //       that.setData({
      //         imgSix: '/static/images/cloudy.png'
      //       })
      //       break;
      //     }
      //   case "霾":
      //     {
      //       that.setData({
      //         imgSix: '/static/images/cloudy.png'
      //       })
      //       break;
      //     }
      //   default:
      //     {
      //       break;
      //     }
      // }
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
  // getUserInfo: function (e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },
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
    $Toast({
      content: '注意防晒噢~'
    });
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
  /**生活指数 */
  shushi() {
    let that = this;
    $Toast({
      content: that.data.lifestyle[0].txt,
      icon: 'prompt',
      duration: 0,
      mask: false
    });
    setTimeout(() => {
      $Toast.hide();
    }, 5000);
  },
  chuanyi() {
    let that = this;
    $Toast({
      content: that.data.lifestyle[1].txt,
      icon: 'prompt',
      duration: 0,
      mask: false
    });
    setTimeout(() => {
      $Toast.hide();
    }, 5000);
  },
  ganmao() {
    let that = this;
    $Toast({
      content: that.data.lifestyle[2].txt,
      icon: 'prompt',
      duration: 0,
      mask: false
    });
    setTimeout(() => {
      $Toast.hide();
    }, 5000);
  },
  yundong() {
    let that = this;
    $Toast({
      content: that.data.lifestyle[3].txt,
      icon: 'prompt',
      duration: 0,
      mask: false
    });
    setTimeout(() => {
      $Toast.hide();
    }, 5000);
  },
  lvyou() {
    let that = this;
    $Toast({
      content: that.data.lifestyle[4].txt,
      icon: 'prompt',
      duration: 0,
      mask: false
    });
    setTimeout(() => {
      $Toast.hide();
    }, 5000);
  },
  ziwaixian() {
    let that = this;
    $Toast({
      content: that.data.lifestyle[5].txt,
      icon: 'prompt',
      duration: 0,
      mask: false
    });
    setTimeout(() => {
      $Toast.hide();
    }, 5000);
  },

})