// pages/Accounting/Accounting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var equipmentType;
    if (options.equipmentType == "QD"){
      equipmentType ="强电"
    } else if (options.equipmentType == "RD"){
      equipmentType = "弱电"
    } else if (options.equipmentType == "KT") {
      equipmentType = "空调"
    } else if (options.equipmentType == "JPS") {
      equipmentType = "给排水"
    } else if (options.equipmentType == "XF") {
      equipmentType = "消防"
    } else if (options.equipmentType == "DT") {
      equipmentType = "电梯"
    }else{
      equipmentType = "其它"
    }
    console.log("type>>>" + typeof (options.equipmentPhoto))
    console.log(options.equipmentPhoto);
    var picture = options.equipmentPhoto;
    try{
      picture=JSON.parse(picture)
    }catch(e){
      picture=[]
    }
    this.setData({
      type: options.equipmentType,
      equipmentId: options.equipmentId,
      companyId: options.companyId,
      companyName: options.companyName,
      projectId: options.projectId,
      projectName: options.projectName,
      equipmentAccountingNo: options.equipmentAccountingNo,
      equipmentType: equipmentType,
      equipmentName: options.equipmentName,
      equipmentModel: options.equipmentModel,
      equipmentParameters: options.equipmentParameters,
      equipmentParts: options.equipmentParts,
      picture: picture,
      manufacturer: options.manufacturer,
      manufacturingDate: options.manufacturingDate,
      manufacturingNo: options.manufacturingNo,
      installPlace: options.installPlace,
      installDate: options.installDate,
      submitStaffId: options.submitStaffId,
      submitStaffName: options.submitStaffName,
      modifyTime: options.modifyTime.substring(0,19),
      createTime: options.createTime.substring(0, 19),
    })
  },
  queryMaintainRecord:function(){
     wx.navigateTo({
       url: '/pages/queryMaintainRecord/queryMaintainRecord?equipmentId=' + this.data.equipmentId,
      //  + '&&maintainPlanId=' + this.data.maintainPlanId + '&&maintainPlanDate=' + this.data.maintainPlanDate + '&&equipmentType' + this.data.equipmentType + '&&equipmentName=' + this.data.equipmentName,
     })
  },
  queryMaintainPlan:function(){
    wx.navigateTo({
      url: '/pages/queryMaintainPlan/queryMaintainPlan?equipmentId=' + this.data.equipmentId,
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
  editAccounting:function(){
    wx.redirectTo({
      url: '/pages/editAccounting/editAccounting?equipmentId=' + this.data.equipmentId + '&&companyId=' + this.data.companyId + '&&companyName=' + this.data.companyName + '&&projectId=' + this.data.projectId + '&&projectName=' + this.data.projectName + '&&equipmentAccountingNo=' + this.data.equipmentAccountingNo + '&&equipmentType=' + this.data.equipmentType + '&&equipmentName=' + this.data.equipmentName + '&&equipmentModel=' + this.data.equipmentModel + '&&equipmentParameters=' + this.data.equipmentParameters + '&&equipmentParts=' + this.data.equipmentParts + '&&picture=' + JSON.stringify(this.data.picture) + '&&manufacturer=' + this.data.manufacturer + '&&manufacturingDate=' + this.data.manufacturingDate + '&&manufacturingNo=' + this.data.manufacturingNo + '&&installPlace=' + this.data.installPlace + '&&installDate=' + this.data.installDate + '&&submitStaffId=' + this.data.submitStaffId + '&&submitStaffName=' + this.data.submitStaffName +'&&equipmentType='+this.data.type 
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