// pages/submitAccounting/submitAccounting.js
var app=getApp();
var utils=require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    equipmentType1: ["强电", "弱电", "空调", "给排水", "消防", "电梯", "其它"],
    equipmentType: ["QD", "RD", "KT", "JPS", "XF", "DT", "QT"],
    type1: "强电",
    equipmentNameInput: '',
    addShow: true,
    projectId: '',
    projectName:'',
    equipmentAccountingNo:'',
    type:'QD',
    equipmentName:'',
    equipmentModel:'',
    equipmentParameters:'',
    equipmentParts:'',
    equipmentPhoto:'',
    manufacturer:'',
    manufacturingDate:'',
    manufacturingNo:'',
    installPlace:'',
    installDate:'',
    disabled:false,
    picture: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.setData({
     projectId: options.projectId,
     projectName: options.projectName
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
  change: function (options) {
    var index = options.detail.value;
    this.setData({
      type1: this.data.equipmentType1[index],
      typeIndex: index,
      type: this.data.equipmentType[index]
    })
    console.log(index);
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
            wx.showModal({
              title: '提示',
              content: '系统繁忙，请稍后再试！',
              showCancel: false,
              confirmText: '知道了',
            })
          },
        });
      },
      fail:function(){
        wx.hideLoading();
      }
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      manufacturingDate: e.detail.value
    })
  },
  bindDate2Change: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      installDate: e.detail.value
    })
  },
  submit:function(){
    this.setData({
      disabled:true
    })
    if (this.data.equipmentName == null || this.data.equipmentName == ''){
      wx.showModal({
        title: '提示',
        content: '设备名称不能为空',
        showCancel:false,
      })
      this.setData({
        disabled: false
      })
      return;
    }
    if (this.data.manufacturer == null || this.data.manufacturer == '') {
      wx.showModal({
        title: '提示',
        content: '生产厂家不能为空',
        showCancel: false,
      })
      this.setData({
        disabled: false
      })
      return;
    }
    if (this.data.manufacturingDate == null || this.data.manufacturingDate == '') {
      wx.showModal({
        title: '提示',
        content: '出厂日期不能为空',
        showCancel: false,
      })
      this.setData({
        disabled: false
      })
      return;
    }
    if (this.data.manufacturingNo == null || this.data.manufacturingNo == '') {
      wx.showModal({
        title: '提示',
        content: '出厂编号不能为空',
        showCancel: false,
      })
      this.setData({
        disabled: false
      })
      return;
    }
    if (this.data.installPlace == null || this.data.installPlace == '') {
      wx.showModal({
        title: '提示',
        content: '安装位置不能为空',
        showCancel: false,
      })
      this.setData({
        disabled: false
      })
      return;
    }
    if (this.data.installDate == null || this.data.installDate == '') {
      wx.showModal({
        title: '提示',
        content: '安装日期不能为空',
        showCancel: false,
      })
      this.setData({
        disabled: false
      })
      return;
    }
    var url = app.globalData.domain +"/building_com_weixin/equipmentAccounting/submitAccounting";
    var data={
      "openidMicroApp": wx.getStorageSync("openId"),
      "unionid": wx.getStorageSync('unionId'),
      "staffId": wx.getStorageSync("staffId"),
      projectId: this.data.projectId,
      projectName: this.data.projectName,
      equipmentAccountingNo: this.data.equipmentAccountingNo,
      equipmentType: this.data.type,
      equipmentName: this.data.equipmentName,
      equipmentModel: this.data.equipmentModel,
      equipmentParameters: this.data.equipmentParameters,
      equipmentParts: this.data.equipmentParts,
      equipmentPhoto: JSON.stringify(this.data.picture),
      manufacturer: this.data.manufacturer,
      manufacturingDate: this.data.manufacturingDate,
      manufacturingNo: this.data.manufacturingNo,
      installPlace: this.data.installPlace,
      installDate: this.data.installDate,
    }
    app.checkLogin(utils.http(url,data,this.submitResult,this.disabled));
  },
  disabled:function(){
     this.setData({
       disabled:false
     })
  },
  submitResult:function(){
    wx.showToast({
      title: '录入成功',
      complete:function(){
        setTimeout(function(){
          wx.navigateBack({
            delta: 1
          })
        },2000)
        
      }
    })
  },
  equipmentAccountingNoInput:function(e){
     this.setData({
       equipmentAccountingNo:e.detail.value
     })
  },
  equipmentNameInput: function (e) {
    this.setData({
      equipmentName: e.detail.value
    })
  },
  equipmentModelInput: function (e) {
    this.setData({
      equipmentModel: e.detail.value
    })
  },
  equipmentParametersInput: function (e) {
    this.setData({
      equipmentParameters: e.detail.value
    })
  },
  equipmentPartsInput: function (e) {
    this.setData({
      equipmentParts: e.detail.value
    })
  },
  manufacturerInput: function (e) {
    this.setData({
      manufacturer: e.detail.value
    })
  },
  manufacturingNoInput: function (e) {
    this.setData({
      manufacturingNo: e.detail.value
    })
  },
  installPlaceInput: function (e) {
    this.setData({
      installPlace: e.detail.value
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