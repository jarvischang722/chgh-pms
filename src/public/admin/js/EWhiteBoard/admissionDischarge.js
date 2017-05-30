/**
 * Created by Jun on 2016/11/7.
 */
new Vue({
    el: '#in_and_out',
    data: {
        InList :[],           //今日入院
        OutList :[],          //今日出院
        ResrvTurnBedList :[],  //預約轉床
        searchDate : moment().format("YYYY/MM/DD")
    },
    ready: function () {
        this.updateInOutHospital();
    },
    methods: {
        updateInOutHospital: function(){
            site.showWaitingModal();
            var self = this;
            $.post("/eWhiteBoard/api/InOutHospitalInfo",{searchDate:this.searchDate},function(resultData){
                site.closeWaitingModal();
                var  InOutList = resultData.InOutList || [];
                self.InList =  _.filter(InOutList , function(item){
                    return item.status == 'in'
                });
                self.OutList =  _.filter(InOutList , function(item){
                    return item.status == 'out'
                });

                self.ResrvTurnBedList = resultData.ResrvTurnBedList || [];

            })
        },
        //找尋前一天
        preDay: function(){
            this.searchDate = moment(new Date(this.searchDate)).subtract(1,"day").format("YYYY/MM/DD");
            this.updateInOutHospital();
        },
        //找尋後一天
        nextDay: function(){
            this.searchDate = moment(new Date(this.searchDate)).add(1,"day").format("YYYY/MM/DD");
            this.updateInOutHospital();
        }
    }
})
