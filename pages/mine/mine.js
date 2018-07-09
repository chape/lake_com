
import util from '../../utils/index';
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '欢迎使用,联系我们',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    qr:''
  },
  //事件处理函数
  bindViewTap: function() {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
    util.alert('提示', '你很美^_^');
  },
  onLoad: function () {
    
    this.requestQr()

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  requestQr() {
    util.request({
      url: 'qr',
      mock: true,
      data: {
      }
    })
      .then(res => {
        // 数据正常返回
        if (res && res.status === 0 && res.data) {
          let qr = res.data.imgUrl;
          this.renderQr(qr)
        }
        /*
        * 返回异常错误
        * 展示后端返回的错误信息，并设置下拉加载功能不可用
        */
        else {
          util.alert('提示', res);
          this.setData({
            hasMore: false
          });
          return null;
        }
      });
  },
  renderQr(data) {
    if (data) {
      this.setData({
        qr: data,
        hiddenLoading: true
      })
    }
  },
})
