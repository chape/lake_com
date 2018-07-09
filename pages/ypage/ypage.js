'use strict';

import util from '../../utils/index';
import config from '../../utils/config';
import api from '../../utils/api';

let app = getApp();
let isDEV = config.isDev;

// 后继的代码都会放在此对象中
let handler = {
  data: {
    page: 1, //当前加载第几页的数据
    pageSize: 4,
    totalSize: 0,
    hasMore: true,// 用来判断下拉加载更多内容操作
    phoneList: [], // 存放电话列表数据，与视图相关联
    defaultImg: config.defaultImg
  },
  onLoad(options) {
    this.setData({
      hiddenLoading: false
    }),
      this.requestPhone()
  },
  /*
   * 获取文章列表数据
   */
  requestPhone() {
    util.request({
      url: 'phones',
      mock: true,
      data: {
        start: this.data.page || 1,
        pageSize: this.data.pageSize
      }
    })
      .then(res => {
        // 数据正常返回
        if (res && res.status === 0 && res.data && res.data.length) {
          let phoneData = res.data;
          this.renderPhone(phoneData)
          console.log(phoneData)
        }
        /*
        * 如果加载第一页就没有数据，说明数据存在异常情况
        * 处理方式：弹出异常提示信息（默认提示信息）并设置下拉加载功能不可用
        */
        else if (this.data.page === 1 && res.data && res.data.length === 0) {
          util.alert();
          this.setData({
            hasMore: false
          });
        }
        /*
        * 如果非第一页没有数据，那说明没有数据了，停用下拉加载功能即可
        */
        else if (this.data.page !== 1 && res.data && res.data.length === 0) {
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
          this.setData({
            hasMore: false
          });
          return null;
        }
      });
  },
  renderPhone(data) {
    if (data && data.length) {
      let newList = this.data.phoneList.concat(data);
      this.setData({
        phoneList: newList,
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
      this.requestPhone();
    }
  },

  callPhone(e) {
    let dataset = e.currentTarget.dataset
    let item = dataset && dataset.item
    console.log(dataset)
    wx.makePhoneCall({
      phoneNumber: item + ''
    })
  },
}

Page(handler)