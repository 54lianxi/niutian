// pages/queryProjectList/queryProjectList.js
var app = getApp();
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    list: -1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLogin(this.queryProjectList);
  },
  hidden: function () {
    wx.hideLoading();
  },
  queryProjectList: function () {
    wx.showLoading({
      title: '加载中',
    })
    var url = app.globalData.domain + '/building_com_weixin/project/queryProjectList';
    var data = {
      "openidMicroApp": wx.getStorageSync("openId"),
      "unionid": wx.getStorageSync('unionId'),
      "staffId": wx.getStorageSync("staffId"),
      pageNum: this.data.pageNum,
      pageSize: 10
    }
    app.checkLogin(utils.http(url, data, this.ProjectList, this.hidden));
  },
  ProjectList: function (data) {
    wx.hideLoading();
    if (this.data.list == -1) {
      if (data.data.length == 0) {
        this.setData({
          nodata: true
        })
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
  onPullDownRefresh: function () {
    this.setData({
      pageNum: 1,
      list: -1,
      nodata: false,
      nomore: false
    })
    app.checkLogin(this.queryProjectList);
    wx.stopPullDownRefresh();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },



  onReachBottom: function () {
    wx.showLoading({
      title: '加载中',
    })
    console.log("触底了，加载下一页");
    this.setData({
      pageNum: this.data.pageNum + 1,
    })
    this.queryProjectList();
    wx.hideLoading();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})