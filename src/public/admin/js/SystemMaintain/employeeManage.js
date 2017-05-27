/**
 * Created by Jun on 2016/11/27.
 */
var globalAdminRoleList = [];
var globalUserRoleList = [];
var inst_employee_modal = $('[data-remodal-id=employee_modal]').remodal();
$(function () {
    var employee = new employeeClass();
    employee.init();
    //到職日期時間選擇器
    $('#expired_date').datepicker({
        format: "yyyy/mm/dd",
    });

    //打開編輯視窗
    $(document).on("click", ".editEmployee", function () {
        $("#employee_no").attr("disabled", true);
        $("#account").attr("disabled", true);
        $("#model_kind").text("編輯人員基本資料");
        $("#saveEmployeeBtn").data("kind", "update");
        $("#passwdColumDiv").hide();
        var employee_no = $(this).parents("tr").data("employee_no");
        $.ajax({
            url: '/systemMaintain/employeeQuery',
            method: 'POST',
            data: {employee_no: employee_no}
        }).done(function (data) {
            var employeeInfo = data.employeeInfo;
            $("#employee_no").val(employeeInfo.no);
            $("#employee_name").val(employeeInfo.name);
            $("#expired_date").val(moment(employeeInfo.expired_date).format("YYYY/MM/DD"));
            $("#account").val(employeeInfo.account);
            $("input:radio[name='gender']").filter("[value='" + employeeInfo.sex + "']").prop('checked', true);
            $("#user_role").val(employeeInfo.user_role_id);
            $("#admin_role").val(employeeInfo.admin_role_id);
            $("input:radio[name='is_enable']").filter("[value='" + employeeInfo.is_enable + "']").prop('checked', true);
            inst_employee_modal.open();
        }).fail(function () {
            alert("system error!");
        })
    })

    //打開新增視窗
    $(document).on("click", "#employeeModal", function () {
        $("#employeeForm")[0].reset(); //清空
        $("#employee_no").attr("disabled", false);
        $("#account").attr("disabled", false);
        $("#model_kind").text("新增人員基本資料");
        $("#saveEmployeeBtn").data("kind", "create");
        $("#passwdColumDiv").show();
        inst_employee_modal.open();
    })

    //監聽儲存按鈕
    $("#saveEmployeeBtn").click(function () {

        var updateKind = $("#saveEmployeeBtn").data("kind");

        if (updateKind == 'create') {
            employee.doCreateEmployee();
        } else {
            employee.doUpdateEmployee();
        }
    })

    //監聽刪除按鈕
    $("#deleteEmployeeBtn").click(function () {
        employee.doDeleteEmployee();
    })
})

//員工類別
function employeeClass() {

    this.init = function () {
        this.fetchAdminRole();
        this.fetchUserRole();
        this.fetchAllEmployee();
    };
    //取管理者
    this.fetchAdminRole = function () {
        $.post("/systemMaintain/adminRoleQuery", function (data) {
            globalAdminRoleList = data.admin_role_list || [];
            var optionContent = "";
            _.each(globalAdminRoleList, function (role) {
                optionContent += "<option value='" + role.id + "'>" + role.admin_role_name + "</option>"
            });
            $("#admin_role").append(optionContent)
        })
    };
    //取使用者角色
    this.fetchUserRole = function () {
        $.post("/systemMaintain/userRoleQuery", function (data) {
            globalUserRoleList = data.user_role_list || [];
            var optionContent = "";
            _.each(globalUserRoleList, function (role) {
                optionContent += "<option value='" + role.id + "'>" + role.user_role_name + "</option>"
            });
            $("#user_role").append(optionContent)
        })
    };

    //取員工資料
    this.fetchAllEmployee = function () {
        site.showWaitingModal("資料抓取中...");
        $.ajax({
            url: '/systemMaintain/employeeQuery',
            method: 'POST'
        }).done(function (data) {
            createEmployeeListTemplate(data.employeeList);
            site.closeWaitingModal();
        }).fail(function () {
            alert("system error!");
        })
    };
    //新增員工資料
    this.doCreateEmployee = function () {

        var self = this;
        var employeeInfo = {
            no: $("#employee_no").val(),
            name: $("#employee_name").val(),
            sex: $("input[name='gender']:checked").val(),
            account: $("#account").val(),
            password: $("#password").val(),
            user_role_id: $("#user_role").val(),
            admin_role_id: $("#admin_role").val(),
            expired_date: $("#expired_date").val(),
            is_enable: $("input[name='is_enable']:checked").val()
        };

        $.post('/systemMaintain/employeeCreate', {employeeInfo: employeeInfo}, function (data) {
            if (!data.success) {
                alert(data.errorMsg);
                return;
            }
            $("#employeeForm")[0].reset(); //清空
            self.fetchAllEmployee();
            //alert("新增成功");
            inst_employee_modal.close();
        })
    };

    //更新員工資料
    this.doUpdateEmployee = function () {
        var self = this;
        var employeeInfo = getEmployeeInfo();
        $.post('/systemMaintain/employeeUpdate', {employeeInfo: employeeInfo}, function (data) {
            if (!data.success) {
                alert(data.errorMsg);
                return;
            }
            self.fetchAllEmployee();
            alert("更新成功！");
            inst_employee_modal.close();
        })

    };
    //刪除員工資料
    this.doDeleteEmployee = function () {
        var self = this;
        var employee_no_list = [];
        $("input[name='employee_checkbox']:checked").each(function () {
            employee_no_list.push($(this).val());
        })
        if (employee_no_list.length > 0) {
            confirm("確定要刪除此人員資料?", function (result) {
                if (result) {
                    employee_no_list = employee_no_list.join(",");
                    $.post('/systemMaintain/employeeDelete', {employee_no_list: employee_no_list}, function (data) {
                        if (data.success) {
                            self.fetchAllEmployee();
                        } else {
                            alert("系統刪除失敗");
                        }
                    })
                }
            });
        } else {
            alert("請勾選要刪除的員工");
        }
    };
}

//顯示結果
function createEmployeeListTemplate(employeeList) {
    $("#employeeNumberSpan").text(employeeList.length || 0);
    var employee_tmpl = Handlebars.compile($("#employee_list_tr_template").html());
    $("#employeeTable tbody").html(employee_tmpl({employeeList: employeeList}));
}

//抓取更新員工的資料
function getEmployeeInfo() {
    var employeeInfo = {
        sex: $("input[name='gender']:checked").val(),
        employee_no: $("#employee_no").val(),
        name: $("#employee_name").val(),
        user_role_id: $("#user_role").val(),
        admin_role_id: $("#admin_role").val(),
        is_enable: $("input[name='is_enable']:checked").val(),
        expired_date: $("#expired_date").val()
    }

    return employeeInfo;

}


