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
    inputContent:"旺狗贺岁，欢乐祥瑞旺狗贺岁\n旺狗汪汪，事业兴旺\n旺狗打滚，财源滚滚\n旺狗高跳，吉星高照\n旺狗撒欢，如意平安",
    initInputTitle:"祝狗年吉祥",
    initInputContent:"旺狗贺岁，欢乐祥瑞旺狗贺岁\n旺狗汪汪，事业兴旺\n旺狗打滚，财源滚滚\n旺狗高跳，吉星高照\n旺狗撒欢，如意平安",
    itemsIconType: [
      { label: '金元宝图一', value: 'vcoin' }, 
      { label: '金元宝图二', value: 'vcoin2' },
      { label: '金元宝图三', value: 'vcoin3' },
      { label: '聚宝盆图一', value: 'jubaopan' },
      { label: '聚宝盆图二', value: 'jubaopan2' },
      { label: '单张人民币', value: 'singlermb' },
      { label: '一叠人民币', value: 'murmb' },
      { label: '财神图一', value: 'caishen' },
      { label: '财神图二', value: 'caishen2' },
      { label: '一叠美元', value: 'dollar' },
      { label: '狗', value: 'dog' },
    ],
    itemsBgMusicType: [
      { label: '无', value: '' },
      { label: '市集', value: 'shiji.mp3' },
      { label: '春节', value: 'chunjie3.mp3' },
      { label: '快乐', value: 'happay.mp3' },
      { label: '发财', value: 'facai.mp3' }
    ],
    blessItems: [],
    viewBlessItems:[],
    iconType:"vcoin",
    bgMusicType:"",
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
    if (options.inputTitle || options.inputContent || options.bgMusicType){
      var tempBlessItems = options.inputContent ? options.inputContent.split("\n") : that.data.blessItems
      var useBlessItems = tempBlessItems.filter(function (value) {
        return !!value
      })
      that.setData({
        "inputTitle": options.inputTitle ? options.inputTitle : that.data.inputTitle, 
        "inputContent": options.inputContent ? options.inputContent : that.data.inputContent,
        "bgMusicType": options.bgMusicType ? options.bgMusicType : that.data.bgMusicType,
        "initInputTitle": options.inputTitle ? options.inputTitle : that.data.inputTitle, 
         "initInputContent": options.inputContent ? options.inputContent : that.data.inputContent,
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
        that.funcPlayBgMusic()
        setTimeout(function () {
          that.setData({ blessWordShow: true }, function () {
            that.handleBlessItems()
          })
        }, 5000)
      })
  },
  funcPlayBgMusic(){
    //dataUrl: 'http://www.99msg.com/mp3/shiji.mp3',
    //dataUrl: 'http://www.99msg.com/mp3/chunjie.mp3',
    if (this.data.bgMusicType){
      console.log("bgMusicType:", this.data.bgMusicType)
      wx.playBackgroundAudio({
        dataUrl: 'http://www.99msg.com/mp3/' + this.data.bgMusicType,
        success: function (res) {
          console.log("success:", JSON.stringify(res))
        },
        fail: function (res) {
          console.log("fail:", JSON.stringify(res))
        },
        complete: function (res) {
          console.log("complete:", JSON.stringify(res))
        }
      })
    }
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
      if (gTotal > 100) {
        that.handleItemHide()
        wx.stopBackgroundAudio()
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
    that.setData({ 
        "blessItems": useBlessItems, 
        "initInputTitle": that.data.inputTitle,
        "initInputContent":that.data.inputContent,
        "viewBlessItems": [], 
        "settingShow": false,
        "containerShow": "container-show", 
        "pathArr": []
        },
       function(){
        wx.stopBackgroundAudio()
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
  bgMusicTypeChange(e){
    this.setData({ "bgMusicType": e.detail.value })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.inputTitle,
      path: "/pages/index/index?inputTitle=" + this.data.inputTitle+
       "&inputContent=" + this.data.inputContent+
        "&iconType=" + this.data.iconType+
      "&bgMusicType=" + this.data.bgMusicType,
      success: function (res) {
        console.log("成功:", JSON.stringify(res));
      },
      fail: function (res) {
        console.log("失败:", JSON.stringify(res));
      }
    }
  }
})