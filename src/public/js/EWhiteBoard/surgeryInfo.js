/**
 * Created by Jun on 2016/11/6.
 * 電子白板手術資訊
 */

new Vue({
    el: '#ope_list',
    data: {
        AllSurgeryList :[],
        surgeryList :[],
        surgeryRoomList : [],
        surgeryDate : moment().format("YYYY/MM/DD")
    },
    ready: function () {
        this.updateSurgeryInfo();
    },
    methods: {
        updateSurgeryInfo: function(){
            site.showWaitingModal();
            var self = this;
            var cond = {
                surgery_date : this.surgeryDate
            };
            $.post("/surgery/surgeryQuery",cond,function(surgeryData){
                site.closeWaitingModal();
                self.AllSurgeryList = surgeryData.surgeryList;
                self.surgeryList = surgeryData.surgeryList;
                self.surgeryRoomList = _.unique(_.pluck(surgeryData.surgeryList , "surgery_room"));
            })
        },
        //找尋前一天
        preDaySurgery: function(){
            this.surgeryDate = moment(new Date(this.surgeryDate)).subtract(1,"day").format("YYYY/MM/DD");
            this.updateSurgeryInfo();
        },
        //找尋後一天
        nextDaySurgery: function(){
            this.surgeryDate = moment(new Date(this.surgeryDate)).add(1,"day").format("YYYY/MM/DD");
            this.updateSurgeryInfo();
        },
        doSearch : function(){
            var checkedRoom = [];
            var searchRange = $("#ope_range").val();
            var filterRoomDate =  this.AllSurgeryList;
            $("input[name='surgeryRoomCheckBox']:checked").each(function() {
                checkedRoom.push($(this).val());
            });
            //過濾刀房
            if(checkedRoom.length > 0){
                filterRoomDate = _.filter(filterRoomDate , function (room) {
                    return _.contains(checkedRoom, room.surgery_room)
                })
            }
            //過濾時間
            if(!_.isEmpty(searchRange)){
                var startDate = searchRange.split("~")[0]; //開始時間
                var endDate   = searchRange.split("~")[1]; //結束時間

                filterRoomDate = _.filter(filterRoomDate , function (room) {
                    return new Date(room.surgery_date) >= new Date(startDate)
                });

                if(!_.isUndefined(endDate)){
                    filterRoomDate = _.filter(filterRoomDate , function (room) {
                        return new Date(room.surgery_date) <= new Date(endDate)
                    });
                }

            }

            this.surgeryList = filterRoomDate;
        }
    }
})


Vue.filter("ymDateFormat" , function(date){
    return moment(new Date(date)).format("MM/DD");
});


Vue.filter("checkStatus" , function(status){
    var statusClass = "";
    switch (status){
        case '化療':
            statusClass = "table_hard_4";
            break;
        case '觀察中':
            statusClass = "table_hard_5";
            break;
        case '送加護病房':
            statusClass = "table_hard_1";
            break;
        case '開刀前':
            statusClass = "table_hard_2";
            break;
        case '開刀後':
            statusClass = "table_hard_3";
            break;
    }
    return statusClass;
});