/**
 * Created by Ian-PC on 2016/11/18.
 */

$(function () {

    $.when(loadAllWard(), loadAllSIPClass(),loadAllUnsignSIP() ).done(function (items, data) {

        //載入所有已被指派的sip裝置
        loadAllSIP();

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


//sip類別
var loadAllSIPClass=function(){

    var deferred = $.Deferred();
    //宣告Deferred物件，不然的話ajax跑完就會被當成完成該函式了
    //但是該函式還要連deviceClassMap的輸入值部份也一起完成，才算結束

    //載入sip類別
    $.ajax({
        url: "/SystemMaintain/SIPDeviceClass",
        type: "get",
        cache:false,
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


                deferred.resolve();   //update state

            }else{
                deferred.reject();    //update state
            }



        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
            deferred.reject();    //update state
        }
    })


    return deferred.promise();
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



loadAllSIP=function(){

    //載入SIP資料
    $.ajax({
        url: "/SystemMaintain/SIPDeviceDistribute",
        type: "get",
        data: {ward_zone_id:1},
        success:function(data) {

            if(data.success){

                var results=data.result;

                $("#sip_count").html((data.result).length);


                //轉換裝置類型從數字變成名稱
                for(var i=0; i<results.length; i++){

                    var da_temp = results[i].da;
                    results[i].daName = SIPClassMap[da_temp] ;

                }


                //render畫面
                var source   = $("#sip-list-template").html();
                var template = Handlebars.compile(source);
                var context = {result: data.result};
                var html    = template(context);


                $("#sip-list-container").html(html);



                $(".edit_sip_btn").on("click", editDevice);


            }else{

            }

        }

    });



}



addSIP=function(){

    event.preventDefault();//不關掉彈跳視窗
    var realname=$("#new_realname").val() || "";
    var phoneno=$("#new_phoneno").val() || "";
    var da=$("#new_da").val() || "";
    var comments=$("#new_comments").val() || "";
    var transno=$("#new_transno").val() || "";


    //更新病床資料
    $.ajax({
        url: "/SystemMaintain/updateSIPDeviceDistribute",
        type: "post",
        data: {phoneno:phoneno,da:da, phoneShowContent:realname, ward_name:comments, transno:transno},
        success:function(data) {

            if(data.success){

                //alert("新增SIP資料成功");
                loadAllSIP();


            }else{
                alert("新增SIP資料失敗");
            }

        }

    });


}

editDevice=function(){


    var realname=$(this).closest('.sip_row').find('#realname_temp').val() || "";
    var phoneno=$(this).closest('.sip_row').find("#phoneno_temp").html()|| "";
    var da=$(this).closest('.sip_row').find("#da_temp").val() || 0;
    var comments=$(this).closest('.sip_row').find("#comments_temp").html()|| "";
    var transno=$(this).closest('.sip_row').find("#transno_temp").html() || "";


    $("#edit_phoneno_text").html(phoneno);

    $("#edit_realname").val(realname);
    $("#edit_phoneno").val(phoneno);
    $("#edit_da").val(da);
    $("#edit_comments").val(comments.trim());
    $("#edit_transno").val(transno);


    updateFormStatus('edit');

}


updateSIP=function(){

    var realname=$("#edit_realname").val() || "";
    var phoneno=$("#edit_phoneno").val() || "";
    var da=$("#edit_da").val() || "";
    var comments=$("#edit_comments").val() || "";
    var transno=$("#edit_transno").val() || "";


    //更新病床資料
    $.ajax({
        url: "/SystemMaintain/updateSIPDeviceDistribute",
        type: "post",
        data: {phoneno:phoneno,da:da, phoneShowContent:realname, ward_name:comments, transno:transno},
        success:function(data) {

            if(data.success){

                //alert("更新SIP資料成功");
                loadAllSIP();


            }else{
                alert("更新SIP資料失敗");
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


    if(da==8 || da==9 || da==10 || da==11){
        //只有8 9 10 11必填病房歸屬
        form.find("#"+type+"_comments").show();

    }else{
        form.find("#"+type+"_comments").hide();
        form.find("#"+type+"_comments").val("");
    }


    if(da==10 || da==11){
        //10 11必填類比緊急系統代碼
        form.find("#"+type+"_transno").show();

    }else{

        form.find("#"+type+"_transno").hide();
        form.find("#"+type+"_transno").val("");
    }


    if(da==8 || da==9){
        //8 9不需填寫類比緊急系統代碼

        form.find("#"+type+"_transno").hide();
        form.find("#"+type+"_transno").val("");

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



//批次刪除sip裝置分派資料(多筆)
var deleteSIP=function(){

    confirm("確定刪除嗎? ", function(result){
        if (result){


            var sip_phonenos=Array();

            //尋遍所有被選擇的病歷
            $('.sip_phonenos:checkbox:checked').each(function () {

                var sip_phoneno=$(this).val() || 0;

                sip_phonenos.push(sip_phoneno);


            });




            $.ajax({
                type: "post",
                url: "/SystemMaintain/deleteSIPDeviceDistribute",
                data:{phonenos:sip_phonenos},
                success: function(data) {


                    //alert("刪除SIP分派資料成功");

                    loadAllSIP();
                    loadAllUnsignSIP();

                }


            });

        }
    })

}