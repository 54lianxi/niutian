// pages/workingOrderBackList/workingOrderBackList.js
const app = getApp();
var loadingFlag =false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    display:'none',
    workOrderId: '',
    workOrderName:'',
    pageNum:0,
    pageSize:10,
    scrollHeight: 0,
    hidecomplete: true,
    list: [
      // { "feedbackOrderId": "10000", "workOrderName": "施工单1", "constructDate":"2018-4-4" }
    ],
    addShow:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("options.workOrderId=" + options.workOrderId);
    if(options.a==1){
      this.setData({
        addShow:false
      })
    }
    if (undefined != options.workOrderId && null != options.workOrderId && '' != options.workOrderId) {
      that.setData({
        workOrderId: decodeURI(options.workOrderId) 
      });
    }
    if (undefined != options.workOrderName && null != options.workOrderName && '' != options.workOrderName) {
      that.setData({
        workOrderName: decodeURI(options.workOrderName)
      });
    }
    console.log("workOrderId=" + that.data.workOrderId);
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
  addOrderBack: function () {
    var that = this;
    wx.navigateTo({
      url: '../addWorkingBack/addWorkingBack?workOrderId=' + that.data.workOrderId,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    app.checkLogin(that.queryFeedbackList);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this;
    that.setData({
      display: 'none',
      pageNum: 0,
      pageSize: 10,
      hidecomplete: true,
      list:[]
    });
  },
  loadMore:function() {
    var that = this;
    console.log("当前页：" + that.data.pageNum);
    console.log("当前没有更多的显示状态：" + that.data.hidecomplete);
    if (true == that.data.hidecomplete) {
      if (true == loadingFlag) {
        return;
      }
      app.checkLogin(that.queryFeedbackList);
    }

  },
  queryFeedbackList:function() {
    wx.showLoading({
      title: '加载中',
      success: function(res) {
        loadingFlag = true;
      },
    })
    var that = this;
    wx.request({
      url: app.globalData.domain +'/building_com_weixin/workOrder/queryFeedbackList',
      data: {
        "openidMicroApp": wx.getStorageSync("openId"),
        "unionid": wx.getStorageSync('unionId'),
        "staffId": wx.getStorageSync("staffId"),
        "workOrderId": that.data.workOrderId,
        "pageNum":that.data.pageNum + 1,
        "pageSize":that.data.pageSize
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        wx.hideLoading();
        that.data.pageNum = that.data.pageNum + 1;
        switch (res.data.retCode) {
          case 0:
            if (0 == res.data.data.length) {
              that.setData({
                hidecomplete: false, //显示没有更多
                display: 'block'
              });
            } else {
              var backList = that.data.list;
              for (var i = 0; i < res.data.data.length; i++) {
                var listObj = { "content": res.data.data[i].content, "feedbackOrderId": res.data.data[i].feedbackOrderId, "submitOrderStaffId": res.data.data[i].submitOrderStaffId, "submitOrderStaffName": res.data.data[i].submitOrderStaffName, "submitOrderTime": res.data.data[i].submitOrderTime.substr(0, 19), "picture": res.data.data[i].photo};
                backList.push(listObj);
              }
              that.setData({
                list: backList,
                display: 'block'
              })

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
          case 21408:
            wx.showModal({
              title: '提示',
              content: '[21408]工单id错误！',
              showCancel: false,
              confirmText: '知道了',
            })
            break;
          case 21409:
            wx.showModal({
              title: '提示',
              content: '[21409]工单id不存在！',
              showCancel: false,
              confirmText: '知道了',
            })
            break;
          case 21403:
            wx.showModal({
              title: '提示',
              content: '[21403]您目前没有查看反馈单列表权限',
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
            content: '[10008]系统繁忙，请稍后再试！',
            confirmText: '知道了',
            showCancel: false,
          })
        }
      },
      complete: function(res) {
        wx.hideLoading();
        loadingFlag = false;
      },
    })
  },
 
})