// pages/queryMaintainPlan/queryMaintainPlan.js
var app=getApp();
var utils=require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    addShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      equipmentId: options.equipmentId
    })
    
    app.checkLogin(this.queryMaintainPlan);
  },
  queryMaintainPlan: function () {
    wx.showLoading({
      title: '加载中',
    })
    var url = app.globalData.domain + '/building_com_weixin/equipmentAccounting/queryMaintainPlan';
    var data = {
      "openidMicroApp": wx.getStorageSync("openId"),
      "unionid": wx.getStorageSync('unionId'),
      "staffId": wx.getStorageSync("staffId"),
      equipmentId: this.data.equipmentId,
      pageNum: this.data.pageNum,
      pageSize: 10
    }
    app.checkLogin(utils.http(url, data, this.listData));
  },
  hidden:function(){
    wx.hideLoading();
  },
  listData: function (data) {
    wx.hideLoading();
    for (var i = 0; i < data.data.length; i++) {
      data.data[i].createTime = data.data[i].createTime.substring(0, 19);
    }  
    if (this.data.list == undefined) {
      if (data.data.length == 0) {
        this.setData({
          nodata: true
        })
        return;
      }

      this.setData({
        list: data.data

      })
    } else {
      if (data.data.length == 0) {
        this.setData({
          nomore: true
        })
        return;
      }
      var list = this.data.list
      list = list.concat(data.data);
      this.setData({
        list: list
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中',
    })
    console.log("触底了，加载下一页");
    this.setData({
      pageNum: this.data.pageNum + 1,
    })
    this.queryMaintainPlan();
    wx.hideLoading();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})