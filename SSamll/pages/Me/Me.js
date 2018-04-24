const app = getApp()
Page({

  data: {

  },

  onLoad: function (options) {
    var that = this 
    that.setData({
      userInfo: app.globalData.userInfo
    }) 
  },


})