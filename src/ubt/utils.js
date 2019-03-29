let UA = navigator.userAgent
/* 判断是否是携程浏览器运行环境 */
export const isCtrip = function () {
    return (/Ctrip/ig).test(UA)
}

/* 判断是否是微信浏览器环境 */
export const isWechat = function () {
    return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
}
/* 获取浏览器平台信息 */
export const getBorwserPlatform = function () {
    if (isCtrip()) {
        return 'ctrip'
    } else if (isWechat()) {
        return 'wechat'
    } else {
        return 'other'
    }
}

/* 返回设备运行的平台信息 */
export const getDevicePlatform = function () {
    var u = navigator.userAgent
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
        return 'adr'
    } else if (u.indexOf('iPhone') > -1) {
        return 'ios'
    } else if (u.indexOf('Windows Phone') > -1) {
        return 'winphone'
    } else if (isWechat()) {
        return 'wx'
    } else {
        return 'h5'
    }
}

/**
 * 生成uuid
 * @param {Number} len  uuid长度
 * @param {Number} radix 基数
 */
export const uuid = function (len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    var uuid = []
    var i
    radix = radix || chars.length
    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
    } else {
        // rfc4122, version 4 form
        var r
        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'
        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16
                let index = (i === 19) ? (r & 0x3) | 0x8 : r
                uuid[i] = chars[index]
            }
        }
    }
    return uuid.join('')
}

/**
 * 获取url后query参数, 如果不穿入key，则返回所有的参数对象
 * @param {string} key
 */
export const getQueryByKey = function (key) {
    let query = {}
    let href = window.location.search || window.location.href
    let queryStr = href.split('?')[1] || ''
    queryStr.split('&').map(function (item) {
        if (!item) {
            return
        }
        item = item.split('=')
        let val = item[1].split('#')[0]
        query[item[0]] = val
    })
    if (key) {
        return query[key] || ''
    } else {
        return query
    }
}

/**
 * 将一个对象转换为query字符串
 * @param {object} queryObj
 */
export const urlQueryStringify = function (queryObj = {}) {
    let keys = Object.keys(queryObj)
    let queryStrArry = []
    keys.map(function (key) {
        if (queryObj[key]) {
            queryStrArry.push(`${key}=${queryObj[key]}`)
        }
    })
    return queryStrArry.join('&')
}

/* 判断对象是否为空 */
export const isEmptyObj = function (obj) {
    let keys = Object.keys(obj)
    if (keys.length === 0) {
        return true
    } else {
        return false
    }
}

export const parseJSON = function (str = '{}') {
    try {
        /* 入参是对象 */
        if (typeof str === 'object' && Object.prototype.toString.call(str) !== '[object Array]') {
            return str || {}
        }
        /* str是字符串 */
        if (typeof str === 'string') {
            return JSON.parse(str || '{}')
        } else {
            console.error('入参必须是一个json对象字符串')
        }
    } catch (e) {
        console.error(e)
        return {}
    }

}
