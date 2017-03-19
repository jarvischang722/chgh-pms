/**
 * Created by Jun on 2016/11/6.
 * 電子白板醫生資訊
 */

new Vue({
    el: '#out',
    data: {
        DoctorList :[],
        OnDutyDoctorList :[],   //值班醫師
        OtherDoctorList : []    //其他醫師
    },
    ready: function () {
        this.updateDoctorInfo();
    },
    methods: {
        updateDoctorInfo: function(){
            site.showWaitingModal();
            var self = this;
            $.post("/doctor/doctorQuery",function(doctorData){
                site.closeWaitingModal();
                self.DoctorList = doctorData.doctorList;
                // self.OnDutyDoctorList = _.filter(doctorList , function(DItem){ return DItem.doctor_class.trim() != '主治醫師' })
                // self.OtherDoctorList = _.filter(doctorList , function(DItem){ return DItem.doctor_class.trim() == '主治醫師' })
            })
        }
    }
})


Vue.filter("checkToday",function(schedule_date){
    return _.isEqual( moment().format("YYYY/MM/DD") , moment.utc(schedule_date).format("YYYY/MM/DD") ) ? "new" : "";
})