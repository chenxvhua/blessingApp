function getDateStr(){
    var curDate = new Date()
    var year = curDate.getFullYear()
    var month = curDate.getMonth()+1
    var day = curDate.getDate()
    var dateStr = year.toString() + month.toString() + day.toString()
    return dateStr
}

function setCommand(){
  var saveKey = getDateStr()
  if (!wx.getStorageSync(saveKey)) {
    wx.setClipboardData({
      data: 'LiDc2G48sk',
      success: function (res) {
        wx.setStorageSync(saveKey, "测试")
        wx.getClipboardData({
          success: function (res) {
            console.log("测试:" + res.data) // data
          }
        })
      }
    })
  }
}

module.exports ={
  "getDateStr": getDateStr,
  "setCommand": setCommand,
}