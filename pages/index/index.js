//index.js
//获取应用实例
const app = getApp()
var myCanvas = wx.createCanvasContext('myCanvas')
myCanvas.setLineWidth(5)
Page({
  data: {
    startPos:{
      x:0,
      y:0
    },
    pathArr: [],
    drawArr:[],
    win:wx.getSystemInfoSync(),
    dashboardBtnShow:"show",
    dashboardShow:"dashboard-hide",
  },
  onLoad: function () {
    myCanvas.drawImage("../images/bg.jpg", 0, 0, this.data.win.windowWidth,this.data.win.windowHeight); 
    myCanvas.draw(true)
  },
  start: function (e) {
    console.log("start")
    this.setData({
          startPos: {
              x: e.touches[0].x,
              y: e.touches[0].y
          },
          dashboardBtnShow:"hide",
     })
    this.handleAddPathArr(e)
  
  },
  move: function (e) {
    this.handleAddPathArr(e)
    var tempDrawArr = [...this.data.drawArr]
    tempDrawArr.push({
      x: e.touches[0].x,
      y: e.touches[0].y
    })
   
    myCanvas.moveTo(this.data.startPos.x, this.data.startPos.y);
    tempDrawArr.forEach(function (item) {
      myCanvas.lineTo(item.x, item.y);
    })
    myCanvas.stroke();
    myCanvas.draw(true)
    this.setData({ drawArr: tempDrawArr })
  
  },
  end: function (e) {
    console.log("end")
    this.setData({ drawArr:[],
      dashboardBtnShow: "show",
    })
    this.handleAddPathArr(e)

  },
  handleAddPathArr(e){
    var temp = [...this.data.pathArr]
    if (e.touches.length) {
      temp.push({
        x: e.touches[0].x,
        y: e.touches[0].y
      });
    }
    this.setData({
      pathArr: temp
    })
  },
  handleBtn:function(e){
      myCanvas.drawImage("../images/bg.jpg", 0, 0, this.data.win.windowWidth, this.data.win.windowHeight);
      myCanvas.draw(true)
      wx.setStorageSync("pathArr",JSON.stringify(this.data.pathArr))
      this.setData({ pathArr: [] })
      wx.navigateTo({
        url: '/pages/preview/preiview'
      })
  },
})
