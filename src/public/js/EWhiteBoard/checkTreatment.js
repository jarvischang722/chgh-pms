/**
 * Created by Jun on 2017/4/16.
 * 檢查治療
 */

var vmMain = new Vue({
    el: '#ope_list',
    mounted: function () {
        this.fetchCheckTreatment();
    },
    data: {
        checkTreatmentList: [],
        isReady: false,
        queryDate: moment().format("YYYY/MM/DD"),
        queryDateString: moment().format("YYYYMMDD")
    },
    watch: {
        queryDate: function (newDate) {
            this.queryDateString = moment(newDate).format("YYYYMMDD");
        }
    },
    methods: {
        fetchCheckTreatment: function () {
            var params = {
                StratDate :this.queryDateString,
                EndDate :this.queryDateString
            };
            $.post("/eWhiteBoard/api/fetchExamScheduleInfo/",params,function (result) {
                vmMain.isReady = true;
                vmMain.checkTreatmentList = result.examScheduleInfo;
            });
        },
        fetchPreDay: function () {
            this.queryDate = moment(this.queryDate).subtract(1, "day").format("YYYY/MM/DD");
            this.fetchCheckTreatment();
        },
        fetchNextDay: function () {
            this.queryDate = moment(this.queryDate).add(1, "day").format("YYYY/MM/DD");
            this.fetchCheckTreatment();
        }

    }
});

