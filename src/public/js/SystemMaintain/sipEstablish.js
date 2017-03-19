/**
 * Created by Ian-PC on 2016/12/04.
 */

$(function () {

    $.when(loadAllWardZone()).done(function (items, data) {

        //載入所有的sip IP
        loadAllSIPIP();

    });


    $("#search_sipip_btn").on("click", selectWardzone);

    $("#save_sipip_btn").on("click", addSIPIP);

    $("#delete_sipip_btn").on("click", deleteSIPIP);


    $(document).on("change","#select_ward_zone", selectWardzone);

/*    //載入特定病房區下的病房
    loadAllWard();

    //載入所有sip裝置類型資料
    loadAllSIPClass();

    //載入所有未被指派的sip裝置
    loadAllUnsignSIP();

    //載入所有已被指派的sip裝置
    loadAllSIP();*/

});

var SIPClassMap={};



var loadAllWardZone=function(){
//載入全部的護理站

    $.ajax({
        url: "/Bed/getAllWardZone",
        type: "get",
        data: {},
        success: function (data) {

            //編輯\新增裝置分派的，裝置型態下拉選單
            $("#add_ward_zone").html("");
            $("#add_ward_zone").append($("<option>").attr('value',"0").text("--"));


            $("#select_ward_zone").html("");
            //這邊的-1是代表搜尋全部護理站
            $("#select_ward_zone").append($("<option>").attr('value',"-1").text("--"));

            if(data.success){

                var results = data.result;


                for(var i=0; i<results.length; i++){

                    var result=results[i];

                         //這筆跟上筆的ward_id不同的話才，要插入該病房選項，避免重覆病房出現
                        $("#add_ward_zone").append($("<option>").attr('value',result.id).text(result.ward_zone_name));
                        $("#select_ward_zone").append($("<option>").attr('value',result.id).text(result.ward_zone_name));


                }


            }else{

            }
        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
        }
    })



};


//病人待辦事項
var loadAllSIPClass=function(){


    //載入病人的出院備註
    $.ajax({
        url: "/SystemMaintain/SIPDeviceClass",
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
                    SIPClassMap[no]=result["name"];


                    $("#edit_da").append($("<option>").attr('value',no).text(result["name"]));
                    $("#new_da").append($("<option>").attr('value',no).text(result["name"]));
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




loadAllUnsignSIP=function(){

    //新增裝置時，裝置分機的下拉選單
    $("#new_phoneno").html("");
    $("#new_phoneno").append($("<option>").attr('value',"").text("--"));

    //載入未被assign的SIP資料
    $.ajax({
        url: "/SystemMaintain/SIPDeviceDistribute",
        type: "get",
        data: {is_assign:"no"},
        success:function(data) {

            if(data.success){


                var results = data.result;

                for(var i=0; i<results.length; i++){

                    var result=results[i];

                    $("#new_phoneno").append($("<option>").attr('value',result.phoneno).text(result.phoneno));

                }


            }else{

            }

        }

    });



}



var loadAllSIPIP=function(){

    var ward_zone_id = $("#select_ward_zone").val() || -1;

    //移掉全選的勾勾
    $(".select_all").prop('checked', false);


    //載入SIPIP資料
    $.ajax({
        url: "/SystemMaintain/SIPIP",
        type: "get",
        data: {ward_zone_id:ward_zone_id},
        success:function(data) {

            if(data.success){

                var results=data.result;

                $("#sip_ip_count").html((data.result).length);



                //render畫面
                var source   = $("#sip-ip-list-template").html();
                var template = Handlebars.compile(source);
                var context = {result: data.result};
                var html    = template(context);


                $("#sip-ip-list-container").html(html);




                $(".edit_sipip_btn").on("click", editSIPIPform);


            }else{

            }

        }

    });



}


refreshAddSIPIPform=function(){


    var ward_zone_id=$("#add_ward_zone").val("");
    var sip_ip=$("#add_sip_ip").val("");

    var sip_ip_account=$("#add_sip_ip_account").val("");
    var sip_ip_password=$("#add_sip_ip_password").val("");
    var sip_ip_port=$("#add_sip_ip_port").val("");
    var sip_ip_dbname=$("#add_sip_ip_dbname").val("");


}


addSIPIP=function(){

    event.preventDefault();//不關掉彈跳視窗

    var ward_zone_id=$("#add_ward_zone").val() || "";
    var sip_ip=$("#add_sip_ip").val() || "";

    var sip_ip_account=$("#add_sip_ip_account").val() || "";
    var sip_ip_password=$("#add_sip_ip_password").val() || "";
    var sip_ip_port=$("#add_sip_ip_port").val() || "";
    var sip_ip_dbname=$("#add_sip_ip_dbname").val() || "";

    //新增sip ip
    $.ajax({
        url: "/SystemMaintain/addSIPIP",
        type: "post",
        data: {sip_ip:sip_ip,DBAccount:sip_ip_account,DBPassword:sip_ip_password,DBPort:sip_ip_port,DBName:sip_ip_dbname,ward_zone_id:ward_zone_id},
        success:function(data) {

            if(data.success){

                //alert("新增SIP IP資料成功");
                refreshAddSIPIPform();
                loadAllSIPIP();


            }else{
                alert("新增SIP IP資料失敗");
            }

        }

    });


}


 var editSIPIPform=function(){
     $(document).off("click", "#save_sip_ip_btn");

    var sip_ip_id=$(this).closest('.sip_ip_row').find('.sip_ip_ids').val() || "";
    var sip_ip=$(this).closest('.sip_ip_row').find('#sip_ips').html() || "";
    var ward_zone_name=$(this).closest('.sip_ip_row').find('#ward_zone_names').html() || "";

     var DBAccount=$(this).closest('.sip_ip_row').find('#DBAccounts').html() || "";
     var DBPassword=$(this).closest('.sip_ip_row').find('#DBPasswords').html() || "";
     var DBPort=$(this).closest('.sip_ip_row').find('#DBPorts').html() || "";
     var DBName=$(this).closest('.sip_ip_row').find('#DBNames').html() || "";



    $("#edit_sip_ip_id").val(sip_ip_id);
    $("#edit_sip_ip").val(sip_ip);
    $("#edit_ward_zone_name").html(ward_zone_name);



     $("#edit_sip_ip_account").val(DBAccount);
     $("#edit_sip_ip_password").val(DBPassword);
     $("#edit_sip_ip_port").val(DBPort);
     $("#edit_sip_ip_dbname").val(DBName);




     //更新病床資料的function
     var saveSIPIP=function(){
         $.ajax({
             url: "/SystemMaintain/updateSIPIP",
             type: "post",
             data: {
                 sip_ip_id:sip_ip_id,
                 sip_ip:$("#edit_sip_ip").val(),
                 DBAccount:$("#edit_sip_ip_account").val(),
                 DBPassword:$("#edit_sip_ip_password").val(),
                 DBPort:$("#edit_sip_ip_port").val(),
                 DBName:$("#edit_sip_ip_dbname").val() },
             success:function(data) {

                 if(data.success){

                     //alert("更新SIP IP資料成功");
                     loadAllSIPIP();

                 }else{

                     alert("更新SIP IP資料失敗，該IP可能已存在於該護理站");
                     loadAllSIPIP();
                 }

             }

         });

     }


     $(document).on("click", "#save_sip_ip_btn",saveSIPIP);



}


selectWardzone=function(){

    var ward_zone_id=$("#select_ward_zone").val() || "";


    if(ward_zone_id!=-1 && ward_zone_id){

        $('.sip_ip_row').each(function () {

            var temp_ward_zone_id = $(this).find("#ward_zone_ids").val();

            if( ward_zone_id == temp_ward_zone_id ){

                $(this).show();

            }else{

                $(this).hide();
            }


        });

    }else{

        $('.sip_ip_row').show();

    }


}









//批次刪除多院備註(多筆)
var deleteSIPIP=function(){


    confirm("確定刪除嗎? ", function(result){
        if (result){


            var sip_ip_ids=Array();

            //尋遍所有被選擇的病歷
            $('.sip_ip_ids:checkbox:checked').each(function () {

                var sip_ip_id=$(this).val() || 0;

                sip_ip_ids.push(sip_ip_id);


            });


            $.ajax({
                type: "post",
                url: "/SystemMaintain/deleteSIPIP",
                data:{sip_ip_ids:sip_ip_ids},
                success: function(data) {



                    loadAllSIPIP();

                }


            });

        }
    })

}