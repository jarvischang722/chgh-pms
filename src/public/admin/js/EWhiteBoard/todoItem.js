$(function () {


    Handlebars.registerHelper('count_todo_list', function (todo_list) {

        //console.log("todo_list:");
        //console.log(todo_list);
        if(todo_list!=null){

            var res = todo_list.split(",");

            return res.length;

        }else{

            return 0;

        }

    });




    Handlebars.registerHelper('csvToList', function (date, format) {
        var mmnt = moment(date);
        format = DateFormats[format] || format;
        return mmnt.format(format);
    });


    AddTabListener();

    //載入全部病人的資料
    loadTodoItemByBed();


});

//暫存病人資料的array
var patientTodoArrayByBed=[];

//暫存病人資料的array
var patientTodoArrayByItem=[];


var  current_datetime = moment().format("YYYY-MM-DD HH:mm:ss");
var  current_date = moment().format("YYYY-MM-DD");


//點選清單時，顯示病患的待辦事項
var loadTodoListByPatient=function(patient_id){


    var result=patientTodoArrayByBed[patient_id];

    var todo_list =result[0].todo_list;

    var todo_array=todo_list.split(",");

    var html="";


    for(var i=0;i<todo_array.length;i++){

        html+="<li>"+todo_array[i]+"</li>";

    }

    //render畫面
//    var source   = $("#patient-profile-template").html();
//    var template = Handlebars.compile(source);
//    var context = {result: result};
//    var html    = template(context);
//
    $("#todoList-byBed-container").html(html);


}



//點選待辦事項清單時，顯示有哪些病患需要

var loadPatientListByTodo=function(todo_id){


    var result=patientTodoArrayByItem[todo_id];


    var source   = $("#patient-todoItemRow-template").html();
    var template = Handlebars.compile(source);
    var context = {result: result};
    var html    = template(context);


    $("#todoList-byItem-container").html(html);


}

loadTodoItemByBed=function(){

    var  current_datetime = moment().format("YYYY-MM-DD HH:mm:ss");
    var  current_date = moment().format("YYYY-MM-DD");

    console.log(current_datetime);


    //載入全部病人的待辦資料
    $.ajax({
        url: "/EWhiteBoard/api/PatientTodoByWard",
        type: "get",
        cache: false,
        data: {ward_zone_id:1, patient_todo_record_date:current_date, is_finish:"N"},
        success: function (data) {
            //console.log(data);

            //清掉html
            clearTodoListHtml();

            if(data.success){

                //render畫面
                var source   = $("#patient-todoPatientRow-template").html();
                var template = Handlebars.compile(source);
                var context = {result: data.result};
                var html    = template(context);

                $("#patient-todoItem-byBed-container").html(html);


                //綁定事件，點選病床時，會更新病患的詳細資訊中，過敏資料及醫囑的頁面
                $("#patient-todoItem-byBed-container tr").bind('click',function(e){



                    if($(this).data("patient_id")!=null
                        && $(this).data("patient_id")!="" ){

                        loadTodoListByPatient($(this).data("patient_id"));

                    }


                })


                //暫存病患的資料
                for(var i=0; i<data.result.length; i++){

                    var tempProfiles=data.result[i];

                    if(tempProfiles.patient_id!=null){

                        patientTodoArrayByBed[tempProfiles.patient_id]=[tempProfiles];

                    }


                }

                console.log(patientTodoArrayByBed);



            }else{

            }
        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
        }
    })
}



loadTodoItemByItem=function(){

    //alert("test");
    //依日期及病房區的id，載入全部病人的待辦事項
    $.ajax({
        url: "/Patient/PatientTodoRecord",
        type: "get",
        data: {ward_zone_id:1, patient_todo_record_date: current_date, is_finish:"N"},
        success: function (data) {
            console.log(data);

            //清掉html
            clearTodoListHtml();

            //重新初始化array
            patientTodoArrayByItem=Array();

            if(data.success){

                var uniqueList = deDuplicateItems(data.result);



                var html="";


                uniqueList.forEach(function(entry) {

                    html+="<li><a href=\"#\" onclick=\"loadPatientListByTodo("+entry.todo_id+")\" >"+entry.todo_name+"</a></li>";

                });

                //顯示左邊的待辦事項清單
                $("#patient-todoItem-byItem-container").html(html);

                //render畫面
                //var source   = $("#patient-todoItemRow-template").html();
                //var template = Handlebars.compile(source);
                //var context = {result: uniqueList};
                //var html    = template(context);

                //$("#patient-todoItem-byItem-container").html(html);

                //暫存病患的資料
                for(var i=0; i<data.result.length; i++){

                    var tempProfiles=data.result[i];

                    if(tempProfiles.todo_id!=null){


                        if(patientTodoArrayByItem[tempProfiles.todo_id] ==null){
                            //先初始化並放入array
                            patientTodoArrayByItem[tempProfiles.todo_id]=Array();

                        }

                        patientTodoArrayByItem[tempProfiles.todo_id].push(tempProfiles);

                    }


                }


            }else{

            }
        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
        }
    })
}


//為依類別的tab，加上clickListener
AddTabListener=function(){

    $("li a").on("click",'', function() {

        if($(this).data("tab-id") == 'nurse_tabs_2' ){
        //依類別

            loadTodoItemByItem();

        }else if($(this).data("tab-id") == 'nurse_tabs_1' ){
        //依病床

            loadTodoItemByBed();


        }

    });


    //重新整理
    $("#refresh").click(function(){

        //重新整理 依病床
        loadTodoItemByBed();

        //重新整理 依類別
        loadTodoItemByItem();

        if($("[data-tab-id].pws_tab_active").data("tab-id") == "nurse_tabs_2"){
            //重新整理 依類別

        }else if ($("[data-tab-id].pws_tab_active").data("tab-id") == "nurse_tabs_1"){
            //重新整理 依病床


        }


    });








}


//去除重覆的待辦事項
deDuplicateItems=function(result){

    var result_array=[];

    for(var i=0;i<result.length;i++){

        var tempResult=result[i];

            if(result_array[tempResult.todo_id] == null){
                //用todo_id當index，如果該index沒有對應，表示還沒有save該筆todo_item

                result_array[tempResult.todo_id]={todo_id:tempResult.todo_id, todo_name:tempResult.todo_name};

            }


    }

    //console.log(result_array);
    return result_array;

}


//清除待辦事項項目的html
clearTodoListHtml=function(){

    $("#todoList-byBed-container").html("");
    $("#todoList-byItem-container").html("");
}