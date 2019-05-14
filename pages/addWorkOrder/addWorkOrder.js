// pages/addWorkOrder/addWorkOrder.js
const app = getApp();
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendWorkOrderType1: ["立即派单","预定时间派单"],
    handleType1:["立即处理","时限处理"],
    sendWorkOrderType:1,
    type: "立即派单",
    handleType:1,
    hType:'立即处理',
    sendWorkOrderTime:'',
    lastHandleTime:'',
    checkBox:[],
    a:'00:00',
    b:'00:00'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var time=new Date();
    time = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' +(time.getDate()+1)
    console.log(time);
    this.setData({
      start:time,
      projectId: options.projectId
    })
    app.checkLogin(this.queryStaffList);
  },
  queryStaffList:function(){
    var url = app.globalData.domain + "/building_com_weixin/user/queryStaffList";
    var data = {
      "openidMicroApp": wx.getStorageSync("openId"),
      "unionid": wx.getStorageSync('unionId'),
      "staffId": wx.getStorageSync("staffId"),  
    }
    app.checkLogin(utils.http(url, data, this.staffList));
  },
  staffList:function(data){
     this.setData({
       Staff:data.data
     })
  },
  checkboxChange:function(e){
    // console.log(e.detail.value);
    this.setData({
      checkBox: e.detail.value
    })
  },
  change:function(e){
    var index = e.detail.value;
    this.setData({
      sendWorkOrderType:parseInt(index)+1,
      type: this.data.sendWorkOrderType1[index]
    })
    if(index==1){
      this.setData({
        // sendWorkOrderTimeShow:true,
        lastHandleTimeShow:true,
        handleType:2

      })
    }else{
      this.setData({
        handleType:1
        // sendWorkOrderTimeShow: false
      })
    }
  },
  change2: function (e) {
    var index = e.detail.value;
    this.setData({
      handleType: parseInt(index) + 1,
      hType: this.data.handleType1[index]
    })
    if (index == 1) {
      this.setData({
        // lastHandleTimeShow: true
      })
    } else {
      this.setData({
        // lastHandleTimeShow: false
      })
    }
  },
  bindTimeChange:function(e){
     this.setData({
       a:e.detail.value
     })
  },
  bindTimeChange2:function(e){
    this.setData({
      b: e.detail.value
    })
  },
  WorkOrderTime: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      sendWorkOrderTime: e.detail.value
    })
  },
  lastHandle:function(e){
    this.setData({
      lastHandleTime: e.detail.value
    })
  },
  contentInput:function(e){
    this.setData({
      content:e.detail.value
    })
  },
  submit:function(){
    console.log(this.data.checkBox == []);
    if(this.data.content==''||this.data.content==undefined){
      wx.showModal({
        title: '提示',
        content: '请填写工单内容',
        showCancel:false
      })
      return;
    }else if (this.data.sendWorkOrderType == 2 && this.data.sendWorkOrderTime==''){
      wx.showModal({
        title: '提示',
        content: '请选择派单日期',
        showCancel: false
      })
      return;
    } else if (this.data.sendWorkOrderType == 2 && this.data.a == '') {
      wx.showModal({
        title: '提示',
        content: '请选择派单时间',
        showCancel: false
      })
      return;
    } 
    else if (this.data.handleType == 2 && this.data.lastHandleTime == ''){
      wx.showModal({
        title: '提示',
        content: '请选择最后处理日期',
        showCancel: false
      })
      return;
    } else if (this.data.sendWorkOrderType == 2 && this.data.b == '') {
      wx.showModal({
        title: '提示',
        content: '请选择最后处理时间',
        showCancel: false
      })
      return;
    } else if (this.data.handleType == 2 && this.data.sendWorkOrderType == 2 ){
      var sendWorkOrderTime = this.data.sendWorkOrderTime + ' ' + this.data.a;
      var lastHandleTime = this.data.lastHandleTime + ' ' + this.data.b;
      var d1 = new Date(Date.parse(sendWorkOrderTime));
      var d2 = new Date(Date.parse(lastHandleTime));
      if(d1>=d2){
        wx.showModal({
          title: '提示',
          content: '最后处理时间需晚于派单时间',
          showCancel:false
        })
        return;
      }

    }else if (this.data.checkBox.length <1){
      wx.showModal({
        title: '提示',
        content: '请选择至少一个员工',
        showCancel: false
      })
      return;
    }
    console.log('length'+this.data.checkBox.length);
    var s=[];
    for(var i=0;i<this.data.checkBox.length;i++){
      for (var j = 0; j < this.data.Staff.length;j++){
        if (this.data.checkBox[i] == this.data.Staff[j].staffId){
          var temp = this.data.Staff[j];
          s.push(temp);
          console.log("s"+JSON.stringify(s));
        }
      }
    }
    this.setData({
      dis:true
    })
    var that=this;
    setTimeout(function(){
       that.setData({
         dis:false
       })
    },3000)
    var url = app.globalData.domain + "/building_com_weixin//workOrder/addWorkOrder";
    if (this.data.sendWorkOrderType==1){
      var sendWorkOrderTime=''
    }else{
      var sendWorkOrderTime = this.data.sendWorkOrderTime + ' ' + this.data.a + ':00'
    }
    if (this.data.handleType == 1) {
      var lastHandleTime = ''
    } else {
      var lastHandleTime = this.data.lastHandleTime + ' ' + this.data.b + ':00'
    }

    var data = {
      "openidMicroApp": wx.getStorageSync("openId"),
      "unionid": wx.getStorageSync('unionId'),
      "staffId": wx.getStorageSync("staffId"),
      projectId: this.data.projectId,
      content: this.data.content,
      sendWorkOrderType: this.data.sendWorkOrderType,
      sendWorkOrderTime: sendWorkOrderTime,
      handleType: this.data.handleType,
      lastHandleTime: lastHandleTime,
      sendtoStaffId: JSON.stringify(s),

    }
    app.checkLogin(utils.http(url, data, this.submitResult));
  },
  submitResult:function(){
     wx.showToast({
       title: '提交成功',
       success:function(){
         setTimeout(function(){
           wx.navigateBack({
             delta:1
           })
         }, 2000)
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