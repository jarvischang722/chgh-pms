/**
 * Created by Ian-PC on 2016/11/18.
 */

$(function () {


    //bind click event to 建立待辦事項
$("#create_modal_btn").on("click",function(){

    loadPatientsByBed();
    loadTodoClass();





})



    //bind click event to 選擇待辦事項類別
    $("#todo-class-container").on("change",function(){

        //選擇待辦事項 全選 鈕 要取消勾選
        $(".select_all_check").prop('checked', false);

        var todo_class_id=$( this ).val();

        if(todo_class_id != null && todo_class_id !=0){
            loadTodoItems(todo_class_id);
        }


    })




});

var  current_datetime = moment().format("YYYY-MM-DD HH:mm:ss");
var  current_date = moment().format("YYYY-MM-DD");


loadPatientsByBed=function(){

    //選擇病患的 全選 鈕
    $(".select_all_remodal_dd").prop('checked', false);

    //選擇日期的 全選 鈕
    $(".select_all_check_2").prop('checked', false);

    //載入全部病人的資料
    $.ajax({
        url: "/EWhiteBoard/api/BedWithPatientByWard",
        type: "get",
        data: {ward_zone_id:1, current_datetime:"2016-10-31 16:00:01"},
        success: function (data) {

            console.log(data);
            if(data.success){

                //render畫面
                var source   = $("#patient-list-template").html();
                var template = Handlebars.compile(source);
                var context = {result: data.result};
                var html    = template(context);

                $("#patient-list-container").html(html);


            }else{

            }
        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
        }
    })
}




loadTodoClass=function(){

    //選擇待辦事項的 全選 鈕
    $(".select_all_check").prop('checked', false);


    //載入全部待辦事項類別
    $.ajax({
        url: "/Patient/patientAllTodoItemClass",
        type: "get",
        data: {},
        success: function (data) {

            console.log(data);
            if(data.success){

                //render畫面
                var source   = $("#todo-class-list-template").html();
                var template = Handlebars.compile(source);
                var context = {result: data.result};
                var html    = template(context);

                $("#todo-class-container").html(html);

                //先載入第一個待辦事項類別的項目
                try{

                    var todo_class_id=data.result[0];
                    todo_class_id=todo_class_id.id;
                    loadTodoItems(todo_class_id);

                }catch (err){

                    console.log("no todo item exist");
                }



            }else{

            }
        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
        }
    })
}



loadTodoItems=function(todo_class_id){

    //載入全部待辦事項類別
    $.ajax({
        url: "/Patient/patientAllTodoItem",
        type: "get",
        data: {todo_class_id:todo_class_id},
        success: function (data) {

            console.log(data);
            if(data.success){

                //render畫面
                var source   = $("#todo-item-list-template").html();
                var template = Handlebars.compile(source);
                var context = {result: data.result};
                var html    = template(context);

                $("#todo-item-container").html(html);


            }else{

            }
        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
        }
    })
}

addTodoRecord=function(){
    //批次加入待辦事項


    site.showWaitingModal("新增中");

    var todoRecords=Array();



    //尋遍所有被選擇的病歷
    $('.medical_record_ids_add:checkbox:checked').each(function () {

            var medical_record_id=$(this).val();

        //尋遍所有被選擇的待辦事項
        $('.todoItemsIDs:checkbox:checked').each(function () {

            var todoItemsID=$(this).val();

            //尋遍所有日期


            $('#add-todo-dates').find(":checkbox:checked").each(function () {

                var todo_date=$(this).val();

                var todoRecordObject={};

                todoRecordObject['medical_record_id']=medical_record_id;
                todoRecordObject['todo_id']=todoItemsID;
                todoRecordObject['todo_date']=todo_date;
                todoRecordObject['is_finish']="N";


                todoRecords.push(todoRecordObject);


            });


        });


    });

    console.log(todoRecords);

    $.ajax({
        url: "/Patient/PatientTodoRecord/add",
        type: "POST",
        data: JSON.stringify(todoRecords),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            console.log(data);
            if(data.success){


                //清掉所選的時間
                $(".date_checklist_pool").html("");

                //reload
                var selectedDate=$("#date_select").val() || current_date ;
                loadAllTodoItemByDate(selectedDate);

            }else{

            }

            site.closeWaitingModal();
        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
        }
    })

}