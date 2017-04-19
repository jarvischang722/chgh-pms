/**
 * Created by Eason on 2017/4/16.
 */
$(function () {
    initialize(); //初始執行
    //body dom event
    $('body').on("click", "#refresh", function(event) {
        event.preventDefault();
        initialize();
    });
});
//初始
function initialize(){
    var querydate = moment().format("YYYY/MM/DD");
    getDuty(querydate);
    /*
    $.ajax({
        method: "GET",
        url: "api/getNurseSche"
    })
        .done(function( result_obj ) {
            console.log(result_obj);

            var sche = result_obj.result;
            //依病房排班顯示
            createTemp01(sche,"A","nurse_tabs_nested_A");
            createTemp01(sche,"B","nurse_tabs_nested_B");
            createTemp01(sche,"C","nurse_tabs_nested_C");

            //依護理師排班顯示
            createTemp02(sche,"A","nurse_tabs_nested_D");
            createTemp02(sche,"B","nurse_tabs_nested_E");
            createTemp02(sche,"C","nurse_tabs_nested_F");
        });
        */
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
            /*
            var exist_datas = response.result;
            if(exist_datas && exist_datas.length > 0){
                var msg="";
                for(var i=0;i<exist_datas.length;i++){
                    var data=exist_datas[i];
                    msg += "病房:"+data.ward_name+"-"+data.bed_name+" 班別:"+data.class_name+" 日期:"+moment(data.assign_date).format('YYYY/MM/DD')+"排班資料已存在\n";
                }
                alert(msg);
            }
            getThisNurseSche({
                month:selected_month,
                year:selected_year,
                nurse_no:nurse_no,
                nurse_name:nurse_name,
                nurse_tel:nurse_tel
            });
            */
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