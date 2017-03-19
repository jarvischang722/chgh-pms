//畫面變數
var selected_month, selected_year,nurse_no,nurse_name,nurse_tel;
var ban01=0,ban02=0,ban03=0;
$(function () {
    initialize(); //初始執行

    //dom event
    $( "#submit_btn" ).click(insertNurseSche);

    $(document).on('click', '.datepicker--cell-month', function () {
        var data = $(this);
        showDetail(data.data());
    });

    $(document).on('click', '#work_setting', function () {
        showwork_setting();
    });

    $(document).on('click', '.c_nurse_item', function () {
        var data = $(this);
        $( ".c_nurse_item" ).removeClass( "active" );
        data.addClass( "active" );
        getThisNurseSche(data.data());
    });

    //已選班別個數計算
    $(document).on('click', '.bed_selected', function () {
        countBedSelect();
    });
});
/**
 *
 */
function initialize(){

}
/**
 * 病房詳細資訊
 * @param data 病房詳細資訊
 */
function showDetail(data){
    data.month = data.month + 1;
    data.year = $('.datepicker--nav-title').html();
    selected_month = data.month;
    selected_year = data.year;
    var results = {
        results: data
    };
    var tmp = Handlebars.compile($("#remodal_header_temp").html());
    $('#remodal_header').html("");
    $('#remodal_header').append(tmp(results));
    //護理師清單
    $.ajax({
        method: "GET",
        url: "api/getAllNurse2",
        //data: $( "#form1" ).serialize()
        //data: {}
    }).done(function( response ) {
        showAjaxResponeMsg(this.url,response);
        if(response.success){
            var nurses_results = {
                nurses: response.result
            };
            var tmp = Handlebars.compile($("#nurse_temp").html());
            $('#nurse_list').html("");
            $('#nurse_list').append(tmp(nurses_results));

            //預設選擇第一筆
            $( ".c_nurse_item" ).first().trigger( "click" );
        }else{
            e_alertMsg(response);
        }
    });
}
/**
 * 取得該護理師本月班表
 */
function getThisNurseSche(data){
    event.preventDefault();
    data.month = selected_month;
    data.year = selected_year;
    nurse_no = data.nurse_no;
    nurse_name = data.nurse_name;
    nurse_tel = data.nurse_tel;
    $.ajax({
        method: "POST",
        url: "api/getThisNurseSche",
        data: data
    }).done(function( response ) {
        showAjaxResponeMsg(this.url,response);
        $('#this_nurse_sche').html("");
        if(response.success){
            var sche_results = {
                sche: response.result
            };
            var tmp = Handlebars.compile($("#this_nurse_sche_temp").html());
            $('#this_nurse_sche').append(tmp(sche_results));
        }else{
            var sche_results = {
                sche: {}
            };
            var tmp = Handlebars.compile($("#this_nurse_sche_temp").html());
            $('#this_nurse_sche').append(tmp(sche_results));
            //alert(response.errorMsg);
        }
        $( "tbody tr:nth-child(2n-1)" ).css( "background-color","#f5f5f5" ).css( "transition","all .125s ease-in-out" );
    })
}
/**
 * 批次排班畫面
 */
function showwork_setting(){
    var data ={};
    data.nurse_name = nurse_name;
    data.nurse_tel = nurse_tel;
    var results = {
        results: data
    };
    var tmp = Handlebars.compile($("#remodal_header2_temp").html());
    $('#remodal_header2').html("");
    $('#remodal_header2').append(tmp(results));

    //顯示所有病床list
    $.ajax({
        method: "GET",
        url: "api/getAllBed",
        data: {}
    }).done(function( response ) {
        showAjaxResponeMsg(this.url,response);
        if(response.success){
            var bed_results = {
                beds: response.result,
                class_type:'01'
            };
            var tmp = Handlebars.compile($("#beds_temp").html());
            $('#class01_bed_tbody').html("");
            $('#class01_bed_tbody').append(tmp(bed_results));

            var bed_results2 = {
                beds: response.result,
                class_type:'02'
            };
            $('#class02_bed_tbody').html("");
            $('#class02_bed_tbody').append(tmp(bed_results2));

            var bed_results3 = {
                beds: response.result,
                class_type:'03'
            };
            $('#class03_bed_tbody').html("");
            $('#class03_bed_tbody').append(tmp(bed_results3));
        }else{
            e_alertMsg(response);
        }
        countBedSelect(); //已選班別個數計算
        //已排班資料不選
    });

    //顯示日期checkbox
    var monthdays = new Date(selected_year,selected_month,0).getDate();
    var today = new Date();
    var today_day = today.getDate();
    var today_month = today.getMonth()+1;
    var days=[];
    for(var i=1;i<=monthdays;i++){
        var thisday={};
        thisday.day = i;
        thisday.date = selected_year + "/" + selected_month + "/" + i;
        if(today_month==selected_month && i<= today_day){
            thisday.disable = true;
        }
        days.push(thisday);
    }

    var days_results = {
        days: days
    };
    var tmp = Handlebars.compile($("#days_temp").html());
    $('#check_day_list').html("");
    $('#check_day_list').append(tmp(days_results));
}

/**
 * 新增排班資料
 */
function insertNurseSche(){
    //檢核
    var isnulticlass01 = parseInt(ban01)>0?1:0;
    var isnulticlass02 = parseInt(ban02)>0?1:0;
    var isnulticlass03 = parseInt(ban03)>0?1:0;
    if((isnulticlass01+isnulticlass02+isnulticlass03)>1){
        alert("同一天只能排一個班別");
        return;
    }

    var selected_beds = [];
    var selected_date = [];
    $('.bed_selected').each(function(index, element){
        if($(this).is(':checked')){
            selected_beds.push($(this).data());
        }
    });
    $('.date_selected').each(function(index, element){
        if($(this).is(':checked')){
            selected_date.push($(this).data());
        }
    });
    //批次排班
    $.ajax({
        method: "POST",
        url: "api/insertScheBatch",
        data: {dates:selected_date,beds:selected_beds,nurse_no:nurse_no}
    }).done(function( response ) {
        showAjaxResponeMsg(this.url,response);
        if(response.success){
            var exist_datas = response.result;
            if(exist_datas && exist_datas.length > 0){
                var msg="";
                for(var i=0;i<exist_datas.length;i++){
                    var data=exist_datas[i];
                    msg += "病房:"+data.ward_name+"-"+data.bed_name+" 班別:"+data.class_name+" 日期:"+moment(data.assign_date).format('YYYY/MM/DD')+"排班資料已存在\n";
                }
                alert(msg);
            }
            getThisNurseSche({
                month:selected_month,
                year:selected_year,
                nurse_no:nurse_no,
                nurse_name:nurse_name,
                nurse_tel:nurse_tel
            });
        }else{
            e_alertMsg(response);
        }
    });
}
/**
 * 已選病房數計算
 */
function countBedSelect(){
    ban01  = $('input[name="classT01[]"]:checked').size();
    ban02 =  $('input[name="classT02[]"]:checked').size();
    ban03 =  $('input[name="classT03[]"]:checked').size();
    $( "#ban01" ).html( ban01);
    $( "#ban02" ).html( ban02);
    $( "#ban03" ).html( ban03);
}

