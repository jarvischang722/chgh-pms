/**
 * Created by Ian-PC on 2016/11/18.
 */

$(function () {

    //載入當日，全部病人的出院備註
    loadAllPatientDischargedNote();


    $('a#add_note').click(function(e) {
        $(".out_note_pool").append($("#note_type").val() + ' ' + $("#note_copy").val() + ' 份，');
    });

    $('a#add_note_2').click(function(e) {
        $(".out_note_pool_2").append($("#note_type_2").val() + ' ' + $("#note_copy_2").val() + ' 份，');
    });


});

var  current_datetime = moment().format("YYYY-MM-DD HH:mm:ss");
var  current_date = moment().format("YYYY-MM-DD");


//病人出院備註
var loadAllPatientDischargedNote=function(){


        //選擇待辦事項的 全選 鈕
        $(".select_all").prop('checked', false);


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

                var results=data.result;
                var result=results[0];

            console.log(result);
            try{
                result.current_date=moment().format("YYYY-MM-DD");
            }catch(e){

            }


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


          //alert("更新病患出院備註成功");

            loadAllPatientDischargedNote();

        }


    });


}



//批次加入出院備註(多筆)
    var batchAddPatientDischargedNotes=function(){


    var discharged_remarks=Array();

    var discharged_remark = $("#patientDischargedNote_add").html() || "";

    //empty
    $("#patientDischargedNote_add").html("");

    if(discharged_remark==""){

        alert("請輸入出院備註");
        return;
    }

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


            //alert("加入病患出院備註成功");

            //建立出院備註的 出院備註 資料框清除
            $("#patientDischargedNote_add").html("");

            loadAllPatientDischargedNote();

        }


    });


}


//批次刪除多院備註(多筆)
var batchDeletePatientDischargedNotes=function(){

    confirm("確定刪除嗎? ", function(result){
        if (result){

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


                    //alert("刪除病患出院備註成功");

                    loadAllPatientDischargedNote();

                }


            });


        }
    })



}


loadPatientsByBed=function(){


    //建立出院備註的 全選 鈕
    $(".select_all_remodal_2").prop('checked', false);

    //建立出院備註的 出院備註 資料框
    //$("#patientDischargedNote_add").html("");

    //載入項目
    var getPatientDischargedRemarkItems=$.ajax({
        type: "GET",
        url: "/Patient/PatientDischargedRemarkItems",
        data: {},
        success: function(data) { console.log("取得出院備註項目資料成功");}

    });


    //載入病患資訊
    var getPatientsByBed=$.ajax({
        url: "/EWhiteBoard/api/BedWithPatientByWard",
        type: "get",
        data: {ward_zone_id:1, current_datetime: current_datetime},
        success:function(data) { console.log("取得病患住院資料成功");}

    });



    $.when(getPatientDischargedRemarkItems, getPatientsByBed).done(function (items, data) {
        //all AJAX requests are finished

        data=data[0];
        items=items[0];
        items=items.result;

        if(data.success){


            //render畫面
            var source   = $("#patient-list-template").html();
            var template = Handlebars.compile(source);
            var context = {result: data.result};
            var html    = template(context);

            $("#patient-list-container").html(html);



            //清掉舊的項目
            $('#note_type_2').html("");

            //出院備註的項目
            $.each(items, function(index, item) {

                $('#note_type_2')
                    .append($("<option></option>")
                        .attr("value",item.name)
                        .text(item.name));
            });




        }else{

        }

    });



}