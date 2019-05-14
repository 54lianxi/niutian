// pages/MaintainPlanDetail/MaintainPlanDetail.js
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
     var maintainPhoto;
     try{
       maintainPhoto = JSON.parse(options.maintainPhoto)
     }catch(e){
       maintainPhoto=[];
     }
     this.setData({
       maintainRecordId: options.maintainRecordId,
       maintainPlanId: options.maintainPlanId,
       maintainPlanDate: options.maintainPlanDate,
       maintainRemark: options.maintainRemark,
       maintainPhoto: maintainPhoto,
       submitStaffId: options.submitStaffId,
       submitStaffName: options.submitStaffName,
       modifyTime: options.modifyTime.substring(0,19),
       createTime: options.createTime.substring(0,19),
     })
  },
  picDetail: function (e) {
    var index = e.target.dataset.index;
    console.log(index);
    this.setData({
      index: index,
      picDetailShow: true,
      picUrl: this.data.maintainPhoto[index],

    })
  },
  close: function () {
    this.setData({
      picDetailShow: false,
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