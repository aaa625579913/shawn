// pages/mine/mine.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    data: '',
    isLogin: false,
    userInfo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
  },
  onShow() {
    let _isLogin = wx.getStorageSync('isLogin');
    if (!_isLogin) {
      let _duration = 1500;
      wx.showToast({
        title: '您还未登录,请先登录',
        icon: 'none',
        duration: _duration
      })
      // setTimeout(() => {
      //   wx.navigateTo({
      //     url: '../login/login',
      //   })
      // }, _duration)
    } else {
      this.setData({
        isLogin: true,
        userInfo: wx.getStorageSync('userInfo')
      })
    }
  },
  goAbout() {
    wx.navigateTo({
      url: '../about/about',
    })
  },
  goSetting() {
    wx.navigateTo({
      url: '../setting/setting',
    })
  },
  // onlogin(){
  //   // 登录
  //   wx.login({
  //     success: res => {
  //       // 发送 res.code 到后台换取 openId, sessionKey, unionId
  //     }
  //   })
  //   // 获取用户信息
  //   wx.getSetting({
  //     success: res => {
  //       if (res.authSetting['scope.userInfo']) {
  //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
  //         wx.getUserInfo({
  //           success: res => {
  //             // 可以将 res 发送给后台解码出 unionId
  //             this.app.globalData.userInfo = res.userInfo

  //             // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //             // 所以此处加入 callback 以防止这种情况
  //             if (this.userInfoReadyCallback) {
  //               this.userInfoReadyCallback(res)
  //             }
  //           }
  //         })
  //       }
  //     }
  //   })
  // },
  goback() {
    wx.navigateBack({})
  },
  goLogin() {
    var that = this;
    if (wx.getStorageSync('isLogin')) {
      wx.showToast({
        title: '已经登陆过啦',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },
  goAboutStart() {
    var that = this;
    that.setData({
      tap1: true
    })
  },
  goAboutEnd() {
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
  goCanvasStart() {
    var that = this;
    that.setData({
      tap3: true
    })
  },
  goCanvasEnd() {
    var that = this;
    that.setData({
      tap3: false
    })
  },
})