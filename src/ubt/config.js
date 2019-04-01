export default {
    /* storage 键值的默认前缀 */
    storageKey: 'qunar_ubt',
    /* 首页的路径表示，会从location的中url去匹配判断当前页面是否是首页 */
    indexPageFlag: 'index',
    /* 统计地址 */
    ubtUrl: '',
    env: 'dev',
    /* 页面运营平台 C-携程 Q-去哪儿 */
    platfrom: 'C',
    /* U-用户侧 D-司机侧 */
    appType: 'U',
    /* 20-即刻 30-专车立即单 40-超巴 50-专车预约单 */
    businessType: '20',
    /* 是否自动上报 */
    autoLog: true,
    /* 可定制选项 */
    design: {
      /* 可定制 pageName 生成方式 */
      generatePageName: function () {
        console.log('生成页面名')
      },
      /* 获取userId的方式，可以定制, 如果uid的获取方式是异步，请将生成的uid传入callback函数 */
      generateUserId: function (callback) {
        /* 异步操作时 使用 callback(window.QunarUbt.uuid()) */
        console.log('2312')
        return window.QunarUbt.uuid()
      }
    },
    /* 是否提供cq hysqk插件，提供该插件后，统计数据中会附带pid/uid/vid等参数 */
    hysdk: null
}
