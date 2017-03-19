/**
 * Created by Ian-PC on 2016/11/18.
 */

$(function () {

    //載入某病床區所有的病床資料
    loadAllbed();


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
var loadAllPatientDischargedNote=function(){


    //載入病人的出院備註
    $.ajax({
        url: "/Patient/PatientDischargedRemark",
        type: "get",
        data: {},
        success: function (data) {

            console.log(data);
            if(data.success){


                $("#data_count").html(data.result.length);

//                //render畫面
                var source   = $("#PatientDischargedRemark-list-template").html();
                var template = Handlebars.compile(source);
                var context = {result: data.result, count:data.result.length};
                var html    = template(context);


                $("#PatientDischargedRemark-list-container").html(html);


            }else{

            }
        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
        }
    })
}



//載入特定病人出院備註
var loadPatientDischargedNote=function(medical_record_id){

       //載入項目
    var getPatientDischargedRemarkItems=$.ajax({
        type: "GET",
        url: "/Patient/PatientDischargedRemarkItems",
        data: {},
        success: function(data) { console.log("取得出院備註項目資料成功");}

    });


    //載入出院備註  特定病人的
    var getPatientDischargedNote=$.ajax({
        type: "GET",
        url: "/Patient/PatientDischargedRemark",
        data: {medical_record_id:medical_record_id},
        success: function(data) { console.log("取得出院備註資料成功");}

    });


    $.when(getPatientDischargedRemarkItems, getPatientDischargedNote).done(function (items, data) {
        //all AJAX requests are finished

        data=data[0];
        items=items[0];
        items=items.result;

        if(data.success){

//            try{

                var today = moment().format("YYYY-MM-DD");

                var result=data.result;
                result=result[0];
                result['current_date']=today;

//                //render畫面
                var source   = $("#PatientDischargedRemark-template").html();
                var template = Handlebars.compile(source);
                var context = {result: data.result};
                var html    = template(context);


                $("#PatientDischargedRemark-container").html(html);

                //add click listener
                $('a#add_note').on("click", function(e) {
                    $(".out_note_pool").append($("#note_type").val() + ' ' + $("#note_copy").val() + ' 份，');
                });



            //出院備註的項目
            $.each(items, function(index, item) {

                $('#note_type')
                    .append($("<option></option>")
                        .attr("value",item.name)
                        .text(item.name));
            });



//            }catch(err){
//
//                console.log(err);
//                $(".remodal-close").click();
//                //alert("查無"+patient_todo_record_date+", 該病患的待辦事項");
//                //
//                //$("#patient-todoItem-detail-template .remodal-close").click();
//            }


        }else{

        }

    });



}

//更新出院備註
var updatePatientDischargedNote=function(patient_medical_record_id){


    var patient_medical_record_id=patient_medical_record_id || 0 ;

    var discharged_remark = $("#patientDischargedNote").html() || "";

    var patientDischargedNote=
    [{   discharged_remark:discharged_remark,
        patient_medical_record_id:patient_medical_record_id
    }];



    $.ajax({
        type: "PUT",
        url: "/Patient/PatientDischargedRemark/update",
        data: JSON.stringify(patientDischargedNote),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data) {


            console.log("更新病患出院備註成功");

            loadAllPatientDischargedNote();

        }


    });


}



//批次加入出院備註(多筆)
var batchUpdatePatientDischargedNotes=function(){


    var discharged_remarks=Array();

    var discharged_remark = $("#patientDischargedNote_add").html() || "";

    //empty
    $("#patientDischargedNote_add").html("");

    //尋遍所有被選擇的病歷
    $('.medical_record_ids_add:checkbox:checked').each(function () {

        var medical_record_id=$(this).val() || 0;

        var discharged_remarkObject={};

        discharged_remarkObject['patient_medical_record_id']=medical_record_id;
        discharged_remarkObject['discharged_remark']=discharged_remark;


        discharged_remarks.push(discharged_remarkObject);


    });


    $.ajax({
        type: "PUT",
        url: "/Patient/PatientDischargedRemark/update",
        data: JSON.stringify(discharged_remarks),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data) {


            console.log("更新病患出院備註成功");

            loadAllPatientDischargedNote();

        }


    });


}


//批次刪除多院備註(多筆)
var batchDeletePatientDischargedNotes=function(){


    var patient_medical_record_ids=Array();


    //尋遍所有被選擇的病歷
    $('.medical_record_ids_delete:checkbox:checked').each(function () {

        var medical_record_id=$(this).val() || 0;

        patient_medical_record_ids.push(medical_record_id);


    });



    $.ajax({
        type: "DELETE",
        url: "/Patient/PatientDischargedRemark/delete",
        data:{patient_medical_record_ids:patient_medical_record_ids},
        success: function(data) {


            console.log("刪除病患出院備註成功");

            loadAllPatientDischargedNote();

        }


    });


}



loadAllbed=function(){

    //載入病床資料
    $.ajax({
        url: "/Bed/getAllWard",
        type: "get",
        data: {ward_zone_id:1},
        success:function(data) {

            if(data.success){

                $("#bed_count").html((data.result).length);

                //render畫面
                var source   = $("#bed-list-template").html();
                var template = Handlebars.compile(source);
                var context = {result: data.result};
                var html    = template(context);


                $("#bed-list-container").html(html);


                $(".edit_bed_btn").on("click", editBed);




            }else{

            }

        }

    });



}



addBed=function(){

    event.preventDefault();//不關掉彈跳視窗

    var ward_name=$("#add_ward_name").val() || "";
    var bed_name=$("#add_bed_name").val() || "";



    //更新病床資料
    $.ajax({
        url: "/Bed/insertBed",
        type: "post",
        data: {bed_name:bed_name,ward_name:ward_name, ward_zone_id:1},
        success:function(data) {

            if(data.success){

                //alert("加入病床成功");


                loadAllbed();


            }else{

                alert(data.errorMsg);
            }

        }

    });


}

editBed=function(){

    var ward_name=$(this).closest('.bed_row').find('#ward_name_temp').html() || "";
    var bed_name=$(this).closest('.bed_row').find("#bed_name_temp").html()|| "";
    var bed_id=$(this).closest('.bed_row').find("#bed_ids").val() || 0;

    $("#edit_bed_name").val(bed_name);
    $("#edit_ward_name").val(ward_name);
    $("#edit_bed_id").val(bed_id);


}


updadteBed=function(){

    var ward_name=$("#edit_ward_name").val() || "";
    var bed_name=$("#edit_bed_name").val() || "";
    var bed_id=$("#edit_bed_id").val() || 0;


    //更新病床資料
    $.ajax({
        url: "/Bed/updateBed",
        type: "post",
        data: {bed_id:bed_id,bed_name:bed_name, ward_name:ward_name, ward_zone_id:1},
        success:function(data) {

            if(data.success){

                //alert("更新病床資料成功");


                loadAllbed();


            }else{
                alert("更新病床資料失敗");
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


//批次刪除病床資料
var deleteBed=function(){


    confirm("確定刪除嗎? ", function(result){

        if (result){
            var bed_ids=Array();

            //尋遍所有被選擇的病歷
            $('.bed_ids:checkbox:checked').each(function () {

                var bed_id=$(this).val() || 0;

                bed_ids.push(bed_id);


            });



            $.ajax({
                type: "post",
                url: "/Bed/deleteBed",
                data:{bed_ids:bed_ids},
                success: function(data) {


                    //alert("刪除病床資料成功");

                    loadAllbed();

                }


            });
        }
    })





}