//app.js
App({
  onLaunch: function() {
    var that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

  
    //判断是否苹果用户（devtools为开发者工具）
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.globalData.screenWidth = res.screenWidth
        that.globalData.screenHeight = res.screenHeight
        let modelmes = res.model;
        if (modelmes.search("iPhone X") != -1) {
          that.globalData.isIphoneX = true
        }
        if (res.system.search("iOS") != -1) {
          that.globalData.iOS = true
        } else {
          that.globalData.iOS = false
        }
        if (that.globalData.iOS == false) {
          that.globalData.statusBarHeight = res.statusBarHeight + 4;
        }else{
          that.globalData.statusBarHeight = res.statusBarHeight;
        }
      }
    })
    
  },

  onShow() {
    var that = this;

  },

  globalData: {
    userInfo: null,
    isIphoneX: false, //判断是否为IphoneX
    iOS: '', //判断是否为iOS用户
    screenHeight: 0, // 获取屏幕的宽度
    screenWidth: 0, // 获取屏幕的高度
    statusBarHeight:0 //导航栏高度
  }
})