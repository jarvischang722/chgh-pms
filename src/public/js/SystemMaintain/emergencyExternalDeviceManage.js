/**
 * Created by Ian-PC on 2016/11/18.
 */

$(function () {

    $.when( loadAllEmergencyExternalDeviceClass(),loadAllWard()).done(function (items, data) {

        //載入所有外部緊急裝置的分派
        loadAllEmergencyExternalDevice();

    });

    //在病房的輸入框，按下enter時，自動開始搜尋
    $("#select_ward_name").on('keyup', function (e) {
        if (e.keyCode == 13) {
            selectBed();
        }
    });



    $("#select_da").on('change', function (e) {

        selectDA();

    });



});

var deviceClassMap={};


var loadAllWard=function(){

//載入病人的出院備註
    $.ajax({
        url: "/Bed/getAllWard",
        type: "get",
        data: {ward_zone_id:1},
        success: function (data) {

            //編輯\新增裝置分派的，裝置型態下拉選單
            $("#edit_comments").html("");
            $("#edit_comments").append($("<option>").attr('value',"").text("--"));


            $("#new_comments").html("");
            $("#new_comments").append($("<option>").attr('value',"").text("--"));

            if(data.success){

                var results = data.result;


                var last_ward_id=0;
                for(var i=0; i<results.length; i++){

                    var result=results[i];

                    if(last_ward_id != result.ward_id){
                        //這筆跟上筆的ward_id不同的話才，要插入該病房選項，避免重覆病房出現
                        $("#edit_comments").append($("<option>").attr('value',result.ward_name).text(result.ward_name));
                        $("#new_comments").append($("<option>").attr('value',result.ward_name).text(result.ward_name));
                        last_ward_id=result.ward_id;
                    }



                }


            }else{

            }
        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
        }
    })



};

var loadAllEmergencyExternalDevice=function(){


    //移掉全選的勾勾
    $(".select_all").prop('checked', false);
    //載入SIP資料
    $.ajax({
        url: "/SystemMaintain/EmergencyExternalDevice",
        type: "get",
        data: {},
        success:function(data) {

            if(data.success){

                var results=data.result;

                $("#device_count").html((data.result).length);


                //轉換裝置類型從數字變成名稱
                for(var i=0; i<results.length; i++){

                    var da_temp = results[i].da;
                    results[i].daName = deviceClassMap[da_temp] ;

                }


                //render畫面
                var source   = $("#device-list-template").html();
                var template = Handlebars.compile(source);
                var context = {result: data.result};
                var html    = template(context);

                $("#device-list-container").html(html);
                $(".edit_device_btn").on("click", editDevice);



            }else{

            }

        }

    });



};


//病人緊急外部裝置類別
var loadAllEmergencyExternalDeviceClass=function(){

    var deferred = $.Deferred();
    //宣告Deferred物件，不然的話ajax跑完就會被當成完成該函式了
    //但是該函式還要連deviceClassMap的輸入值部份也一起完成，才算結束

    //載入病人的出院備註
    $.ajax({
        url: "/SystemMaintain/EmergencyExternalDeviceClass",
        type: "get",
        data: {},
        success: function (data) {

            //編輯\新增裝置分派的，裝置型態下拉選單
            $("#edit_da").html("");
            $("#edit_da").append($("<option>").attr('value',"").text("--"));

            $("#select_da").html("");


            //3.3 P59 加入全部項目
            $("#select_da").append($("<option>").attr('value',"").text("全部"));

            $("#new_da").html("");
            $("#new_da").append($("<option>").attr('value',"").text("--"));

            if(data.success){

                var results = data.result;

                for(var i=0; i<results.length; i++){

                    var result=results[i];

                    var no = result.no;
                    //放入對應的array中
                    deviceClassMap[no]=result["name"];


                    $("#edit_da").append($("<option>").attr('value',no).text(result["name"]));
                    $("#new_da").append($("<option>").attr('value',no).text(result["name"]));
                    $("#select_da").append($("<option>").attr('value',no).text(result["name"]));

                }

                deferred.resolve();   //update state

            }else{
                deferred.reject();    //update state

            }



        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
            deferred.reject();    //update state

        }
    });

    return deferred.promise();
}






addDevice=function(){

    event.preventDefault();//不關掉彈跳視窗
    

    var description=$("#new_description").val() || "";
    var da=$("#new_da").val() || "";
    var comments=$("#new_comments").val() || "";
    var ipaddress=$("#new_ipaddress").val() || "";



    //新增裝置資料
    $.ajax({
        url: "/SystemMaintain/insertEmergencyExternalDevice",
        type: "post",
        data: {
            device_name:description,
            device_class_no:da ,
            ward_name:comments ,
            device_IP:ipaddress},
        success:function(data) {

            if(data.success){

                //alert("加入緊急外部裝置資料成功");
                loadAllEmergencyExternalDevice();


            }else{
                alert("加入緊急外部裝置資料失敗");
            }

        }

    });



}

var editDevice=function(){



    var id=$(this).closest('.device_row').find('#device_ids').val() || "";
    var ipaddress=$(this).closest('.device_row').find('#ipaddress_temp').html() || "";
    var description=$(this).closest('.device_row').find("#description_temp").html()|| "";
    var da=$(this).closest('.device_row').find("#da_temp").val() || 0;
    var comments=$(this).closest('.device_row').find("#comments_temp").html()|| "";


    $("#edit_id").val(id);
    $("#edit_description").val(description);
    $("#edit_da").val(da);
    $("#edit_comments").val(comments);
    $("#edit_ipaddress").val(ipaddress);

    //更新 編輯表單的預設顯示
    updateFormStatus('edit');

}


updateDevice=function(){


    var id=$("#edit_id").val() || "";
    var description=$("#edit_description").val() || "";
    var da=$("#edit_da").val() || "";
    var comments=$("#edit_comments").val() || "";
    var ipaddress=$("#edit_ipaddress").val() || "";



    //更新病床資料
    $.ajax({
        url: "/SystemMaintain/updateEmergencyExternalDevice",
        type: "post",
        data: {
            device_name:description,
            device_class_no:da ,
            ward_name:comments ,
            device_IP:ipaddress,
            emergency_external_device_id:id},
        success:function(data) {

            if(data.success){

                //alert("更新緊急外部裝置資料成功");
                loadAllEmergencyExternalDevice();


            }else{
                alert("更新緊急外部裝置資料失敗");
            }

        }

    });

}



selectBed=function(){

    var select_ward_name=$("#select_ward_name").val() || "";


    if(select_ward_name){

        $('.bed_row').each(function () {

            var temp_ward_name = $(this).find("#ward_name_temp").html();

            if( temp_ward_name == select_ward_name ){

                $(this).show();

            }else{

                $(this).hide();
            }


        });

    }else{

        $('.bed_row').show();

    }


}


//更新新增及編輯sip表單時，欄位的顯示情況
updateFormStatus=function(type){

    var form;

    if(type=='edit'){

        form=$("#edit_form");

        var realname=form.find("#edit_realname").val() || "";
        var phoneno=form.find("#edit_phoneno").val() || "";
        var da=form.find("#edit_da").val() || 0;
        var comments=form.find("#edit_comments").val() || "";
        var transno=form.find("#edit_transno").val() || "";

    }else{
        type='new';
        form=$("#new_form");

        var realname=form.find("#new_realname").val() || "";
        var phoneno=form.find("#new_phoneno").val() || "";
        var da=form.find("#new_da").val() || 0;
        var comments=form.find("#new_comments").val() || "";
        var transno=form.find("#new_transno").val() || "";

    }


    if(da==1){
        //只有0必填病房名稱，但不用寫裝置名稱
        form.find("#"+type+"_comments").show();
        form.find("#"+type+"_description").hide();
        form.find("#"+type+"_description").val("");
    }


    if(da==2){
        //只有1必填裝置名稱，但不用寫病房名稱
        form.find("#"+type+"_comments").hide();
        form.find("#"+type+"_comments").val("");
        form.find("#"+type+"_description").show();
    }


    if(da==3 || da==4){
        //3或4的話，兩者都不用填
        form.find("#"+type+"_comments").hide();
        form.find("#"+type+"_comments").val("");
        form.find("#"+type+"_description").hide();
        form.find("#"+type+"_description").val("");
    }



}



selectDA=function(){


    var select_da=$("#select_da").val() || "";

    console.log(select_da=="");

    if(select_da!=""){

        $('.sip_row').each(function () {

            var temp_da = $(this).find("#da_temp").val();

            if( temp_da == select_da ){

                $(this).show();

            }else{

                $(this).hide();
            }


        });

    }else{

        $('.sip_row').show();

    }





}



//批次刪除裝置資料(多筆)
var deleteDevice=function(){


    confirm("確定刪除嗎? ", function(result){
        if (result){


            var device_ids=Array();

            //尋遍所有被選擇的病歷
            $('.device_ids:checkbox:checked').each(function () {

                var device_id=$(this).val() || 0;

                device_ids.push(device_id);


            });



            $.ajax({
                type: "post",
                url: "/SystemMaintain/deleteEmergencyExternalDevice",
                data:{emergency_external_device_ids:device_ids},
                success: function(data) {


                    //alert("刪除緊急裝置分配資料成功");

                    loadAllEmergencyExternalDevice();

                }


            });

        }
    })

}



selectBed=function(){

    var select_ward_name=$("#select_ward_name").val() || "";

    if(select_ward_name){

        $('.device_row').each(function () {

            var temp_ward_name = $(this).find("#comments_temp").html();

            if( temp_ward_name == select_ward_name ){

                $(this).show();

            }else{

                $(this).hide();
            }


        });

    }else{

        $('.device_row').show();

    }


}



var selectDA=function(){


    var select_da=$("#select_da").val() || "";


    if(select_da!=""){

        $('.device_row').each(function () {

            var temp_da = $(this).find("#da_temp").val();

            if( temp_da == select_da ){

                $(this).show();

            }else{

                $(this).hide();
            }


        });

    }else{

        $('.device_row').show();

    }





}
