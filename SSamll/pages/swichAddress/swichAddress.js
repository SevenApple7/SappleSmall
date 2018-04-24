var myMethod = require('../../utils/common.js');
Page({
  data: {
    info: []
  },
  onLoad: function (options) {
    this.data.info = JSON.parse(options.str)
    this.GetAderess();
  },
  GetAderess: function () {//获取收货地址
    var that = this;
    let data = { UserId: wx.getStorageSync("Wuserid"), StateId: 1 };
    myMethod.$http('/SevenApple/GetAddressListByUserid', data,
    function (res) {
      // success
      var resData = res.data;
      let arr = JSON.parse(resData);
      if (arr.Result) {
        var list = arr.List
        var AdressArray = new Array();
        if (list.length > 0) {//有数据
          for (var i = 0; i < list.length; i++) {
            AdressArray[i] = { 'AddrID': list[i].AddrID, 'PerName': list[i].PerName, 'PerMobile': list[i].PerMobile, 'Province': list[i].Province, 'City': list[i].City, 'Area': list[i].Area, 'Addrdetil': list[i].Addrdetil, 'StateId': list[i].StateId }
          }
        }
        that.setData({
          adressList: AdressArray
        });
      }
    });
  },
  select(event){
    var param = event.currentTarget.dataset.id
    var info = this.data.info
    info.AddrID = param.AddrID
    info.Addrdetil = param.Addrdetil
    info.Province = param.Province
    info.City = param.City 
    info.Area = param.Area 
    info.PerName = param.PerName 
    info.PerMobile = param.PerMobile
    info.StateId = param.StateId
    var str = JSON.stringify(info)
    wx.redirectTo({
      url: '/pages/PreOrder/PreOrder?p=2&str=' + str
    })
  }
})