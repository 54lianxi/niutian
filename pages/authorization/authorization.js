const app = getApp()
Page({
  data:{},
  bindGetUserInfo: function () {
    var that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.navigateBack({
            delta: 1,
          })

        }
      }
    })
  }
})