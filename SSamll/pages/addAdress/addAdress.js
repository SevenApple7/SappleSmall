var myMethod = require('../../utils/common.js');
Page({
  data: {
    region: ['北京市', '北京市', '海淀区'],
    customItem: '全部',
    AddrID: '',
    Addrdetil: '',
    PerName: '',
    PerMobile: '',
    StateId: '',
    PageState: 1,//1添加，2编辑
    callback: ''
  },
  onLoad: function (options) {//options.str=1：添加，options.str={原收货地址}：编辑
    this.data.callback = decodeURIComponent(options.callback)
    var PArray = JSON.parse(options.str)
    if (PArray != 1) {
      this.setData({//编辑形态
        PageState: 2,
        StateId: PArray.StateId,
        AddrID: PArray.AddrID,
        Addrdetil: PArray.Addrdetil,
        PerMobile: PArray.PerMobile,
        PerName: PArray.PerName,
        region: [PArray.Province, PArray.City, PArray.Area]
      })
    } else {//添加形态
      this.setData({
        PageState: 1
      })
    }
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  getPerName: function (e) {
    this.setData({
      PerName: e.detail.value
    })
  },
  getPerMobile: function (e) {
    this.setData({
      PerMobile: e.detail.value
    })
  },
  getAddrdetil: function (e) {
    this.setData({
      Addrdetil: e.detail.value
    })
  },
  saveAdr(event) {
    var that = this;
    var place = event.currentTarget.dataset.id
    var arr = { "PerMobile": this.data.PerMobile, "PerName": this.data.PerName, "Province": place[0], "City": place[1], "Area": place[2], "Addrdetil": this.data.Addrdetil, "StateId": 1 }
    var arr2 = { "AddrID": this.data.AddrID, "PerMobile": this.data.PerMobile, "PerName": this.data.PerName, "Province": place[0], "City": place[1], "Area": place[2], "Addrdetil": this.data.Addrdetil, "StateId": this.data.StateId }
    var strJson = JSON.stringify(arr)
    var strJson2 = JSON.stringify(arr2)
    //var a = this.data.Mymobile;
    if (that.data.PageState == 1) {
      that.AddAddress(strJson)
    } else {
      that.EditAddress(strJson2)
    }
  },
  AddAddress: function (strJson) {//添加收货地址
    var that = this;
    wx.showLoading({
      title: '添加收货地址',
    })
    let data = { UserId: wx.getStorageSync("Wuserid"), Json: strJson };
    myMethod.$http('/SevenApple/AddAddress', data,
      function (res) {
        var resData = res.data;
        let arr = JSON.parse(resData);
        if (arr.Result) {
          // wx.showToast({
          //   title: '添加成功！',
          //   icon: 'success',
          //   duration: 2000
          // })
          wx.hideLoading()
          //跳转
          wx.switchTab({
            url: that.data.callback
          })
          wx.redirectTo({
            url: that.data.callback + '&addr=' + strJson
          })
        }
      })
  },
  EditAddress: function (strJson) {//编辑收货地址
    var that = this;
    wx.showLoading({
      title: '保存收货地址',
    })
    let data = { UserId: wx.getStorageSync("Wuserid"), MJson: strJson };
    myMethod.$http('/SevenApple/UpdateAddress', data,
      function (res) {
        var resData = res.data;
        let arr = JSON.parse(resData);
        if (arr.Result) {
          wx.showToast({
            title: '修改成功！',
            icon: 'success',
            duration: 2000
          })
          wx.hideLoading()
          //跳转
          wx.switchTab({
            //url: '/pages/person/person?refresh=1'
            url: that.data.callback
          })
          wx.redirectTo({
            url: that.data.callback + '&addr=' + strJson
          })
        }
      })
  }
})