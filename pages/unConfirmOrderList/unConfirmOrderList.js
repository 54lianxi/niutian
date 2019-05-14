// pages/unConfirmOrderList/unConfirmOrderList.js
var utils=require("../../utils/util.js");
const app = getApp();
var nowDate = new Date();
var year = nowDate.getFullYear();
var month = app.toFormat(nowDate.getMonth() + 1);
var day = app.toFormat(nowDate.getDate());
var today = year+"-"+month+"-"+day;
var loadingFlag = false;
var histroyLoadingFlag = false;
Page({ 

  /**
   * 页面的初始数据
   */
  data: {
    TodayUnAcceptTabBack:"#cc0001",
    TodayUnAcceptColor:'white',
    TodayUnAcceptDisplay:'none',
    historyUnAcceptTabBack:'white',
    historyUnAcceptColor:"#555",
    historyUnAcceptDisplay:'none',
    pageNum:0,
    pageSize:10,
    scrollHeight:0,
    hidecomplete: true,
    orderList: [], //今日未接
    histroyOrderList:[],  //历史已接
    count1:0,
    count2: 0,
    lastTime:0,
    todayTime:0,
    historyTime:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        // console.log("窗口高度：" + res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    }); 
  },
  acceptWorkOrder: function (e) {
    var time = e.target.dataset.time;
    var workOrderId=e.target.dataset.workorderid;
    var index=e.target.dataset.index;
    var dis = 'orderList['+index+'].dis';
    var dis2 = 'histroyOrderList[' + index + '].dis';
    if(time=="today"){
      this.setData({
        [dis]:true
      })
    }else{
      this.setData({
        [dis2]: true
      })
    }
    var that = this;
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType;
        // console.log(networkType);
        if ('none' == networkType || 'unknown' == networkType) {
          wx.showModal({
            title: '提示',
            content: '网络连接不可用，请仔细检查网络设置，稍后再试！',
            confirmText: '知道了',
            showCancel: false,
          })
          if (time == "today") {
            this.setData({
              [dis]: false
            })
          } else {
            this.setData({
              [dis2]: false
            })
          }
          return;
        }
        wx.request({
          url: app.globalData.domain + "/building_com_weixin/workOrder/acceptWorkOrder",
          data: {
            "openidMicroApp": wx.getStorageSync("openId"),
            "unionid": wx.getStorageSync('unionId'),
            "staffId": wx.getStorageSync("staffId"),
            "workOrderId": workOrderId
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
                if (time == "today") {
                  this.setData({
                    [dis]: false
                  })
                } else {
                  this.setData({
                    [dis2]: false
                  })
                }
                break;
                case 21401:
                wx.showModal({
                  title: '提示',
                  content: '[21401]请登录！',
                  showCancel: false,
                  confirmText: '知道了',
                })
                if (time == "today") {
                  this.setData({
                    [dis]: false
                  })
                } else {
                  this.setData({
                    [dis2]: false
                  })
                }
                break;
              case 21403:
                wx.showModal({
                  title: '提示',
                  content: '[21403]您当前没有接受工单的权限！',
                  showCancel: false,
                  confirmText: '知道了',
                })
                if (time == "today") {
                  this.setData({
                    [dis]: false
                  })
                } else {
                  this.setData({
                    [dis2]: false
                  })
                }
                break;
              case 21408:
                wx.showModal({
                  title: '提示',
                  content: '[21408]工单id错误！',
                  showCancel: false,
                  confirmText: '知道了',
                })
                if (time == "today") {
                  this.setData({
                    [dis]: false
                  })
                } else {
                  this.setData({
                    [dis2]: false
                  })
                }
                break;
              case 21409:
                wx.showModal({
                  title: '提示',
                  content: '[21409]工单id不存在！',
                  showCancel: false,
                  confirmText: '知道了',
                })
                if (time == "today") {
                  this.setData({
                    [dis]: false
                  })
                } else {
                  this.setData({
                    [dis2]: false
                  })
                }
                break;
              case 21415:
                wx.showModal({
                  title: '提示',
                  content: '[21415]工单已经被接受了，请勿重新接受工单！',
                  showCancel: false,
                  confirmText: '知道了',
                })
                if (time == "today") {
                  this.setData({
                    [dis]: false
                  })
                } else {
                  this.setData({
                    [dis2]: false
                  })
                }
                break;
              default:
                wx.showModal({
                  title: '提示',
                  content: '[' + res.data.retCode + ']系统繁忙,请稍后再试！',
                  showCancel: false,
                  confirmText: '知道了',
                })
                if (time == "today") {
                  this.setData({
                    [dis]: false
                  })
                } else {
                  this.setData({
                    [dis2]: false
                  })
                }
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
              if (time == "today") {
                this.setData({
                  [dis]: false
                })
              } else {
                this.setData({
                  [dis2]: false
                })
              }
            } else {
              wx.showModal({
                title: '提示',
                content: '[10009]系统繁忙，请稍后再试！',
                confirmText: '知道了',
                showCancel: false,
              })
              if (time == "today") {
                this.setData({
                  [dis]: false
                })
              } else {
                this.setData({
                  [dis2]: false
                })
              }
            }
          },
          complete: function (res) { },
        })
      }
    });
  },
  loadMore:function() {
    var that = this;
    // console.log("当前页："+that.data.pageNum);
    // console.log("没有更多的隐藏状态:" + that.data.hidecomplete);
    if (true == that.data.hidecomplete) {
      if (that.data.TodayUnAcceptTabBack == "#cc0001" && that.data.TodayUnAcceptColor == "white") {
        if (true == loadingFlag) {
          return;
        }
        app.checkLogin(that.queryWorkOrderList);
      }
      if (that.data.historyUnAcceptTabBack == "#cc0001" && that.data.historyUnAcceptColor == "white") {
        if (true == histroyLoadingFlag) {
          return;
        }
        app.checkLogin(that.queryHistroyOrderList);
      }

    }
  },
  // scroll:function(e) {
  //   console.log(e);
  // },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    app.checkLogin(that.queryWorkOrderList);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this;
    that.setData({
      TodayUnAcceptTabBack: "#cc0001",
      TodayUnAcceptColor: 'white',
      TodayUnAcceptDisplay: 'none',
      historyUnAcceptTabBack: 'white',
      historyUnAcceptColor: "#555",
      historyUnAcceptDisplay: 'none',
      pageNum: 0,
      pageSize: 10,
      hidecomplete: true,
      orderList: [],
      histroyOrderList:[],
    })
  },
  
  queryWorkOrderList:function() {  
    var that = this;
    wx.showLoading({
      title: '加载中',
      success:function() {
        loadingFlag = true;
      }
    });
    // console.log("缓存中的staffId=" + wx.getStorageSync('staffId'));
    wx.request({
      url: app.globalData.domain + '/building_com_weixin/workOrder/queryWorkOrderList',
      data: {
        "openidMicroApp": wx.getStorageSync("openId"),
        "unionid": wx.getStorageSync('unionId'),
        "staffId": wx.getStorageSync('staffId'),
        "acceptWorkOrderStatus":0,
        "pageNum":that.data.pageNum+1,
        "pageSize":that.data.pageSize,
        "date": today
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        wx.hideLoading();
        switch(res.data.retCode) {
          case 0:
            that.data.pageNum = that.data.pageNum + 1;
            if (0 == res.data.data.length) {
              that.setData({
                hidecomplete: false, //显示没有更多
                TodayUnAcceptDisplay:'block'
              });
            } else {
              var list = that.data.orderList;
              var listObj;
              for (var i = 0; i < res.data.data.length; i++) {
                if (res.data.data[i].type==3){
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
                    // this.setData({
                    //   maintainPlanId: content.maintainPlanId,
                    //   maintainPlanDate: content.maintainPlanDate,
                    //   equipmentId: content.equipmentId,
                    //   equipmentType: equipmentType1,
                    //   equipmentName: content.equipmentName,
                    // })
                    listObj = {
                      "workOrderId": res.data.data[i].workOrderId,
                      "type": res.data.data[i].type,
                      "maintainPlanId": content.maintainPlanId,
                      "maintainPlanDate": content.maintainPlanDate,
                      "equipmentId": content.equipmentId,
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
                }else{
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
                
                list.push(listObj);
              }
              that.setData({
                orderList:list,
                TodayUnAcceptDisplay: 'block'
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
          case 20408:
            wx.showModal({
              title: '提示',
              content: '[20408]工单ID错误!',
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
            content: '[10005]系统繁忙，请稍后再试！',
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
  queryHistroyOrderList: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
      success: function () {
        histroyLoadingFlag = true;
      }
    });
    console.log("缓存中的staffId=" + wx.getStorageSync('staffId'));
    wx.request({
      url: app.globalData.domain + '/building_com_weixin/workOrder/queryWorkOrderList',
      data: {
        "openidMicroApp": wx.getStorageSync("openId"),
        "unionid": wx.getStorageSync('unionId'),
        "staffId": wx.getStorageSync('staffId'),
        "acceptWorkOrderStatus": 0,
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
                historyUnAcceptDisplay: 'block'
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
                //  listObj = {
                //    "type": res.data.data[i].type, "content": res.data.data[i].content, "handleType": res.data.data[i].handleType, "acceptWorkOrderTime": res.data.data[i].acceptWorkOrderTime.substr(0, 19),
                //    "lastHandleTime": res.data.data[i].lastHandleTime.substr(0, 19),
                //    "workOrderId": res.data.data[i].workOrderId,
                //    "createTime": res.data.data[i].createTime.substring(0, 19),
                //    "dis":false
                //   };
                histroyList.push(listObj);
              }
              that.setData({
                histroyOrderList: histroyList,
                historyUnAcceptDisplay: 'block'
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
          case 20408:
            wx.showModal({
              title: '提示',
              content: '[20408]工单ID错误!',
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

  TodayUnAccept:function() {
     var currentTime=new Date().getTime();
     if (this.data.count1 == 0) {
       this.data.todayTime = currentTime;
       this.data.count1++;
       this.a();
     } else {
       // currentTime = new Date().getTime();
       if (currentTime - this.data.todaytime < 1000) {
       } else {
         this.a();
       }
       this.data.todaytime = currentTime;
     }
  },

  a:function(){
    var that=this;
    that.setData({
      TodayUnAcceptTabBack: "#cc0001",
      TodayUnAcceptColor: 'white',
      historyUnAcceptTabBack: 'white',
      historyUnAcceptColor: "#555",
      historyUnAcceptDisplay: 'none',
      pageNum: 0,
      orderList: [],
      hidecomplete: true,
    });
    app.checkLogin(that.queryWorkOrderList);
  },
  historyUnAccept:function() {
    var currentTime = new Date().getTime();
    if (this.data.count2 == 0) {
      this.data.historyTime = currentTime;
      this.data.count2++;
      this.b();
    } else {
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
      TodayUnAcceptTabBack: "white",
      TodayUnAcceptColor: '#555',
      TodayUnAcceptDisplay: 'none',
      historyUnAcceptTabBack: '#cc0001',
      historyUnAcceptColor: "white",
      pageNum: 0,
      histroyOrderList: [],
      hidecomplete: true,
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