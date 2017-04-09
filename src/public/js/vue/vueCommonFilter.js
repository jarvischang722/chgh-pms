/**
 * Created by Jun on 2017/4/9.
 */

/**
 * 格式化日期
 */
Vue.filter("fmtDate",function(val){
    return moment(val).format("YYYY/MM/DD");
});

/**
 * api 性別文字轉換
 */
Vue.filter("convSexStringToParma",function(sex){
    if(sex == "男"){
        return "male";
    }else{
        return "female";
    }

});