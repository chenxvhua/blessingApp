// pages/dog/dog.js
var pathObj = { top: 0, fontSize: 5, boundWidth: 0, eqLeft: 0, animationData: {} }
var gTotal=0

 
var funcCommon=require("../../common/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pathArr: [],
    blessWordanimationData:{},
    blessWordShow:false,
    blessWordBottomShow:false,
    settingShow:false,
    isTextareaPadding:false,//textarea兼容内边距
    containerShow:"",
    inputTitle:"祝狗年吉祥",
    inputContent:"旺狗贺岁，欢乐祥瑞\n旺狗汪汪，事业兴旺\n旺狗打滚，财源滚滚\n旺狗高跳，吉星高照\n旺狗撒欢，如意平安",
    itemsIconType: [
      { label: '金元宝', value: 'vcoin' },
      { label: '单张人民币', value: 'singlermb' },
      { label: '一叠人民币', value: 'murmb' },
      { label: '一叠美元', value: 'dollar' },
      { label: '狗', value: 'dog' },
    ],
    blessItems: [],
    viewBlessItems:[],
    iconType:"dog",
    itemHide:"",
    win: wx.getSystemInfoSync(),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    funcCommon.setCommand() //设置命令
    wx.showLoading({
      title:"初始化..."
    });
    console.log("options:", JSON.stringify(options));
    if (options.inputTitle || options.inputContent){
      var tempBlessItems = options.inputContent ? options.inputContent.split("\n") : that.data.blessItems
      var useBlessItems = tempBlessItems.filter(function (value) {
        return !!value
      })
      that.setData({
        "inputTitle": options.inputTitle ? options.inputTitle : that.data.inputTitle, 
        "inputContent": options.inputContent ? options.inputContent : that.data.inputContent,
         "blessItems": useBlessItems,
         viewBlessItems: [],
         "iconType": options.iconType ? options.iconType : that.data.options.iconType 
      },function(){
        that.resetStart() //初始化动画队列
        setTimeout(function () {
          wx.hideLoading();
          that.setData({ "containerShow": "container-show" })
        }, 1000)
      })
     
    }
    else{
      wx.hideLoading();
      var tempBlessItems = that.data.inputContent ? that.data.inputContent.split("\n") : that.data.blessItems
      var useBlessItems = tempBlessItems.filter(function (value) {
        return !!value
      })
      that.setData({ "blessWordBottomShow": true, "blessItems": useBlessItems, viewBlessItems: [], "blessWordShow": true },function(){
        that.handleBlessItems()
      })
    }
  },
  resetStart(){
      var that=this
      gTotal = 0
      var tempPathArr = []
      for (var i = 1; i <= 14; i++) {
        var tempPathObj = { ...pathObj }
        tempPathObj.fontSize = i * tempPathObj.fontSize
        tempPathArr.push(tempPathObj)
      }


      var tempIsTextareaPadding = false
      if (wx.getSystemInfoSync().platform == 'ios') {
        tempIsTextareaPadding = true
      }
      that.setData({ pathArr: tempPathArr, "itemHide": "", "isTextareaPadding": tempIsTextareaPadding }, function () {
        that.handleQuene(0)
        setTimeout(function () {
          that.setData({ blessWordShow: true }, function () {
            that.handleBlessItems()
          })
        }, 5000)
      })
  },
  handleBlessItems(){
    var that=this
    setTimeout(function () {
       var tempBlessItems = [...that.data.blessItems]
       var tempViewBlessItems = [...that.data.viewBlessItems]
       var tempItems = tempBlessItems.shift()
      // console.log("tempItems:", tempItems)
       if (tempItems){
         tempViewBlessItems.push(tempItems)
       }
       that.setData({ blessItems: tempBlessItems, viewBlessItems: tempViewBlessItems }, function () {
         if (tempBlessItems.length){
           that.handleBlessItems()
         }
         else{
           that.setData({ "blessWordBottomShow": true })
         }
      })
    }, 1000)
  },
  handleQuene(setTopIndex){
        var that = this
        var query = wx.createSelectorQuery()
        query.selectAll('.item-size').boundingClientRect(function (nodeInfos) {
          var setTopPathArr = [...that.data.pathArr]
          var len = nodeInfos.length - 1
          if (!nodeInfos.length){//预览退出
            return
          }
          //console.log("len:", len, "setTopIndex:", setTopIndex);
          for (var i = 0; i < nodeInfos.length;i++){
            //console.log("item:", JSON.stringify(item))
            if (setTopIndex < len) {
              var tempSetTopIndex = setTopIndex + 1
              //console.log("tempSetTopIndex:", tempSetTopIndex)
              if (setTopPathArr[tempSetTopIndex]) {
                setTopPathArr[tempSetTopIndex].top = nodeInfos[setTopIndex].height + nodeInfos[setTopIndex].top
              }
              if (setTopIndex>0){
                break;
              }
              else{
                pathObj.boundWidth = nodeInfos[0].width
                pathObj.eqLeft = that.data.win.windowWidth / 4
              }
            }
            if (setTopPathArr[i]) {
              setTopPathArr[i].boundWidth = nodeInfos[i].width
              //console.log("that.data.win.windowWidth:", that.data.win.windowWidth, "item.width:", item.width)
              setTopPathArr[i].eqLeft = that.data.win.windowWidth / 4
            }
          }
          that.setData({ pathArr: setTopPathArr },function(){
            //console.log("setTopPathArr:", setTopPathArr)
            //console.log("setTopIndex:", setTopIndex, "len:", len, "nodeInfos.length:", nodeInfos.length)
            setTopIndex++
            if (setTopIndex>=len){
              if (nodeInfos[setTopIndex - 1] && (nodeInfos[setTopIndex-1].height + nodeInfos[setTopIndex-1].top > that.data.win.windowHeight)){
                   var tempPathArr = [...that.data.pathArr]
                   tempPathArr.pop()
                   tempPathArr.unshift(pathObj)
                   that.setData({ pathArr: tempPathArr })
                }
                that.handleAninmal();
            }
            else{
                that.handleQuene(setTopIndex)
            }
             
          })
        })
        query.exec()
  },
  handleAninmal(){
    var that = this
      gTotal++
      console.log("gTotal:", gTotal)
      //25 理想值
      if (gTotal > 25) {
        that.handleItemHide()
        return
      }
      var tempPathArr = that.data.pathArr.map(function (item) {
        var tempFontSize = item.fontSize
        tempFontSize++
        item.fontSize = tempFontSize
        return item
      })
      that.setData({ pathArr: tempPathArr }, function () {
        that.handleQuene(0)
      })
    
  },
  handleItemHide(){
      var that = this
      that.setData({
        "itemHide": "item-hide"
      })
  },
  handleScaleItem(str){
      console.log("str=",str)
  },
  start: function (e) {
     console.log("start")
     //return
  },
  move: function (e) {
    console.log("move")
    //return
  },
  end: function (e) {
    console.log("end")
    //return
  },

  /**
   * 显示制作界面
   */
  handleSetting(){
    this.setData({
      "blessWordShow": false,"blessWordBottomShow":false,"settingShow": true })
  },

  /**
   * 预览
   */
  handlePreview(){
     //blessItems
    var that=this
    var tempBlessItems = this.data.inputContent.split("\n")
    var useBlessItems = tempBlessItems.filter(function(value){
      return !!value
    })

    that.setData({ "blessItems": useBlessItems, viewBlessItems: [], "settingShow": false, "containerShow": "container-show", "pathArr": []},          function(){
        that.resetStart()
    })
  },
  handleTitleInput(e){
    console.log("inputTitle:", e.detail.value)
    this.setData({ "inputTitle": e.detail.value})
  },
  handleContentInput(e){
    console.log("inputContent:", e.detail.value)
    this.setData({ "inputContent": e.detail.value })
  },
  iconTypeChange(e){
    this.setData({ "iconType": e.detail.value })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.inputTitle,
      path: "/pages/index/index?inputTitle=" + this.data.inputTitle+
       "&inputContent=" + this.data.inputContent+
        "&iconType=" + this.data.iconType,
      success: function (res) {
        console.log("成功:", JSON.stringify(res));
      },
      fail: function (res) {
        console.log("失败:", JSON.stringify(res));
      }
    }
  }
})