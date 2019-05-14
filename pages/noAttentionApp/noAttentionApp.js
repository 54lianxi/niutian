// pages/noAttentionApp/noAttentionApp.js
const app = getApp();
var onLoadFlag = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storageUnionId:'',
  },

  onLoad: function (options) {
    console.log("options:------");
    console.log(options);
  },

  onReady: function () {
  
  },
  toIndex:function(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  onShow: function () {
    var that = this;
    console.log("onLoadFlag:"+onLoadFlag);
    if (onLoadFlag == false) {
      that.checkUnionId();
      // console.log("unionId为空");
      // if (that.data.storageUnionId == 'none') {
      //   that.checkUnionId();
      // } else {
      //   console.log("关注状态为0");
      //   that.checkStatus();
      // }
    }
    console.log("未关注公众号页面onshow");
  },
  /**
 * 生命周期函数--监听页面隐藏
 */
  onHide: function () {
    console.log("切换到后台");
    onLoadFlag = false;
    console.log("onLoadFlag:" + onLoadFlag);
  },
  checkUnionId: function () {
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
          });
          return;
        } else {
          wx.showLoading({
            title: '加载中',
          });
          wx.login({
            success: function (res) {
              //调用request请求api转换登录凭证 
              console.log("code:" + res.code);
              if (res.code) {
                wx.request({
                  url: app.globalData.domain + '/building_com_weixin/user/queryOpenid',
                  data: {
                    code: res.code
                  },
                  method: "POST",
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: function (res) {
                    switch (res.data.retCode) {
                      case 0:
                        console.log("未关注公众号页面获取的unionid为:" + res.data.unionid);//unionid
                        var unionId = res.data.unionid;
                        if ("" == res.data.unionid) {
                          return;
                        } else {
                          console.log("noAttenApp");
                          wx.setStorageSync('unionId', unionId);
                          wx.redirectTo({
                            url: '../index/index',
                          })
                        }
                        break;
                      case 21400:
                        wx.showModal({
                          title: '提示',
                          content: '[21400]系统繁忙，请稍后再试！',
                          showCancel: false,
                          confirmText: '知道了'
                        });
                        break;
                      case 21404:
                        wx.showModal({
                          title: '提示',
                          content: '[21404]授权码错误！',
                          showCancel: false,
                          confirmText: '知道了'
                        });
                        break;
                      default:
                        wx.showModal({
                          title: '提示',
                          content: '[' + res.data.retCode + ']系统繁忙，请稍后再试！',
                          showCancel: false,
                          confirmText: '知道了'
                        });
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
                        content: '[10002]系统繁忙，请稍后再试！',
                        confirmText: '知道了',
                        showCancel: false,
                      })
                    }
                  },
                }) //获取openId和union接口
              } //如果登录凭证存在
              else {
                wx.showModal({
                  title: '提示',
                  content: '[10003]系统繁忙，请稍后再试！',
                  showCancel: false,
                });
              }
            },
            fail: function (error) {
              wx.showModal({
                title: '提示',
                content: '[10004]请重新登录！',
                showCancel: false,
                confirmText: '知道了',
              })
            },
            complete: function () {
              wx.hideLoading();
            }
          })
        }
      }
    });
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