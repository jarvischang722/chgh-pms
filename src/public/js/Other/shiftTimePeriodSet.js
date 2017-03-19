//畫面變數
var AllMin=[];
var AllHour=[];
$(function () {
    initialize(); //初始執行

    //dom event
    $("#insert_btn").click(doInsert);
    $("#update_btn").click(doUpdate);
    $("#delete_btn").click(doDelete);

    $(document).on('click', '.edit_period', function () {
        var data = $(this);
        edit_period(data.data());
    });
    $(document).on('click', '#new_btn', function () {
        $( "#insert_form" )[0].reset();
    });
});
/**
 *
 */
function initialize() {
    //時段
    $.ajax({
        method: "GET",
        url: "api/getAllTimePeriod",
    }).done(function (response) {
        console.log(response);
        if (response.success) {
             var periods_results = {
                 periods: response.result
             };
             var tmp = Handlebars.compile($("#timeperiods_temp").html());
             $('#all_periods_body').html("");
             $('#all_periods_body').append(tmp(periods_results));
        } else {
            alert(response.errorMsg);
        }
    });
    //時間下拉選單
    for(var i=0;i<24;i++){
        var thisobj={};
        var str = i;
        if(i<10){
            str = "0"+i;
        }
        thisobj["key"] = str;
        thisobj["value"] = str;
        AllHour.push(thisobj);
    }
    for(var i=0;i<60;i++){
        var thisobj={};
        var str = i;
        if(i<10){
            str = "0"+i;
        }
        thisobj["key"] = str;
        thisobj["value"] = str;
        AllMin.push(thisobj);
    }
    var hour_results = {
        hours: AllHour
    };
    var tmp = Handlebars.compile($("#hour_temp").html());
    $('#start_hour_select').html("");
    $('#start_hour_select').append(tmp(hour_results));
    $('#end_hour_select').html("");
    $('#end_hour_select').append(tmp(hour_results));
    var min_results = {
        mins: AllMin
    };
    var tmp = Handlebars.compile($("#min_temp").html());
    $('#start_min_select').html("");
    $('#start_min_select').append(tmp(min_results));
    $('#end_min_select').html("");
    $('#end_min_select').append(tmp(min_results));
}
/**
 * 新增時段
 */
function doInsert() {
    $.ajax({
        method: "POST",
        url: "api/insertTimePeriod",
        data: $( "#insert_form" ).serialize()
    }).done(function (response) {
        if (response.success) {
            initialize();
            //alert("新增成功!");
        } else {
            alert(response.errorMsg);
        }
    });
}
/**
 * 編輯時段
 */
function edit_period(data) {
    data.AllHour = AllHour;
    data.AllMin = AllMin;
    var period_results = {
        period: data
    };
    var tmp = Handlebars.compile($("#edit_period_temp").html());
    $('#edit_period_div').html("");
    $('#edit_period_div').append(tmp(period_results));
}
/**
 * 更新時段
 */
function doUpdate() {
    $.ajax({
        method: "POST",
        url: "api/updateTimePeriod",
        data: $( "#update_form" ).serialize()
    }).done(function (response) {
        if (response.success) {
            initialize();
            //alert("編輯成功!");
        } else {
            alert(response.errorMsg);
        }
    });
}
/**
 * 刪除時段
 */
function doDelete() {
    event.preventDefault();


    confirm("確定刪除嗎? ", function(result){
        if (result){

            //取得checkbox selected
            var searchIDs = $("#period_table input:checkbox:checked").map(function () {
                return {'id': $(this).val()};
            }).get();

            $.ajax({
                method: "POST",
                url: "api/deleteTimePeriod",
                data: {"periods": searchIDs}
            }).done(function (response) {
                    if (response.success) {
                        initialize();
                        //alert("刪除成功!");
                    } else {
                        alert(response.errorMsg);
                    }
                });
        }
    })

}
