//畫面變數
$(function () {
    initialize(); //初始執行

    //dom event
    $("#insert_btn").click(doInsert);
    $("#update_btn").click(doUpdate);
    $("#delete_btn").click(doDelete);

    $(document).on('click', '.edit_ann', function () {
        var data = $(this);
        editAnn(data.data());
    });
    $(document).on('click', '#new_btn', function () {
        $( "#insert_form" )[0].reset();
    });
});
/**
 *
 */
function initialize() {
    //病房公告
    $.ajax({
        method: "GET",
        url: "api/getAllAnnouncement",
    }).done(function (response) {
        console.log(response);
        if (response.success) {
             var anns_results = {
                anns: response.result
             };
             var tmp = Handlebars.compile($("#ann_temp").html());
             $('#all_ann_body').html("");
             $('#all_ann_body').append(tmp(anns_results));

            //筆數
            $('#ann_num').html(response.result.length);
        } else {
            alert(response.errorMsg);
        }
    });
}
/**
 * 新增病房公告
 */
function doInsert() {
    $.ajax({
        method: "POST",
        url: "api/insertAnnouncement",
        data: $( "#insert_form" ).serialize()
    }).done(function (response) {
        if (response.success) {
            initialize();
            //alert("新增成功!");
        } else {
            alert(response.errorMsg);
        }
    });
}
/**
 * 編輯病房公告
 */
function editAnn(data) {
    var anns_results = {
        anns: data
    };
    var tmp = Handlebars.compile($("#edit_ann_temp").html());
    $('#edit_ann_div').html("");
    $('#edit_ann_div').append(tmp(anns_results));

    $('.datepicker-here').datepicker({
        minDate: new Date(),
    });
}
/**
 * 更新病房公告
 */
function doUpdate() {
    $.ajax({
        method: "POST",
        url: "api/updateAnnouncement",
        data: $( "#update_form" ).serialize()
    }).done(function (response) {
        if (response.success) {
            initialize();
            //alert("編輯成功!");
        } else {
            alert(response.errorMsg);
        }
    });
}
/**
 * 刪除病房公告
 */
function doDelete() {
    event.preventDefault();

    confirm("確定刪除嗎? ", function(result){
        if (result){
            //取得checkbox selected
            var searchIDs = $("#ann_table input:checkbox:checked").map(function () {
                return {'id': $(this).val()};
            }).get();

            $.ajax({
                method: "POST",
                url: "api/deleteAnnouncement",
                data: {"anns": searchIDs}
            }).done(function (response) {
                    if (response.success) {
                        initialize();
                        //alert("刪除成功!");
                    } else {
                        alert(response.errorMsg);
                    }
                });
        }
    })



}
