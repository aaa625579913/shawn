// pages/version/version.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    versions: [
      { version: 'V1.3.3', date: '2019-09-04', content: ['1、新增音乐播放功能，可在设置页面设置显示模式', '2、优化地理位置选择；'] },
      { version: 'V1.3.2', date: '2019-08-27', content: ['1、新增地理位置选择功能，可查看国内任意城市的天气情况', '2、新增匿名功能，用户可以匿名发言；'] },
      { version: 'V1.3.1', date: '2019-08-21', content: ['1、优化背景图片；', '2、点击区域增加点击效果，优化用户体验；', '3、优化地理位置授权的操作和提示；'] },
      { version: 'V1.3.0', date: '2019-08-17', content: ['1、新增"朋友圈"功能，用户可以查看与发布动态', '2、新增"授权登陆"功能，用户登陆后可以发布动态；'] },
      { version: 'V1.2.0', date: '2019-08-10', content: ['1、修复"生活指数"Toast文字显示不全的问题；', '2、新增"实时天气的状态"根据时间的变化而变化功能；', '3、新增"天气绘图"显示功能，点击逐小时天气区域即可进入；'] },
      { version: 'V1.1.0', date: '2019-08-03', content: ['1、修复地理位置取消授权后不能重新授权的bug；', '2、新增"生活指数"功能。', '3、新增背景图可以随着时间和天气的变化而变化的功能。'] },
      { version: 'V1.0.0', date: '2019-07-27', content: ['1、初始化版本，待更新'] },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  goback() {
    wx.navigateBack({})
  },
})