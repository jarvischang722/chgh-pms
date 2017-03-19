/**
 * Created by Eason on 2016/10/21.
 * * 執行Table [todo1]的SQL 相關語法
 */
module.exports = {
    //待辦事項片語
    "QRY_ALL_TODO" : "SELECT * FROM todo ",
    "QRY_TODO_BY_CLASS" : "SELECT * FROM todo WHERE todo_class_id = :todo_class_id ",
    "DEL_TODO" : "DELETE  FROM todo where id= :id ",
    "ADD_TODO" : "INSERT INTO todo SET ? ",
    "UPDATE_TODO" : "UPDATE todo SET todo_name= :name, last_update_time= :last_update_time, update_user= :update_user where id= :id ",

    //待辦事項類別
    "QRY_TODO_CLASS" : "SELECT * FROM todo_class ",
    "DEL_TODO_CLASS" : "DELETE  FROM todo_class where id= :id ",
    "ADD_TODO_CLASS" : "INSERT INTO todo_class SET ? ",
    "UPDATE_TODO_CLASS" : "UPDATE todo_class SET todo_class_name= :name, last_update_time= :last_update_time, update_user= :update_user where id= :id "
};