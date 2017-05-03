/**
 * Created by Eason on 2017/4/16.
 */
var querydate;

$(function () {
    initialize(); //初始執行
    //body dom event
    $('body').on("click", "#refresh", function(event) {
        event.preventDefault();
        initialize();
    });
    $('body').on("click", "#predate", function(event) {
        querydate = moment(querydate, "YYYY/MM/DD").add(-1, 'days').format("YYYY/MM/DD");
        getDuty(querydate)
    });
    $('body').on("click", "#nextdate", function(event) {
        querydate = moment(querydate, "YYYY/MM/DD").add(1, 'days').format("YYYY/MM/DD");
        getDuty(querydate)
    });
});
//初始
function initialize(){
    querydate = moment().format("YYYY/MM/DD");
    getDuty(querydate);
}
//取得排班資訊
function getDuty(date){
    $.ajax({
        method: "POST",
        url: "api/getDoctorOnDuty",
        data: {querydate:date}
    }).done(function( response ) {
        showAjaxResponeMsg(this.url,response);
        if(response.success){
            var result_table = new Vue({
                el: '#result_table',
                data: {
                    results: response.result
                }
            });

            $('#thisdate').html(date);
        }else{
            e_alertMsg(response);
        }
    });
}

var e_debugMode = true;
function showAjaxResponeMsg(url,response){
    if(e_debugMode){
        console.log(url+"->");
        console.log(response);
    }
}

//錯誤訊息顯示
function e_alertMsg(response){
    if(response.errorCode!=-1){
        alert(response.errorMsg);
    }
}