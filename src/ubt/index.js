import storage from './storage'
import defaultConfig from './config'
import * as utils from './utils'
import {uuid, parseJSON, getDevicePlatform, getQueryByKey, isCtrip} from './utils'
import Cookies from 'js-cookie'
import { debug } from 'util';

function devHelper (env) {
  if (env === 'dev') {
    return console
  } else {
    let keys = Object.keys(console)
    let emptyConsole = {}
    for (let i in keys) {
      emptyConsole[keys[i]] = function () {}
    }
    return emptyConsole
  }
}

class QunarUbt {
    constructor (config = {}) {
        let design = config.design || {}
        this.designFunc(design)
        /* 统计默认配置 */
        this.defaultConfig = {
            ...defaultConfig,
            ...config
        }

        this.qlog = devHelper(this.defaultConfig.env)
        /* 只能读取不能复制，赋值使用  setStorageValue 函数 (初始化操作除外)*/
        this._data = {
            /* 公用属性 */
          uniqId: '',
          userId: '',
          prePageName: '',
          pageName: '',
          /* 页面渠道来源 */
          nfrom: '',
          /* 页面运营平台 */
          platfrom: '',
          /* ios/adr/H5/wx  */
          runEnv: '',
          actionTime: Date.now(),
          /* 行为类型 view/click/write */
          action: '',
          /* 行为的特别描述 */
          actionName: '',
          /* 具体行为额外附带的数据 */
          actionObject: {

          },
          lat: '0',
          lng: '0',
          /* app 相关属性 */
          vid: 0,
          uid: 0,
          pid: 0
        }
      /* 当所有必要信息都采集完成后，主要是hy的情况下某些信息需要异步获取 */
      this._isReady = false
      this.pageInit()
    }

  /* 定制组件 */
  designFunc (dFuncObj = {}) {
    for (let i in dFuncObj) {
      if (this[i]) {
        let oldFunc = this[i].bind(this)
        this[i] = function () {
          return dFuncObj[i](...arguments, oldFunc)
        }
      }
    }
  }


  pageInit () {
    this._data = {
      /* 公用属性 */
            uniqId: this.getUniqId(),
            userId: this.getUserId(),
            prePageNameLogs: [],
            prePageName: '',
            pageName: this.getPageName(),
            /* 页面渠道来源 */
            nfrom: this.getValueSync('nfrom'),
            /* 页面运营平台 */
            platfrom: this.defaultConfig.platfrom,
            /* ios/adr/H5/wx  */
            runEnv: getDevicePlatform(),
            actionTime: Date.now(),
            /* 行为类型 view/click/write */
            action: '',
            /* 行为的特别描述 */
            actionName: '',
            /* 具体行为额外附带的数据 */
            actionObject: {

            },
            lat: '0',
            lng: '0',
            /* app 相关属性 */
            vid: 0,
            uid: 0,
            pid: 0
        }

        this.setPrePageNameLogs()
        this.getPrePageName()
        this.getlatlng()
        this.resetStorage(this._data)
        this.qlog.info('_data init: ', this._data)
    }

    view () {

    }

    click () {

    }

    log () {

    }

    autoLog () {

    }

    /* 数据存储，暂时只支持localstorage */
    getStorageValue (key) {
        let storageJsonStr = this.storage.getItem(this.defaultConfig.storageKey)
        let res =  parseJSON(storageJsonStr)
        return res[key] || ''
    }

    setStorageValue (key, val) {
        let res =  parseJSON(this.storage.getItem(this.defaultConfig.storageKey))
        res[key] = val
        this.storage.setItem(this.defaultConfig.storageKey, JSON.stringify(res))
        this._data[key] = val
    }

    resetStorage (valObj) {
        let res =  parseJSON(this.storage.getItem(this.defaultConfig.storageKey))
        this._data = valObj
        this.storage.setItem(this.defaultConfig.storageKey, JSON.stringify(valObj))
    }

    clearStorage () {
        this.storage.setItem(this.defaultConfig.storageKey, '{}')
    }

    deleteStorageValue (key) {
        let res =  parseJSON(this.storage.getItem(this.defaultConfig.storageKey))
        delete res[key]
        this._data = res
        this.storage.setItem(this.defaultConfig.storageKey, JSON.stringify(res))
    }

    /* 优先从url中获取参数，如果没有则从本地存储中（localstorage）获取参数,都没有就返回空字符串 */
    getValFromUrlAndStorage (key) {
        let val = getQueryByKey(key)
        if (val) {
            return val
        } else {
            return this.getStorageValue(key)
        }
    }

    /* 自动生成页面名称 */
    generatePageName () {
        let pathname = window.location.pathname
        let baseName = window.location.hostname.split('.')[0]
        pathname = pathname.split('.')[0]
        let pageName = pathname.replace(/^\//ig, '').replace(/\\$/ig, '').replace(/\//ig, '-')
        if (pageName) {
          pageName = `${baseName}_${pageName}`
        } else {
          pageName = baseName
        }
        return pageName
    }

    /* 是否是首页判断 */
    isIndexPage () {
      let url = location.href
      let isIndex = false
      isIndex = url.indexOf(this.defaultConfig.indexPageFlag) + 1 > 0
      this.qlog.log('是否是首页: ', isIndex)
      return isIndex
    }

    /* 获取会话唯一Id */
    getUniqId () {
        let uniqueId = uuid ()
        /* 判断是否是首页, 会话的生命周期，unique的有效性，首页强制重置uniqueId */
        if (!this.isIndexPage()) {
          uniqueId = this.getValFromUrlAndStorage('uniqId') || uuid()
        }

        this.setStorageValue('uniqueId', uniqueId)
        return uniqueId
    }

    getPageName () {
        let pageName = this.generatePageName()
        this.qlog.info('pageName:', pageName)
        this.setStorageValue('pageName', pageName)
      return pageName
    }

  getPrePageName () {
    /* 如果有前一页的名称记录，优先从url中取  */
    let temp = getQueryByKey('prePageName') || ''
    if (!temp) {
      if (this._data.prePageNameLogs.length > 1) {
        temp = this._data.prePageNameLogs[this._data.prePageNameLogs.length - 2]
      } else {
        temp = this.generatePageName()
      }
    }
    this.setStorageValue('prePageName', temp)
    return temp
  }

  /* 设置页面访问记录 */
  setPrePageNameLogs () {
    let tempArry = [].concat(this.getStorageValue('prePageNameLogs'));
    /* 如果是当前页刷新, 则不记录 */
    if (tempArry[tempArry.length - 1] !== this._data.pageName) {
      tempArry.push(this._data.pageName)
      /* 只保留近的10条记录 */
      tempArry = tempArry.slice(-10)
    }

    this._data.prePageNameLogs = tempArry
    this.setStorageValue('prePageNameLogs', tempArry)
    }

    /* 获取对应的key值，并且同步到本地存储 */
    getValueSync (key) {
      let temp = this.getValFromUrlAndStorage(key) || ''
      this.setStorageValue(key, temp)
      return temp
    }

    /* 获取经纬度 */
    getlatlng () {
        let latlng =  {
            lat: 0,
            lng: 0
        }

        if (!navigator.geolocation) {
            return latlng
        }

        try {
            var options = {
                timeout: 5 * 1000,
                maximumAge: 15 * 1000
            };

            var success = (pos) => {
                var crd = pos.coords;
                latlng = {
                    lat: crd.latitude,
                    lng: crd.longitude,
                    accuracy: crd.accuracy,
                    coordsType: 'wgs84'
                }

                this.setStorageValue('lat', latlng.lat)
                this.setStorageValue('lng', latlng.lng)
                console.log('Your current position is:');
                console.log('Latitude : ' + crd.latitude);
                console.log('Longitude: ' + crd.longitude);
                console.log('More or less ' + crd.accuracy + ' meters.');
            };

            var error = (err) => {
                console.log(err)
                console.warn('ERROR(' + err.code + '): ' + err.message);
                this.setStorageValue('lat', 0)
                this.setStorageValue('lng', 0)
            };
            navigator.geolocation.getCurrentPosition(success, error, options);
        } catch (e) {
            console.log(e)
        }
    }
  /* 存储sdk还没有实例化之前的action，等待成功后再次调用 */
  saveActions (type, data) {
  }


  /* 生成用户userId */
  generateUserId (callback = function () {}, handler, QunarUbt) {
    let userId = uuid()
    let hy = this.defaultConfig.hysdk
    let ctripCookie = parseJSON(Cookies.get('ctripCookie'))
    /* 使用hy获取用户信息,在hy情况下 */
    if (hy && isCtrip ()) {
      hy.getUserInfo && hysdk.getUserInfo({
        success: function (data) {
          if (data && data.data && data.data.UserID) {
            callback(data.data.UserID)
          } else {
            callback(userId)
          }
        },
        fail: function (data) {
          callback(userId)
        }
      });
    } else if (ctripCookie.uid)  {
      userId = ctripCookie.uid
    }
    callback(userId)
    return userId
  }

  /* 获取用户id */
  getUserId () {
    let userId = this.generateUserId((val) => {
      this.setStorageValue('userId', val)
    }, this, QunarUbt)
    this.setStorageValue('userId', userId)
    return userId
  }

  /* 检查sdk 是否已经准备ok */
  checkReady () {

  }



}

/*
* 静态属性
*/
QunarUbt.Utils = utils
QunarUbt.Cookies = Cookies
/* 后续加入版本号控制管理 */
QunarUbt.prototype._version = '1.0.0'
QunarUbt.prototype.storage = storage
window.QunarUbt = QunarUbt

