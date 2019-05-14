// pages/addWorkingBack/addWorkingBack.js
const app = getApp();
var nowDate = new Date();
var year = nowDate.getFullYear();
var month = app.toFormat(nowDate.getMonth() + 1);
var date = app.toFormat(nowDate.getDate());
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: year + '-' + month + '-' + date,
    detailObj:{},
    display:'none',
    feedbackOrderId:5,
    constructTeam:[],
    index:'',
    disabled:false
    // chooseTips:'请选择'
  },

  bindDateChange: function (e) {
    var constructDate = "detailObj.constructDate";
    this.setData({
      [constructDate]: e.detail.value
    })
    console.log("constructDate:" + this.data.detailObj.constructDate);
  },
  bindTeamChange: function (e) {
    var that = this;
    console.log(e);
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      chooseTips: ''
    })
    var constructTeam = "detailObj.constructTeam";
    var teamData = that.data.constructTeam[that.data.index]
    console.log("teamData:"+teamData);
    this.setData({
      [constructTeam]: teamData
    });
    console.log("constructTeam:" + this.data.detailObj.constructTeam);
  },
  wellNoInput: function (e) {
    var wellNo = "detailObj.wellNo";
    this.setData({
      [wellNo]: e.detail.value
    })
  },
  wellTypeInput: function (e) {
    var wellType = "detailObj.wellType";
    this.setData({
      [wellType]: e.detail.value
    })
  },
  oilExtractionCompanyInput: function (e) {
    var oilExtractionCompany = "detailObj.oilExtractionCompany";
    this.setData({
      [oilExtractionCompany]: e.detail.value
    })
  },
  perforatedIntervalInput: function (e) {
    var perforatedInterval = "detailObj.perforatedInterval";
    this.setData({
      [perforatedInterval]: e.detail.value
    })
  },
  fracturingTechniqueInput: function (e) {
    var fracturingTechnique = "detailObj.fracturingTechnique";
    this.setData({
      [fracturingTechnique]: e.detail.value
    })
  },
  constructDisplacementInput: function (e) {
    var constructDisplacement = "detailObj.constructDisplacement";
    this.setData({
      [constructDisplacement]: e.detail.value
    })
  },
  oilPressureInput: function (e) {
    var oilPressure = "detailObj.oilPressure";
    this.setData({
      [oilPressure]: e.detail.value
    })
  },
  casingPressureInput: function (e) {
    var casingPressure = "detailObj.casingPressure";
    this.setData({
      [casingPressure]: e.detail.value
    })
  },
  slickwaterAmountInput: function (e) {
    var slickwaterAmount = "detailObj.slickwaterAmount";
    this.setData({
      [slickwaterAmount]: e.detail.value
    })
  },
  gelAmountInput: function (e) {
    var gelAmount = "detailObj.gelAmount";
    this.setData({
      [gelAmount]: e.detail.value
    })
  },
  ceramsiteAmount1Input: function (e) {
    var ceramsiteAmount1 = "detailObj.ceramsiteAmount1";
    this.setData({
      [ceramsiteAmount1]: e.detail.value
    })
  },
  ceramsiteAmount2Input: function (e) {
    var ceramsiteAmount2 = "detailObj.ceramsiteAmount2";
    this.setData({
      [ceramsiteAmount2]: e.detail.value
    })
  },
  ceramsiteAmount3Input: function (e) {
    var ceramsiteAmount3 = "detailObj.ceramsiteAmount3";
    this.setData({
      [ceramsiteAmount3]: e.detail.value
    })
  },
  ceramsiteAmount4Input: function (e) {
    var ceramsiteAmount4 = "detailObj.ceramsiteAmount4";
    this.setData({
      [ceramsiteAmount4]: e.detail.value
    })
  },
  quartzSandAmount1Input: function (e) {
    var quartzSandAmount1 = "detailObj.quartzSandAmount1";
    this.setData({
      [quartzSandAmount1]: e.detail.value
    })
    console.log("石英砂"+this.data);
  },
  quartzSandAmount2Input: function (e) {
    var quartzSandAmount2 = "detailObj.quartzSandAmount2";
    this.setData({
      [quartzSandAmount2]: e.detail.value
    })
  },
  quartzSandAmount3Input: function (e) {
    var quartzSandAmount3 = "detailObj.quartzSandAmount3";
    this.setData({
      [quartzSandAmount3]: e.detail.value
    })
  },
  quartzSandAmount4Input: function (e) {
    var quartzSandAmount4= "detailObj.quartzSandAmount4";
    this.setData({
      [quartzSandAmount4]: e.detail.value
    })
  },
  stopPumpPressureInput: function (e) {
    var stopPumpPressure = "detailObj.stopPumpPressure";
    this.setData({
      [stopPumpPressure]: e.detail.value
    })
  },
  remarkConfirm: function (e) {
    var remark = "detailObj.remark";
    this.setData({
      [remark]: e.detail.value
    })
    console.log("this.data.detailObj.remark:" + this.data.detailObj.remark);
  },
  remarkInput: function (e) {
    var remarkStr = "detailObj.remark";
    this.setData({
      [remarkStr]: e.detail.value
    })
    console.log("this.data.detailObj.remark:" + this.data.detailObj.remark);
  },
  editFeedback: function () {
    var that = this;   
    var detailData = that.data.detailObj;
    console.log("detail" +detailData);
    console.log(detailData.constructDate);
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
          return;
        }
        if (detailData.constructDate.length == 0) {
          wx.showModal({
            title: '提示',
            content: '请选择施工日期',
            showCancel: false,
            confirmText: '知道了'
          })
          return;
        } else if (detailData.constructTeam.length == 0) {
          wx.showModal({
            title: '提示',
            content: '请选择施工队',
            showCancel: false,
            confirmText: '知道了'
          })
          return;
        } else if (detailData.wellNo.length == 0) {
          wx.showModal({
            title: '提示',
            content: '请填写井号！',
            showCancel: false,
            confirmText: '知道了'
          })
          return;
        } else if (detailData.wellType.length == 0) {
          wx.showModal({
            title: '提示',
            content: '请填写井型！',
            showCancel: false,
            confirmText: '知道了'
          })
          return;
        } else if (detailData.oilExtractionCompany.length == 0) {
          wx.showModal({
            title: '提示',
            content: '请填写所属采油单位！',
            showCancel: false,
            confirmText: '知道了'
          })
          return;
        } else if (detailData.perforatedInterval.length == 0) {
          wx.showModal({
            title: '提示',
            content: '请填写射孔段！',
            showCancel: false,
            confirmText: '知道了'
          })
          return;
        } else if (detailData.fracturingTechnique.length == 0) {
          wx.showModal({
            title: '提示',
            content: '请填写压裂工艺！',
            showCancel: false,
            confirmText: '知道了'
          })
          return;
        } else if (detailData.constructDisplacement.length == 0) {
          wx.showModal({
            title: '提示',
            content: '请填写施工排量！',
            showCancel: false,
            confirmText: '知道了'
          })
          return;
        } else if (detailData.oilPressure.length == 0) {
          wx.showModal({
            title: '提示',
            content: '请填写油压！',
            showCancel: false,
            confirmText: '知道了'
          })
          return;
        } else if (detailData.casingPressure.length == 0) {
          wx.showModal({
            title: '提示',
            content: '请填写套压！',
            showCancel: false,
            confirmText: '知道了'
          })
          return;
        } else if (detailData.slickwaterAmount.length == 0) {
          wx.showModal({
            title: '提示',
            content: '请填写滑溜水量！',
            showCancel: false,
            confirmText: '知道了'
          })
          return;
        } else if (detailData.gelAmount.length == 0) {
          wx.showModal({
            title: '提示',
            content: '请填写冻胶量！',
            showCancel: false,
            confirmText: '知道了'
          })
          return;
        } else if (detailData.ceramsiteAmount1.length == 0) {
          wx.showModal({
            title: '提示',
            content: '请填写20/40陶粒量！',
            showCancel: false,
            confirmText: '知道了'
          })
          return;
        } else if (detailData.ceramsiteAmount2.length == 0) {
          wx.showModal({
            title: '提示',
            content: '请填写30/50陶粒量！',
            showCancel: false,
            confirmText: '知道了'
          })
          return;
        } else if (detailData.ceramsiteAmount3.length == 0) {
          wx.showModal({
            title: '提示',
            content: '请填写40/70陶粒量！',
            showCancel: false,
            confirmText: '知道了'
          })
          return;
        } else if (detailData.ceramsiteAmount4.length == 0) {
          wx.showModal({
            title: '提示',
            content: '请填写 70/140陶粒量！',
            showCancel: false,
            confirmText: '知道了'
          })
          return;
        }else if (detailData.quartzSandAmount1.length == 0) {
          wx.showModal({
            title: '提示',
            content: '请填写20/40石英砂量！',
            showCancel: false,
            confirmText: '知道了'
          })
          return;
        } else if (detailData.quartzSandAmount2.length == 0) {
          wx.showModal({
            title: '提示',
            content: '请填写30/50石英砂量！',
            showCancel: false,
            confirmText: '知道了'
          })
          return;
        } else if (detailData.quartzSandAmount3.length == 0) {
          wx.showModal({
            title: '提示',
            content: '请填写40/70石英砂量！',
            showCancel: false,
            confirmText: '知道了'
          })
          return;
        }
        else if (detailData.quartzSandAmount4.length == 0) {
          wx.showModal({
            title: '提示',
            content: '请填写覆膜砂量！',
            showCancel: false,
            confirmText: '知道了'
          })
          return;
        } else if (detailData.stopPumpPressure.length == 0) {
          wx.showModal({
            title: '提示',
            content: '请填写停泵压力！',
            showCancel: false,
            confirmText: '知道了'
          })
          return;
        } else if (detailData.remark.length == 0) {
          wx.showModal({
            title: '提示',
            content: '请填写备注！',
            showCancel: false,
            confirmText: '知道了'
          })
          return;
        }
        that.setData({
          disabled:true
        })
        wx.request({
          url: app.globalData.domain + '/building_com_weixin/feedback/editFeedback',
          data: {
            "openidMicroApp": wx.getStorageSync("openId"),
            "unionid": wx.getStorageSync('unionId'),
            "staffId": wx.getStorageSync("staffId"),
            "feedbackOrderId": that.data.detailObj.feedbackOrderId,
            "constructDate": that.data.detailObj.constructDate,
            "constructTeam": that.data.detailObj.constructTeam,
            "wellNo": that.data.detailObj.wellNo,
            "wellType": that.data.detailObj.wellType,
            "oilExtractionCompany": that.data.detailObj.oilExtractionCompany,
            "perforatedInterval": that.data.detailObj.perforatedInterval,
            "fracturingTechnique": that.data.detailObj.fracturingTechnique,
            "constructDisplacement": that.data.detailObj.constructDisplacement,
            "oilPressure": that.data.detailObj.oilPressure,
            "casingPressure": that.data.detailObj.casingPressure,
            "slickwaterAmount": that.data.detailObj.slickwaterAmount,
            "gelAmount": that.data.detailObj.gelAmount,
            "ceramsiteAmount1": that.data.detailObj.ceramsiteAmount1,
            "ceramsiteAmount2": that.data.detailObj.ceramsiteAmount2,
            "ceramsiteAmount3": that.data.detailObj.ceramsiteAmount3,
            "ceramsiteAmount4": that.data.detailObj.ceramsiteAmount4,
            "quartzSandAmount1": that.data.detailObj.quartzSandAmount1,
            "quartzSandAmount2": that.data.detailObj.quartzSandAmount2,
            "quartzSandAmount3": that.data.detailObj.quartzSandAmount3,
            "quartzSandAmount4": that.data.detailObj.quartzSandAmount4,
            "stopPumpPressure": that.data.detailObj.stopPumpPressure,
            "remark": that.data.detailObj.remark,
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
                  title: '修改成功',
                  success: function (res) {
                    setTimeout(function () {
                      wx.navigateBack({
                        delta: 1,
                      });
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
                  disabled: false
                })
                break;
              case 21403:
                wx.showModal({
                  title: '提示',
                  content: '[21403]没有删除反馈单详情权限！',
                  showCancel: false,
                  confirmText: '知道了',
                })
                that.setData({
                  disabled: false
                })
                break;
              case 20216:
                wx.showModal({
                  title: '提示',
                  content: '[20216]反馈单号错误',
                  showCancel: false,
                  confirmText: '知道了',
                })
                that.setData({
                  disabled: false
                })
                break;
              case 20217:
                wx.showModal({
                  title: '提示',
                  content: '[20217]反馈单号不存在',
                  showCancel: false,
                  confirmText: '知道了',
                })
                that.setData({
                  disabled: false
                })
                break;
              default:
                wx.showModal({
                  title: '提示',
                  content: '[' + res.data.retCode + ']系统繁忙,请稍后再试！',
                  showCancel: false,
                  confirmText: '知道了',

                });
                that.setData({
                  disabled: false
                })
                break;
            }
          },
          fail: function (res) {
            that.setData({
              disabled: false
            })
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
                content: '[10014]系统繁忙，请稍后再试！',
                confirmText: '知道了',
                showCancel: false,
              })
            }
          },
          complete: function (res) { },
        })
      }
    });
  },
  queryFeedbackDetail: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: app.globalData.domain + "/building_com_weixin/feedback/queryFeedbackDetail",
      data: {
        "openidMicroApp": wx.getStorageSync("openId"),
        "unionid": wx.getStorageSync('unionId'),
        "staffId": wx.getStorageSync("staffId"),
        "feedbackOrderId": that.data.feedbackOrderId
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
            if (null != res.data.data && undefined != res.data.data) {
              var dataObj = res.data.data;
              var detail = { "workOrderId": dataObj.workOrderId, "feedbackOrderId": dataObj.feedbackOrderId, "constructDate": dataObj.constructDate, "constructTeam": dataObj.constructTeam, "wellNo": dataObj.wellNo, "oilExtractionCompany": dataObj.oilExtractionCompany, "wellType": dataObj.wellType, "perforatedInterval": dataObj.perforatedInterval, "fracturingTechnique": dataObj.fracturingTechnique, "constructDisplacement": dataObj.constructDisplacement, "oilPressure": dataObj.oilPressure, "casingPressure": dataObj.casingPressure, "slickwaterAmount": dataObj.slickwaterAmount, "gelAmount": dataObj.gelAmount, "ceramsiteAmount1": dataObj.ceramsiteAmount1, "ceramsiteAmount2": dataObj.ceramsiteAmount2, "ceramsiteAmount3": dataObj.ceramsiteAmount3, "ceramsiteAmount4": dataObj.ceramsiteAmount4, "quartzSandAmount1": dataObj.quartzSandAmount1, "quartzSandAmount2": dataObj.quartzSandAmount2, "quartzSandAmount3": dataObj.quartzSandAmount3, "quartzSandAmount4": dataObj.quartzSandAmount4, "stopPumpPressure": dataObj.stopPumpPressure, "remark": dataObj.remark }
              that.setData({
                detailObj: detail,
                display: 'block'
              });
            }
            console.log(that.data.detailObj);
            that.queryConstructTeam();
            break;
          case 21400:
            wx.showModal({
              title: '提示',
              content: '[21400]系统繁忙，请稍后再试！',
              showCancel: false,
              confirmText: '知道了',
            })
            break;
          case 21403:
            wx.showModal({
              title: '提示',
              content: '[21403]没有查看反馈单详情权限！',
              showCancel: false,
              confirmText: '知道了',
            })
            break;
          case 20216:
            wx.showModal({
              title: '提示',
              content: '[20216]反馈单号错误',
              showCancel: false,
              confirmText: '知道了',
            })
            break;
          case 20217:
            wx.showModal({
              title: '提示',
              content: '[20217]反馈单号不存在',
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
            content: '[10012]系统繁忙，请稍后再试！',
            confirmText: '知道了',
            showCancel: false,
          })
        }
      },
      complete: function (res) {
        wx.hideLoading();
      },
    })
  },
  queryConstructTeam: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + "/building_com_weixin/constructTeam/queryConstructTeamList",
      data: {
        "openidMicroApp": wx.getStorageSync("openId"),
        "unionid": wx.getStorageSync('unionId'),
        "staffId": wx.getStorageSync("staffId"),
        "pageNum": 1,
        "pageSize": 100
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
            if (res.data.data.length == 0) {

            } else {
              var teamArry = [];
              for (var i = 0; i < res.data.data.length; i++) {
                teamArry.push(res.data.data[i].constructTeamName);
              }

              that.setData({
                constructTeam: teamArry
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
            content: '[10016]系统繁忙，请稍后再试！',
            confirmText: '知道了',
            showCancel: false,
          })
        }
      },
      complete: function (res) { },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("options.feedbackOrderId=" + options.feedbackOrderId);
    if (undefined != options.feedbackOrderId && null != options.feedbackOrderId && '' != options.feedbackOrderId) {
      that.setData({
        feedbackOrderId: decodeURI(options.feedbackOrderId)
        
      });
    }
    app.checkLogin(that.queryFeedbackDetail);
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
})