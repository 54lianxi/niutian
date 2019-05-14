// pages/nowBindStaff/nowBindStaff.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    mobile: '',
    nameFocus: false,
    mobileFocus: false,
    dis:false,
  },
  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value,
    });
    console.log("userName=" + e.detail.value);
  },
  mobileInput: function (e) {
    this.setData({
      mobile: e.detail.value,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  send:function() {
    var that=this;
    that.setData({
      dis:true
    })
    console.log("缓存里的unionid=" + wx.getStorageSync('unionId'));
    var that = this;
    if (that.data.userName == '') {
      wx.showModal({
        title: '提示',
        content: '请填写真实姓名',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            that.setData({
              nameFocus: true,
            });
          }
        },
      });
      that.setData({
        dis: false
      })
      console.log("that.data.userName=" + that.data.userName);
      return;
    } else if (that.data.mobile == '') {
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            that.setData({
              mobileFocus: true,
            });
          }
        },
      });
      that.setData({
        dis: false
      })
      return;
    } else if (isNaN(that.data.mobile) == true || that.data.mobile.length != 11) {
      that.setData({
        dis: false
      })
      wx.showModal({
        title: '提示',
        content: '填写的手机号码必须是11位的数字，请正确填写！',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            that.setData({
              mobileFocus: true,
            });
          }
        },
      });
      return
    }
    that.handApply();
  },
  handApply:function() {
    var that = this;
    //测试时清除缓存
    var openId = wx.getStorageSync('openId');
    var unionId = wx.getStorageSync('unionId');

    if (openId) {
      console.log("缓存存在");
      that.a();
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
                    that.a();
                  } //如果openId和unionId存在
                  break;
                case 21400:
                  wx.showModal({
                    title: '提示',
                    content: '[21400]系统繁忙，请稍后再试！',
                    showCancel: false,
                    confirmText: '知道了'
                  });
                  that.setData({
                    dis: false
                  })
                  break;
                case 21404:
                  wx.showModal({
                    title: '提示',
                    content: '[21404]授权码错误！',
                    showCancel: false,
                    confirmText: '知道了'
                  });
                  that.setData({
                    dis: false
                  })
                  break;
                default:
                  wx.showModal({
                    title: '提示',
                    content: '[' + res.data.retCode + ']系统繁忙，请稍后再试！',
                    showCancel: false,
                    confirmText: '知道了'
                  });
                  that.setData({
                    dis: false
                  })
                  break;
              }
            },
            fail: function (res) {
              console.log("res>>>" + JSON.stringify(res));
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
                that.setData({
                  dis: false
                })
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
          that.setData({
            dis: false
          })
          wx.showModal({
            title: '提示',
            content: '[10003]系统繁忙，请稍后再试！',
            showCancel: false,
          });
        }
      },
      fail: function (error) {
        that.setData({
          dis: false
        })
        wx.showModal({
          title: '提示',
          content: '[10004]请重新登录！',
          showCancel: false,
          confirmText: '知道了',
        })
      }
    })

  },
  a:function(){
    var that=this;
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType;
        if ('none' == networkType || 'unknown' == networkType) {
          wx.showModal({
            title: '提示',
            content: '网络连接不可用，请仔细检查网络设置，稍后再试！',
            confirmText: '知道了',
            showCancel: false,
          });
          that.setData({
            dis: false
          })
          return;
        }
        wx.request({
          url: app.globalData.domain + "/building_com_weixin/user/bindAccount",
          data: {
            "mobile": that.data.mobile, "name": that.data.userName,
            "wxName": app.globalData.userInfo.nickName,
            "wxHead": app.globalData.userInfo.avatarUrl,
            "openidMicroApp": wx.getStorageSync('openId'),
            "unionid": wx.getStorageSync('unionId')
            // "unionid":'lianxi'
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
                wx.setStorageSync("accountBindStatus", 1);
                wx.showToast({
                  title: '绑定成功',
                  success: function (res) {
                    that.setData({
                      userName: '',
                      mobile: '',
                    });
                    setTimeout(function () {
                      console.log("nowBindstaff");
                      wx.redirectTo({
                        url: '../index/index',
                      })
                    }, 2000)
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
                  content: '[21401]请登录！',
                  showCancel: false,
                  confirmText: '知道了',
                })
                that.setData({
                  dis: false
                })
                break;
              case 21410:
                that.setData({
                  dis: false
                })
                wx.showModal({
                  title: '提示',
                  content: '[21410]填写的姓名错误，请重新填写！',
                  showCancel: false,
                  confirmText: '知道了',
                  success: function (res) {
                    if (res.confirm) {
                      that.setData({
                        nameFocus: true,
                      });
                    }
                  }
                })
                break;
              case 21411:
                that.setData({
                  dis: false
                })
                wx.showModal({
                  title: '提示',
                  content: '[21411]填写的手机号错误，请重新填写！',
                  showCancel: false,
                  confirmText: '知道了',
                  success: function (res) {
                    if (res.confirm) {
                      that.setData({
                        mobileFocus: true,
                      });
                    }
                  }
                })
                break;
              case 21412:
                that.setData({
                  dis: false
                })
                wx.showModal({
                  title: '提示',
                  content: '[21412]所填写的姓名手机号信息不匹配，请仔细核对，重新填写！',
                  showCancel: false,
                  confirmText: '知道了'
                })
                break;
              case 21413:
                that.setData({
                  dis: false
                })
                wx.showModal({
                  title: '提示',
                  content: '[21413]微信头像错误',
                  showCancel: false,
                  confirmText: '知道了'
                })
                break;
              case 21414:
                that.setData({
                  dis: false
                })
                wx.showModal({
                  title: '提示',
                  content: '[21414]微信名错误',
                  showCancel: false,
                  confirmText: '知道了'
                })
                break;
              case 21418:
                that.setData({
                  dis: false
                })
                wx.redirectTo({
                  url: '../noAttentionApp/noAttentionApp',
                })
                break;
              case 21419:
                that.setData({
                  dis: false
                })
                wx.showModal({
                  title: '提示',
                  content: '[21419]帐户已经绑定，请仔细检查所填写的信息！',
                  showCancel: false,
                  confirmText: '知道了',
                })
                break;
              case 21418:
                that.setData({
                  dis: false
                })
                wx.showModal({
                  title: '提示',
                  content: '[21418]宁目前还没有订阅服务号，请前往订阅服务号！',
                  showCancel: false,
                  confirmText: '知道了',
                })
                break;

              default:
                that.setData({
                  dis: false
                })
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
            that.setData({
              dis: false
            })
            var errMsg = res.errMsg;
            console.log(errMsg);
            if (errMsg.indexOf('time') != -1 && errMsg.indexOf('out') != -1) {
              that.setData({
                dis: false
              })
              wx.showModal({
                title: '提示',
                content: '网络请求超时，请仔细检查网络设置，稍后再试！',
                confirmText: '知道了',
                showCancel: false,

              })
            } else {
              that.setData({
                dis: false
              })
              wx.showModal({
                title: '提示',
                content: '[10001]系统繁忙，请稍后再试！',
                confirmText: '知道了',
                showCancel: false,
              })
            }
          },
          complete: function (res) {
            // that.setData({
            //   userName: '',
            //   mobile: '',
            // });
          },
        })
      }
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
    if(app.globalData.userInfo==null){
      app.getUserInfo();
    }
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