// pages/orderDetail/orderDetail.js
var app=getApp();
var utils=require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dis:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.setData({
       workOrderId: options.workOrderId
     })
    app.checkLogin(this.queryWorkOrderList);
     
  },
  queryWorkOrderList:function(){
    var url = app.globalData.domain +"/building_com_weixin/workOrder/queryWorkOrderList";
    var data={
      "openidMicroApp": wx.getStorageSync("openId"),
      "unionid": wx.getStorageSync('unionId'),
      "staffId": wx.getStorageSync("staffId"),
      acceptWorkOrderStatus:-1,
      workOrderId: this.data.workOrderId,
      date:""
    };
    app.checkLogin(utils.http(url,data,this.result));
    wx.showLoading({
      title: '加载中',
    })

  },
  result:function(data){
    var type='';
    if (data.data[0].type == 1){
      type ="人工派单"
      this.setData({
        content: data.data[0].content,
      })
    } else if (data.data[0].type == 2){
      type = "设备故障"
      this.setData({
        content: data.data[0].content,
      })
    } else{
      type ="定期保养";
      var content = data.data[0].content;
      console.log("content>>"+content);
      try{
        content=JSON.parse(content);
        console.log("content>>" + content);
        console.log("content>>maintainPlanDate>>>" + content.maintainPlanDate);
        var equipmentType1;
        if (content.equipmentType =='QD'){
          console.log("强电");
          equipmentType1 ="强电"
        } else if (content.equipmentType == 'RD'){
          equipmentType1 = "弱电"
        } else if (content.equipmentType == 'KT') {
          equipmentType1 = "空调"
        } else if (content.equipmentType == 'JPS') {
          equipmentType1 = "给排水"
        } else if (content.equipmentType == 'XF') {
          equipmentType1 = "消防"
        } else if (content.equipmentType == 'DT') {
          equipmentType1 = "电梯"
        }else{
          equipmentType1 = "其它"
        }
        this.setData({
          maintainPlanId: content.maintainPlanId,
          maintainPlanDate: content.maintainPlanDate,
          equipmentId: content.equipmentId,
          equipmentType: content.equipmentType,
          equipmentType1: equipmentType1,
          equipmentName: content.equipmentName,
        })      
    }
    catch(e){
       content=[]
    }
  };
    this.setData({
      workOrderId: data.data[0].workOrderId,     
      type1: type,
      type: data.data[0].type,
      handleType: data.data[0].handleType,
      lastHandleTime: data.data[0].lastHandleTime.substring(0, 19),
      acceptWorkOrderStatus: data.data[0].acceptWorkOrderStatus,
      acceptWorkOrderTime: data.data[0].acceptWorkOrderTime.substring(0,19),
      createTime: data.data[0].createTime.substring(0, 19),
    })
 },
  acceptWorkOrder: function () {
    var that=this;
    that.setData({
      dis:true
    })
    var that = this;
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType;
        console.log(networkType);
        if ('none' == networkType || 'unknown' == networkType) {
          wx.showModal({
            title: '提示',
            content: '网络连接不可用，请仔细检查网络设置，稍后再试！',
            confirmText: '知道了',
            showCancel: false,
          })
          that.setData({
            dis: false
          })
          return;
        }
        wx.request({
          url: app.globalData.domain + "/building_com_weixin/workOrder/acceptWorkOrder",
          data: {
            "openidMicroApp": wx.getStorageSync("openId"),
            "unionid": wx.getStorageSync('unionId'),
            "staffId": wx.getStorageSync("staffId"),
            "workOrderId": that.data.workOrderId
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
                wx.showToast({
                  title: '接受成功',
                  success: function (res) {
                    setTimeout(function () {
                      wx.redirectTo({
                        url: '../success/success?message=接受工单成功啦，可前往已接工单查看！',
                      })
                    }, 2000);
                  },
                })
                break;
              case 21400:
                wx.showModal({
                  title: '提示',
                  content: '[21400]系统繁忙，请稍后再试！',
                  showCancel: false,
                  confirmText: '知道了',
                })
                that.setData({
                  dis: false
                })
                break;
                case 21401:
                wx.showModal({
                  title: '提示',
                  content: '[21401]请登录',
                  showCancel: false,
                  confirmText: '知道了',
                })
                that.setData({
                  dis: false
                })
                break;
              case 21403:
                wx.showModal({
                  title: '提示',
                  content: '[21403]您当前没有接受工单的权限！',
                  showCancel: false,
                  confirmText: '知道了',
                })
                that.setData({
                  dis: false
                })
                break;
              case 21408:
                wx.showModal({
                  title: '提示',
                  content: '[21408]工单id错误！',
                  showCancel: false,
                  confirmText: '知道了',
                })
                that.setData({
                  dis: false
                })
                break;
              case 21409:
                wx.showModal({
                  title: '提示',
                  content: '[21409]工单id不存在！',
                  showCancel: false,
                  confirmText: '知道了',
                })
                that.setData({
                  dis: false
                })
                break;
              case 21415:
                wx.showModal({
                  title: '提示',
                  content: '[21415]工单已经被接受了，请勿重新接受工单！',
                  showCancel: false,
                  confirmText: '知道了',
                })
                that.setData({
                  dis: false
                })
                break;
              default:
                wx.showModal({
                  title: '提示',
                  content: '[' + res.data.retCode + ']系统繁忙,请稍后再试！',
                  showCancel: false,
                  confirmText: '知道了',
                })
                that.setData({
                  dis: false
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
              that.setData({
                dis: false
              })
            } else {
              wx.showModal({
                title: '提示',
                content: '[10009]系统繁忙，请稍后再试！',
                confirmText: '知道了',
                showCancel: false,
              })
              that.setData({
                dis: false
              })
            }
          },
          complete: function (res) { },
        })
      }
    });
  },
  addWorkingBack:function(){
    wx.navigateTo({
      url: '/pages/addWorkingBack/addWorkingBack?workOrderId=' + this.data.workOrderId,
    })
  },

  submitMaintainRecord: function () {
    wx.navigateTo({
      url: '/pages/submitMaintainRecord/submitMaintainRecord?workOrderId=' + this.data.workOrderId + '&&maintainPlanId=' + this.data.maintainPlanId + '&&maintainPlanDate=' + this.data.maintainPlanDate + '&&equipmentId=' + this.data.equipmentId + '&&equipmentType=' + this.data.equipmentType + '&&equipmentName=' + this.data.equipmentName,
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})