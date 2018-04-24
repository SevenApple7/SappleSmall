var myMethod = require('../../utils/common.js');
Page({
  data: {
  
  },

  onLoad: function (options) {
    var Orderid = options.OrderId
    var that = this
    let data = { UserId: wx.getStorageSync("Wuserid"), OrderId: Orderid  };
    myMethod.$http('/SevenApple/GetDetailByOrderId', data,
    function (res) {
      var resData = res.data;
      let arr = JSON.parse(resData);
      if (arr.Result) {
        var PArray = arr.List
        var statename;
        switch (arr.Stateid) {
          case 0:
            statename = "已取消";
            break;
          case 1:
            statename = "待收货";
            break;
          case 2:
            statename = "已收货";
            break;
          default:
            statename = "已取消";
            break;
        }
        that.setData({
          info: { 'statename': statename,'OrderId': arr.OrderId, 'Createdate': arr.Createdate, 'RefreshDate': arr.RefreshDate,'name': arr.PerName, 'phone': arr.Mobile, 'adrDetail': arr.Address, 'Amount': arr.Amount,'productList': PArray }
        });
      }
    })
  }
})