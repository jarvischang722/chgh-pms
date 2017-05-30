/**
 * Created by Ian-PC on 2016/11/18.
 */

$(function () {

    $.when(loadAllWardZone(), loadAllUserRole()).done(function (items, data) {

        //載入所有使用者權限
        loadAllPrivilege();



        //編輯使用者角色的按鈕
        $(document).on("click",'.editUserRoleFormBtn',editUserRoleForm);

        //綁定左邊選單的事件
        $(document).on("click",'.user_role_name',function(){

            event.preventDefault();

            //移除掉原本被選取的按鈕
            $(".user_role_name.active").removeClass("active");


            $("input[type=checkbox]").prop('checked', false);


            var user_role_id=$(this).data("user-role-id");
            var user_role_name=$(this).data("user-role-name");


            //存當前被選取的user role
            $("#current_user_role").data("id", user_role_id);
            $("#current_user_role").data("name", user_role_name);

            //讓被點選項目亮起來
            $(this).addClass("active");


            loadPrivilegeByRole(user_role_id);

        });

    });

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
//載入所有病房區
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


var loadAllUserRole=function(){
//載入所有使用者角色

    $.ajax({
        url: "/SystemMaintain/userRoleQuery",
        type: "POST",
        success: function (data) {

            //render畫面
            var source   = $("#userRole-list-template").html();
            var template = Handlebars.compile(source);
            var context = {result: data.user_role_list};
            var html    = template(context);

            $("#userRole-container").html(html);

        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
        }
    })



};



//取得所有使用者角色的病房區權限
var loadAllPrivilege=function(){


    //載入病人的出院備註
    $.ajax({
        url: "/SystemMaintain/getWardZonePrivilege",
        type: "get",
        data: {},
        success: function (data) {


            console.log(data);


        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
        }
    })
}


var loadPrivilegeByRole=function(user_role_id){
//取得特定使用者的病房權限

    $.ajax({
        url: "/SystemMaintain/getWardZonePrivilege",
        type: "GET",
        data:{user_role_id:user_role_id},
        success: function (data) {

            //先讓全部的取消勾選
            $("#wardZone-list-container input[type=checkbox]").prop('checked', false);

            var result=data.result;

            for(var i=0; i<result.length; i++){

                var id=result[i].id;

                $('#wardZone-list-container input[type=checkbox][value='+id+']').prop('checked', true);

            }


        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
        }
    })



};


var updatePrivilegeByRole=function(){
//儲存特定使用者的病房權限

    event.preventDefault();

    var ward_zone_ids=Array();

    //尋遍所有被選擇的病歷
    $('.ward_zone_ids:checkbox:checked').each(function () {

        var ward_zone_id=$(this).val() || 0;

        ward_zone_ids.push(ward_zone_id);


    });


    var user_role_id=$("#current_user_role").data("id") || 0;
    var user_role_name=$("#current_user_role").data("name") || "";

    if(user_role_name=="系統管理員" ){

        alert("無法更新系統管理員的護理站權限");

    }else{

        $.ajax({
            url: "/SystemMaintain/updateWardZonePrivilege",
            type: "POST",
            data:{user_role_id:user_role_id, ward_zone_ids:ward_zone_ids},
            success: function (data) {

                alert("更新使用者的護理站權限完成");

            },
            error: function (err) {
                console.log("Error: " + JSON.stringify(err));
            }
        })

    }


};


var addUserRole=function(){
//新增使用者角色

    event.preventDefault();


    var user_role_name=$("#user_role_name_add").val() || "";


    if(user_role_name=="系統管理員" ){

        alert("無法新增系統管理員");

    }else{

        $.ajax({
            url: "/SystemMaintain/addUserRole",
            type: "POST",
            data:{user_role_name:user_role_name},
            success: function (data) {

                if(data.success){

                    //alert("新增使用者角色完成");
                    //清掉新增用的input box
                    $("#user_role_name_add").val("");
                    //重載清單
                    loadUserRoleList();
                    loadAllUserRole();
                }else{
                    alert("新增使用者角色失敗，名稱可能已存在");

                }


            },
            error: function (err) {
                console.log("Error: " + JSON.stringify(err));
            }
        })

    }


};


var editUserRoleForm=function(){
//修正特定使用者角色的名稱的表單


    var user_role_name=$(this).closest('.role_row').find('#user_role_name_temp').html() || "";

    var user_role_id=$(this).closest('.role_row').find('#user_role_ids').val() || 0;



    $("#user_role_name_edit").val(user_role_name);
    $("#user_role_id_edit").val(user_role_id);


};


var editUserRole=function(){
//修正特定使用者角色的名稱


    var user_role_name=$("#user_role_name_edit").val() || "";

    var user_role_id=$("#user_role_id_edit").val() || 0;

    if(user_role_name=="系統管理員" ){

        alert("無法命名為系統管理員");

    }else{

        $.ajax({
            url: "/SystemMaintain/updateUserRole",
            type: "POST",
            data:{user_role_name:user_role_name,user_role_id:user_role_id},
            success: function (data) {

                if(data.success){

                    //alert("更新使用者角色名稱完成");
                    //重載清單
                    loadUserRoleList();
                    loadAllUserRole();

                }else{
                    alert("更新使用者角色名稱完成，名稱可能已存在");

                }




            },
            error: function (err) {
                console.log("Error: " + JSON.stringify(err));
            }
        })

    }


};


//批次刪除使用者角色
var deleteUserRole=function(){
    event.preventDefault();
    confirm("確定刪除嗎? ", function(result){
        if (result){

            var user_role_ids=Array();

            //尋遍所有被選擇的病歷
            $('.user_role_ids:checkbox:checked').each(function () {

                var user_role_id=$(this).val() || 0;

                //系統管理員不能被砍
                if(user_role_id!=1){
                    user_role_ids.push(user_role_id);
                }



            });



            $.ajax({
                type: "post",
                url: "/SystemMaintain/deleteUserRole",
                data:{user_role_ids:user_role_ids},
                success: function(data) {

                    //alert("刪除使用者角色成功");
                    //重新清單
                    loadUserRoleList();
                    loadAllUserRole();

                }


            });
        }
    })




}


var loadUserRoleList=function(){
//管理使用者角色

    $(".select_all_remodal").prop('checked', false);


    $.ajax({
        url: "/SystemMaintain/userRoleQuery",
        type: "POST",
        data:{},
        success: function (data) {


            //render畫面
            var source   = $("#userRole-list-manage-template").html();
            var template = Handlebars.compile(source);
            var context = {result: data.user_role_list};
            var html    = template(context);

            $("#userRole-list-manage-container").html(html);


        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
        }
    })


};