// pages/queryMaintainRecord/queryMaintainRecord.js
var app=getApp();
var utils=require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum:1,
    addShow:false,
    list: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options"+JSON.stringify(options));
    if (options.maintainPlanId) {
      this.setData({
        workOrderId: options.workOrderId,
        maintainPlanId: options.maintainPlanId,
        equipmentId: options.equipmentId,
        maintainPlanDate: options.maintainPlanDate,
        equipmentType: options.equipmentType,
        equipmentName: options.equipmentName,
        addShow: true
      })
    }else{
      this.setData({
        equipmentId: options.equipmentId,
      })
    }
    
    

  },
  queryMaintainRecord:function(){
    wx.showLoading({
      title: '加载中',
    })
    var url = app.globalData.domain + '/building_com_weixin/equipmentAccounting/queryMaintainRecord';
    var data = {
      "openidMicroApp": wx.getStorageSync("openId"),
      "unionid": wx.getStorageSync('unionId'),
      "staffId": wx.getStorageSync("staffId"),
      equipmentId:this.data.equipmentId,
      pageNum: this.data.pageNum,
      pageSize: 10
    }
    app.checkLogin(utils.http(url, data, this.listData,'',this.hidden));
  },
  listData:function(data){
    wx.hideLoading();
    if (this.data.pageNum == 1) {
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
  submitMaintainRecord:function(){
    wx.navigateTo({
      url: '/pages/submitMaintainRecord/submitMaintainRecord?maintainPlanId=' + this.data.maintainPlanId + "&&maintainPlanDate=" + this.data.maintainPlanDate + "&&equipmentId=" + this.data.equipmentId + "&&equipmentType=" + this.data.equipmentType + "&&equipmentName=" + this.data.equipmentName + '&&workOrderId=' + this.data.workOrderId,
    })
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
    this.setData({
      list:[],
      pageNum: 1,
    })
    app.checkLogin(this.queryMaintainRecord);
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
    this.queryMaintainRecord();
    wx.hideLoading();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})