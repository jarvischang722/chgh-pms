$(function () {
    initialize(); //初始執行
    //body dom event
     $('body').on("click", "#refresh", function(event) {
         event.preventDefault();
         initialize();
     });
});
//初始
function initialize(){
    $.ajax({
        method: "GET",
        url: "api/getNurseSche"
        //data: $( "#form1" ).serialize()
        //data: {}
    })
        .done(function( result_obj ) {
            console.log(result_obj);
            var sche = result_obj.result;
            //依病房排班顯示
            createTemp01(sche,"01","nurse_tabs_nested_1_1_div");
            createTemp01(sche,"02","nurse_tabs_nested_1_2_div");
            createTemp01(sche,"03","nurse_tabs_nested_1_3_div");
            //依護理師排班顯示
            createTemp02(sche,"01","nurse_tabs_nested_2_1_table");
            createTemp02(sche,"02","nurse_tabs_nested_2_2_table");
            createTemp02(sche,"03","nurse_tabs_nested_2_3_table");

            e_resetTable();
        });
}

//產生班表by病房
function createTemp01(sche,thisclass,divid){
    var classobj = sche[thisclass];
    if(!classobj || !classobj['ward']){
        return;
    }

    classobj = classobj['ward'];

    var wardList01 = classobj.wardList;
    var wardList02;
    var count = wardList01.length;
    if(count>=18){
        wardList02 = wardList01.slice(count/2);
        wardList01 = wardList01.slice(0,count/2);
    }else if(count>=9){
        wardList02 = wardList01.slice(9);
        wardList01 = wardList01.slice(0,9);
    }else{
        wardList02=[];
    }
    var results = {
        wardList01: wardList01,
        wardList02: wardList02
    };
    var tmp = Handlebars.compile($("#nurse_tabs_nested_1_1_temp").html());
    $('#'+divid).html("");
    $('#'+divid).append(tmp(results));
}

//產生班表by護理師
function createTemp02(sche,thisclass,tableid){
    var classobj = sche[thisclass];
    if(!classobj || !classobj['nurse']){
        return;
    }

    classobj = classobj['nurse'];

    var results = {
        nurses: classobj.nurseList
    };
    var tmp = Handlebars.compile($("#nurse_tabs_nested_2_1_temp").html());
    $('#'+tableid).html("");
    $('#'+tableid).append(tmp(results));
}
