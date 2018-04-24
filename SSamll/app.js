//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var Util = require('utils/util.js');

    //维护登录状态
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        var Wuserid = wx.getStorageSync("Wuserid")
        //验证
        wx.request({
          url: getApp().globalData.Host + '/SevenApple/WxLoginCheck',
          data: { UserId: Wuserid },
          method: 'Post',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (e) {
            var resData = e.data;
            let arr = JSON.parse(resData);
            if (!arr.Result) {
              //后台缓存过期,重新登录
              Util.WxLogin()
            }
          }
        })
      },
      fail: function () {
        //登录态过期,重新登录
        Util.WxLogin()
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 将userInfo存入全局变量，方便调用
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          wx.openSetting({
            success: (res) => {
              wx.getUserInfo({
                success: res => {
                  // 将userInfo存入全局变量，方便调用
                  this.globalData.userInfo = res.userInfo
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                  }
                  var a = wx.getStorageSync("Wuserid")
                  wx.request({
                    url: getApp().globalData.Host + '/SevenApple/wxUserInfo',
                    data: { uf: res.rawData, UserId: wx.getStorageSync("Wuserid") },
                    method: 'Post',
                    header: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    },
                    success: function (res) {
                      var a = 1;
                    },
                    fail: function (res) {
                      var a = 1;
                    },
                    complete: function (res) {
                      var a = 1;
                    },
                  })
                }
              })
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: {},
    //Host: "http://localhost:8801"
    Host: "https://www.bambooego.com"
  }

})