// pages/submitMaintainRecord/submitMaintainRecord.js
var app=getApp();
var utils=require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addShow:true,
    picture:[],
    disabled:false,
    maintainRemark:"OK"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options"+JSON.stringify(options));
    var equipmentType1;
    if (options.equipmentType == 'QD') {
      equipmentType1 = "强电"
    } else if (options.equipmentType == 'RD') {
      equipmentType1 = "弱电"
    } else if (options.equipmentType == 'KT') {
      equipmentType1 = "空调"
    } else if (options.equipmentType == 'JPS') {
      equipmentType1 = "给排水"
    } else if (options.equipmentType == 'XF') {
      equipmentType1 = "消防"
    } else if (options.equipmentType == 'DT') {
      equipmentType1 = "电梯"
    } else {
      equipmentType1 = "其它"
    }
     this.setData({
       workOrderId: options.workOrderId,
       equipmentType1: equipmentType1,
       maintainPlanId: options.maintainPlanId,
       maintainPlanDate:options.maintainPlanDate,
       equipmentId: options.equipmentId,
       equipmentType: options.equipmentType,
       equipmentName: options.equipmentName
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
            else {
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
  maintainRemarkInput:function(e){
    this.setData({
      maintainRemark:e.detail.value
    })
  },
  submit:function(){
    this.setData({
      disabled:true
    })
    if (this.data.maintainRemark == '' || this.data.maintainRemark == null ){
      wx.showModal({
        title: '提示',
        content: '维保备注不能为空',
        showCancel:false
      })
      this.noDisabled();
      return;
    }else if(this.data.picture==[]){
      wx.showModal({
        title: '提示',
        content: '维护照片不能为空',
        showCancel: false
      })
      this.noDisabled();
      return;
    }
    var url = app.globalData.domain +'/building_com_weixin/equipmentAccounting/submitMaintainRecord';
    var data={
      "openidMicroApp": wx.getStorageSync("openId"),
      "unionid": wx.getStorageSync('unionId'),
      "staffId": wx.getStorageSync("staffId"),
      workOrderId: this.data.workOrderId,
      maintainPlanId: this.data.maintainPlanId,
      maintainPlanDate: this.data.maintainPlanDate,
      equipmentId: this.data.equipmentId,
      equipmentType: this.data.equipmentType,      
      equipmentName: this.data.equipmentName,
      maintainRemark: this.data.maintainRemark,
      maintainPhoto: JSON.stringify(this.data.picture)
    }
    app.checkLogin(utils.http(url, data, this.result, this.noDisabled));
    
  },
  result:function(){
    wx.redirectTo({
      url: '../success/success?message=反馈成功，点击跳转主页查看！',
    })
    var url2 = app.globalData.domain + '/building_com_weixin/workOrder/submitFeedback';
    var data2 = {
      workOrderId: this.data.workOrderId,
      "openidMicroApp": wx.getStorageSync("openId"),
      "unionid": wx.getStorageSync('unionId'),
      "staffId": wx.getStorageSync("staffId"),
      content: this.data.maintainRemark,
      photo: JSON.stringify(this.data.picture)
    }
    app.checkLogin(utils.http(url2, data2, this.res));
  },
  res:function(){

  },
  noDisabled:function(){
    this.setData({
      disabled:false
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