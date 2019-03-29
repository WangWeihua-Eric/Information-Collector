import storage from './storage'
import defaultConfig from './config'
import {uuid, parseJSON, getDevicePlatform, getQueryByKey} from './utils'

class QunarUbt {
    constructor (config = {}) {
        let design = config.design || {}
        this.designFunc(design)
        /* 统计默认配置 */
        this.defaultConfig = {
            ...defaultConfig,
            ...config
        }

        /* 只能读取不能复制，赋值使用  setStorageValue 函数 (初始化操作除外)*/
        this._data = {
            /* 公用属性 */
            uniqId: this.getUniqId(),
            userId: uuid(),
            prePageName: this.getValueSync('prePageName'),
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

        this.getlatlng()
        this.resetStorage(this._data)

        if (this._data.env === 'dev') {
            console.info('_data init', _data)
        }
    }

    /* 定制组件 */
    designFunc (dFuncObj = {}) {
        for (let i in dFuncObj) {
            if (this[i]) {
                this[i] = dFuncObj[i]
            }
        }
    }

    pageInit () {
        /* 获取页面id */
        this.getStorageValue('')
    }

    view () {

    }

    click () {

    }

    log () {

    }

    /* 数据存储，暂时只支持localstorage */
    getStorageValue (key) {
        let storageJsonStr = this.storage.getItem(this.defaultConfig.storageKey)
        let res =  parseJSON(storageJsonStr)
        this._data = res
        return res[key] || ''
    }

    setStorageValue (key, val) {
        let res =  parseJSON(this.storage.getItem(this.defaultConfig.storageKey))
        res[key] = val
        this._data = res
        this.storage.setItem(this.defaultConfig.storageKey, JSON.stringify(res))
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
    getvalFromUrlAndStorage (key) {
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
        let pageName = pathname.replace(/\//ig, '-')
        if (pageName === '-') {
            pageName = this.defaultConfig.indexPageFlag
        }
        if (this.defaultConfig.env === 'dev') {
            console.info('pageName:', pageName)
        }
        return pageName
    }

    /* 是否是首页判断 */
    isIndexPage () {
    }

    /* 获取会话唯一Id */
    getUniqId () {
        let uniqueId = uuid ()
        /* 判断是否是首页, 会话的生命周期，unique的有效性，首页强制重置uniqueId */
        if (!this.isIndexPage()) {
            uniqueId = this.getvalFromUrlAndStorage('uniqId') || uuid()
        }

        this.setStorageValue('uniqueId', uniqueId)
        return uniqueId
    }

    /* 使用hysdk获取用户id, 异步函数 */
    async getUserId () {
        let uid = uuid()
        this.setStorageValue('userId', uid)
    }

    getPageName () {
        let pageName = this.generatePageName()
        this.setStorageValue('pageName', pageName)
    }

    /* 获取对应的key值，并且同步到本地存储 */
    getValueSync (key) {
        let temp = this.getvalFromUrlAndStorage(key) || ''
        this.setStorageValue('key', temp)
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

}

/*
* 静态属性
*/

/* 后续加入版本号控制管理 */
QunarUbt.prototype._version = '1.0.0'
QunarUbt.prototype.storage = storage

window.QunarUbt = QunarUbt
console.log(new QunarUbt())

