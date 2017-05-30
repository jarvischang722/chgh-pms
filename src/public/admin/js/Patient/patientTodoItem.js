/**
 * Created by Ian-PC on 2016/11/18.
 */

$(function () {

    //default is today

    var today = moment().format("YYYY-MM-DD");
    $("#date_select").val(today);
    $("#date_select").attr("placeholder",today);

    var selectedDate=$("#date_select").val();

    //載入當日，全部病人的待辦事項
    loadAllTodoItemByDate(selectedDate);





});



//new Vue({
//    el: '#todoItems',
//    data: {
//        todoItems :[]   //所有病患的待辦事項
//    },
//    ready: function () {
//        this.updateTodoItems();
//    },
//    methods: {
//        updateTodoItems: function(){
//            site.showWaitingModal();
//
//            var self = this;
//            $.get("/Patient/PatientTodoRecord",function(TodoItems){
//                site.closeWaitingModal();
//                var doctorList = doctorData.doctorList;
//                self.OnDutyDoctorList = _.filter(doctorList , function(DItem){ return DItem.doctor_class.trim() != '主治醫師' })
//                self.OtherDoctorList = _.filter(doctorList , function(DItem){ return DItem.doctor_class.trim() == '主治醫師' })
//            })
//        }
//    }
//})



//病人待辦事項
var loadAllTodoItemByDate=function(patient_todo_record_date){


    var patient_todo_record_date = patient_todo_record_date || $("#date_select").val()  || "2016-10-02";

    $(".select_all").prop('checked', false);

    //載入全部病人的資料
    $.ajax({
        url: "/Patient/allPatientTodoItemCount",
        type: "get",
        data: {patient_todo_record_date:patient_todo_record_date},
        success: function (data) {

            if(data.success){



//                //render畫面
                var source   = $("#patient-todoItems-count-template").html();
                var template = Handlebars.compile(source);
                var context = {result: data.result, count:data.result.length};
                var html    = template(context);


                $("#todoItemsCount_container").html(html);


            }else{

            }
        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
        }
    })

};



//特定病人，特定日子的待辦事項清單
var loadTodoItemTodayByPatient=function(patient_person_id,patient_todo_record_date, bed_name){

    var patient_person_id=patient_person_id  ||"";
    var patient_todo_record_date=patient_todo_record_date ||"";
    var bed_name=bed_name  || "";


    //FOR TEST
    var patient_todo_record_date= patient_todo_record_date || moment().format("YYYY-MM-DD");

    var getPatientTodo=$.ajax({
        type: "GET",
        url: "/Patient/PatientTodoRecord",
        data: {patient_person_id:patient_person_id,
            patient_todo_record_date:patient_todo_record_date},
        success: function(data) { console.log("取得特定病患待辦事項資料成功");console.log(data); }

    });


    var countPatientTodo=$.ajax({
        type: "GET",
        url: "/Patient/patientTodoItemCount",
        data: {patient_person_id:patient_person_id,
            patient_todo_record_date:patient_todo_record_date},
        success: function(data) { console.log("計算特定病患待辦事項資料成功");console.log(data); }


    });

    $.when(getPatientTodo, countPatientTodo).done(function (data, countResult) {
        //all AJAX requests are finished

        data=data[0];
        countResult=countResult[0];

         if(data.success){

                     try{
                            //有可能會沒撈到資料，這時留白即可

                         var countResult=countResult.result[0];
                         var finishCount =countResult.finishCount || 0;
                         var notFinishCount =countResult.notFinishCount || 0;
                         var patient_person_id=countResult.patient_person_id;
                         //render畫面
                         //用第0筆資料當profile去抓病患的一些基本資料
                         var source   = $("#patient-todoItem-detail-template").html();
                         var template = Handlebars.compile(source);
                         var context =
                         {result: data.result
                             ,countSuccess:finishCount
                             ,countFailed:notFinishCount
                             ,patient_todo_record_date:patient_todo_record_date
                             ,patient_person_id:patient_person_id
                             ,bed_name:bed_name
                             ,profile:data.result[0]};
                         var html    = template(context);

                         console.log(context);

                         $("#patientTodoItemDetail_container").html(html);

                         //加入全選Checkbox的listener
                         $('.select_all_remodal').on("click",function(e) {
                             $('.remodal_1 .sticky-wrap').find('td input:checkbox').prop('checked', this.checked);
                         });

                     }catch(err){
                         console.log(err);

                          $(".remodal-close").click();
                         //alert("查無"+patient_todo_record_date+", 該病患的待辦事項");
                         //
                         //$("#patient-todoItem-detail-template .remodal-close").click();
                     }


            }else{

            }

    });


}




//更新待辦事項狀態
var updateTodoItemStatus=function(){

    event.preventDefault();

    var patient_todo_record_ids=Array();

    $('.patient_todo_record_ids:checkbox:checked').each(function () {

        patient_todo_record_ids.push($(this).val());

    });


    $.ajax({
        type: "PUT",
        url: "/Patient/PatientTodoRecord/update",
        data: {patient_todo_record_ids:patient_todo_record_ids,
            patient_todo_record_status:"Y"},

        success: function(data) {


            //alert("更新病患待辦事項資料成功");


            var patient_person_id=$("#txt_patient_person_id").val() || "";
            var patient_todo_record_date=$("#txt_patient_todo_record_date").val() || "";
            var bed_name=$("#txt_bed_name").val() || "";

            loadTodoItemTodayByPatient(patient_person_id,patient_todo_record_date, bed_name);

            loadAllTodoItemByDate();




        }


    });


}



// 刪除待辦事項
var deleteTodoItem=function(){


    confirm("確定刪除嗎? ", function(result){
        if (result){

            var patient_todo_record_ids=Array();

            $('.patient_todo_record_ids:checkbox:checked').each(function () {

                patient_todo_record_ids.push($(this).val());

            });


            $.ajax({
                type: "DELETE",
                url: "/Patient/PatientTodoRecord/delete",
                data: {patient_todo_record_ids:patient_todo_record_ids},
                success: function(data) {


                    console.log("刪除病患待辦事項資料成功");

                    //reload
                    var selectedDate=$("#date_select").val() || "2016-10-02" ;
                    loadAllTodoItemByDate(selectedDate);


                }


            });

        }
    })

}


// 刪除待辦事項狀態(依病歷)
var deleteTodoItemByMedicalRecordId=function(){

    confirm("確定刪除嗎? ", function(result){
        if (result){




            site.showWaitingModal("刪除中");

            var medical_record_ids=Array();

            $('.medical_record_ids_delete:checkbox:checked').each(function () {

                medical_record_ids.push($(this).val());

            });

            //set default
            var todo_date=$("#date_select").val() || "0000-00-00" ;


            $.ajax({
                type: "DELETE",
                url: "/Patient/PatientTodoRecord/delete",
                data: {medical_record_ids:medical_record_ids, todo_date:todo_date},
                success: function(data) {


                    //alert("刪除病患待辦事項資料成功");

                    //reload
                    var selectedDate=$("#date_select").val() || "2016-10-02" ;
                    loadAllTodoItemByDate(selectedDate);

                    site.closeWaitingModal();
                }


            });

        }
    })

}