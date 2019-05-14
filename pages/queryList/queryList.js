// pages/queryList/queryList.js
var app = getApp();
var utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.setData({
       projectId: options.projectId,
       projectName:options.projectName
     })
    wx.setNavigationBarTitle({
      title: options.projectName,
    })
  },
  addWorkOrder:function(){
     wx.navigateTo({
       url: '/pages/addWorkOrder/addWorkOrder?projectId=' + this.data.projectId,
     })
  },
  queryList:function(){
    var url = app.globalData.domain + '/building_com_weixin/workOrder/queryList';
    var data = {
      "openidMicroApp": wx.getStorageSync("openId"),
      "unionid": wx.getStorageSync('unionId'),
      "staffId": wx.getStorageSync("staffId"),
      projectId: this.data.projectId,
      pageNum: this.data.pageNum,
      pageSize: 10
    }
    app.checkLogin(utils.http(url, data, this.listData));
  },
  listData: function (data) {
    wx.hideLoading();
    for (var i = 0; i < data.data.length; i++) {
      console.log(typeof (data.data[i].sendtoStaffId));
      try{
        data.data[i].sendtoStaffId = JSON.stringify(data.data[i].sendtoStaffId);
      }catch(e){
        data.data[i].sendtoStaffId =[]
      }
      // if(data.data[i].type==3){
      //   try{
      //     data.data[i].equipmentName = (JSON.parse(data.data[i].content)).equipmentName;
      //   }catch(e){
      //     data.data[i].equipmentName=''
      //   }
        
      // }
    }
    if (this.data.pageNum == 1) {
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


  onShow: function () {
    this.setData({
      pageNum:1,
      list:[],
      nodata:false,
      nomore:false
    })
    app.checkLogin(this.queryList);
  },

  onReachBottom: function () {
    wx.showLoading({
      title: '加载中',
    })
    console.log("触底了，加载下一页");
    this.setData({
      pageNum: this.data.pageNum + 1,
    })
    this.queryList();
    wx.hideLoading();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})