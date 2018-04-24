const app = getApp()
var Util = require('../../utils/util.js');
var myMethod = require('../../utils/common.js');
Page({
  data: {
    imgUrls: [
      '../../img/banner_02.jpg',
      '../../img/banner_02.jpg',
      '../../img/banner_02.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 500,
    indicatorColor: "#ffffff",
    indicatorActiveColor: "#46f3ac",
    hotTitle: "热门推荐",
  },
  onLoad: function () {
    var that = this;
    //获取商品类型
    myMethod.$http('/SevenApple/GetProductType', {},
    function (res) {
      var resData = res.data;
      let arr = JSON.parse(resData);
      if (arr.Result) {
        var list = arr.List
        var TypeArray = new Array();
        if (list.length > 0) {//有数据
          for (var i = 0; i < list.length; i++) {
            TypeArray[i] = { "name": list[i].TypeName, "src": list[i].TypePic }
          }            
        }
        that.setData({ navList: TypeArray });
      }
    })
    //获取商品列表
    myMethod.$http('/SevenApple/GetProductList', { stateid: '2' },
    function (res) {
      var resData = res.data;
      let arr = JSON.parse(resData);
      if (arr.Result) {
        var list = arr.List
        var productArray = new Array();
        if (list.length > 0) {//有数据
          for (var i = 0; i < list.length; i++) {
            productArray[i] = { "name": list[i].ProductName, "dec": list[i].ProductDetail, "price": list[i].ProductPrice, "src": list[i].MainImgUrl,"Pid": list[i].ProductId }
          }
        }
        that.setData({ productList: productArray });
      }
    })
  },
  showp(event) {
    var param = event.currentTarget.dataset.id
    wx.navigateTo({      
      url: '/pages/productDetail/productDetail?productid=' + param
    })
  },
})
