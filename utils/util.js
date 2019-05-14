const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function time_limit(currentTime,lastTime,fun,vari){
  var that = vari;
  if (vari.data.count == 0) {
    console.log("count==0");
    vari.data.lastTime = currentTime;
    vari.data.count++;
    fun();
  } else {
    // currentTime = new Date().getTime();
    if (currentTime - vari.data.lastTime < 1000) {
    } else {
      fun();
    }
    vari.data.lastTime = currentTime;
  }
}
function http(url, data, fun, fun2) {
  var that = this;
  wx.request({
    url: url,
    data: data,
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      wx.hideLoading();
      if (res.data.retCode == 0) {
        return fun(res.data);

      } else if (res.data.retCode == 21423){
         wx.showModal({
           title: '提示',
           content: '设备在台账列表中不存在',
           success: function (res) {
             if (res.confirm) {
               console.log("点击了确定");
               if (undefined != fun2 && ''!=fun2) {
                 fun2();
               }

             }
           }
         })
      }
      else {
        wx.showModal({
          title: '提示',
          content: '[' + res.data.retCode + ']' + res.data.retMsg,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log("点击了确定");
              if (undefined != fun2 && '' != fun2) {
                fun2();
              }

            }
          }
        })
      }
    },
    fail: function () {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '系统繁忙，请稍后再试！',
        showCancel: false,
      })
    }
  })
}

module.exports = {
  formatTime: formatTime,
  time_limit:time_limit,
  http:http
}
