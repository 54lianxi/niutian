// pages/orderDetail2/orderDetail2.js
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
    // this.setData({
    //   workOrderId: options.workOrderId
    // })
    console.log(JSON.stringify(options));
    if (options.type==1){
      this.setData({
        type1:'人工派单',
        
      })
    }else if(options.type==2){
      this.setData({
        type1: '设备故障',
        // content: options.content
      })
    } else if (options.type == 3){
      this.setData({
        type1:'定期保养'
      })
      // var content = options.content;
      // try {
      //   content = JSON.parse(content);
      //   console.log("content>>" + content);
      //   console.log("content>>maintainPlanDate>>>" + content.maintainPlanDate);
      //   var equipmentType1;
      //   if (content.equipmentType == 'QD') {
      //     console.log("强电");
      //     equipmentType1 = "强电"
      //   } else if (content.equipmentType == 'RD') {
      //     equipmentType1 = "弱电"
      //   } else if (content.equipmentType == 'KT') {
      //     equipmentType1 = "空调"
      //   } else if (content.equipmentType == 'JPS') {
      //     equipmentType1 = "给排水"
      //   } else if (content.equipmentType == 'XF') {
      //     equipmentType1 = "消防"
      //   } else if (content.equipmentType == 'DT') {
      //     equipmentType1 = "电梯"
      //   } else {
      //     equipmentType1 = "其它"
      //   }
      //   this.setData({
      //     maintainPlanId: content.maintainPlanId,
      //     maintainPlanDate: content.maintainPlanDate,
      //     equipmentId: content.equipmentId,
      //     equipmentType: content.equipmentType,
      //     equipmentType1: equipmentType1,
      //     equipmentName: content.equipmentName,
      //   })
      // }
      // catch (e) {
      //   content = []
      // }
    }
    this.setData({
      content: options.content,
      workOrderId: options.workOrderId,
      handleType: options.handleType,
      lastHandleTime: options.lastHandleTime.substring(0, 19),
      submitOrderStaffId: options.submitOrderStaffId,
      submitOrderStaffName: options.submitOrderStaffName,
      sendWorkOrderStatus: options.sendWorkOrderStatus,
      sendWorkOrderStaffId: JSON.parse(options.sendWorkOrderStaffId),
      sendWorkOrderStaffName: options.sendWorkOrderStaffName,
      sendWorkOrderType: options.sendWorkOrderType,
      sendWorkOrderTime: options.sendWorkOrderTime.substring(0, 19),
      handleType: options.handleType,
      lastHandleTime: options.lastHandleTime.substring(0, 19),
      sendtoStaffId: JSON.parse(options.sendtoStaffId),
      feedbackStatus: options.feedbackStatus,
      feedbackStaffId: options.feedbackStaffId,
      feedbackStaffName: options.feedbackStaffName,
      lastFeedbackTime: options.lastFeedbackTime.substring(0, 19),
      modifyTime: options.modifyTime.substring(0, 19)
    })
    console.log('aaa'+typeof (this.data.sendWorkOrderStaffId));
  },
  queryFeedbackList:function(){
    // wx.navigateTo({
    //   url: '/pages/feedBackOrderList/feedBackOrderList?workOrderId=' + this.data.workOrderId,
    // })
    wx.redirectTo({
      url: '/pages/feedBackOrderList/feedBackOrderList?workOrderId=' + this.data.workOrderId+'&&a=1',
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