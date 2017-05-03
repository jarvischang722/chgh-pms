/**
 * Created by Jun on 2017/4/16.
 */

Vue.component('doctor-info-tmp', {
    template: '#doctorInfoTmp',
    props: ["bedInfo"],
    data: function () {
        return {

        }
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
       bedInfo : {}
    },
    watch: {

    },
    methods: {
        fetchDoctorInfo :function(){

            $.post("/eWhiteBoard/api/fetchDoctorInfo/",{_nurid:"5A"},function(result){
                if(result.success){
                    vmMain.doctorList = result.doctorList;
                }
            })
        },
        fetchOneBedInfo : function(doctor_name , bed_no){
            this.bedInfo = _.findWhere(_.findWhere(this.doctorList,{doctor_name:doctor_name}).bedList , {bed_no:bed_no})
           console.log( this.bedInfo);
            $('[data-remodal-id=bed_modal]').remodal().open();
        }
    }
});

