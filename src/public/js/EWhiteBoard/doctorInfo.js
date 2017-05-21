/**
 * Created by Jun on 2017/4/16.
 */

Vue.component('patient-info-tmp', {
    template: '#patientInfoTmp',
    props: ['patientInfo'],
    data: function () {
        return {}
    },
    methods: {}
});

var vmMain = new Vue({
    el: '#out',
    mounted: function () {
            this.fetchDoctorInfo();
    },
    data: {
       doctorList : [],
       bedInfo : {},
        patientInfo:{}
    },
    watch: {

    },
    methods: {
        fetchDoctorInfo :function(){

            $.post("/eWhiteBoard/api/fetchDoctorInfo/",function(result){
                if(result.success){
                    vmMain.doctorList = result.doctorList;
                }
                // console.log(vmMain.doctorList );
            })
        },
        fetchOneBedInfo : function(doctor_name , bed_no){
            this.bedInfo = _.findWhere(_.findWhere(this.doctorList,{doctor_name:doctor_name}).bedList , {bed_no:bed_no})


            var formData = {
                nur_id: this.bedInfo.nur_id,
                patient_id: this.bedInfo.patient_id
            };

            $.post("/eWhiteBoard/api/fetchSinglePatientInfo/", formData, function (result) {
                vmMain.patientInfo = result.patientInfo;
                 console.log(vmMain.patientInfo);
                $('[data-remodal-id=rooms_modal]').remodal().open();
            })

        },
        checkIsToday:function(date){
            var isToday = false;
            if(moment().format("YYYYMMDD") == date){
                isToday = true;
            }
            return isToday
        }
    }
});

