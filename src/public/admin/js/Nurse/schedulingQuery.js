//畫面變數

$(function () {
    initialize(); //初始執行

    //dom event
    $( "#query_btn" ).click(queryNurseSche);

    $(document).on('click', '.showdetail', function () {
        var data = $(this);
        showDetail(data.data());
    });
});
/**
 *
 */
function initialize(){
    var today =  moment(new Date()).format("YYYY/MM/DD");
    $("#ope_range").val(today + " ~ " + today);
}
/**
 * 搜尋護理師班表
 */
function queryNurseSche(){
    event.preventDefault();
    $.ajax({
        method: "POST",
        url: "api/queryNurseSche",
        data: {"sche_class":$("#sche_class").val(),"ope_range":$("#ope_range").val(),"nurse_id_name":$("#nurse_id_name").val()}
    }).done(function( response ) {
        if(response.success){
            var nurses_results = {
                nurses: response.result
            };
            var tmp = Handlebars.compile($("#nurse_temp").html());
            $('#nurses_div').html("");
            $('#nurses_div').append(tmp(nurses_results));
        }else{
            alert(response.errorMsg);
        }
    });
}
/**
 * 病房詳細資訊
 * @param data 病房詳細資訊
 */
function showDetail(data){
    var nurses_results = {
        results: data
    };
    var tmp = Handlebars.compile($("#detail_temp").html());
    $('#modal_list_search').html("");
    $('#modal_list_search').append(tmp(nurses_results));
    //病房出入院記錄
    $.ajax({
        method: "POST",
        url: "api/getMedicalRecord",
        data: {"bed_id":data.bed_id}
    }).done(function( response ) {
        if(response.success){
            var nurses_results = {
                records: response.result
            };
            var tmp = Handlebars.compile($("#record_temp").html());
            $('#record_tbody').html("");
            $('#record_tbody').append(tmp(nurses_results));
        }else{
            $('#record_tbody').html("");
            //alert(response.errorMsg);
        }
    });
}


