$(function () {


    //載入全部病人的資料
    loadTodayDischargeNote();



});


var current_datetime = moment().format("YYYY-MM-DD HH:mm:ss");
var current_date = moment().format("YYYY-MM-DD");

//載入今日離院病人的出院備註
loadTodayDischargeNote=function(){

    //載入全部病人的資料
    $.ajax({
        url: "/Patient/PatientDischargedRemark",
        type: "get",
        data: {ward_zone_id:1, expect_discharged_date:current_date},
        success: function (data) {

            console.log(data);
            if(data.success){



                if(data.result.length>0){

                    //render畫面
                    var source   = $("#patient-dischargeNote-template").html();
                    var template = Handlebars.compile(source);
                    var context = {result: data.result};
                    var html    = template(context);

                    $("#out").removeClass("no_data");

                }else{
                    //沒資料時，顯示無病患

                    $("#out").addClass("no_data");


                }

                $("#dischargeNote_container").html(html);

            }else{

            }
        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
        }
    })
}
