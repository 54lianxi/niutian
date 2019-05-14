//app.js
App({
  onLaunch: function () {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })


    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })

    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    })
 
  },
  onShow:function(options) {
    console.log("进入了前台app onShow.....");
  },
  onHide:function() {
    
  },
  globalData: {
    userInfo: null,
    domain: 'https://iot-building.sichang.com.cn',
    serviceAppSubStatus:'',
    networkType:''
  },

  checkLogin: function (func1, func2,vari) {
    var that = this;
    //测试时清除缓存
    var openId = wx.getStorageSync('openId');
    var unionId = wx.getStorageSync('unionId');

    if (openId) {
      console.log("缓存存在");
      that.checkAttentionStatus(func1, func2, vari);
      return;
    }
    wx.login({     
      success: function (res) {
        console.log("wx.login");
        //调用request请求api转换登录凭证 
        console.log("code:" + res.code);
        if (res.code) {
          wx.request({
            url: that.globalData.domain + '/building_com_weixin/user/queryOpenid',
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
                  console.log("openid为:" + res.data.openid) //获取openid
                  console.log("unionid为:" + res.data.unionid);//unionid
                  var openId = res.data.openid;
                   var unionId = res.data.unionid;
                   wx.setStorageSync('openId', openId);
                  wx.setStorageSync('unionId', unionId);
                  if (openId) {
                    that.checkAttentionStatus(func1, func2,vari)
                  } //如果openId和unionId存在
                  break;
                case 21400:
                  wx.showModal({
                    title: '提示',
                    content: '[21400]系统繁忙，请稍后再试！',
                    showCancel: false,
                    confirmText:'知道了'
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
              console.log("res>>>"+JSON.stringify(res));
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
      }
    })
  },

  getUserInfo: function (func, vari, vari2) {
    console.log("app.getUserInfo");
    var that = this;
    if (that.globalData.userInfo) {
      console.log("已经有用户信息");
      if (undefined != vari) {
        vari.setData({
          avatarUrl: that.globalData.userInfo.avatarUrl,
          nickName: that.globalData.userInfo.nickName,
          province: that.globalData.userInfo.province,
          city: that.globalData.userInfo.city
        });
      }
      if (undefined != func) {
        func(vari);
      }
      return;

    }
    wx.getUserInfo({
      lang: 'zh_CN',
      success: function (res) {
        var info = res.userInfo;
        that.globalData.userInfo = info;
        console.log("用户信息:");
        console.log(res.userInfo);
        if (undefined != vari) {
          vari.setData({
            avatarUrl: that.globalData.userInfo.avatarUrl,
            nickName: that.globalData.userInfo.nickName,
            province: that.globalData.userInfo.province,
            city: that.globalData.userInfo.city
          });
          console.log("主页wxName:" + vari.data.wxName);
          console.log("主页头像:" + vari.data.wxHeadPic);
        }
        if (undefined != func) {
          func(vari);
        }
      },
      fail: function (res) {
        wx.navigateTo({
          url: '/pages/authorization/authorization',
        })


      },
    })
  },
  GetQueryString(src, name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = src.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
  },
  toFormat: function (date) {
    if (date <= 9) {
      return "0" + date;
    } else {
      return date;
    }
  },

  checkAttentionStatus: function (func1,func2,vari) {
    var that = this;
    var staffId=wx.getStorageSync("staffId");
    var accountBindStatus = wx.getStorageSync("accountBindStatus");
    if (staffId && accountBindStatus){
      console.log("staffId存在");
      if (undefined != func1) {
        func1(func2, vari)
      }
      return;

    }
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType;
        that.globalData.networkType = networkType;
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
          wx.request({
            url: that.globalData.domain + "/building_com_weixin/user/login",
            data: {
              "openidMicroApp": wx.getStorageSync("openId"),
              "unionid": wx.getStorageSync('unionId'),
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: function (res) {
              var res1=res;
              switch (res.data.retCode) {
                case 0:
                  var staffId = res.data.staffId;
                  var accountBindStatus = res.data.accountBindStatus;
                  console.log("staffId=" + res.data.staffId); 
                  that.globalData.serviceAppSubStatus = res.data.serviceAppSubStatus;
                  wx.setStorageSync('staffId', staffId);
                  wx.setStorageSync('accountBindStatus', accountBindStatus);
                  if (0 == res.data.serviceAppSubStatus) {
                     wx.showModal({
                      title: '提示',
                      content: '当前您未关注牛田机电公众号，如需收到工单消息，需先关注牛田机电平台',
                      showCancel: false,
                      success: function (res) {

                        if (res.confirm) {
                          console.log('accountBindStatus'+res1.data.accountBindStatus);
                          if (res1.data.accountBindStatus == 0) {
                            wx.showModal({
                              title: '提示',
                              content: '您目前还没有绑定账户，将无法完成接单，确定前往绑定？',
                              showCancel: false,
                              confirmText: '前往',
                              success:function(res){
                                if(res.confirm){
                                  wx.redirectTo({
                                    url: '../nowBindStaff/nowBindStaff',
                                  })
                                  // wx.navigateTo({
                                  //   url: '../nowBindStaff/nowBindStaff',
                                  // })
                                }else{
                                  wx.redirectTo({
                                    url: '/pages/noBind/noBind',
                                  })
                                }
                                }
                              })
                              return;
                            }else{
                            if (undefined != vari) {
                              vari.setData({
                                display: 'block'
                              })
                            }
                            if (undefined != func1) {
                              func1(func2, vari)
                            }
                            }
                           
                            
                        }else{
                          if (res1.data.accountBindStatus == 0) {
                            wx.showModal({
                              title: '提示',
                              content: '您目前还没有绑定账户，将无法完成接单，确定前往绑定？',
                              // showCancel: false,
                              confirmText: '前往',
                              success: function (res) {
                                if (res.confirm) {
                                  wx.redirectTo({
                                    url: '../nowBindStaff/nowBindStaff',
                                  })
                                  // wx.navigateTo({
                                  //   url: '../nowBindStaff/nowBindStaff',
                                  // })
                                }else{
                                  wx.redirectTo({
                                    url: '/pages/noBind/noBind',
                                  })
                                }
                              }
                            })
                            return;
                          }else{
                            if (undefined != vari) {
                              vari.setData({
                                display: 'block'
                              })
                            }
                            if (undefined != func1) {
                              func1(func2, vari)
                            }
                          } 
                        }
                      }
                     })
                     return;
                    // console.log("当前是未关注公众号的状态");
                  }else if (0 == res1.data.accountBindStatus) {
                    console.log("当前是未绑定账号的状态");
                    wx.showModal({
                      title: '提示',
                      content: '您目前还没有绑定账户，将无法完成接单，确定前往绑定？',
                      showCancel: false,
                      confirmText: '前往绑定',
                      success: function (res) {
                        if (res.confirm) {
                          wx.redirectTo({
                            url: '/pages/nowBindStaff/nowBindStaff',
                          })
                          // wx.navigateTo({
                          //   url: '/pages/nowBindStaff/nowBindStaff',
                          // })
                        }else{
                          console.log("else")
                          wx.redirectTo({
                            url: '/pages/noBind/noBind',
                          })
                        }
                      }
                      
                    })
                    return;
                    // wx.redirectTo({
                    //   url: '../authorization/authorization',
                      
                    // })
                    
                  }
                  // if (1 == res.data.accountBindStatus){
                  //   console.log("绑定正常，进入首页");
                  //   wx.redirectTo({
                  //     url: '../index/index',

                  //   })
                  // }
                  console.log("xialaila");
                  if (undefined != vari) {
                    vari.setData({
                      display:'block'
                    })
                  }
                  if (undefined != func1) {
                    func1(func2, vari)
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
                case 21405:
                  wx.showModal({
                    title: '提示',
                    content: '[21405]openid号错误！',
                    showCancel: false,
                    confirmText: '知道了',
                  })
                  break;
                case 21406:
                  wx.showModal({
                    title: '提示',
                    content: '[21406]unionid错误！',
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
                  content: '[10017]系统繁忙，请稍后再试！',
                  confirmText: '知道了',
                  showCancel: false,
                })
              }
            },
            complete: function (res) {
              wx.hideLoading();
            },
          })
        }
      }
    }) //检查网络
  },
})