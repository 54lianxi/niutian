//index.js
//获取应用实例
const app = getApp();
var utils=require('../../utils/util.js');
var onLoadFlag = false;
Page({
  data: {
    userInfo: null,
    display:'none',
    unacceptWorkOrderNum:0,
    menuList: [
      { "title": "未接工单", "image": '../image/unAccept.jpg', "action": "notConfirmOrder" },
      // { "title": "正在施工单", "image": '../image/hasAccepted.jpg', "action": "nowWorkingOrder" },
      { "title": "已接工单", "image": '../image/hasAccepted.jpg', "action": "hasAcceptedOrder" },
      { "title": "查看台帐", "image": '../image/taizhang.png', "action": "queryProjectList" },
      
      ]

  },
  onLoad: function () {
    console.log("进入了前台page onLoad.....");
    onLoadFlag = true;
    var that = this;
  },
  onShow:function() {
    this.setData({
      addShow:false
    })
    console.log("onshow");
    var that = this;
    if(app.globalData.userInfo==null){
      app.checkLogin(app.getUserInfo, that.queryUnacceptWorkOrderNum, that);
    }else{
      app.checkLogin(that.queryUnacceptWorkOrderNum);
      that.setData({
        nickName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl
      })
    }
  },
  login:function(){
    var url = app.globalData.domain +'/building_com_weixin/user/login';
    var data={
      unionid: wx.getStorageSync("unionId"),
      openidMicroApp:wx.getStorageSync("openId")
    }
    app.checkLogin(utils.http(url,data,this.result));
  },
  result:function(data){
    // var b = this.data.menuList;
    if (data.role==1){
      // var a = { "title": "增加工单", "image": '../image/add.png', "action": "queryProjectList2" };
      // b.push(a);
      this.setData({
        addShow:true
      })
    }
  },
  onHide:function() {
    onLoadFlag = false;
  },
  queryProjectList:function(){
     wx.navigateTo({
       url: '/pages/queryProjectList/queryProjectList',
     })
  },
  queryProjectList2: function () {
    wx.navigateTo({
      url: '/pages/queryProjectList2/queryProjectList2',
    })
  },
  nowWorkingOrder:function() {
    wx.navigateTo({
      url: '../workingOrderList/workingOrderList',
    })
  },
  notConfirmOrder:function() {
    wx.navigateTo({
      url: '../unConfirmOrderList/unConfirmOrderList',
    })
  },
  hasAcceptedOrder:function() {
    wx.navigateTo({
      url: '../hasAcceptedOrderList/hasAcceptedOrderList',
    })
  },

  queryUnacceptWorkOrderNum:function() {
    app.checkLogin(this.login);
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: app.globalData.domain + '/building_com_weixin/workOrder/queryUnacceptWorkOrderNum',
      data: {
        "openidMicroApp": wx.getStorageSync('openId'),
        "unionid": wx.getStorageSync('unionId'),
        "staffId": wx.getStorageSync('staffId')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        switch(res.data.retCode) {
          case 0:
          that.setData({
            unacceptWorkOrderNum: res.data.unacceptWorkOrderNum,
          })
          break;
          case 21400:
          wx.showModal({
            title: '提示',
            content: '[21400]系统繁忙，请稍后再试！',
            showCancel: false,
            confirmText: '知道了',
          })
          break;
          case 21401:
            wx.showModal({
              title: '提示',
              content: '[21401]请登录！',
              showCancel: false,
              confirmText: '知道了',
            })
            break;
          case 21408:
            wx.showModal({
              title: '提示',
              content: '[21408]工单id错误！',
              showCancel: false,
              confirmText: '知道了',
            })
            break;
          default:
            wx.showModal({
              title: '提示',
              content: '[' + res.data.retCode + ']系统繁忙,请稍后再试！',
              showCancel: false,
              confirmText: '知道了',
            })
            break;
        }
      },
      fail: function(res) {
        var errMsg = res.errMsg;
        console.log(errMsg);
        if (errMsg.indexOf('time') != -1 && errMsg.indexOf('out') != -1) {
          wx.showModal({
            title: '提示',
            content: '网络请求超时，请仔细检查网络设置，稍后再试！',
            confirmText: '知道了',
            showCancel: false,

          })
        } else {
          wx.showModal({
            title: '提示',
            content: '[10011]系统繁忙，请稍后再试！',
            confirmText: '知道了',
            showCancel: false,
          })
        }
      },
      complete: function(res) {
        wx.hideLoading();
      },
    })
  },
 /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      addShow: false
    })
    var that = this;
    app.checkLogin(app.getUserInfo, that.queryUnacceptWorkOrderNum, that);
    wx.stopPullDownRefresh();
  },
  onShareAppMessage: function () {
    return {
      title: '石油工业管理',
      path: '/pages/index/index',
      imageUrl: '../image/share.png',
      success: function () {
        console.log("转发成功！");
      }
    }
  },
  onReady:function() {
    
  }
})
