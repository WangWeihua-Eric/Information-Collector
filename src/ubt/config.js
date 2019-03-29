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
    /* 可定制选项 */
    design: {
        /* 可定制 pageName 生成方式 */
        generatePageName: function () {

        }
    }
}
