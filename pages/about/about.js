// pages/about/about.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  goback() {
    wx.navigateBack({})
  },
  //复制微信号
  bindtouchstart1() {
    this.setData({
      iswechatclick: true
    })
  },
  bindtouchend1() {
    this.setData({
      iswechatclick: false
    })
    wx.setClipboardData({
      data: 'a625579913',
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {

          }
        })
      }
    })
  },
})