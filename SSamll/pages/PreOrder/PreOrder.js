const app = getApp()
var Util = require('../../utils/util.js');
var myMethod = require('../../utils/common.js');
var PArray;
Page({
  data: {
    cartidlist: [],
    info: [],
    condition: true,
    //param: '',
    //Addrparam: [],
  },
  onLoad: function (options) {
    var that = this
    //that.data.param = "p=" + options.p + "&str=" + options.str
    if (options.p == 1) {//初次进入
      PArray = JSON.parse(options.str)
      var Amount = 0
      if (PArray.length > 0) {//有数据
        for (var i = 0; i < PArray.length; i++) {
          Amount += PArray[i].price * PArray[i].num
          this.data.cartidlist.push({ 'cartid': PArray[i].cartid })
        }
      }
      //收货地址
      let data = { UserId: wx.getStorageSync("Wuserid"), StateId: 1 };
      myMethod.$http('/SevenApple/GetAddressListByUserid', data,
        function (res) {
          var resData = res.data;
          let arr = JSON.parse(resData);
          if (arr.Result) {
            var list = arr.List
            var AdressArray = new Array();
            if (list.length > 0) {//有数据
              AdressArray[0] = { 'AddrID': list[0].AddrID, 'PerName': list[0].PerName, 'PerMobile': list[0].PerMobile, 'Province': list[0].Province, 'City': list[0].City, 'Area': list[0].Area, 'Addrdetil': list[0].Addrdetil, 'StateId': list[0].StateId }
              that.setData({
                condition: true,
                //Addrparam: AdressArray[0],
                info: { 'AddrID': AdressArray[0].AddrID, 'PerName': AdressArray[0].PerName, 'PerMobile': AdressArray[0].PerMobile, 'Province': list[0].Province, 'City': list[0].City, 'Area': list[0].Area, 'Addrdetil': list[0].Addrdetil, 'StateId': list[0].StateId, 'Amount': Amount, 'productList': PArray }
              });
            } else {
              that.setData({
                condition: false,
                info: { 'AddrID': "", 'PerName': "", 'PerMobile': "", 'Province': "", 'City': "", 'Area': "", 'Addrdetail': "", 'StateId': "",'Amount': Amount, 'productList': PArray }
              });
            }
          }
        })
    }
    if (options.p == 2) {//
      var PArray = JSON.parse(options.str)
      if (options.addr != null && options.addr != '' && options.addr != undefined) {
        var addr = JSON.parse(options.addr)
        PArray.AddrID = addr.AddrID,
        PArray.PerName = addr.PerName,
        PArray.PerMobile = addr.PerMobile,
        PArray.Province = addr.Province,
        PArray.City = addr.City,
        PArray.Area = addr.Area,
        PArray.Addrdetil = addr.Addrdetil,
        PArray.StateId = addr.StateId
      }
      this.setData({
        info: PArray,
        condition: true
      });
    }
  },
  onShow: function () {
    //this.onLoad()
  },
  pay(event) {//提交订单
    var param = event.currentTarget.dataset.id
    var strJson = JSON.stringify(param)
    let data = { UserId: wx.getStorageSync("Wuserid"), strJson: strJson };
    myMethod.$http('/SevenApple/CreateOrder', data,
      function (res) {
        var resData = res.data;
        let arr = JSON.parse(resData);
        if (arr.Result) {
          var OrderId = arr.OrderId
          //请求
          let data = { UserId: wx.getStorageSync("Wuserid"), orderid: OrderId };
          myMethod.$http('/SevenApple/UnifiedOrder', data,
            function (res1) {
              var resData = res1.data;
              let arr = JSON.parse(resData);
              if (arr.Result) {
                wx.requestPayment({
                  'timeStamp': arr.timeStamp,
                  'nonceStr': arr.nonceStr,
                  'package': arr.package,
                  'signType': arr.signType,
                  'paySign': arr.paySign,
                  'success': function (res) {
                    wx.showToast({
                      title: '支付成功！',
                      icon: 'success',
                      duration: 2000
                    })
                    if (this.data.cartidlist.length > 0) {
                      this.deleteCart(this.data.cartidlist);
                    }
                    //请求
                    let data = { userid: wx.getStorageSync("Wuserid"), orderid: OrderId, Stateid: 1 };
                    myMethod.$http('/SevenApple/UpdateStateid', data,
                      function (res2) {
                        //跳转
                        wx.redirectTo({
                          url: '/pages/PayComplete/PayComplete'
                        })
                      })
                  },
                  'fail': function (res) { },
                  'complete': function (res) { }
                })
              } else {
                wx.showToast({
                  title: '请勿重复支付！',
                  icon: 'success',
                  duration: 2000
                })
              }
            })
        }
      });

  },
  addadr() {//添加收货地址
    var that = this
    var strJson = JSON.stringify(that.data.info)
    var callback = encodeURIComponent('/pages/PreOrder/PreOrder?p=2&str=' + strJson)
    wx.redirectTo({
      url: '/pages/addAdress/addAdress?str=1&callback=' + callback
    })
  },
  editAdr(event) {//编辑收货地址
    var that = this
    var strJson = JSON.stringify(that.data.info)
    var callback = encodeURIComponent('/pages/PreOrder/PreOrder?p=2&str=' + strJson)
    wx.redirectTo({
      url: '/pages/addAdress/addAdress?str=' + strJson + '&callback=' + callback
    })
  },
  selectAdr(event) {//选择收货地址
    var str = JSON.stringify(this.data.info)
    wx.redirectTo({
      url: '/pages/swichAddress/swichAddress?str=' + str
    })
  },
  deleteCart: function (str) {//删除收货地址
    let data = { UserId: wx.getStorageSync("Wuserid"), Cartid: JSON.stringify(str) };
    myMethod.$http('/SevenApple/DeleteCart', data,
      function (res) {
        var resData = res.data;
        let arr = JSON.parse(resData);
        if (arr.Result) {
          var list = arr.List
          var AdressArray = new Array();
          if (list.length > 0) {//有数据
            AdressArray[0] = { 'adrId': list[0].AddressID, 'name': list[0].PerName, 'tel': list[0].PerMobile, 'adrDetail': list[0].Address }
          }
          that.setData({
            info: { 'name': AdressArray[0].name, 'phone': AdressArray[0].tel, 'adress': AdressArray[0].adrDetail, 'Amount': Amount, 'productList': PArray }
          });
        }
      });
  }
})