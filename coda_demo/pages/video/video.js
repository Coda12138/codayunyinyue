// pages/video/video.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList : [],
    navId: '',
    videoList: [],
    videoId: '', //视频id标识
    videoUpdateTime: [], //记录video播放时长 
    isTriggered: false, //标识下拉刷新
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupListData();
  },

  async getVideoGroupListData() {
    let videoGroupListData = await request('/video/group/list');
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0,14),
      navId: videoGroupListData.data[0].id
    });

    this.getVideoList(this.data.navId);
  },

  async getVideoList(navId) {
    if(!navId) return;
    let videoListData = await request('/video/group', {id: navId});
    wx.hideLoading();
    let index = 0;
    let videoList = videoListData.datas.map(item => {
      item.id = index++;
      return item;
    })
    this.setData({
      videoList,
      isTriggered: false
    })
  },

  changeNav(event) {
    let navId = event.currentTarget.id;
    this.setData({
      navId: navId >>> 0,
      videoList: []
    });
    wx.showLoading({
      title: '正在加载',
    })
    this.getVideoList(this.data.navId);
  },
  handlePlay(event) {
    let vid = event.currentTarget.id;
    // this.vid !== vid && this.videoContent && this.videoContent.stop();
    // this.vid = vid;
    this.setData({
      videoId: vid
    })
    this.videoContent = wx.createVideoContext(vid);
    let {videoUpdateTime} = this.data;
    let videoItem = videoUpdateTime.find(item => item.vid === vid);
    if(videoItem) {
      this.videoContent.seek(videoItem.currentTime);
    }
  },
  handleTimeUpdate(event) {
    let videoTimeObj = {vid: event.currentTarget.id, currentTime: event.detail.currentTime};
    let {videoUpdateTime} = this.data;
    //判断该视频是否已存在于该列表内
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid);
    if(videoItem) {
      videoItem.currentTime = event.detail.currentTime
    } else {
      videoUpdateTime.push(videoTimeObj);
    }
    this.setData({
      videoUpdateTime
    })
  },
  handleEnded(event) {
    let {videoUpdateTime} = this.data;
    let pos = videoUpdateTime.findIndex(item => item.vid === event.currentTarget.id);
    videoUpdateTime.splice(pos, 1);
    this.setData({
      videoUpdateTime
    })
  },
  handleRefresher() {
    this.getVideoList(this.data.navId);
  },
  handleToLower() {
    console.log("下拉刷新火热开发中");
  },

  toSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
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
  onShareAppMessage: function ({from}) {
    if(from === 'button') {
      return {
        title: '欢迎来到coda云音乐 by button',
        page: '/pages/video/video'
      }
    } else {
      return {
        title: '欢迎来到coda云音乐 by menu',
        page: '/pages/video/video'
      }
    }
  }
})