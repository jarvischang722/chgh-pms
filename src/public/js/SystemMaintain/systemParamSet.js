/**
 * Created by Jun on 2016/12/9.
 */

//儲存點滴參數
function doSaveBitParam(){

    var values = {};
    $.each($('#bitForm').serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });
    $.post("/systemMaintain/updateBitParam",values,function(result){
        if(result.success){

            alert('已儲存');
        }else{
            alert('儲存失敗:'+result.errorMsg);
        }
    })
}

//儲存HIS參數
function doSaveHISParam(){
    var values = {};
    $.each($('#hisForm').serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });
    $.post("/systemMaintain/updateHISParam",values,function(result){
         if(result.success){
             alert('已儲存');
         }else{
             alert('儲存失敗:'+result.errorMsg);
         }
    })
}

//儲存SIP參數
function doSaveSIPParam(){
    var values = {};
    $.each($('#sipForm').serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });
    values["get_call_record_time"] = $("#get_call_record_time").val();
    values["ntp_adjust"] = $("#ntp_adjust").val();

    $.post("/systemMaintain/updateSIPParam",values,function(result){
        if(result.success){
            SIPGetCheckInterval();
            alert('已儲存');
        }else{
            alert('儲存失敗:'+result.errorMsg);
        }
    })
}

