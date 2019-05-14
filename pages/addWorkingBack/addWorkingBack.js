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
    addShow: true,
    picture: [],
    content:'',
    disabled: false
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.setData({
       workOrderId: options.workOrderId
     })
  },
  contentInput:function(e){
     this.setData({
       content:e.detail.value
     })
  },
  addFeedback: function (e) {
    this.setData({
      disabled:true
    })
    console.log("disabled" + this.data.disabled);
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
            disabled: false
          })
          return;
        }

        if (that.data.content == '' || that.data.content== null) {
          wx.showModal({
            title: '提示',
            content: '请填写反馈内容！',
            showCancel: false,
            confirmText: '知道了',
          })
          that.setData({
            disabled: false
          })
          return;
        }
        wx.request({
          url: app.globalData.domain + '/building_com_weixin/workOrder/submitFeedback',
          data: {
            "openidMicroApp": wx.getStorageSync("openId"),
            "unionid": wx.getStorageSync('unionId'),
            "staffId": wx.getStorageSync("staffId"),
            "workOrderId": that.data.workOrderId,
            "content": that.data.content,
            "photo":JSON.stringify(that.data.picture)
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
                  title: '添加成功',
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
              case 21401:
                wx.showModal({
                  title: '提示',
                  content: '[21401]请登录！',
                  showCancel: false,
                  confirmText: '知道了',
                })
                that.setData({
                  disabled: false
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
                  disabled: false
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
                  disabled: false
                })
                break;
              case 21403:
                wx.showModal({
                  title: '提示',
                  content: '[21403]您目前没有添加该工单的反馈单的权限',
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
                })
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
                content: '[10015]系统繁忙，请稍后再试！',
                confirmText: '知道了',
                showCancel: false,
              })
            }
          },
          
        })
      }
      
    })
  },
  addpic: function () {//点击事件
    wx.showLoading({
      title: '图片上传中',
    })
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log("tempFilePaths" + tempFilePaths);
        that.setData({
          pictrue: tempFilePaths
        })
        wx.uploadFile({
          url: app.globalData.domain + '/building_com_weixin/photo/uploadPhoto',
          filePath: tempFilePaths[0],
          name: "file",
          formData: { "imageFile": tempFilePaths, },
          header: {
            'Content-Type': ' multipart/form-data'
          },
          success: function (res) {
            
            console.log(res);
            var data = JSON.parse(res.data);
            if (data.retCode == 0) {
              var imageUrl = data.url;
              console.log("imageUrl:" + imageUrl);
              var pic = that.data.picture;
              console.log()
              pic.push(imageUrl);
              console.log("pic" + typeof (pic));
              that.setData({
                picture: pic
              })
              if (pic.length == 3) {
                that.setData({
                  addShow: false
                })

              }
              wx.hideLoading();
              wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 2000
              })
            }
            else if (data.retCode == 21300) {
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '[21300]系统繁忙，请稍后再试！',
                showCancel: false,
                confirmText: '知道了',
              })
            }
            else if (data.retCode == 21301) {
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '[21301]请登录！',
                showCancel: false,
                confirmText: '知道了',
              })

            }
            else{
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '系统繁忙，请稍后再试！',
                showCancel: false,
                confirmText: '知道了',
              })
            }

          },
          fail: function (res) {
            wx.hideLoading();
            wx.showToast({
              title: '系统繁忙，请稍后再试！',
              duration: 2000
            });
          },
        });
      },
      fail:function(){
        wx.hideLoading();
      }
    })
  },
  picDetail: function (e) {
    var index = e.target.dataset.index;
    console.log(index);
    this.setData({
      index: index,
      picDetailShow: true,
      picUrl: this.data.picture[index],

    })
  },
  close: function () {
    this.setData({
      picDetailShow: false,
    })

  },
  delete: function () {
    var picture = this.data.picture;
    picture.splice(this.data.index, 1);
    this.close();
    this.setData({
      picture: picture,
      addShow: true
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