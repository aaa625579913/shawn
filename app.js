//app.js
const apiConfig = require('./utils/request.js').apiConfig;
const api = require('./utils/api.js');
const util = require('./utils/util.js');

App({
  apiConfig: apiConfig,
  api: api,
  util: util,
  onLaunch: function() {
    this.checkUpdate()
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      // 小程序在开始使用云能力前需进行初始化【全局初始化】
      wx.cloud.init({
        env: 'test-wqyxr', // 这里填写【环境ID】 而不是环境名
        traceUser: true, // 是否在将用户访问记录到用户管理中，在控制台中可见
      })
    }
    var that = this;
    if (wx.getStorageSync('switch1') != null) {

    } else {
      wx.setStorage({
        key: 'switch1',
        data: true,
      })
    }
    if (wx.getStorageSync('switch2') != null) {

    } else {
      wx.setStorage({
        key: 'switch2',
        data: true,
      })
    }
    //判断是否苹果用户（devtools为开发者工具）
    wx.getSystemInfo({
      success: function(res) {
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
        } else {
          that.globalData.statusBarHeight = res.statusBarHeight;
        }
      }
    })

  },

  onShow() {
    var that = this;
  },
  prevPage: function() {
    let pages = getCurrentPages(); //当前页面
    return pages[pages.length - 2]; //上一页面
  },
  checkUpdate() {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      if (!res.hasUpdate) {
        console.log('当前已是最新版本')
      } else {
        console.log('您有新版本需要更新')
      }
    })

    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，重启应用',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function() {
      // 新版本下载失败
      console.log('意外：新版本下载失败')
    })
  },
  globalData: {
    userInfo: null,
    isIphoneX: false, //判断是否为IphoneX
    iOS: '', //判断是否为iOS用户
    screenHeight: 0, // 获取屏幕的宽度
    screenWidth: 0, // 获取屏幕的高度
    statusBarHeight: 0, //导航栏高度
  }
})