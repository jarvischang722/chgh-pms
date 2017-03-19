//畫面變數
var agents={};
$(function () {
    initialize(); //初始執行

    //dom event
    $( "#insert_btn" ).click(insertNurse);
    $( "#update_btn" ).click(updateNurse);
    $( "#delete_btn" ).click(deleteNurse);

    $(document).on('click', '.edit_nurse', function () {
        var data = $(this);
        editNurse(data.data());
    });
});
/**
 *
 */
function initialize(){
    //代理人
    $.ajax({
        method: "GET",
        url: "api/getAllNurse",
        //data: $( "#form1" ).serialize()
        //data: {}
    }).done(function( response ) {
        if(response.success){
            agents = response.result;
            var nurses_results = {
                nurses: agents
            };
            var tmp = Handlebars.compile($("#nurse_agent_temp").html());
            $('#agent1_nurse_id').html("");
            $('#agent1_nurse_id').append(tmp(nurses_results));
            $('#agent2_nurse_id').html("");
            $('#agent2_nurse_id').append(tmp(nurses_results));
            $('#agent3_nurse_id').html("");
            $('#agent3_nurse_id').append(tmp(nurses_results));
        }else{
            alert(response.errorMsg);
        }
    });
    //護理師清單
    $.ajax({
        method: "GET",
        url: "api/getAllNurse2",
        //data: $( "#form1" ).serialize()
        //data: {}
    }).done(function( response ) {
         if(response.success){
             var nurses_results = {
                nurses: response.result
             };
             var tmp = Handlebars.compile($("#nurse_temp").html());
             $('#nurses_table').html("");
             $('#nurses_table').append(tmp(nurses_results));
         }else{
            alert(response.errorMsg);
         }
    });
}
/**
 * 新增護理師
 */
function insertNurse(){
    $.ajax({
        method: "POST",
        url: "api/insertNurse",
        data: $( "#insert_form" ).serialize()
    }).done(function( response ) {
        if(response.success){
            initialize();
            alert("新增成功!");
        }else{
            alert(response.errorMsg);
        }
    });
}
/**
 * 編輯護理師畫面
 * @param data 護理師資料
 */
function editNurse(data){
    data.agents = agents; //代理人list
    var nurses_results = {
        nurses: data
    };
    var tmp = Handlebars.compile($("#nurse_edit_temp").html());
    $('#edit_nurse_div').html("");
    $('#edit_nurse_div').append(tmp(nurses_results));
}
/**
 * 更新護理師
 */
function updateNurse(){
    $.ajax({
        method: "POST",
        url: "api/updateNurse",
        data: $( "#update_form" ).serialize()
    }).done(function( response ) {
        if(response.success){
            initialize();
            alert("編輯成功!");
        }else{
            alert(response.errorMsg);
        }
    });
}
/**
 * 刪除護理師
 */
function deleteNurse(){
    event.preventDefault();

    confirm("確定刪除嗎? ", function(result){
        if (result){
            //取得checkbox selected nurse's id
            var searchIDs = $("#nurses_table input:checkbox:checked").map(function(){
                return {'id':$(this).val()};
            }).get();

            $.ajax({
                method: "POST",
                url: "api/deleteNurse",
                data: {"nurses":searchIDs}
            }).done(function( response ) {
                    if(response.success){
                        initialize();
                        alert("刪除成功!");
                    }else{
                        alert(response.errorMsg);
                    }
                });
        }
    })




}
