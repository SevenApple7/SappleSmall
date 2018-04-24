const app = getApp()
var myMethod = require('../../utils/common.js');

Page({
  data: {
    orderList: [],
    adressList: [],
    checkBoxImgSrc: '../../img/dui.png',
    current: 0,
    windowHeight: 0
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
        });
      }
    });
    this.GetAderess();
    this.GetOrderList();
  },
  onShow: function () {
    this.GetAderess();
  },
  GetAderess: function () {
    var that = this;
    //收货地址
    myMethod.$http(
      '/SevenApple/GetAddressListByUserid',
      { UserId: wx.getStorageSync("Wuserid"), StateId: 1 },
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
      }
    )
  },
  GetOrderList: function () {//获取订单列表
    var that = this;
    let data = { UserId: wx.getStorageSync("Wuserid") };
    myMethod.$http('/SevenApple/GetOrderListByUserId', data,
      function (res) {
        // success
        var resData = res.data;
        let arr = JSON.parse(resData);
        if (arr.Result) {
          var list = arr.List
          var AdressArray = new Array();
          if (list.length > 0) {//有数据
            for (var i = 0; i < list.length; i++) {
              var ProArray = new Array();
              var statename;
              switch (list[i].Stateid) {
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
              AdressArray[i] = { 'orderNumber': list[i].OrderId, 'state': list[i].Stateid, 'priceAll': list[i].Amount, 'proList': ProArray, 'statename': statename }
              for (var j = 0; j < list[i].proList.length; j++) {
                ProArray[j] = { 'id': list[i].proList[j].ProductId, "name": list[i].proList[j].ProductName, "dec": list[i].proList[j].TypeName, "price": list[i].proList[j].ProductPrice, "src": list[i].proList[j].MainImgUrl, "num": list[i].proList[j].Num }
              }
            }
          }
          that.setData({ orderList: AdressArray });
        }
      });
  },
  changeTab(e) {
    var current = e.currentTarget.dataset.current;
    this.setData({ current: current });
  },
  setDefault(e) {//设置默认收货地址
    var that = this
    wx.showLoading({
      title: '修改默认地址',
    })
    var num = e.currentTarget.dataset.index;
    var state = this.data.adressList[num].StateId;
    var adressList = this.data.adressList;
    if (state == 2) return;
    else {
      for (var i = 0; i < this.data.adressList.length; i++) {
        this.data.adressList[i].StateId = 1;
      }
      this.data.adressList[num].StateId = 2;
      //请求
      myMethod.$http('/SevenApple/UpdateAddrStateid', { UserId: wx.getStorageSync("Wuserid"), MJson: JSON.stringify(adressList) },
        function (res) {
          var resData = res.data;
          let arr = JSON.parse(resData);
          if (arr.Result) {
            wx.hideLoading()
            that.setData({
              adressList: adressList
            })
          }
        })
    }
  },
  delateAdr(e) {//删除收货地址
    var adressList = e.currentTarget.dataset.id;
    adressList.StateId = 0
    var that = this;
    var strJson = JSON.stringify(adressList)
    let data = { MJson: strJson };
    myMethod.$http('/SevenApple/UpdateAddress', data,
      function (res) {
        var resData = res.data;
        let arr = JSON.parse(resData);
        if (arr.Result) {
          wx.showToast({
            title: '删除收货地址成功',
            icon: 'success',
            duration: 2000
          })
          that.GetAderess();
        }
      });

  },
  editAdr(event) {//编辑收货地址
    var param = event.currentTarget.dataset.id
    var strJson = JSON.stringify(param)
    wx.navigateTo({
      url: '/pages/addAdress/addAdress?str=' + strJson + '&callback=/pages/person/person?q=1'
    })
  },
  addadr() {//添加收货地址
    wx.navigateTo({
      url: '/pages/addAdress/addAdress?str=1&callback=/pages/person/person'
    })
  },
  ViewOrderDetail(event) {//查看订单详情
    var param = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?OrderId=' + param
    })
  },
  ViewProduct(event) {//查看商品详情
    var param = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/productDetail/productDetail?productid=' + param
    })
  }

})