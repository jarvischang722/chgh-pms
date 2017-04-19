/**
 * Created by Jun on 2017/4/9.
 */

/**
 * 格式化日期
 */
Vue.filter("fmtDateMMDD", function (val) {
    return moment(val).format("MM/DD");
});

/**
 * api 性別文字轉換
 */
Vue.filter("convSexStringToParma", function (sex) {
    if (sex == "男") {
        return "male";
    } else {
        return "female";
    }

});

/**
 * 出生年月日轉換年齡
 */
Vue.filter("convBirthdayToAge", function (birth_str) {

    if(!_.isUndefined(birth_str)) {
        var year = birth_str.substring(0, 4);
        var month = birth_str.substring(4, 6);
        var day = birth_str.substring(6, 8);
        var age = moment().diff(new Date(year + "/" + month + "/" + day), "years");
        return age;
    }else{
        return "";
    }
});