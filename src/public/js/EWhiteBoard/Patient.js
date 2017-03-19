$(function () {




    $.when(loadDoctorClasses()).done(function (items, data) {

        //載入全部病人的資料
        loadPatientInfoByBed();

    });


});

//暫存病人資料的array
var patientProfilesArray=[];

//醫生別的資料
var doctorClasses={};

var toType = function(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}


var loadDoctorClasses = function(){

    //載入病人的出院備註
    $.ajax({
        url: "/Doctor/getDoctorClass",
        type: "post",
        success: function (data) {

            if(data.success){

                var results = data.classRows;

                for(var i=0; i<results.length; i++){

                    var result=results[i];

                    doctorClasses[result['id']]=result['doctor_class_name'];

                }

                console.log(doctorClasses);

            }else{

            }


        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
        }
    })

}

//病人待辦資料
var loadPatientTodoInformation=function(patient_person_id){

    //載入全部病人的資料
    $.ajax({
        url: "/Patient/PatientTodoInformation",
        type: "get",
        cache:false,
        data: {patient_person_id:patient_person_id},
        success: function (data) {

            console.log(data);

            if(data.success){

                //render畫面
                var source   = $("#patient-todo-template").html();
                var template = Handlebars.compile(source);
                var context = {result: data.result};
                var html    = template(context);

                $("#patientTodoInformation").html(html);

            }else{

            }
        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
        }
    })
}



//病人醫囑資料
var loadPatientMedicalInformation=function(patient_person_id){

    //載入全部病人的資料
    $.ajax({
        url: "/Patient/PatientMedicalInformation",
        type: "get",
        cache:false,
        data: {patient_person_id:patient_person_id},
        success: function (data) {

            console.log(data);

            if(data.success){

                //render畫面
                var source   = $("#patient-MedicalInformation-template").html();
                var template = Handlebars.compile(source);
                var context = {result: data.result};
                var html    = template(context);

                $("#patientMedicalInformation").html(html);

            }else{

            }
        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
        }
    })
}


//病人過敏資料
var loadPatientAllergy=function(patient_person_id){

    //載入全部病人的資料
    $.ajax({
        url: "/Patient/PatientAllergy",
        type: "get",
        cache:false,
        data: {patient_person_id:patient_person_id},
        success: function (data) {

            console.log(data);
            if(data.success){

                //render畫面
                var source   = $("#patient-allergy-template").html();
                var template = Handlebars.compile(source);
                var context = {result: data.result};
                var html    = template(context);

                $("#patientAllergy").html(html);


            }else{

            }
        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
        }
    })
}


//點選病床時，顯示病患的詳細資訊的頁首
var loadPatientProfileHeader=function(patient_person_id){

    //原本是用array型態存進去，所以要讀引索0的位置
    var result=patientProfilesArray[patient_person_id][0];


    console.log(result);


    //設定病床名稱
    $("#profileHeaderBed").html(result.ward_name+"-"+result.bed_name);

    //設定性別
    if(result.patient_sex==0){
        $("#profileHeaderName").find("span").attr('class', 'female');
    }
    else{
        $("#profileHeaderName").find("span").attr('class', 'male');
    }

    //設定名字及年紀
    $("#profileHeaderName").find("span").html(result.patient_name+"("+result.patient_age+")");


}

//點選病床時，顯示病患的詳細資訊
var loadPatientProfile=function(patient_person_id){


    var result=patientProfilesArray[patient_person_id];

    console.log(result);

    //render畫面
    var source   = $("#patient-profile-template").html();
    var template = Handlebars.compile(source);
    var context = {result: result};
    var html    = template(context);

    $("#patientProfile").html(html);


}



var loadPatientInfoByBed=function(){

    var  current_datetime = moment().format("YYYY-MM-DD HH:mm:ss");

    //console.log(current_datetime);
    //載入全部病人的資料
    $.ajax({
        url: "/EWhiteBoard/api/BedWithPatientByWard",
        type: "get",
        cache:false,
        data: {ward_zone_id:1, current_datetime:current_datetime},
        success: function (data) {

            console.log(data);
            if(data.success){

                //render畫面
                var source   = $("#rooms-template").html();
                var template = Handlebars.compile(source);
                var context = {result: data.result};
                var html    = template(context);

                $("#information_container").append(html);


                //綁定事件，點選病床時，會更新病患的詳細資訊中，過敏資料及醫囑的頁面
                $(".rooms").bind('click',function(e){


                    if($(this).data("patient_person_id")!=null
                        && $(this).data("patient_person_id")!="" ){


                        //病人詳細資料的頁首
                        loadPatientProfileHeader($(this).data("patient_person_id"));

                        //病人基本資料
                        loadPatientProfile($(this).data("patient_person_id"));

                        //病人過敏資料
                        loadPatientAllergy($(this).data("patient_person_id"));

                        //病人醫囑資料
                        loadPatientMedicalInformation($(this).data("patient_person_id"));


                        //病人待辦資料
                        loadPatientTodoInformation($(this).data("patient_person_id"));

                    }




                })

                //暫存病患的資料
                var lightCount=0;
                var mediumCount=0;
                var hardCount=0;

                for(var i=0; i<data.result.length; i++){

                    var tempProfiles=data.result[i];

                    if(tempProfiles.patient_person_id!=null){

                        patientProfilesArray[tempProfiles.patient_person_id]=[tempProfiles];

                        //順便統計人數(一般 , DNR , 不確定)
                        //如果病人出院了，tempProfiles.medical_record_id會是NULL值，這時不要計它的數量
                        if(tempProfiles.patient_sick_level=="light" || tempProfiles.patient_sick_level=="一般"
                            && tempProfiles.medical_record_id !=null){

                            lightCount++;

                        }else if(tempProfiles.patient_sick_level=="medium" || tempProfiles.patient_sick_level=="DNR"
                        && tempProfiles.medical_record_id !=null){

                            mediumCount++;

                        }else if(tempProfiles.patient_sick_level=="hard" || tempProfiles.patient_sick_level=="不確定"
                            && tempProfiles.medical_record_id !=null){

                            hardCount++;
                        }

                    }

                }

                //顯示統計資訊
                $("#light_count").html(lightCount);
                $("#medium_count").html(mediumCount);
                $("#hard_count").html(hardCount);
                //console.log(patientProfilesArray);



            }else{

            }
        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
        }
    })
}
