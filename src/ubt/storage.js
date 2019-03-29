/* 数据存储，暂时只支持localstorage */

var exportStorage = {}
class storageObj {
    constructor () {
        /* 默认将数据放在内存里面 */
        this._storage = {

        }
    }

    getItem (key) {
        return this._storage[key] || ''
    }

    setItem (key, val) {
        this._storage[key] = val
    }

    removeItem (key) {
        delete this._storage[key]
    }

    clear () {
        this._storage = {}
    }
}

exportStorage = new storageObj()

if (window.localStorage) {
    exportStorage = localStorage
}

console.log(exportStorage)

export default exportStorage
