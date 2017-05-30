/**
 * Created by Jun on 2016/10/20.
 * VUE 專用過濾器
 */

//格式化日期 YYYY/MM/DD
Vue.filter('ymdFormatDate', function (date) {
    return moment.utc(date).format("YYYY/MM/DD");
});