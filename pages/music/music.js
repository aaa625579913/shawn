// pages/test3/test3.js
var _animation; // 动画实体
var _animationIndex = 0; // 动画执行次数index（当前执行了多少次）
var _animationIntervalId = -1; // 动画定时任务id，通过setInterval来达到无限旋转，记录id，用于结束定时任务
const _ANIMATION_TIME = 500; // 动画播放一次的时长ms

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    audioCover: true, //音频播放的遮罩
    course_id: '1',
    isOpen: false, //播放开关
    is_updateTime: false, //判断有没有观看
    starttime: '00:00', //正在播放时长
    src: "", //音频链接
    offset: 0, //当前播放时间
    viewing_time: 0, //接口返回的课程播放到的时间
    // musicList: [{
    //   "course_name": "Kiss Goodbye",
    //   "course_pictures": "../../static/images/cd.png",
    //   "src": 'https://shawn-weather-1258489802.cos.ap-shenzhen-fsi.myqcloud.com/music/%E7%8E%8B%E5%8A%9B%E5%AE%8F%20-%20kiss%20goodbye.mp3'
    // },
    //   {
    //     "course_name": "Bad Guy",
    //     "course_pictures": "../../static/images/cd.png",
    //     "src": 'https://shawn-weather-1258489802.cos.ap-shenzhen-fsi.myqcloud.com/music/Bad%20Guy.mp3'
    //   },
    //   {
    //     "course_name": "Let Me Love You",
    //     "course_pictures": "../../static/images/cd.png",
    //     "src": 'https://shawn-weather-1258489802.cos.ap-shenzhen-fsi.myqcloud.com/music/Let%20Me%20Love%20You.mp3'
    //   }
    // ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    const bgMusic = wx.getBackgroundAudioManager(); //音乐播放实例
    // if(bgMusic.duration){
    //   that.setData({
    //     duration: 'bgMusic.duration',
    //   })
    // }
  },
  onShow() {
    var that = this;
    const switch2 = wx.getStorageSync('switch2')
    const bgMusic = wx.getBackgroundAudioManager(); //音乐播放实例
    that.setData({
      switch2: switch2,
      course_name: "Let Me Love You",
      course_pictures: "../../static/images/cd.png",
      duration: '3:26',
      src: "https://shawn-weather-1258489802.cos.ap-shenzhen-fsi.myqcloud.com/music/Let%20Me%20Love%20You.mp3"
    })
  },

  // // 真机上可行
  //   onShow() {
  //     var that = this;
  //     this.audio = wx.getBackgroundAudioManager(); //音乐播放实例
  //     this.audio.title = "test"
  //     this.audio.protocol = 'hls';
  //     this.audio.src = "http://2345.liveplay.myqcloud.com/live/2980600602880440129.m3u8";
  //   },

  onReady() {


  },
  //开始按钮
  listenerButtonPlay: function() {
    let that = this;
    const bgMusic = wx.getBackgroundAudioManager(); //音乐播放实例
    //bug ios 播放时必须加title 不然会报错导致音乐不播放
    if (that.data.offset == 0) {
      bgMusic.title = that.data.course_name;
      bgMusic.epname = that.data.course_name;
      bgMusic.src = that.data.src;
      that.currentTimeChange();
      // //获取当前音频/视频播放时长 由于声明提前造成viewing_time不是我们想要的，而是上次点击存的(注意：这里也是个坑)
      // // that.getMediaCurTime();
      // setTimeout(function() {
      //   let viewing_time = that.data.viewing_time;
      //   bgMusic.onTimeUpdate(() => {
      //     //判断当前时间是不是0，如果是0就不需要跳转直接更新进度
      //     if (viewing_time != 0) {
      //       //跳转到暂停时存储的时间
      //       bgMusic.seek(viewing_time);
      //       //更新进度
      //       that.currentTimeChange();
      //     } else {
      //       //更新进度
      //       that.currentTimeChange();
      //     }
      //   });
      // }, 300)

      //开始播放
      bgMusic.play();
      that.setData({
        isOpen: true,
      });

      //播放结束
      bgMusic.onEnded(() => {
        that.setData({
          starttime: '00:00',
          isOpen: false,
          offset: 0
        })
        //播放自然结束时更新进度
        // that.updateViewTime();
      })
    } else {
      //开始播放
      setTimeout(function() {
        bgMusic.play();
        that.setData({
          isOpen: true,
        });
      }, 300)
    }
  },

  //暂停
  listenerButtonPause: function() {
    const bgMusic = wx.getBackgroundAudioManager(); //音乐播放实例
    let that = this
    bgMusic.pause();
    that.setData({
      isOpen: false
    });
    //更新进度
    // that.updateViewTime();
  },
  circleChange(e) {
    let that = this;
    const bgMusic = wx.getBackgroundAudioManager(); //音乐播放实例
    console.log(e)
    let currentTime = parseInt(e.detail.value);
    // let duration = bgMusic.duration;
    // let min = "0" + parseInt(currentTime / 60);
    // let max = parseInt(bgMusic.duration);
    // let sec = currentTime % 60;
    // if (sec < 10) {
    //   sec = "0" + sec;
    // };
    // let starttime = min + ':' + sec;
    bgMusic.pause();
    bgMusic.seek(currentTime)
    that.setData({
      isChange: true,
      // starttime: starttime
    })
  },
  // 音频进度条拖拽
  sliderChange: function(e) {
    let that = this;
    console.log(e)
    that.setData({
      isChange: false
    })
    const bgMusic = wx.getBackgroundAudioManager(); //音乐播放实例
    let offset = parseInt(e.detail.value);
    if (that.data.isOpen) {
      //播放状态
      bgMusic.play();
      //进度条拖动，音乐进度也要改变
      bgMusic.seek(offset);
      that.setData({
        offset: offset
      })
      that.currentTimeChange();
      //更新进度
      // that.updateViewTime();
    } else {
      //暂停状态
      if (offset) {
        bgMusic.pause();
        bgMusic.seek(offset);

        that.setData({
          offset: offset
        })
        that.currentTimeChange();
        //更新进度
        // that.updateViewTime();
      } else {
        // util.showSuccess("请观看后操作");
      }
    }
  },
  //当前音频时间发生变化时
  currentTimeChange: function() {
    let self = this;
    const bgMusic = wx.getBackgroundAudioManager(); //音乐播放实例
    bgMusic.onTimeUpdate(() => {
      let offset = bgMusic.currentTime;
      console.log("offset", offset)
      let currentTime = parseInt(offset);
      let duration = bgMusic.duration;
      let min = "0" + parseInt(currentTime / 60);
      let max = parseInt(bgMusic.duration);
      let sec = currentTime % 60;
      if (sec < 10) {
        sec = "0" + sec;
      };
      let starttime = min + ':' + sec;
      self.setData({
        offset: currentTime,
        starttime: starttime,
        max: max,
        is_updateTime: true,
      });
    });
  },
  //后退10秒
  prev: function() {
    let that = this;
    const bgMusic = wx.getBackgroundAudioManager(); //音乐播放实例
    if (bgMusic.currentTime - 10 <= 0) {
      bgMusic.seek(0);
      that.currentTimeChange();
    } else {



      if (that.data.isOpen) {
        //播放状态
        bgMusic.seek(bgMusic.currentTime - 10);
        that.currentTimeChange();
        // that.updateViewTime();
      } else {
        //暂停状态
        if (that.data.offset) {
          bgMusic.seek(bgMusic.currentTime - 10);
          that.setData({
            offset: bgMusic.currentTime - 10
          });
          let currentTime = parseInt(bgMusic.currentTime - 10);
          let min = "0" + parseInt(currentTime / 60);
          let sec = currentTime % 60;
          if (sec < 10) {
            sec = "0" + sec;
          };
          let starttime = min + ':' + sec;
          that.setData({
            starttime: starttime
          })
          // that.updateViewTime();
          that.currentTimeChange();
        } else {
          // util.showSuccess("请观看后操作");
        }
      }
    }
  },
  //前进10秒
  next: function() {
    let that = this;
    const bgMusic = wx.getBackgroundAudioManager(); //音乐播放实例
    if (that.data.isOpen) {
      //播放状态
      bgMusic.seek(bgMusic.currentTime + 10);
      // that.updateViewTime();
    } else {
      //暂停状态
      if (that.data.offset) {
        bgMusic.seek(bgMusic.currentTime + 10);
        that.setData({
          offset: bgMusic.currentTime + 10
        });
        let currentTime = parseInt(bgMusic.currentTime + 10);
        let min = "0" + parseInt(currentTime / 60);
        let sec = currentTime % 60;
        if (sec < 10) {
          sec = "0" + sec;
        };
        let starttime = min + ':' + sec;
        that.setData({
          starttime: starttime
        })
        // that.updateViewTime();
      } else {
        // util.showSuccess("请观看后操作");
      }
    }
  },
  goback() {
    wx.navigateBack({
      delta: 1,
    })
  },
  audioNextStart() {
    var self = this;
    self.setData({
      tapNext: true
    })
  },
  audioNextEnd() {
    var self = this;
    self.setData({
      tapNext: false
    })
  },
  audioPrevStart() {
    var self = this;
    self.setData({
      tapPrev: true
    })
  },
  audioPrevEnd() {
    var self = this;
    self.setData({
      tapPrev: false
    })
  },

  audioMiddleStart() {
    var self = this;
    self.setData({
      tapMiddle: true
    })
  },
  audioMiddleEnd() {
    var self = this;
    self.setData({
      tapMiddle: false
    })
  },
})