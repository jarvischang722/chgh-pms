/**
 * Created by Ian-PC on 2016/12/10.
 */

$(function () {


        loadAllInfo();


});


var loadAllInfo=function(){


    $.ajax({
        url: "/SystemMaintain/logInfoGet",
        type: "get",
        data: {},
        success: function (data) {

            if(data.success){

                var results = data.result;

                $("#version").html(results["version"]);
                //$("#userKey").html(results["key"]);

            }else{

            }
        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
        }
    })



};