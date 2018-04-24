var myMethod = require('../../utils/common.js');
Page({
  data: {

  },

  onLoad: function (options) {
    var that = this;
    var productid = options.productid
    let data = { productid: productid};
    myMethod.$http('/SevenApple/GetProductDetail', data,
    function (res) {
      var resData = res.data;
      let arr = JSON.parse(resData);
      if (arr.Result) {
        var list = arr.List
        var productArray = new Array();
        if (list.length > 0) {//有数据
          for (var i = 0; i < list.length; i++) {
            productArray[i] = { "Pname": list[i].ProductName, "dec": list[i].ProductDetail, "price": list[i].ProductPrice, "src": list[i].MainImgUrl, "Pid": list[i].ProductId }
          }
        }
        that.setData({ productList: productArray });
      }
    })
  },
  
  buy(event) {
    var TypeArray = new Array();
    TypeArray[0] = event.currentTarget.dataset.id
    TypeArray[0].num = 1
    var param = JSON.stringify(TypeArray)
    wx.navigateTo({
      url: '/pages/PreOrder/PreOrder?p=1&str=' + param
    })
  },

  addCart(event) {
    var param = event.currentTarget.dataset.id
    var that = this;
    let data = { UserId: wx.getStorageSync("Wuserid"), Productid: param, Num: '1' };
    myMethod.$http('/SevenApple/AddCart', data,
    function (res) {
      var resData = res.data;
      let arr = JSON.parse(resData);
      if (arr.Result) {
        wx.showToast({
          title: '加入购物车成功',
          icon: 'success',
          duration: 2000
        })
      }
    });
  },
  index() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  shopCart() {
    wx.switchTab({
      url: '/pages/shopCar/shopCar'
    })
  }
})