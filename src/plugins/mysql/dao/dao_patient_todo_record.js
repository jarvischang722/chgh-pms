/**
 * Created by Ian on 2016/10/25.
 * * 執行Table [patient_todo_record]的SQL 相關語法
 */
module.exports = {

    // 待辦事項類別
    "QRY_ALL_PATIENT_TODO_CLASS" : "SELECT * FROM todo_class",


    // 待辦事項項目
    "QRY_ALL_PATIENT_TODO_ITEM" : "SELECT * FROM todo where todo_class_id=:todo_class_id",


    // 病人的待辦事項紀錄
    "QRY_ALL_PATIENT_TODO_RECORD" : "SELECT * FROM patient_todo_record",

    //依病床，去顯示哪個床位上有什麼待辦事項
    "QRY_ALL_PATIENT_TODO_RECORD_GROUP_BY_BED" :"SELECT   " +
        "bed.name as bed_name,  " +
        "patient.id as patient_id,  " +
        "patient.name as patient_name,  " +
        "patient.age as patient_age,  " +
        "patient.sex as patient_sex,  " +
        "patient.record_no as patient_record_no,  " +
        "ward.ward_name AS ward_name, " +
        "ward.id AS ward_id, " +
        "ward_zone.ward_zone_name AS ward_zone_name, " +
        "ward_zone.id AS ward_zone_id, " +
        "" +
        "group_concat(todo .todo_name separator ', ')  as todo_list  " +
        "FROM `patient_todo_record`   " +
        "" +
        "left join medical_record on patient_todo_record.medical_record_id=medical_record.id  " +
        "left join todo on patient_todo_record.todo_id=todo.id  " +
        "left join patient on patient.person_id = medical_record.patient_person_id  " +
        "left join bed_record on bed_record.patient_person_id = patient.person_id  " +
        "left join bed on bed.id = bed_record.bed_id  " +
        "LEFT join ward on ward.id = bed.ward_id " +
        "LEFT join ward_zone ON ward.ward_zone_id = ward_zone.id " +
        "" +
        "where ward_zone.id=:ward_zone_id  " +
        "and patient_todo_record.todo_date=:patient_todo_record_date " +
        "group by patient_todo_record.medical_record_id  ",


    //依病床，去顯示哪個床位上有什麼待辦事項(是否完成)
    "QRY_ALL_PATIENT_TODO_RECORD_GROUP_BY_BED_AND_FINISH" :"SELECT   " +
        "bed.name as bed_name,  " +
        "patient.id as patient_id,  " +
        "patient.name as patient_name,  " +
        "patient.age as patient_age,  " +
        "patient.sex as patient_sex,  " +
        "patient.record_no as patient_record_no,  " +
        "ward.ward_name AS ward_name, " +
        "ward.id AS ward_id, " +
        "ward_zone.ward_zone_name AS ward_zone_name, " +
        "ward_zone.id AS ward_zone_id, " +
        "" +
        "group_concat(todo .todo_name separator ', ')  as todo_list  " +
        "FROM `patient_todo_record`   " +
        "" +
        "left join medical_record on patient_todo_record.medical_record_id=medical_record.id  " +
        "left join todo on patient_todo_record.todo_id=todo.id  " +
        "left join patient on patient.person_id = medical_record.patient_person_id  " +
        "left join bed_record on bed_record.patient_person_id = patient.person_id  " +
        "left join bed on bed.id = bed_record.bed_id  " +
        "LEFT join ward on ward.id = bed.ward_id " +
        "LEFT join ward_zone ON ward.ward_zone_id = ward_zone.id " +
        "" +
        "where ward_zone.id=:ward_zone_id  " +
        "and patient_todo_record.todo_date=:patient_todo_record_date " +
        "and patient_todo_record.is_finish=:is_finish " +
        "and medical_record.status='in'" +
        "group by patient_todo_record.medical_record_id  ",

    //依病患id去找資訊
    "QRY_ALL_PATIENT_TODO_RECORD_BY_PATIENT_PERSION_ID" :
        "SELECT "+
            "patient_todo_record.id as patient_todo_record_id,"+
            "bed.name as bed_name,"+
            "patient.name as patient_name,"+
            "patient.sex as patient_sex,"+
            "patient.age as patient_age,"+
            "patient.birthday_date as patient_birthday_date,"+
            "medical_record.number as medical_record_number,"+
            "todo.todo_name as todo_name,"+
            "patient_todo_record.todo_date as patient_todo_record_date,"+
            "patient_todo_record.is_finish as patient_todo_record_is_finish "+

            "FROM patient_todo_record " +

            "INNER JOIN todo "+
            "ON patient_todo_record.todo_id = todo.id "+
            "INNER JOIN medical_record "+
            "ON patient_todo_record.medical_record_id = medical_record.id "+
            "INNER JOIN patient "+
            "ON medical_record.patient_person_id = patient.person_id "+
            "INNER JOIN bed_record "+
            "ON bed_record.patient_person_id = patient.person_id "+
            "INNER JOIN bed "+
            "ON bed_record.bed_id = bed.id "+

            "where patient.person_id=:patient_person_id and " +
            "patient_todo_record.todo_date=:patient_todo_record_date",

    "QRY_ALL_PATIENT_TODO_RECORD_BY_DATE_NOT_FINISH" :
        "SELECT "+
            "patient_todo_record.id as patient_todo_record_id,"+
            "bed.name as bed_name,"+
            "patient.name as patient_name,"+
            "patient.sex as patient_sex,"+
            "patient.age as patient_age,"+
            "patient.person_id as patient_person_id,"+
            "patient.birthday_date as patient_birthday_date,"+
            "patient_todo_record.medical_record_id as medical_record_id,"+
            "medical_record.number as medical_record_number,"+
            "todo.id as todo_id,"+
            "todo.todo_name as todo_name,"+
            "patient_todo_record.todo_date as patient_todo_record_date,"+
            "patient_todo_record.is_finish as patient_todo_record_is_finish,"+

            "ward.ward_name AS ward_name, " +
            "ward.id AS ward_id, " +
            "ward_zone.ward_zone_name AS ward_zone_name, " +
            "ward_zone.id AS ward_zone_id " +

            "FROM patient_todo_record "+


            "INNER JOIN todo "+
            "ON patient_todo_record.todo_id = todo.id "+
            "INNER JOIN medical_record "+
            "ON patient_todo_record.medical_record_id = medical_record.id "+
            "INNER JOIN patient "+
            "ON medical_record.patient_person_id = patient.person_id "+
            "INNER JOIN bed_record "+
            "ON bed_record.patient_person_id = patient.person_id "+
            "INNER JOIN bed "+
            "ON bed_record.bed_id = bed.id "+

            "LEFT join ward on ward.id = bed.ward_id " +

            "LEFT join ward_zone ON ward.ward_zone_id = ward_zone.id " +

            "where ward.ward_zone_id=:ward_zone_id " +

            "AND medical_record.status='in' " +

            "AND patient_todo_record.todo_date=:todo_date and is_finish='N'",

    "QRY_ALL_PATIENT_TODO_RECORD_BY_DATE" :
        "SELECT "+
        "patient_todo_record.id as patient_todo_record_id,"+
        "bed.name as bed_name,"+
        "patient.name as patient_name,"+
        "patient.sex as patient_sex,"+
        "patient.age as patient_age,"+
        "patient.person_id as patient_person_id,"+
        "patient.birthday_date as patient_birthday_date,"+
        "patient_todo_record.medical_record_id as medical_record_id,"+
        "medical_record.number as medical_record_number,"+
        "todo.id as todo_id,"+
        "todo.todo_name as todo_name,"+
        "patient_todo_record.todo_date as patient_todo_record_date,"+
        "patient_todo_record.is_finish as patient_todo_record_is_finish,"+

        "ward.ward_name AS ward_name, " +
        "ward.id AS ward_id, " +
        "ward_zone.ward_zone_name AS ward_zone_name, " +
        "ward_zone.id AS ward_zone_id " +

        "FROM patient_todo_record "+


        "INNER JOIN todo "+
        "ON patient_todo_record.todo_id = todo.id "+
        "INNER JOIN medical_record "+
        "ON patient_todo_record.medical_record_id = medical_record.id "+
        "INNER JOIN patient "+
        "ON medical_record.patient_person_id = patient.person_id "+
        "INNER JOIN bed_record "+
        "ON bed_record.patient_person_id = patient.person_id "+
        "INNER JOIN bed "+
        "ON bed_record.bed_id = bed.id "+

        "LEFT join ward on ward.id = bed.ward_id " +

        "LEFT join ward_zone ON ward.ward_zone_id = ward_zone.id " +

         "where ward.ward_zone_id=:ward_zone_id and " +

            "patient_todo_record.todo_date=:todo_date",

    "QRY_PATIENT_TODO_RECORD_COUNT_BY_DATE" :
        "SELECT *, "
            + "sum(patient_todo_record.is_finish='Y')  AS finishCount, "
            + "sum(patient_todo_record.is_finish='N')  AS notFinishCount "
            + " "
            + "FROM   patient_todo_record "
            + "   LEFT JOIN medical_record "
            + "   ON patient_todo_record.medical_record_id = medical_record.id "
            + "WHERE  medical_record.patient_person_id = :patient_person_id "
            + "       AND patient_todo_record.todo_date = :todo_date "
            + " "
            + "Group by patient_todo_record.medical_record_id",



    "QRY_PATIENT_TODO_RECORD_BY_PATIENT" :
    "SELECT *, patient_todo_record.id as patient_todo_record_id "
    + "FROM   patient_todo_record "
    + "       INNER JOIN todo "
    + "               ON patient_todo_record.todo_id = todo.id "
    + "WHERE  1=1"
    + "       [AND nur_id = :ward_zone_id ]"
    + "       [AND medical_record_id = :patient_id ]"
    + "       [AND todo_date = :todo_date] ",

    "QRY_PATIENT_TODO_RECORD_GORUP_BY_PATIENT" :
    "SELECT *, "
    + "sum(`is_finish`='Y')  AS finishCount, "
    + "sum(`is_finish`='N')  AS notFinishCount "
    + "FROM   patient_todo_record "
    + "       INNER JOIN todo "
    + "               ON patient_todo_record.todo_id = todo.id "
    + "WHERE  1=1"
    + "       [AND nur_id = :ward_zone_id ]"
    + "       [AND medical_record_id = :patient_id ]"
    + "       [AND todo_date = :todo_date] "
    + "Group by medical_record_id",

    "QRY_PATIENT_TODO_RECORD" :
    "SELECT * "
    + "FROM   patient_todo_record "
    + "       INNER JOIN todo "
    + "               ON patient_todo_record.todo_id = todo.id "
    + "WHERE  1=1"
    + "       [AND nur_id = :ward_zone_id ]"
    + "       [AND medical_record_id = :patient_id ]"
    + "       [AND todo_date = :todo_date]",



    "QRY_ALL_PATIENT_TODO_RECORD_COUNT_BY_DATE_OLD" :
        "SELECT patient_todo_record.id        AS patient_todo_record_id, "
            + "       bed.name                      AS bed_name, "
            + "       patient.name                  AS patient_name, "
            + "       patient.sex                   AS patient_sex, "
            + "       patient.age                   AS patient_age, "
            + "       patient.person_id             AS patient_person_id, "
            + "       patient.birthday_date         AS patient_birthday_date, "
            + "       medical_record.number         AS medical_record_number, "
            + "       patient_todo_record.medical_record_id as medical_record_id,"
            + "       todo.id                       AS todo_id, "
            + "       todo.todo_name                AS todo_name, "
            + "       patient_todo_record.todo_date AS patient_todo_record_date, "
            + "       patient_todo_record.is_finish AS patient_todo_record_is_finish, "
            + "       ward.ward_name                AS ward_name, "
            + "       ward.id                       AS ward_id, "
            + "       ward_zone.ward_zone_name      AS ward_zone_name, "
            + "       ward_zone.id                  AS ward_zone_id , "
            + " "
            + "sum(`is_finish`='Y')  AS finishCount, "
            + "sum(`is_finish`='N')  AS notFinishCount "
            + " "
            + "FROM   patient_todo_record "
            + "       INNER JOIN todo "
            + "               ON patient_todo_record.todo_id = todo.id "
            + "       INNER JOIN medical_record "
            + "               ON patient_todo_record.medical_record_id = medical_record.id "
            + "       INNER JOIN patient "
            + "               ON medical_record.patient_person_id = patient.person_id "
            + "       INNER JOIN bed_record "
            + "               ON bed_record.patient_person_id = patient.person_id "
            + "       INNER JOIN bed "
            + "               ON bed_record.bed_id = bed.id "
            + "       LEFT JOIN ward "
            + "              ON ward.id = bed.ward_id "
            + "       LEFT JOIN ward_zone "
            + "              ON ward.ward_zone_id = ward_zone.id "
            + "WHERE  ward.ward_zone_id = :ward_zone_id "
            + "       AND patient_todo_record.todo_date = :todo_date "
            + " "
            + "Group by patient.person_id",

    "UPDATE_PATIENT_TODO_RECORD_STATUS" : "UPDATE patient_todo_record SET is_finish= :is_finish, update_user=:update_user where id= :patient_todo_record_id",

    "INS_PATIENT_TODO_RECORD" : "INSERT IGNORE INTO patient_todo_record (medical_record_id, todo_id, todo_date, patient_name, patient_sex, patient_birthday, nur_id, bed_no, is_finish,update_user)  VALUES ?",

    "DEL_PATIENT_TODO_RECORD" : "DELETE FROM patient_todo_record where id= :patient_todo_record_id",


    "DEL_PATIENT_TODO_RECORD_BY_medical_record_id" : "DELETE FROM patient_todo_record where medical_record_id= :medical_record_id and todo_date=:todo_date"





};