/**
 * Created by Jun on 2017/4/12.
 * 電子白板病患資訊js
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
    el: '#app',
    mounted: function () {
        this.fetchPatientInfo();
        this.fetchDayBeforeInfo();
        this.fetchBedInfo();
    }
    ,
    data: {

        allPatientInfo: [],  //全部病患
        showPatientInfo: [],  //顯示的病患
        patientInfo: {},      //單一病患資訊
        DNRCount: 0,
        CriticalCount: 0,
        dayBeforeInfo: {},      //前一日動態訊息
        bedInfo: {},        //床位數資訊
        patientAllergyData: [] //單病患過敏資料
    },
    watch: {},
    methods: {
        //抓取前一日動態資訊
        fetchDayBeforeInfo: function () {
            var formData = {
                Query_date: moment().subtract(1, "day").format("YYYYMMDD")
            };
            $.post("/eWhiteBoard/api/fetchDayBeforeInfo/", formData, function (result) {
                vmMain.dayBeforeInfo = result.dayBeforeInfo;
            })
        },
        //抓取病患資訊
        fetchPatientInfo: function () {
            $.post("/eWhiteBoard/api/fetchAllPatientInfo/", function (result) {
                vmMain.allPatientInfo = result.allPatientInfo;
                vmMain.DNRCount = _.where(vmMain.allPatientInfo, {signDNRFlag: 'Y'}).length;
                vmMain.CriticalCount = _.filter(vmMain.allPatientInfo, function (data) {
                    return data.critical != '' && data.patient_name
                }).length;
                vmMain.showPatient();
                vmMain.filterPaitentInfo();
                // console.table(JSON.parse(JSON.stringify(vmMain.allPatientInfo)));

            })
        },
        //抓取病患資訊
        fetchBedInfo: function () {
            $.post("/eWhiteBoard/api/fetchNurBedInfo/", function (result) {
                vmMain.bedInfo = result.bedInfo || {};
            });
            //抓取過敏資料
            $.post("/eWhiteBoard/api/fetchAllergyData/", function (result) {
                vmMain.patientAllergyData = result.allergyData || [];
            });
        },
        //取一筆病患
        fetchSinglePatientInfo: function (nur_id, patient_id) {

            var formData = {
                nur_id: nur_id,
                patient_id: patient_id
            };

            $.post("/eWhiteBoard/api/fetchSinglePatientInfo/", formData, function (result) {
                vmMain.patientInfo = result.patientInfo;
                // console.log(vmMain.patientInfo);
                $('[data-remodal-id=rooms_modal]').remodal().open();
            })
        },
        //過濾顯示的病床
        filterPaitentInfo: function (type) {

            if (_.isUndefined(type) || _.isEmpty(type)) {
                this.showPatientInfo = this.allPatientInfo;
                return;
            }

            switch (type) {
                case 'DNR':
                    this.showPatientInfo = _.filter(this.allPatientInfo, function (p_data) {
                        return p_data.signDNRFlag == 'Y';
                    });
                    break;
                case 'Critical':
                    this.showPatientInfo = _.filter(this.allPatientInfo, function (p_data) {
                        return p_data.critical != '' && !_.isUndefined(p_data.patient_name)
                    });
                    break;
                case 'emptyBed':
                    this.showPatientInfo = _.filter(this.allPatientInfo, function (p_data) {
                        return _.isUndefined(p_data.patient_name);
                    });
                    break;
            }
        },
        //顯示病患資訊
        showAllPatient: function () {

        },
        //更新單一病患資訊
        showPatient: function () {

        }
    }
});

