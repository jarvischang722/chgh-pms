/**
 * Created by Ian-PC on 2016/12/04.
 */

$(function () {

     //全選按鈕
    $('.choose_room_stop_check').click(function(e) {
        $('.choose_room_stop_check_check').prop('checked', this.checked);
    });


    //預設今天
    var today = moment().format("MM/DD/YYYY");

    $('#date_range').datepicker('setDate', today);
    $('#date_range').val(moment().format("YYYY/MM/01")+"~"+moment().format("YYYY/MM/DD"));

    $.when(loadAllSIPClass(),setMenuCenter()).done(function (items, data) {

        //載入所有已被指派的sip裝置
       // loadAllSIP();
        loadeAllSIPRecord();

    });



    $("#time_range_1, #time_range_2").html("");
    $("#time_range_1, #time_range_2").append($("<option>").attr('value',"").text("--"));

    for(var i=0; i<=60; i++){

        $("#time_range_1, #time_range_2").append($("<option>").attr('value',i).text(i));

    }

    $("#showAllWardZone").click(loadAllWardZone);
    $("#search_btn").click(loadeAllSIPRecord);


});

var loadAllWardZone=function(){
//載入所有病房區

    //先取消全選
    $('.choose_room_stop_check_check').prop('checked', false);
    //全選按鈕
    $('.choose_room_stop_check').prop('checked', false);

    $.ajax({
        url: "/Bed/getAllWardZone",
        type: "get",
        data: {},
        success: function (data) {

            var source   = $("#wardZone-list-template").html();
            var template = Handlebars.compile(source);
            var context = {result: data.result};
            var html    = template(context);

            $("#wardZone-list-container").html(html);

        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
        }
    })


};

//設定畫面置中
var setMenuCenter=function(){

    jQuery.fn.center_vertical = function(parent) {
        if (parent) {
            parent = this.parent();
        } else {
            parent = window;
        }
        this.css({
            "position": "absolute",
            "top": ((($(parent).height() - this.outerHeight()) / 2) + $(parent).scrollTop() + "px")
        });
        return this;
    }
    $("#choose_room_stop").center_vertical(true);

}
var SIPClassMap={};

//取得SIP裝置的類型
//病人待辦事項
var loadAllSIPClass=function(){


    //載入病人的出院備註
    $.ajax({
        url: "/SystemMaintain/SIPDeviceClass",
        type: "get",
        data: {},
        success: function (data) {

            //編輯\新增裝置分派的，裝置型態下拉選單

            $("#select_da").html("");
            //3.3 P59 加入全部項目
            $("#select_da").append($("<option>").attr('value',"").text("全部"));


            if(data.success){

                var results = data.result;

                for(var i=0; i<results.length; i++){

                    var result=results[i];

                    var no = result.no;
                    //放入對應的array中
                    SIPClassMap[no]=result["name"];


                    $("#select_da").append($("<option>").attr('value',no).text(result["name"]));



                }




            }else{

            }



        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
        }
    })
}



var loadeAllSIPRecord=function(){



    var date_range=$("#date_range").val() || "";

    date_range=date_range.split("~");

    var start_date=date_range[0] || moment().format("YYYY/MM/DD");
    start_date.trim();

    var end_date=date_range[1] || start_date;
    end_date.trim();

    console.log("start_date:"+start_date);
    console.log("end_date:"+end_date);

    var da=$("#select_da").val() || null;

    var second_start =$("#time_range_1").val()*60 || null;
    //因為1分跟1分59包都是同一分，所以這邊加59秒進去，讓RANGE比較fit
    var second_end =$("#time_range_2").val()*60|| null;
    if(second_end){second_end+=59;}

    //載入病人的出院備註
    $.ajax({
        url: "/other/api/getAllSIPRecord",
        type: "get",
        data: {start_date:start_date, end_date:end_date, da:da, second_start:second_start, second_end:second_end},
        success: function (data) {


            if(data.success){

                var results=data.result;


                //轉換裝置類型從數字變成名稱
                for(var i=0; i<results.length; i++){

                    var da_temp = results[i].type;
                    results[i].typeName = SIPClassMap[da_temp] ;


                    //擷取發話端
                    //SIP/XXXX-000000ff，只取xxxx
                    var clid_temp = results[i].clid;

                    clid_temp=clid_temp.split(/<(\w*)>/);

                    results[i].src=clid_temp[1] || results[i].clid;



                    //擷取受話端
                    //SIP/XXXX-000000ff，只取xxxx

                    var dstchannel_temp = results[i].dstchannel;

                    try{
                        dstchannel_temp=dstchannel_temp.split(/SIP\/(\d*)/);
                        results[i].dst=dstchannel_temp[1];
                    }catch(e){
                        results[i].dst=results[i].dstchannel;
                    }



                    //通話時間從seconds改成time format
                    var duration_temp = results[i].duration;

                    results[i].duration_str=moment.utc(duration_temp*1000).format("HH:mm:ss");


                }



                //render畫面
                var source   = $("#sip-record-list-template").html();
                var template = Handlebars.compile(source);
                var context = {result: data.result};
                var html    = template(context);


                $("#sip-record-list-container").html(html);



            }else{

            }



        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
        }
    })
}