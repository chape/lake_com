'use strict';
const env = 'dev';// dev production
/*
 * 默认接口出错弹窗文案
 * @type {string}
 */
const defaultAlertMessage = '好像哪里出了小问题~ 请再试一次~';
/*
 * 默认分享文案
 * @type {{en: string}}
 */
const defaultShareText = {
  en: '河畔新世界/天府半岛'
};
/*
 * 小程序默认标题栏文字
 * @type {string}
 */
const defaultBarTitle = {
  en: '河畔新世界'
};
/*
 * 文章默认图片
 * @type {string}
 */
const defaultImg = {
  articleImg: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
  coverImg: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg'
};


let core = {
  env: env,
  defaultBarTitle: defaultBarTitle['en'],
  defaultImg: defaultImg,
  defaultAlertMsg: defaultAlertMessage,
  defaultShareText: defaultShareText['en'],
  isDev: env === 'dev',
  isProduction: env === 'production',
};
export default core;