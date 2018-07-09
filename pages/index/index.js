'use strict';

import util from '../../utils/index';
import config from '../../utils/config';
import api from '../../utils/api';

let app = getApp();
let isDEV = config.isDev;

// 后继的代码都会放在此对象中
let handler = {
  data: {
    lunboList: [], // 存放轮播图数据，与视图相关联
    internal: 3000,
    duration: 1000,
    shopList: [], // 存放店铺列表数据
    hasMore: true,// 用来判断下拉加载更多内容操作
    page: 0, //当前加载第几页的数据
    pageSize: 4,
    totalSize: 0
  },
  onLoad(options) {
    this.setData({
      hiddenLoading: false,
    }),
      this.requestLunbo(),
      this.requestShop()
  },
  /*
   * 获取轮播图数据
   */
  requestLunbo() {
    util.request({
      url: 'lunbo',
      mock: true,
      data: {
      }
    })
      .then(res => {
        // 数据正常返回
        if (res && res.status === 0 && res.data && res.data.length) {
          let lunboData = res.data;
          this.renderLunbo(lunboData)
        }
        /*
        * 返回异常错误
        * 展示后端返回的错误信息，并设置下拉加载功能不可用
        */
        else {
          util.alert('提示', res);
          this.setData({
            lunboList: app.globalData.defaultLunboData
          });
          return null;
        }
      });
  },
  renderLunbo(data) {
    if (data && data.length) {
      this.setData({
        lunboList: data
      })
    }
  },

  /*
   * 获取店铺列表数据
   */
  requestShop() {
    util.request({
      url: 'shops',
      mock: true,
      data: {
        page: this.data.page || 0,
        size: this.data.size || 3,
      }
    })
      .then(res => {
        // 数据正常返回
        if (res && res.errorCode === 0 && res.data && res.data.data && res.data.data.length) {
          let shopData = res.data.data;
          console.log(res)
          this.renderShop(shopData)
        }
        /*
        * 如果加载第一页就没有数据，说明数据存在异常情况
        * 处理方式：弹出异常提示信息（默认提示信息）并设置下拉加载功能不可用
        */
        else if (this.data.page === 0 && res.data && res.data.data && res.data.data.length === 0) {
          util.alert();
          console.log(res)
          this.setData({
            hasMore: false
          });
        }
        /*
        * 如果非第一页没有数据，那说明没有数据了，停用下拉加载功能即可
        */
        else if (this.data.page !== 0 && res.data && res.data.data && res.data.data.length === 0) {
          this.setData({
            hasMore: false
          });
        }
        /*
        * 返回异常错误
        * 展示后端返回的错误信息，并设置下拉加载功能不可用
        */
        else {
          util.alert('提示', res);
          console.log(res)
          this.setData({
            hasMore: false
          });
          return null;
        }
      });
  },
  renderShop(data) {
    if (data && data.length) {
      let newList = this.data.shopList.concat(data);
      this.setData({
        shopList: newList,
        hiddenLoading: true
      })
    }
  },
  /*
  * 每次触发，我们都会先判断是否还可以『加载更多』
  * 如果满足条件，那说明可以请求下一页列表数据，这时候把 data.page 累加 1
  * 然后调用公用的请求函数
  */
  onReachBottom() {
    if (this.data.hasMore) {
      let nextPage = this.data.page + 1;
      this.setData({
        page: nextPage
      });
      this.requestShop();
    }
  },

  callPhone(e) {
    let dataset = e.currentTarget.dataset
    let item = dataset && dataset.item
    wx.makePhoneCall({
      phoneNumber: item+''
    })
  },

  /*
  * 分享
  */
  onShareAppMessage() {
    let title = config.defaultShareText || '';
    return {
      title: title,
      path: `/pages/index/index`,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }

}

Page(handler)