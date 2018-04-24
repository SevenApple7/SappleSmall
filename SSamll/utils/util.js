const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//生成从minNum到maxNum的随机数
function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
      break;
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
      break;
    default:
      return 0;
      break;
  }
}
function wxlogin() {
  wx.login({
    success: res => {
      // 获取code
      if (res.code) {
        console.log('获取用户登录凭证：' + res.code);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: getApp().globalData.Host + '/SevenApple/Wxlogin',
          data: { code: res.code },
          method: 'Post',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (e) {
            var resData = e.data;
            let arr = JSON.parse(resData);
            if (arr.Result) {
              wx.setStorageSync("Wuserid", arr.userID)
            }
          }
        })
        // ------------------------------------
      } else {
        wx.showModal({
          title: '获取用户登录态失败',
          content: res.errMsg,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    }
  })
}
module.exports = {
  WxLogin: wxlogin,
  formatTime: formatTime,
  randomNum: randomNum
}