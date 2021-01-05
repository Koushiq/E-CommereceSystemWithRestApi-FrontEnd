let date = new Date().toISOString().
    replace(/T/, ' ').
    replace(/\..+/, '');

$(document).ready(function () {

    $("#registerSubmitBtn").click(function () {
        var formData = getFormData($("#registrationForm"));
        formData.CreatedAt = date;
        $.ajax({
            url: "http://localhost:3001/api/admins",
            method: "POST",
            data: formData,
            success: function (data) {
                $("#RegisterNewAdminBtn").click();
                alert("Welcome, " + formData.Username + "\nRegistration successful...!");
                $("#AdminRegistrationDiv").css("display", "none");
            },
            failure: function () {
                alert('failed to view wallet entries');
            }
        });
    });
    $("#RegisterNewAdminBtn").click(function () {
        toggoleRegisterAdminView();
    });
    $("#showAllAdminsBtn").click(function () {
        if ($("#ShowAllAdminsDiv").css("display") == "none") {
            showAllAdmins();
            $("#ShowAllAdminsDiv").css("display", "block");
            $("#showAllAdminsBtn").html("Close");
            $("#showAllAdminsBtn").addClass("btn-danger");
            $("#showAllAdminsBtn").removeClass("btn-success");
        }
        else {
            $("#showAllAdminsBtn").html("Show All Admins");
            $("#showAllAdminsBtn").addClass("btn-primary");
            $("#showAllAdminsBtn").removeClass("btn-danger");
            $("#ShowAllAdminsDiv").css("display", "none");
        }
    });
});

function toggoleRegisterAdminView() {
    if ($("#AdminRegistrationDiv").css("display") == "none") {
        $("#AdminRegistrationDiv").css("display", "block");
        $("#RegisterNewAdminBtn").html("Cancel");
        $("#RegisterNewAdminBtn").addClass("btn-danger");
        $("#RegisterNewAdminBtn").removeClass("btn-success");
    }
    else {
        $("#AdminRegistrationDiv").css("display", "none");
        $("#RegisterNewAdminBtn").html("Register New Admin");
        $("#RegisterNewAdminBtn").addClass("btn-success");
        $("#RegisterNewAdminBtn").removeClass("btn-danger");
    }
}

function getFormData($form) {
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function (n, i) {
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

function showAllAdmins() {
    $.ajax({
        url: "http://localhost:3001/api/admins",
        method: "GET",
        success: function (data) {
            $("#ShowAllAdminsTable").html("<th>S/N</th><th>Username</th><th>First Name</th><th>Last Name</th><th>Role</th><th>Join Date</th><th>Actions</th>");

            for (let i = 0; i < data.length; i++) {
                var serial = `<td>` + (i + 1) + `</td>`;
                var username = `<td><input type="text"style="background-color:#F5F5DC;"readonly="true"value="` + data[i].Username + `"id="username_` + data[i].AdminId + `"</input></td>`;
                var firstName = `<td><input type="text"style="background-color:#F5F5DC;"readonly="true"value="` + data[i].FirstName + `"id="firstName_` + data[i].AdminId + `"</input></td>`;
                var lastName = `<td><input type="text"style="background-color:#F5F5DC;"readonly="true"value="` + data[i].LastName + `"id="lastName_` + data[i].AdminId + `"</input></td>`;;
                var role = `<td><input type="text"style="background-color:#F5F5DC;"readonly="true"value="` + (data[i].Role == null ? "" : data[i].Role) + `"id="role_` + data[i].AdminId + `"</input></td>`;;
                var createdAt = `<td>` + (new Date(data[i].CreatedAt)).toDateString() + `</td>`;
                var editBtn = `<td><div id="actionBtnDiv"><button id="edit_` + data[i].AdminId + `" class="btn-secondary">Edit</button> `;
                var deleteBtn = `<button id="delete_` + data[i].AdminId + `" class="btn-danger">Delete</button></div></td>`;
                $("#ShowAllAdminsTable").append(`<tr>` + serial + username + firstName + lastName + role + createdAt + editBtn + deleteBtn + `<tr>`);

                $("#edit_" + data[i].AdminId).click(function () {
                    if ($("#edit_" + data[i].AdminId).html() == "Edit") {
                        enableEditing(data[i].AdminId);
                    }
                    else {
                        var editData = data[i];
                        editData.FirstName = $("#firstName_" + data[i].AdminId).val();
                        editData.LastName = $("#lastName_" + data[i].AdminId).val();
                        editData.Username = $("#username_" + data[i].AdminId).val();
                        editData.Role = $("#role_" + data[i].AdminId).val();
                        editAdminAjax(editData);
                    }
                });

                $("#delete_" + data[i].AdminId).click(function () {
                    if ($("#delete_" + data[i].AdminId).html() == "Delete") {
                        if (confirm("Delete admin " + data[i].Username + "?")) {
                            deleteAdminAjax(data[i].AdminId);
                        }
                    }
                    else {
                        $("#username_" + data[i].AdminId).val(data[i].Username);
                        $("#firstName_" + data[i].AdminId).val(data[i].FirstName);
                        $("#lastName_" + data[i].AdminId).val(data[i].LastName);
                        $("#role_" + data[i].AdminId).val(data[i].Role);

                        backFromEditing(data[i].AdminId);
                    }
                });
            }
        },
        failure: function () {
            alert('failed to view wallet entries');
        }
    });
}

function enableEditing(adminId) {
    $("#username_" + adminId).attr('readonly', false);
    $("#firstName_" + adminId).attr('readonly', false);
    $("#lastName_" + adminId).attr('readonly', false);
    $("#role_" + adminId).attr('readonly', false);

    $("#username_" + adminId).css('background-color', "#FFFFFF");
    $("#firstName_" + adminId).css('background-color', "#FFFFFF");
    $("#lastName_" + adminId).css('background-color', "#FFFFFF");
    $("#role_" + adminId).css('background-color', "#FFFFFF");

    $("#edit_" + adminId).html("Save");
    $("#delete_" + adminId).html("Cancel");

    $("#edit_" + adminId).addClass("btn-success");
    $("#edit_" + adminId).removeClass("btn-primary");

    $("#delete_" + adminId).addClass("btn-secondary");
    $("#delete_" + adminId).removeClass("btn-danger");
}

function backFromEditing(adminId) {
    $("#username_" + adminId).attr('readonly', true);
    $("#firstName_" + adminId).attr('readonly', true);
    $("#lastName_" + adminId).attr('readonly', true);
    $("#role_" + adminId).attr('readonly', true);

    $("#username_" + adminId).css('background-color', "#F5F5DC");
    $("#firstName_" + adminId).css('background-color', "#F5F5DC");
    $("#lastName_" + adminId).css('background-color', "#F5F5DC");
    $("#role_" + adminId).css('background-color', "#F5F5DC");

    $("#edit_" + adminId).html("Edit");
    $("#delete_" + adminId).html("Delete");

    $("#edit_" + adminId).addClass("btn-primary");
    $("#edit_" + adminId).removeClass("btn-success");

    $("#delete_" + adminId).addClass("btn-danger");
    $("#delete_" + adminId).removeClass("btn-secondary");
}

function deleteAdminAjax(adminId) {
    $.ajax({
        url: "http://localhost:3001/api/admins/" + adminId,
        method: "DELETE",
        success: function () {
            $("#actionBtnDiv").html("Deleted");
            $("#actionBtnDiv").addClass("text-danger");
        },
        failure: function () {
            alert('failed to delete admin');
        }
    });
}

function editAdminAjax(editdata) {
    $.ajax({
        url: "http://localhost:3001/api/admins/" + editdata.AdminId,
        method: "PUT",
        data: editdata,
        success: function () {
            backFromEditing(editdata.AdminId);
        },
        failure: function () {
            alert('failed to edit admin');
        }
    });
}