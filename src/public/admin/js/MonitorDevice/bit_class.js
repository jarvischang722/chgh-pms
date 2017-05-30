/**
 * Created by Ian-PC on 2016/12/04.
 */
var globalBitPipeClass = [];
$(function () {

    //載入所有資訊
    initAll();


    $(document).on("change","#select_bit_class", loadSelectBitClass);


    $("#add_bit_class_btn").on("click", add_bit_class);

    $("#delete_bit_class_btn").on("click", delete_bit_class);

    $(document).on("click", ".edit_bit_class_btn",  edit_bit_class);

    $(document).on("click", ".edit_bit_pipe_class_btn" , edit_bit_pipe_class);

    $(document).on("click", "#doEditBitPipeClassBtn" , updateBitePipeClass);

    $(document).on("click", "#addBitPipe" , addBitPipeClass);



    /*    //載入特定病房區下的病房
     loadAllWard();

     //載入所有sip裝置類型資料
     loadAllSIPClass();

     //載入所有未被指派的sip裝置
     loadAllUnsignSIP();

     //載入所有已被指派的sip裝置
     loadAllSIP();*/

});


var initAll=function(){

    $.when(loadAllBitClass(),loadBitPipeClass()).done(function (items, data) {


        $("#add_bit_no").val("");
        $("#add_bit_class_name").val("");
        $("#add_bit_capacity").val("");
        $("#add_bit_name").val("");
        $("#add_bit_empty_weight").val("");
        $(".select_all").prop('checked', false);

        //載入特定點滴種類的資料
        loadSelectBitClass();

    });
}


var SIPClassMap={};

var BitClassMap={};


var loadAllBitClass=function(){
//載入全部的點滴種類

    var deferred = $.Deferred();
    //宣告Deferred物件，不然的話ajax跑完就會被當成完成該函式了

    $.ajax({
        url: "/monitor/queryBitClass",
        type: "get",
        data: {},
        success: function (data) {

            $("#select_bit_class").html("");
            //這邊的-1是代表搜尋全部護理站
            $("#select_bit_class").append($("<option>").attr('value',"0").text("--"));

            if(data.success){

                var results = data.result;



                //.載入"建立點滴種類"的資料
                //render畫面
                var source   = $("#bit-class-list-template").html();
                var template = Handlebars.compile(source);
                var context = {result: data.result};
                var html    = template(context);

                $("#bit-class-list-container").html(html);


                $(".edit_bit_class_btn").on("click", edit_bit_class);

                //2.載入主畫面的下拉選單view
                for(var i=0; i<results.length; i++){

                    var result=results[i];

                    $("#select_bit_class").append($("<option>").attr('value',result.id).text(result.bit_class_name));

                    //建立id與資料的cache
                    BitClassMap[result.id]=result;

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
};



//讀入點滴輸液管種類
var loadBitPipeClass = function(){

    var deferred = $.Deferred();
    //宣告Deferred物件，不然的話ajax跑完就會被當成完成該函式了

    $.ajax({
        url: "/monitor/queryBitPipeClass",
        type: "POST",
        success: function (data) {


            if(data.success){

                var results = data.result;
                var bitPipeClassList = results.bitPipeClassList || [];

                globalBitPipeClass =  bitPipeClassList
                showBitPipeClassList(bitPipeClassList);
                showBitPipeClassDropDown(bitPipeClassList);
                changePipe();
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



var loadSelectBitClass=function(){

    var bit_class_id=$("#select_bit_class").val() || 0;

    try{

        var result = BitClassMap[bit_class_id];

        $("#bit_class_capacity").html(result['bit_capacity']+" ml");
        $("#bit_class_empty_weight").html(result['bit_empty_weight']+" g");

    }catch(e){

        $("#bit_class_capacity").html("");
        $("#bit_class_empty_weight").html(" ");

    }


}


add_bit_class=function(){
    event.preventDefault();//不關掉彈跳視窗

    var bit_no=$("#add_bit_no").val();
    var bit_class_name=$("#add_bit_class_name").val();
    var bit_capacity=$("#add_bit_capacity").val();
    var bit_name=$("#add_bit_name").val();
    var bit_empty_weight=$("#add_bit_empty_weight").val();


    $.ajax({
        url: "/monitor/addBitClass",
        type: "post",
        data: {
            bit_no:bit_no,
            bit_class_name:bit_class_name,
            bit_capacity:bit_capacity,
            bit_name:bit_name,
            bit_empty_weight:bit_empty_weight
        },
        success:function(data) {

            if(data.success){

                //alert("加入點滴種類成功");
                initAll();

            }else{

                alert("加入點滴種類失敗，可能有欄位未輸入或點滴編號重覆");
                initAll();
            }

        }

    });



}





var edit_bit_class=function(){


    $(document).off("click", "#save_bit_class_btn");

    var bit_class_id=$(this).closest('.bit_class_row').find('.bit_class_ids').val() || "";

    var serial_no=$(this).closest('.bit_class_row').find('.serial_no').html() || "";
    var bit_no=$(this).closest('.bit_class_row').find('.bit_no').html() || "";
    var bit_name=$(this).closest('.bit_class_row').find('.bit_name').html() || "";
    var bit_class_name=$(this).closest('.bit_class_row').find('.bit_class_name').html() || "";
    var bit_capacity=$(this).closest('.bit_class_row').find('.bit_capacity').html() || "";
    var bit_empty_weight=$(this).closest('.bit_class_row').find('.bit_empty_weight').html() || "";



    $("#edit_bit_no").val(bit_no);
    $("#edit_bit_name").val(bit_name);
    $("#edit_bit_class_name").val(bit_class_name);
    $("#edit_bit_capacity").val(bit_capacity);
    $("#edit_bit_empty_weight").val(bit_empty_weight);
    $("#edit_serial_no").html(serial_no);


    //更新病床資料的function
    var saveBitClass=function(){
        $.ajax({
            url: "/monitor/updateBitClass",
            type: "post",
            data: {
                id:bit_class_id,
                bit_no:$("#edit_bit_no").val(),
                bit_class_name:$("#edit_bit_class_name").val(),
                bit_capacity:$("#edit_bit_capacity").val(),
                bit_name:$("#edit_bit_name").val(),
                bit_empty_weight:$("#edit_bit_empty_weight").val()
                 },
            success:function(data) {

                if(data.success){

                    //alert("更新點滴種類資料成功");
                    initAll();

                }else{

                    alert("更新點滴種類資料失敗，該點滴編號可能已存在於系統、或是有欄位未輸入");
                    initAll();
                }

            }

        });

    }


    $(document).on("click", "#save_bit_class_btn",saveBitClass);



}


var edit_bit_pipe_class = function(){

    var bit_pipe_id = $(this).parents("tr").data("bit_pipe_id");
    var bitPipeInfo = _.findWhere(globalBitPipeClass, {id :Number(bit_pipe_id) });
    $("#edit_bit_pipe_no").text(_.findIndex(globalBitPipeClass, {id :Number(bit_pipe_id) })+1);
    $("#edit_bit_pipe_id").val(bit_pipe_id);
    $("#edit_bit_pipe_name").val(bitPipeInfo.name);
    $("#edit_bit_pipe_weight").val(bitPipeInfo.weight);
    $("#edit_bit_pipe_capacity_in_pipe").val(bitPipeInfo.capacity_in_pipe);
    $("#edit_bit_pipe_total_capacity_in_pipe").text(bitPipeInfo.total_capacity_in_pipe);

    $("[data-remodal-id='edit_bit_pipe_modal']").remodal().open();

};

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



//顯示點滴輸液管清單
function showBitPipeClassList(bitPipeList){


    var content = "<option value='0'>--</option>";

    _.each(bitPipeList,function(bitPipe){
        content += "<option value='"+bitPipe.id+"'>"+bitPipe.name+"</option>"
    });

    $("#bitPipeSelect").html(content);
}

//顯示點滴輸液管下拉選單
function showBitPipeClassDropDown(bitPipeList){
    var content = "";

    _.each(bitPipeList,function(bitPipe,bIdx){
        content += "<tr data-bit_pipe_id='"+bitPipe.id+"'>";
        content += "<td>";
        content += "<input type='checkbox' name=''>";
        content += "</td>";
        content += "<td><a class='btn edit_bit_pipe_class_btn'><i class='fa fa-edit' aria-hidden='true'></i> 編輯</a></td>";
        content += "<td>"+(bIdx+1)+"</td>";
        content += "<td>"+bitPipe.name+"</td>";
        content += "<td>"+bitPipe.weight+" g</td>";
        content += "<td>"+bitPipe.capacity_in_pipe+ "g</td>";
        content += "<td>"+bitPipe.total_capacity_in_pipe+" g</td>";
        content += "</tr>";
    });

    $("#bitPipeTable tbody").html(content);
}






//批次刪除多院備註(多筆)
var delete_bit_class=function(){

    var bit_class_ids=Array();

    //尋遍所有被選擇的病歷
    $('.bit_class_ids:checkbox:checked').each(function () {

        var bit_class_id=$(this).val() || 0;

        bit_class_ids.push(bit_class_id);


    });


    $.ajax({
        type: "post",
        url: "/monitor/deleteBitClass",
        data:{bit_class_ids:bit_class_ids},
        success: function(data) {

            //alert("刪除點滴種類資料成功");

            initAll();

        }


    });


}


function changePipe(bitPipeId){

    var bitPipeInfo = _.findWhere(globalBitPipeClass, {id :Number(bitPipeId) });
    if(_.isUndefined(bitPipeInfo)){
        $("#defaultWeightDiv").html("");
    }else{
        $("#defaultWeightDiv").html(bitPipeInfo.weight + "g");
    }

}


//新增點滴輸液管類別
function addBitPipeClass(){
    var bit_pipe_name = $("#bit_pipe_name").val();
    var bit_pipe_weight = $("#bit_pipe_weight").val();
    var capacity_in_pipe = $("#capacity_in_pipe").val();

    $.ajax({
        type: "post",
        url: "/monitor/addBitPipeClass",
        data:{bit_pipe_name:bit_pipe_name, bit_pipe_weight:bit_pipe_weight, capacity_in_pipe:capacity_in_pipe },
        success: function(data) {
            if(data.success){
                loadBitPipeClass();
                $("#bit_pipe_name").val("");
                $("#bit_pipe_weight").val("");
                $("#capacity_in_pipe").val("");
            }
        }
    });
}

//更新點滴輸液管類別
function updateBitePipeClass(){
    var bit_pipe_id =  $("#edit_bit_pipe_id").val();
    var bit_pipe_name = $("#edit_bit_pipe_name").val();
    var bit_pipe_weight = $("#edit_bit_pipe_weight").val();
    var capacity_in_pipe = $("#edit_bit_pipe_capacity_in_pipe").val();

    $.ajax({
        type: "post",
        url: "/monitor/updateBitPipeClass",
        data:{
            bit_pipe_id:bit_pipe_id,
            bit_pipe_name:bit_pipe_name,
            bit_pipe_weight:bit_pipe_weight,
            capacity_in_pipe:capacity_in_pipe
        },
        success: function(data) {

            if(data.success){
                loadBitPipeClass();
                $("[data-remodal-id='add_bit_pipe_modal']").remodal().open();
            }
        }
    });
}
