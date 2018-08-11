; (function () {
    axios.defaults.baseURL = API
    function retryFailedRequest(err) {
        if (err.status === 500 && err.config && !err.config.__isRetryRequest) {
            err.config.__isRetryRequest = true;
            return axios(err.config);
        }
        throw err;
    }
    axios.interceptors.response.use(undefined, retryFailedRequest);
    if (!NOT_USING_AUTH_HEADER) {
        axios.defaults.headers.common['Authorization'] = "pToken " + $('meta[name=JWT_TOKEN]').attr("content");
        axios.defaults.withCredentials = true
    }
    axios.defaults.headers.common['Content-Type'] = "application/json"
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    //    axios.defaults.withCredentials = true
})()
var NOTIF_TIMEOUT = 2000;
var NOTIF_TOP_CENTER = "top-center";
var NOTIF_TOP_LEFT = "top-left";
var NOTIF_TOP_RIGHT = "top-right";
var NOTIF_BOTTOM_CENTER = "bottom-center";
var NOTIF_BOTTOM_LEFT = "bottom-left";
var NOTIF_BOTTOM_RIGHT = "bottom-right";
var NOTIF_DEFAULT = "primary";
var NOTIF_DANGER = "danger";
var NOTIF_WARNING = "warning";
var NOTIF_SUCCESS = "success";

function GetValueOrDefault(value, defaultValue) {
    return typeof value == "undefined" ? defaultValue : value;
}

function GeneralNotif(message, status, timeout, pos) {
    message = GetValueOrDefault(message, "");
    status = GetValueOrDefault(status, NOTIF_DEFAULT);
    timeout = GetValueOrDefault(timeout, NOTIF_TIMEOUT);
    pos = GetValueOrDefault(pos, NOTIF_TOP_CENTER);

    UIkit.notify({
        message: message,
        status: status,
        timeout: timeout,
        pos: pos
    });
}

function CustomNotif(message, options = { status: NOTIF_DEFAULT, timeout: NOTIF_TIMEOUT, pos: NOTIF_TOP_CENTER }) {
    GeneralNotif(message, options.status, options.timeout, options.pos);
}

function DangerNotif(message, options = { timeout: NOTIF_TIMEOUT, pos: NOTIF_TOP_CENTER }) {
    GeneralNotif(message, NOTIF_DANGER, options.timeout, options.pos);
}

function WarningNotif(message, options = { timeout: NOTIF_TIMEOUT, pos: NOTIF_TOP_CENTER }) {
    GeneralNotif(message, NOTIF_WARNING, options.timeout, options.pos);
}
function SuccessNotif(message, options = { timeout: NOTIF_TIMEOUT, pos: NOTIF_TOP_CENTER }) {
    GeneralNotif(message, NOTIF_SUCCESS, options.timeout, options.pos);
}

function DefaultNotif(message, options = { timeout: NOTIF_TIMEOUT, pos: NOTIF_TOP_CENTER }) {
    GeneralNotif(message, NOTIF_DEFAULT, options.timeout, options.pos);
}

function ajaxGet(e, p, cb) {
    axios.get(e, {
        params: p
    })
        .then(function (response) {
            response = parseJson(response);
            cb(response.data);
        })
        .catch(function (error) {
            console.log(error);
            DangerNotif(error);
        })
}

function ajaxPost(e, p, cb) {
    axios.post(e, p)
        .then(function (response) {
            response = parseJson(response);
            cb(response.data);
        })
        .catch(function (error) {
            console.log(error);
            DangerNotif(error);
        })
}

function ajaxGetJquery(e, p = {}, cb = function (res) { }) {
    p = typeof p != "undefined" ? p : {};
    cb = typeof cb != "undefined" ? cb : function (res) { };
    $.ajax({
        method: "GET",
        url: e,
        data: p
    })
        .done(cb)
        .fail(function (error) {
            console.log(error);
            DangerNotif(error);
        });
}

function ajaxPostJquery(e, p = {}, cb = function (res) { }) {
    p = typeof p != "undefined" ? p : {};
    cb = typeof cb != "undefined" ? cb : function (res) { };
    $.ajax({
        method: "POST",
        url: e,
        data: p
    })
        .done(cb)
        .fail(function (error) {
            console.log(error);
            DangerNotif(error);
        });
}

//api
function ajaxGetApi(e, p, cb) {
    ajaxGet(API + e, p, cb);
}

function ajaxPostApi(e, p, cb) {
    ajaxPost(API + e, p, cb);
}

function ajaxGetApiFinance(e, p, cb) {
    ajaxGet(API_FINANCE + e, p, cb);
}

function ajaxPostApiFinance(e, p, cb) {
    ajaxPost(API_FINANCE + e, p, cb);
}

function ajaxGetApiHris(e, p, cb) {
    ajaxGet(API_HRIS + e, p, cb);
}

function ajaxPostApiHris(e, p, cb) {
    ajaxPost(API_HRIS + e, p, cb);
}


function ajaxGetApiGeneral(e, p, cb) {
    ajaxGet(API_GENERAL + e, p, cb);
}

function ajaxPostApiGeneral(e, p, cb) {
    ajaxPost(API_GENERAL + e, p, cb);
}

function ajaxGetApiPM(e, p, cb) {
    ajaxGet(API_PM + e, p, cb);
}

function ajaxPostApiPM(e, p, cb) {
    ajaxPost(API_PM + e, p, cb);
}

//web
function ajaxGetWeb(e, p, cb) {
    ajaxGetJquery(WEB + e, p, cb);
}

function ajaxPostWeb(e, p, cb) {
    ajaxPostJquery(WEB + e, p, cb);
}

function ajaxGetWebFinance(e, p, cb) {
    ajaxGetJquery(WEB_FINANCE + e, p, cb);
}

function ajaxPostWebFinance(e, p, cb) {
    ajaxPostJquery(WEB_FINANCE + e, p, cb);
}

function ajaxGetWebHris(e, p, cb) {
    ajaxGetJquery(WEB_HRIS + e, p, cb);
}

function ajaxPostWebHris(e, p, cb) {
    ajaxPostJquery(WEB_HRIS + e, p, cb);
}


function ajaxGetWebGeneral(e, p, cb) {
    ajaxGetJquery(WEB_GENERAL + e, p, cb);
}

function ajaxPostWebGeneral(e, p, cb) {
    ajaxPostJquery(WEB_GENERAL + e, p, cb);
}

function ajaxGetWebPM(e, p, cb) {
    ajaxGetJquery(WEB_PM + e, p, cb);
}

function ajaxPostWebPM(e, p, cb) {
    ajaxPostJquery(WEB_PM + e, p, cb);
}


var MODAL_BLOCKUI;
var MODAL_FOR_ALL;
var MODAL_CUSTOM = {};
var MODAL_FOR_ALL_ID = "modal_for_all";

function showModalContent(title, content) {
    MODAL_CUSTOM[MODAL_FOR_ALL_ID] = MODAL_FOR_ALL = UIkit.modal("#" + MODAL_FOR_ALL_ID);
    $("#" + MODAL_FOR_ALL_ID + " .uk-modal-title").html(title);
    $("#" + MODAL_FOR_ALL_ID + " .uk-modal-content").html(content);
    MODAL_FOR_ALL.show();
}

function hideModalContent() {
    if (typeof MODAL_FOR_ALL != "undefined") {
        MODAL_FOR_ALL.hide();
    }
}

function showCustomModal(id, opts = {}) {
    if (typeof opts["style"] != "undefined") {
        $("#" + id).attr("style", opts["style"]);
    }
    MODAL_CUSTOM[id] = UIkit.modal("#" + id, opts);
    MODAL_CUSTOM[id].show();
}

function hideCustomModal(id) {
    if (typeof MODAL_CUSTOM[id] != "undefined") {
        MODAL_CUSTOM[id].hide();
    }
}

function hideAllModal() {
    $.each(MODAL_CUSTOM, function (key, value) {
        value.hide();
    });
}

function showModalBlockUI(content) {
    MODAL_BLOCKUI = UIkit.modal.blockUI(content);
}

function hideModalBlockUI() {
    if (typeof MODAL_BLOCKUI != "undefined") {
        MODAL_BLOCKUI.hide();
    }
}

function showModalAjaxGet(title, url, p, cb) {
    //axios.get(url, {
    //    params: p
    //})
    //    .then(function (response) {
    //        showModalContent(title, response);
    //        if (typeof cb != "undefined") {
    //            cb();
    //        }
    //    })
    //    .catch(function (error) {
    //        console.log(error);
    //        DangerNotif(error);
    //    })
    ajaxGetJquery(url, p, function (response) {

        showModalContent(title, response);
        if (typeof cb != "undefined") {
            setTimeout(cb, 400);
        }

    });
}

function showModalAjaxPost(title, url, p, cb) {
    //axios.post(url, p)
    //    .then(function (response) {
    //        showModalContent(title, response);
    //        if (typeof cb != "undefined") {
    //            cb();
    //        }
    //    })
    //    .catch(function (error) {
    //        console.log(error);
    //        DangerNotif(error);
    //    })
    ajaxPostJquery(url, p, function (response) {

        showModalContent(title, response);
        if (typeof cb != "undefined") {
            setTimeout(cb, 400);
        }
    });

}

function checkLogin() {
    /*$.get("${urlApp}/checkSession",function(resultSession){
     resultSession = parseJson(resultSession);
     if(!resultSession.isLogin){
     alert("Session login anda sudah habis ! silahkan login lagi");
     window.location.href="${urlApp}/login";
     }
     });*/
}
function checkActivity(timeout, interval, elapsed) {
    if ($.active) {
        elapsed = 0;
        $.active = false;
        $.get('checkEBOnlineSession');
    }
    if (elapsed < timeout) {
        elapsed += interval;
        setTimeout(function () {
            checkActivity(timeout, interval, elapsed);
        }, interval);
    } else {
        window.location.href = 'login'; // Redirect to login page
    }
}

function parseJson(data) {
    if (typeof data == "string")
        data = jQuery.parseJSON(data);

    return data;
}
function FormLoadByAjaxGet(formid, url, p, cb) {
    ajaxGet(url, p, function (data) {
        FormLoadByDataUsingName(formid, data, cb);
    });
}

function FormLoadByAjaxPost(formid, url, p, cb) {
    ajaxPost(url, p, function (data) {
        FormLoadByDataUsingName(formid, data, cb);
    });
}

function FormLoadByData(data, formid, attrKey, cb) {
    console.log(data);
    attrKey = typeof attrKey == "undefined" ? "name" : attrKey;
    $.each(data, function (key, value) {
        //console.log(key+' '+ value);
        if ($('#' + formid + ' [' + attrKey + '="' + key + '"]').attr('data-role') == "datepicker") {
            //window.console.log('1');
            $('#' + formid + ' [' + attrKey + '="' + key + '"]').val(value);
        }
        else if ($('#' + formid + ' [' + attrKey + '="' + key + '"]').attr('data-role') == "combobox") {
            //window.console.log('2');
            $('#' + formid + ' [' + attrKey + '="' + key + '"]').val(value);
        }
        else if ($('#' + formid + ' [' + attrKey + '="' + key + '"]').attr('data-role') == "numeric") {
            //window.console.log('3');
            $('#' + formid + ' [' + attrKey + '="' + key + '"]').val(value);
        }
        else if ($('#' + formid + ' [' + attrKey + '="' + key + '"]').attr('data-role') == "checkbox") {
            //window.console.log('3');
            if (value == "1" || value == 1 || value == "true" || value == true)
                $('#' + formid + ' [' + attrKey + '="' + key + '"]').prop('checked', true);
            else
                $('#' + formid + ' [' + attrKey + '="' + key + '"]').removeAttr('checked');
        }
        else {
            //window.console.log('4');
            $('#' + formid + ' [' + attrKey + '="' + key + '"]').val(value);
        }
    });
    if (typeof cb != "undefined") {
        cb();
    }
}
function FormLoadByDataUsingID(data, formid, cb = function () { }) {
    FormLoadByData(data, formid, "id", cb);
}
function FormLoadByDataUsingName(data, formid, cb = function () { }) {
    FormLoadByData(data, formid, "name", cb);
}

var TABLES = {};

function GenerateTableHeader(tableId, columns) {
    var headers = "<thead><tr>";
    $.each(columns, function (key, value) {
        headers += "<th field='" + value.data + "'>" + value.title + "</th>";
    });
    headers += "</tr></thead>";
    return headers;
    $("#" + tableId).html(headers);
}

function InitTable(tableId, ajaxUrl, ajaxParams, columns) {
    GenerateTableHeader(tableId, columns);
    TABLES[tableId] = $('#' + tableId).DataTable({
        "responsive": true,
        "drawCallback": function (settings) {
            setTimeout(function () {
                //  table.responsive.rebuild();
                //  table.responsive.recalc();
            }, 50);
        },
        "processing": true,
        "serverSide": true,
        "bFilter": false,
        "bSort": false,
        ajax: function (data, callback, settings) {
            var page = 0;
            if (data.start == 0) {
            } else {
                page = data.start / data.length;
            }
            var nama = $('#searchNama').val();
            // var idKotama = $('#combo_kotama').val();
            var idKotama = "";
            var allParams = {};
            allParams["rows"] = data.length;
            allParams["page"] = page + 1;
            $.each(ajaxParams(), function (key, value) {
                allParams[key] = value;
            });

            ajaxGet(ajaxUrl, allParams, function (res) {

                //dayat for testing purpose
                if (Array.isArray(res)) {
                    res = res[0];
                } else {
                    res = parseJson(res);
                }

                //res = parseJson(res);
                //res = res.data;
                LIST_DATA = new Object();
                $.each(res.Rows, function (keyResult, valueResult) {
                    //LIST_DATA[valueResult.id] = valueResult;
                });
                callback({
                    //recordsFiltered: res.RecordsTotal,
                    //recordsTotal: res.RecordsFiltered,
                    recordsTotal: res.RecordsTotal,
                    recordsFiltered: res.RecordsFiltered,
                    data: res.Rows
                });
            });
        },
        "columns": columns
    });
}

function ReloadGrid(tableId) {
    TABLES[tableId] = $('#' + tableId).DataTable();

    TABLES[tableId].ajax.reload(function (json) {

    });
}

function GetOptionsForm(showRequestForm, showResponseForm) {
    return {
        dataType: 'json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "pToken " + $('meta[name=JWT_TOKEN]').attr("content"));
        },
        beforeSubmit: showRequestForm,
        success: showResponseForm
    };
}

function InitForm(formId, optionsForm) {
    //console.log(formId);
    //console.log(optionsForm);
    //console.log($('#' + formId).html());
    //console.log($.fn.jquery);
    $('#' + formId).ajaxForm(optionsForm);
    $("#" + formId).parsley();
}

function setFormAction(formId, url) {
    $("#" + formId).attr("action", url);
}

function confirmDialog(text, cb) {
    UIkit.modal.confirm(text, cb);
}