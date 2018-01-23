// pages/preview/preiview.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pathArr:[],
    iconArr: [
      "icon-xiaoniao",
      "icon-jinzhuan",
      "icon-huahuaduoqingxin",
      "icon-tuiguangzhuanqianxian",
      "icon-xin",
      "icon-tubiaozhizuomoban",
      "icon-hongbao",
      "icon-jinyuanbao",
      "icon-gou"
    ],
    currentIcon: "icon-xin",
    currentIndex: 4,
    animationData:{},
  },

  onReady: function () {
    var pathArr = JSON.parse(wx.getStorageSync("pathArr"))
    this.setData({
      pathArr: pathArr
    })
    wx.showShareMenu({
      withShareTicket: true
    })

  },
  onLoad: function (options){
    console.log("options:", JSON.stringify(options));
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onShow: function () {
    setTimeout(function(){
      var tempPathArr = [...this.data.pathArr];
      for (var i = 0; i < tempPathArr.length; i++) {
          var animation = wx.createAnimation({
            duration: 3000,
            timingFunction: 'ease',
          })
          animation.translateX(tempPathArr[i].x).translateY(tempPathArr[i].y).rotate(360).step()
          tempPathArr[i].animationData = animation.export()
        }
        this.setData({
          pathArr: tempPathArr
        })
    }.bind(this),100)

  },
  reload:function(){

    // this.setData({
    //   pathArr:[]
    // })


    // console.log(wx.getStorageSync("pathArr"))
    // var pathArr = JSON.parse(wx.getStorageSync("pathArr"))
    // console.log(pathArr)
    // this.setData({
    //   pathArr: pathArr
    // })



    var pathArr = JSON.parse(wx.getStorageSync("pathArr"))
    for (var i = 0; i < pathArr.length; i++) {
      var animation = wx.createAnimation({
        duration: 10000,
        timingFunction: 'ease',
      })
      animation.translateX(pathArr[i].x).translateY(pathArr[i].y).step()
      pathArr[i].animationData = animation.export()
    }
    this.setData({
      pathArr: pathArr
    })



    // var animation = wx.createAnimation({
    //   duration: 1000,
    //   timingFunction: 'ease',
    // })
    // this.animation = animation

    // this.animation.translateX(200).translateY(200).step()
    // //this.animation.rotate(360).step()

    // this.setData({
    //   animationData: this.animation.export()
    // })

  },
  rotateThenScale: function () {
    // 先旋转后放大
    this.animation.rotate(45).step()
    this.animation.scale(2, 2).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  onShareAppMessage: function (){
    // title	转发标题	当前小程序名称	
    // path	转发路径	当前页面 path ，必须是以 / 开头的完整路径
    // imageUrl	自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4		1.5.0
    // success	转发成功的回调函数		1.1.0
    // fail	转发失败的回调函数		1.1.0
    // complete	转发结束的回调函数（转发成功、失败都会执行

     return {
       title:"测试转发",
       path:"/pages/preview/preiview?id=11&name=kenley",
       success: function (res){
         console.log("成功:", JSON.stringify(res));
       },
       fail:function(res){
         console.log("失败:", JSON.stringify(res));
       }
     }
   

  },

})