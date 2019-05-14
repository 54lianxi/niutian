// pages/hasAcceptedOrderList/hasAcceptedOrderList.js
const app = getApp();
var utils=require("../../utils/util.js");
var nowDate = new Date();
var year = nowDate.getFullYear();
var month = app.toFormat(nowDate.getMonth() + 1);
var day = app.toFormat(nowDate.getDate());
var today = year + "-" + month + "-" + day;
var loadingFlag = false;
var histroyLoadingFlag = false;
Page({ 

  /**
   * 页面的初始数据
   */
  data: {
    TodayhasAcceptedTabBack: "#cc0001",
    TodayhasAcceptedColor: 'white',
    TodayhasAcceptedDisplay: 'none',
    historyhasAcceptedTabBack: 'white',
    historyhasAcceptedColor: "#555",
    historyhasAcceptedDisplay: 'none',
    pageNum: 0,
    pageSize: 10,
    scrollHeight: 0,
    hidecomplete: true,
    orderList: [],  //今日已接
    histroyOrderList:[], //历史已接
    todayTime:0,
    historyTime:0,
    count1:0,
    count2:0,   
    page: "today"

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log("窗口高度：" + res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    }); 
  },
  loadMore:function() {
    var that = this;
    console.log("当前页：" + that.data.pageNum);
    console.log("没有更多的隐藏状态:" + that.data.hidecomplete);

    if (true == that.data.hidecomplete) {
      if (that.data.TodayhasAcceptedTabBack == "#cc0001" && that.data.TodayhasAcceptedColor == "white") { //当点击今日已接工单时
        if (true == loadingFlag) {
          return;
        }
        console.log("今日已接");
        app.checkLogin(that.queryWorkOrderList);
      }
      if (that.data.historyhasAcceptedTabBack == "#cc0001" && that.data.historyhasAcceptedColor == "white") {  //当点击历史已接工单时
        if (true == histroyLoadingFlag) {
          return;
        }
        console.log("历史已接");
        app.checkLogin(that.queryHistroyOrderList);
      }
    } //当没有更多隐藏时
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    this.setData({
      pageNum: 0,
      pageSize: 10,
      hidecomplete: true,
      orderList: [],  //今日已接
      histroyOrderList: [] //历史已接
    })
    if(this.data.page=="today"){
      app.checkLogin(that.queryWorkOrderList);
    }else{
      app.checkLogin(that.queryHistroyOrderList);
    }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  // onHide: function () {
  //   var that = this;
  //   that.setData({
  //     TodayhasAcceptedTabBack: "#cc0001",
  //     TodayhasAcceptedColor: 'white',
  //     TodayhasAcceptedDisplay: 'none',
  //     historyhasAcceptedTabBack: 'white',
  //     historyhasAcceptedColor: "#555",
  //     historyhasAcceptedDisplay: 'none',
  //     pageNum: 0,
  //     pageSize: 10,
  //     hidecomplete: true,
  //     orderList: [],  //今日已接
  //     histroyOrderList: [] //历史已接
  //   })
  // },
  //查询今日已接
  queryWorkOrderList: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
      success:function() {
        loadingFlag = true;
      }
    })
    wx.request({
      url: app.globalData.domain + '/building_com_weixin/workOrder/queryWorkOrderList',
      data: {
        "openidMicroApp": wx.getStorageSync("openId"),
        "unionid": wx.getStorageSync('unionId'),
        "staffId": wx.getStorageSync("staffId"),
        "acceptWorkOrderStatus": 1,
        "pageNum": that.data.pageNum + 1,
        "pageSize": that.data.pageSize,
        "date": today
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        wx.hideLoading();
        switch (res.data.retCode) {
          case 0:
            that.data.pageNum = that.data.pageNum + 1;
            if (0 == res.data.data.length) {
              that.setData({
                hidecomplete: false, //显示没有更多
                TodayhasAcceptedDisplay: 'block',
              });
            } else {
              var list = that.data.orderList;
              var listObj;
              for (var i = 0; i < res.data.data.length; i++) {
                if (res.data.data[i].type == 3) {
                  try {
                    var content = JSON.parse(res.data.data[i].content);
                    var equipmentType1;
                    if (content.equipmentType == 'QD') {
                      console.log("强电");
                      equipmentType1 = "强电"
                    } else if (content.equipmentType == 'RD') {
                      equipmentType1 = "弱电"
                    } else if (content.equipmentType == 'KT') {
                      equipmentType1 = "空调"
                    } else if (content.equipmentType == 'JPS') {
                      equipmentType1 = "给排水"
                    } else if (content.equipmentType == 'XF') {
                      equipmentType1 = "消防"
                    } else if (content.equipmentType == 'DT') {
                      equipmentType1 = "电梯"
                    } else {
                      equipmentType1 = "其它"
                    }
                    listObj = {
                      "workOrderId": res.data.data[i].workOrderId,
                      "type": res.data.data[i].type,
                      "maintainPlanId": content.maintainPlanId,
                      "maintainPlanDate": content.maintainPlanDate,
                      "equipmentId": content.equipmentId,
                      "equipmentType": content.equipmentType,
                      "equipmentType1": equipmentType1,
                      "equipmentName": content.equipmentName,
                      "handleType": res.data.data[i].handleType,
                      "lastHandleTime": res.data.data[i].lastHandleTime.substring(0, 19), "acceptWorkOrderTime": res.data.data[i].acceptWorkOrderTime.substring(0, 19),
                      "createTime": res.data.data[i].createTime.substring(0, 19),
                      "dis": false
                    }
                  }
                  catch (e) {
                    content = []
                  }
                } else {
                  listObj = {
                    "workOrderId": res.data.data[i].workOrderId,
                    "type": res.data.data[i].type,
                    "content": res.data.data[i].content,
                    "handleType": res.data.data[i].handleType,
                    "lastHandleTime": res.data.data[i].lastHandleTime.substring(0, 19), "acceptWorkOrderTime": res.data.data[i].acceptWorkOrderTime.substring(0, 19),
                    "createTime": res.data.data[i].createTime.substring(0, 19),
                    "dis": false
                  }
                }
                // listObj = { 
                //   "workOrderId": res.data.data[i].workOrderId,
                //   "type": res.data.data[i].type, 
                //   "lastHandleTime": res.data.data[i].lastHandleTime.substr(0,19),
                //   "acceptWorkOrderTime": res.data.data[i].acceptWorkOrderTime.substr(0, 19),
                //   "handleType": res.data.data[i].handleType,
                //   "content": res.data.data[i].content
                // };
                list.push(listObj);
              }
              that.setData({
                orderList: list,
                TodayhasAcceptedDisplay: 'block',
              });
            }
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
          case 21407:
            wx.showModal({
              title: '提示',
              content: '[21407]收单状态错误!',
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
      fail: function (res) {
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
            content: '[10005]系统繁忙，请稍后再试！',
            confirmText: '知道了',
            showCancel: false,
          })
        }
      },
      complete: function (res) {
        wx.hideLoading();
        loadingFlag = false;
      },
    })
  },
  //查询历史已接
  queryHistroyOrderList: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
      success: function () {
        histroyLoadingFlag = true;
      }
    })
    wx.request({
      url: app.globalData.domain + '/building_com_weixin/workOrder/queryWorkOrderList',
      data: {
        "openidMicroApp": wx.getStorageSync("openId"),
        "unionid": wx.getStorageSync('unionId'),
        "staffId": wx.getStorageSync("staffId"),
        "acceptWorkOrderStatus": 1,
        "pageNum": that.data.pageNum + 1,
        "pageSize": that.data.pageSize,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        switch (res.data.retCode) {
          case 0:
            that.data.pageNum = that.data.pageNum + 1;
            if (0 == res.data.data.length) {
              that.setData({
                hidecomplete: false, //显示没有更多
                historyhasAcceptedDisplay: 'block',
              });
            } else {
              var histroyList = that.data.histroyOrderList;
              var listObj;
              for (var i = 0; i < res.data.data.length; i++) {
                if (res.data.data[i].type == 3) {
                  try {
                    var content = JSON.parse(res.data.data[i].content);
                    var equipmentType1;
                    if (content.equipmentType == 'QD') {
                      console.log("强电");
                      equipmentType1 = "强电"
                    } else if (content.equipmentType == 'RD') {
                      equipmentType1 = "弱电"
                    } else if (content.equipmentType == 'KT') {
                      equipmentType1 = "空调"
                    } else if (content.equipmentType == 'JPS') {
                      equipmentType1 = "给排水"
                    } else if (content.equipmentType == 'XF') {
                      equipmentType1 = "消防"
                    } else if (content.equipmentType == 'DT') {
                      equipmentType1 = "电梯"
                    } else {
                      equipmentType1 = "其它"
                    }
                    listObj = {
                      "workOrderId": res.data.data[i].workOrderId,
                      "type": res.data.data[i].type,
                      "maintainPlanId": content.maintainPlanId,
                      "maintainPlanDate": content.maintainPlanDate,
                      "equipmentId": content.equipmentId,
                      "equipmentType1": equipmentType1,
                      "equipmentType": content.equipmentType,
                      "equipmentName": content.equipmentName,
                      "handleType": res.data.data[i].handleType,
                      "lastHandleTime": res.data.data[i].lastHandleTime.substring(0, 19), "acceptWorkOrderTime": res.data.data[i].acceptWorkOrderTime.substring(0, 19),
                      "createTime": res.data.data[i].createTime.substring(0, 19),
                      "dis": false
                    }
                  }
                  catch (e) {
                    content = []
                  }
                } else {
                  listObj = {
                    "workOrderId": res.data.data[i].workOrderId,
                    "type": res.data.data[i].type,
                    "content": res.data.data[i].content,
                    "handleType": res.data.data[i].handleType,
                    "lastHandleTime": res.data.data[i].lastHandleTime.substring(0, 19), "acceptWorkOrderTime": res.data.data[i].acceptWorkOrderTime.substring(0, 19),
                    "createTime": res.data.data[i].createTime.substring(0, 19),
                    "dis": false
                  }
                }
                // listObj = { 
                //   "workOrderId": res.data.data[i].workOrderId,
                //   "type": res.data.data[i].type,
                //   "lastHandleTime": res.data.data[i].lastHandleTime.substr(0, 19),
                //   "acceptWorkOrderTime": res.data.data[i].acceptWorkOrderTime.substr(0, 19),
                //   "handleType": res.data.data[i].handleType,
                //   "content": res.data.data[i].content
                //  };
                histroyList.push(listObj);
              }
              that.setData({
                histroyOrderList: histroyList,
                historyhasAcceptedDisplay: 'block',
              });
            }
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
          case 21407:
            wx.showModal({
              title: '提示',
              content: '[21407]收单状态错误!',
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
      fail: function (res) {
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
            content: '[10005]系统繁忙，请稍后再试！',
            confirmText: '知道了',
            showCancel: false,
          })
        }
      },
      complete: function (res) {
        wx.hideLoading();
        histroyLoadingFlag = false;
      },
    })
  },
  orderDetail: function (e) {
    var workOrderId = e.currentTarget.dataset.workorderid;
    wx.navigateTo({
      url: '../hasAcceptedOrderDetail/hasAcceptedOrderDetail?workOrderId=' + workOrderId,
    })
  },
  feedbackOrder: function (e) {
    var type=e.target.dataset.type;
    var workOrderId = e.target.dataset.workorderid;
    var equipmentId = e.target.dataset.equipmentid;
    console.log("equipmentId" + equipmentId);
    if(type==3){
      console.log("e.target.dataset.maintainplanid"+e.target.dataset.maintainplanid);
      wx.navigateTo({
        url: '../queryMaintainRecord/queryMaintainRecord?&equipmentId=' + equipmentId + '&&workOrderId=' + workOrderId + "&&maintainPlanId=" + e.target.dataset.maintainplanid + '&&maintainPlanDate=' + e.target.dataset.maintainplandate + '&&equipmentType=' + e.target.dataset.equipmenttype + '&&equipmentName=' + e.target.dataset.equipmentname

      })
    }else{
      wx.navigateTo({
        url: '../feedBackOrderList/feedBackOrderList?&workOrderId=' + encodeURI(workOrderId)
      })
    }
    
  },

  TodayhasAccepted:function() {
    this.setData({
      page:"today"
    })
    var currentTime = new Date().getTime();
    if (this.data.count1 == 0) {
      this.data.todayTime = currentTime;
      this.data.count1++;
      this.a();
    } else {
      if (currentTime - this.data.todaytime < 1000) {
      } else {
        this.a();
      }
      this.data.todaytime = currentTime;
    }

  },
  a:function(){
    var that = this;
    that.setData({
      TodayhasAcceptedTabBack: "#cc0001",
      TodayhasAcceptedColor: 'white',
      historyhasAcceptedTabBack: 'white',
      historyhasAcceptedColor: "#555",
      historyhasAcceptedDisplay: 'none',
      pageNum: 0,
      hidecomplete: true,
      orderList: [],  //今日已接
    });
    app.checkLogin(that.queryWorkOrderList);
  },
  historyhasAccepted:function() {
    this.setData({
      page: "history"
    })
    var currentTime = new Date().getTime();
    if (this.data.count1 == 0) {
      this.data.historyTime = currentTime;
      this.data.count1++;
      this.b();
    } else {
      // currentTime = new Date().getTime();
      if (currentTime - this.data.historyTime < 1000) {
      } else {
        this.b();
      }
      this.data.historyTime = currentTime;
    }
  },
  b:function(){
    var that = this;
    that.setData({
      TodayhasAcceptedTabBack: "white",
      TodayhasAcceptedColor: '#555',
      TodayhasAcceptedDisplay: 'none',
      historyhasAcceptedTabBack: '#cc0001',
      historyhasAcceptedColor: "white",
      pageNum: 0,
      hidecomplete: true,
      histroyOrderList: [] //历史已接
    });
    app.checkLogin(that.queryHistroyOrderList);
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})