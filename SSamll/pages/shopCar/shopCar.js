//index.js
//获取应用实例
const app = getApp()
var myMethod = require('../../utils/common.js');
Page({
  data: {
    checkBoxImgSrc:"../../img/dui.png",
    hasList: false,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
    selectAllStatus: false,    // 全选状态，默认全选
    shopImg: [],                // 购物车列表
    SPList:[]                   //选中商品列表
  },
  onLoad: function (options) {
    this.onShow();
    this.getTotalPrice();
  },
  onShow() {
    var that = this; 
    let data = { UserId: wx.getStorageSync("Wuserid")};
    myMethod.$http('/SevenApple/GetCartListByUserid', data,
    function (res) {
      // success
      var resData = res.data;
      let arr = JSON.parse(resData);
      if (arr.Result) {
        var list = arr.myList
        var SIArray = new Array();
        var Islist = false;
        if (list.length>0){//有数据
          Islist = true
          for (var i = 0; i < list.length; i++) { 
            SIArray[i] = { 'Cartid': list[i].Cartid, 'id': list[i].ProductId, "name": list[i].ProductName, "dec": list[i].TypeName, "price": list[i].ProductPrice, "src": list[i].MainImgUrl, "num": list[i].CartNum, "selected":false};
          }            
        }
        that.setData({
          hasList: Islist,        // 既然有数据了，那设为true吧              
          shopImg: SIArray
        });
      }
    });
  },
  getTotalPrice() {
    var shopImg = this.data.shopImg;                  // 获取购物车列表
    var SPList = this.data.SPList;
    SPList.splice(0, SPList.length);
    var total = 0;
    console.log(shopImg.length)
    for (var i = 0; i < shopImg.length; i++) {         // 循环列表得到每个数据
      if (shopImg[i].selected) {                   // 判断选中才会计算价格
        total += shopImg[i].num * shopImg[i].price;     // 所有价格加起来
        SPList.push({ "cartid": shopImg[i].Cartid,"num": shopImg[i].num, "price": shopImg[i].price, "Pname": shopImg[i].name, "src": shopImg[i].src});
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      shopImg: shopImg,
      totalPrice: total.toFixed(2)
    });
  },
  selectList(e) {
    var index = e.currentTarget.dataset.index;    // 获取data- 传进来的index
    var shopImg = this.data.shopImg;                    // 获取购物车列表
    var selected = shopImg[index].selected;         // 获取当前商品的选中状态
    shopImg[index].selected = !selected;              // 改变状态
    this.setData({
      shopImg: shopImg
    });
    this.getTotalPrice();                           // 重新获取总价
  },
  selectAll(e) {
    var selectAllStatus = this.data.selectAllStatus;    // 是否全选状态
    selectAllStatus = !selectAllStatus;
    var shopImg = this.data.shopImg;

    for (var i = 0; i < shopImg.length; i++) {
      shopImg[i].selected = selectAllStatus;            // 改变所有商品状态
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      shopImg: shopImg
    });
    this.getTotalPrice();                               // 重新获取总价
  },
  pay(){
    var SPList = this.data.SPList;
    var str = JSON.stringify(SPList)
    wx.navigateTo({
      url: '/pages/PreOrder/PreOrder?p=1&str=' + str
    })
  },
  showp(event) {
    var param = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/productDetail/productDetail?productid=' + param
    })
  },
})