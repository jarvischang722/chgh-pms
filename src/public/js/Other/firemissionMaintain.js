//畫面變數
var update_todo, update_todoclass;
$(function () {
    initialize(); //初始執行

    //dom event
    $("#insert_btn").click(doInsert);
    $("#update_btn").click(doUpdate);
    $("#delete_btn").click(doDelete);

    $(document).on('click', '.edit_group', function () {
        var data = $(this);
        editGroup(data.data());
    });

    $('input[type=radio][name=mission_types]').change(function() {
        console.log(this.value);
        getfmList(this.value);
    });

    //Ian , select連動
    /*
    $(document).on('change', '#todoclass_select', function () {
        var todoclass_select=$("#todoclass_select").val() || "";
        if(todoclass_select!=""){
            $('.todo_row').each(function () {
                var temp_todoclass = $(this).find("a").data("todo-class-id");
                if( temp_todoclass == todoclass_select ){
                    $(this).show();
                }else{
                    $(this).hide();
                }
            });
        }else{
            $('.todo_row').show();
        }
    });
    */
});
/**
 *
 */
function initialize() {
    //todo清單
    getfmList('M');
}

function getfmList(type){
    console.log(type);
    $.ajax({
        method: "POST",
        url: "api/getAllFireMission",
        data: {"type":type}
    }).done(function (response) {
        console.log(response);
        if (response.success) {
            var todos_results = {
                items: response.result
            };
            var tmp = Handlebars.compile($("#groups_temp").html());
            $('#all_group_body').html("");
            $('#all_group_body').append(tmp(todos_results));
        } else {
            alert(response.errorMsg);
        }
    });
    //輸入欄位初始
    //$('#new_todo_name').val("");
    //$('#new_todoclass_name').val("");
}
/**
 * 新增群組
 */
function doInsert() {
    $.ajax({
        method: "POST",
        url: "api/insertFireMission",
        data: {"group_name":$('#group_name').val(),"group_sname":$('#group_sname').val(),"type":$('input[name="mission_types"]:checked').val()}
    }).done(function (response) {
        if (response.success) {
            getfmList($('input[name="mission_types"]:checked').val());
            //alert("新增成功!");
        } else {
            alert(response.errorMsg);
        }
    });
}

/**
 * 編輯群組畫面
 * @param data 護理師資料
 */
function editGroup(data) {
    var todos_results = {
        group: data
    };
    var tmp = Handlebars.compile($("#edit_group_temp").html());
    $('#edit_group_div').html("");
    $('#edit_group_div').append(tmp(todos_results));
}

/**
 * 更新群組
 */
function doUpdate() {
    $.ajax({
        method: "POST",
        url: "api/updateFireMission",
        data: $( "#update_form" ).serialize()
    }).done(function (response) {
        if (response.success) {
            getfmList($('input[name="mission_types"]:checked').val());
            //alert("編輯成功!");
        } else {
            alert(response.errorMsg);
        }
    });
}

/**
 * 刪除群組
 */
function doDelete() {
    event.preventDefault();
    /*
    if(!confirm("確定刪除嗎")){
        return;
    }
    //取得checkbox selected
    var searchIDs = $("#group_table input:checkbox:checked").map(function () {
        return {'id': $(this).val(),'type':$(this).data().type};
    }).get();

    $.ajax({
        method: "POST",
        url: "api/deleteFireMission",
        data: {"groups": searchIDs}
    }).done(function (response) {
        if (response.success) {
            getfmList($('input[name="mission_types"]:checked').val());
            //alert("刪除成功!");
        } else {
            alert(response.errorMsg);
        }
    });
    */
    confirm("確定刪除嗎? ", function(result){
        if (result){
            //取得checkbox selected
            var searchIDs = $("#group_table input:checkbox:checked").map(function () {
                return {'id': $(this).val(),'type':$(this).data().type};
            }).get();

            $.ajax({
                method: "POST",
                url: "api/deleteFireMission",
                data: {"groups": searchIDs}
            }).done(function (response) {
                    if (response.success) {
                        getfmList($('input[name="mission_types"]:checked').val());
                        //alert("刪除成功!");
                    } else {
                        alert(response.errorMsg);
                    }
            });
        }
    })
}
