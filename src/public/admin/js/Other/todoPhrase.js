//畫面變數
var update_todo, update_todoclass;
$(function () {
    initialize(); //初始執行

    //dom event
    $("#insert_todo_btn").click(doInsertTodo);
    $("#insert_todoclass_btn").click(doInsertTodoClass);
    $("#update_todo_btn").click(doUpdateTodo);
    $("#update_todoclass_btn").click(doUpdateTodoClass);
    $("#delete_todo_btn").click(doDeleteTodo);
    $("#delete_todoclass_btn").click(doDeleteTodoClass);


    $(document).on('click', '.edit_todo', function () {
        var data = $(this);
        editTodo(data.data());
    });
    $(document).on('click', '.edit_todoclass', function () {
        var data = $(this);
        editTodoClass(data.data());
    });

    //Ian , select連動
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
});
/**
 *
 */
function initialize() {
    //todo清單
    $.ajax({
        method: "GET",
        url: "api/getAllTodo",
    }).done(function (response) {
        if (response.success) {
             var todos_results = {
                todos: response.result
             };
             var tmp = Handlebars.compile($("#todo_temp").html());
             $('#all_todo_body').html("");
             $('#all_todo_body').append(tmp(todos_results));

            //筆數
            $('#todo_num').html(response.result.length);
        } else {
            alert(response.errorMsg);
        }
    });
    //todo類別
    $.ajax({
        method: "GET",
        url: "api/getTodoClass",
    }).done(function (response) {
        console.log(response);
        if (response.success) {
            var todos_results = {
                todoclasses: response.result
            };
            var tmp = Handlebars.compile($("#todoclass_temp").html());
            $('#todo_class_body').html("");
            $('#todo_class_body').append(tmp(todos_results));

            //筆數
            $('#todo_class_num').html(response.result.length);

            var tmp = Handlebars.compile($("#todoclass_select_temp").html());
            $('#todoclass_select').html("");
            $('#todoclass_select').append(tmp(todos_results));
        } else {
            alert(response.errorMsg);
        }
    });
    //輸入欄位初始
    $('#new_todo_name').val("");
    $('#new_todoclass_name').val("");
}
/**
 * 新增片語
 */
function doInsertTodo() {
    $.ajax({
        method: "POST",
        url: "api/insertTodo",
        data: {"todo_name":$('#new_todo_name').val(),"todo_class_id":$('#todoclass_select').val()}
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
 * 新增片語類別
 */
function doInsertTodoClass() {
    $.ajax({
        method: "POST",
        url: "api/insertTodoClass",
        data: {"todo_class_name":$('#new_todoclass_name').val()}
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
 * 編輯片語畫面
 * @param data 護理師資料
 */
function editTodo(data) {
    update_todo = data;
    var todos_results = {
        todos: data
    };
    var tmp = Handlebars.compile($("#edit_todo_temp").html());
    $('#edit_todo_div').html("");
    $('#edit_todo_div').append(tmp(todos_results));
}
/**
 * 編輯片語類別畫面
 * @param data 護理師資料
 */
function editTodoClass(data) {
    update_todoclass = data;
    var todoclasses_results = {
        todoclasses: data
    };
    var tmp = Handlebars.compile($("#edit_todoclass_temp").html());
    $('#edit_todoclass_div').html("");
    $('#edit_todoclass_div').append(tmp(todoclasses_results));
}
/**
 * 更新片語
 */
function doUpdateTodo() {
    update_todo.name = $('#edit_todo_name').val();
    $.ajax({
        method: "POST",
        url: "api/updateTodo",
        data: update_todo
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
 * 更新片語類別
 */
function doUpdateTodoClass() {
    update_todoclass.name = $('#edit_todoclass_name').val();
    $.ajax({
        method: "POST",
        url: "api/updateTodoClass",
        data: update_todoclass
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
 * 刪除片語
 */
function doDeleteTodo() {
    event.preventDefault();



    confirm("確定刪除嗎? ", function(result){
        if (result){

            //取得checkbox selected nurse's id
            var searchIDs = $("#todo_table input:checkbox:checked").map(function () {
                return {'id': $(this).val()};
            }).get();

            $.ajax({
                method: "POST",
                url: "api/deleteTodo",
                data: {"todos": searchIDs}
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
/**
 * 刪除片語類別
 */
function doDeleteTodoClass() {
    event.preventDefault();
/*
    if (!confirm('是否確定要刪除?')) {
        return;
    }
    //取得checkbox selected nurse's id
    var searchIDs = $("#todoclass_table input:checkbox:checked").map(function () {
        return {'id': $(this).val()};
    }).get();

    $.ajax({
        method: "POST",
        url: "api/deleteTodoClass",
        data: {"todoclasses": searchIDs}
    }).done(function (response) {
        if (response.success) {
            initialize();
            //alert("刪除成功!");
        } else {
            alert(response.errorMsg);
        }
    });*/


    confirm("確定刪除嗎? ", function(result){
        if (result){
            //取得checkbox selected nurse's id
            var searchIDs = $("#todoclass_table input:checkbox:checked").map(function () {
                return {'id': $(this).val()};
            }).get();

            $.ajax({
                method: "POST",
                url: "api/deleteTodoClass",
                data: {"todoclasses": searchIDs}
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
