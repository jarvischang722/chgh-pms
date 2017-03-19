/**
 * Created by Jun on 2016/10/1.
 * 執行Table [surgery]的SQL 相關語法
 */
module.exports = {

    "QRY_SURGERY" : "SELECT sg.*,dct.doctor_name, mr.number as medical_number  ,pt.name , pt.sex, pt.age , " +
                                                 "wz.ward_zone_name , bd.`name` as bed_name, wd.ward_name  " +
                    "FROM `surgery` sg  "+
                    "LEFT JOIN  doctor dct on dct.doctor_no = sg.doctor_no "+
                    "LEFT JOIN  medical_record mr on mr.number = sg.medical_record_number "+
                    "LEFT JOIN  patient pt on pt.person_id = mr.patient_person_id " +
                    "LEFT JOIN  bed_record  br on br.patient_person_id = mr.patient_person_id " +
                    "Left JOIN  bed bd on bd.id  = br.bed_id " +
                    "LEFT JOIN  ward wd on wd.id = bd.ward_id " +
                    "LEFT JOIN  ward_zone wz on wz.id = wd.ward_zone_id " +
                    "where  sg.surgery_date = :surgery_date "
    //新增手術資訊
    ,"ADD_SURGERY" : "INSERT INTO surgery SET ? "
    //修改手術資訊
    ,"UPDATE_SURGERY" : "UPDATE surgery SET surgery_date=:surgery_date,surgery_name=:surgery_name,surgery_eng_name=:surgery_eng_name,surgery_type=:surgery_type," +
    " surgery_status=:surgery_status, doctor_no=:doctor_no, medical_record_number=:medical_record_number," +
    " surgery_room=:surgery_room, surgery_number=:surgery_number, last_update_time=:last_update_time, update_user=:update_user " +
    " WHERE id= :id "
};