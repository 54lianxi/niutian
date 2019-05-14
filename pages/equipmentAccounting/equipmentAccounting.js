// pages/equipmentAccounting/equipmentAccounting.js
var app=getApp();
var utils=require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    equipmentType1: ["全部","强电", "弱电", "空调", "给排水", "消防", "电梯","其它"],
    equipmentType: ["","QD", "RD", "KT", "JPS", "XF", "DT" , "QT" , ],
    type:"全部",
    equipmentNameInput:'',
    typeIndex:0,
    pageNum:1,
    nomore:false,
    nodata:false,
    equipmentName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      projectId: options.projectId,
      projectName: options.projectName
    })
   wx.setNavigationBarTitle({
     title: options.projectName,
   })
    
  },
  submitAccounting:function(){
     wx.navigateTo({
       url: '/pages/submitAccounting/submitAccounting?projectId=' + this.data.projectId + '&projectName=' + this.data.projectName,
     })
  },
  search:function(){
    this.setData({
      pageNum: 1,
      nomore: false,
      nodata: false,
      list: null,
    })
    app.checkLogin(this.queryList);
    
  },
  queryList:function(){
    wx.showLoading({
      title: '加载中',
    })
    console.log(this.data.typeIndex);
    console.log(this.data.equipmentType);
    var url = app.globalData.domain +'/building_com_weixin/equipmentAccounting/queryList'; 
    var data={
      "openidMicroApp": wx.getStorageSync("openId"),
      "unionid": wx.getStorageSync('unionId'),
      "staffId": wx.getStorageSync("staffId"),
      projectId: this.data.projectId,
      equipmentType: this.data.equipmentType[this.data.typeIndex],
      equipmentName: this.data.equipmentName,
      pageNum: this.data.pageNum,
      pageSize:10
    }
    app.checkLogin(utils.http(url,data,this.listData));
  },
  equipmentNameInput:function(e){
     this.setData({
       equipmentName:e.detail.value
     })
  },
  change:function(options){
    var index=options.detail.value;
    this.setData({
      type: this.data.equipmentType1[index],
      typeIndex:index
    })
    console.log(index);
  },
  listData:function(data){
    wx.hideLoading();
    // for (var i = 0; i < data.data.length; i++) {
    //   data.data[i].createTime = data.data[i].createTime.substring(0, 19);
    //   data.data[i].replyTime = data.data[i].replyTime.substring(0, 19);
    // }
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
      typeIndex: 0,
      type: "全部",
      pageNum: 1,
      nomore: false,
      nodata: false,
      pageNum: 1,
      equipmentName: ''
    })
    app.checkLogin(this.queryList);
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
    this.queryList();
    wx.hideLoading();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})