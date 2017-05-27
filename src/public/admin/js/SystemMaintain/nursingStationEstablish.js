/**
 * Created by Ian-PC on 2016/12/04.
 */

$(function () {


    loadAllWardZone();


    $("#delete_wardzone_btn").on("click", deleteWardzone);

    $(document).on("click",".edit_btn", editWardzoneform);


    $(document).on("click","#select_ward_zone_btn", selectWardzone);
/*    //載入特定病房區下的病房
    loadAllWard();

    //載入所有sip裝置類型資料
    loadAllSIPClass();

    //載入所有未被指派的sip裝置
    loadAllUnsignSIP();

    //載入所有已被指派的sip裝置
    loadAllSIP();*/

});


var loadAllWardZone=function(){
//載入全部的護理站


    $(".select_all").prop('checked', false);

    $.ajax({
        url: "/SystemMaintain/wardZoneInfoGet",
        type: "get",
        data: {},
        success: function (data) {

            var module_list_mapping={};
            var modules = data.module_list;
            var results = data.result;

            //1.建立模組名稱的中英對應
            for(var i=0;i<modules.length;i++){

                var module=modules[i];
                var module_name=module["module_name"];
                var module_eng_name=module["module_eng_name"];
                module_list_mapping[module_eng_name]=module_name;

            }

            //2.產生模組的中文字串
            for(var i=0;i<results.length;i++){

                var result=results[i];

                var system_module_list="";

                var module_eng_names =result["module_eng_name"];


                $.each(module_eng_names, function( index, module_eng_name ) {

                    system_module_list += module_list_mapping[module_eng_name]+",";

                });


                results[i]["system_module_list"]=system_module_list.replace(/,\s*$/, "");

            }




            $("#ward_zone_count").html(results.length);


            //render畫面
            var source   = $("#ward-zone-list-template").html();
            var template = Handlebars.compile(source);
            var context = {result: results};
            var html    = template(context);


            $("#ward-zone-list-container").html(html);

        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
        }
    })



};




 var editWardzoneform=function(){
     $(document).off("click", "#edit_save_btn");

    var ward_zone_id=$(this).closest('.ward-zone-row').find('.ward_zone_ids').val() || "";
    var ward_zone_description=$(this).closest('.ward-zone-row').find('.ward_zone_descriptions').html() || "";
    var ward_zone_name=$(this).closest('.ward-zone-row').find('.ward_zone_names').html() || "";


    $("#edit_ward_zone_name").val(ward_zone_name);
    $("#edit_ward_zone_id").val(ward_zone_id);
    $("#edit_ward_zone_description").val(ward_zone_description);


     //更新護理站資料的function
     var saveWardzone=function(){
         $.ajax({
             url: "/SystemMaintain/updateWardzone",
             type: "post",
             data: {

                 ward_zone_id:ward_zone_id,
                 wardZoneName:$("#edit_ward_zone_name").val(),
                 wardZoneDescription:$("#edit_ward_zone_description").val()


             },
             success:function(data) {

                 if(data.success){

                     //alert("更新護理站資料成功");
                     loadAllWardZone();

                 }else{

                     alert("更新護理站資料失敗");
                     loadAllWardZone();
                 }

             }

         });

     }


     $(document).on("click", "#edit_save_btn",saveWardzone);



}


selectWardzone=function(){

    var ward_zone_name=$("#select_ward_zone").val() || "";


    if(ward_zone_name!=""){

        $('.ward-zone-row').each(function () {

            var temp_ward_zone_names = $(this).find(".ward_zone_names").html();

            if( temp_ward_zone_names.includes(ward_zone_name) ){

                $(this).show();

            }else{

                $(this).hide();
            }


        });

    }else{

        $('.ward-zone-row').show();

    }


}









//批次刪除護理站(多筆)
var deleteWardzone=function(){

    confirm("確定刪除嗎? ", function(result){
        if (result){

            var ward_zone_ids=Array();

            //尋遍所有被選擇的病歷
            $('.ward_zone_ids:checkbox:checked').each(function () {

                var ward_zone_id=$(this).val() || 0;

                ward_zone_ids.push(ward_zone_id);


            });


            $.ajax({
                type: "post",
                url: "/SystemMaintain/wardZoneModuleInfoDelete",
                data:{ward_zone_ids:ward_zone_ids},
                success: function(data) {


                    //alert("刪除護理站資料成功");

                    loadAllWardZone();

                }


            });
        }
    })


}