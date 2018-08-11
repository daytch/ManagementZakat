var loadedScripts = new Array();
$(document)
    .ajaxStart(function () {
        iload(true);
    })
    .ajaxError(function () {
        iload(false);

    })
    .ajaxStop(function () {
        iload(false);
    });
function iload(x) {
    if (x) {
        $('#dloader').show();
    } else {
        $('#dloader').hide();
    }
}
function loadScript(scriptArray, isasync) {
    scrsync = false;
    if (isasync) {
        scrsync = true;
    }
    if ($.isArray(scriptArray)) {
        $.each(scriptArray, function (intIndex, objValue) {
            if ($.inArray(objValue, loadedScripts) < 0) {
                $.ajax({
                    async: scrsync,
                    cache: true,
                    type: 'GET',
                    url: objValue,
                    success: function () { loadedScripts.push(objValue); },
                    dataType: 'script'

                });
            }
        });
    }
    else {
        if ($.inArray(scriptArray, loadedScripts) < 0) {
            $.ajax({
                async: scrsync,
                cache: true,
                type: 'GET',
                url: scriptArray,
                success: function () { loadedScripts.push(scriptArray); },
                dataType: 'script'

            });
        }
    }
}

$(document).on('click','a.fakemenulink', function(e) {


    e.preventDefault();
    var xmen=$(this);
    var uli=$("#menu_section");
     if(uli){


     $(uli).find("li").each(function () {

     $(this).removeClass("act_item")
     });
     $(this).closest( "li" ).addClass("act_item");
     $(this).closest( "li" ).parents( "li" ).addClass("current_section");
     }

 
    var vlink = xmen.attr('href');

    var defdiv = xmen.attr('atarget');


    convault(defdiv,vlink);


});
$(document).on('click', 'a.fakelink', function (e) {
    iload(true);

    e.preventDefault();
    var xmen = $(this);  
    $("#iframe_title").html(xmen.title);
 
    var vlink = xmen.attr('href');

    var defdiv = xmen.attr('atarget');

    $("#iframe_content").attr('src', vlink);

    convault(defdiv,vlink);
    //-for toogle menu right
    $('.uk-dropdown-active.uk-dropdown-shown.uk-dropdown-bottom').each(function () {
        $(this).removeClass("uk-dropdown-active uk-dropdown-shown uk-dropdown-bottom");
        $(this).attr("aria-hidden","true")
    });

});
function convault(defdiv,vlink){
    if(!defdiv){
        defdiv="page_content";
    }
    
    history.pushState(null, null, vlink)


    $('#'+defdiv).load(vlink, function() {


    });

}
function generateTable(columns,dbsource,divs){
    var sortnum=1;

var $dt_table = $('#'+divs);
$dt_buttons = $('#dt_colVis_buttons');    
var xtable=$dt_table.DataTable({
    "searchDelay": 1000,
        "aaSorting": [[ sortnum, "asc" ]],
        "columnDefs": [{
            "searchable": false,
            "orderable": false,
            "targets": 0
        }],
        "bFilter":   true,

        "bLengthChange": true,
        "bStateSave": true,
        "bProcessing": true,
        "columns": columns ,
        "bServerSide":true,
        "sAjaxSource": dbsource,



        'fnServerData': function (sSource, aoData, fnCallback) {
            $.ajax
            ({
                'dataType': 'json',
                'type': 'POST',
                'url': sSource,
                'data': aoData,
                'success': fnCallback
            });
        }
    });
    //xtable.fnSetFilteringDelay(2000);
    
new $.fn.dataTable.Buttons(xtable, {
    buttons: [ {
                        extend: 'colvis',
                        fade: 0,
                        columns: ':gt(0)'
                    } ]
});
    xtable.on('order.dt search.dt', function () {
        xtable.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
        cell.innerHTML = i + 1;
    });
}).draw();
   xtable.buttons().container().appendTo($dt_buttons);
 $(".dataTables_filter input")
    .unbind() // Unbind previous default bindings
    .keyup( function (e) {
  
        input_filter_value=this.value;
if (typeof input_filter_timeout != 'undefined'){
    clearTimeout(input_filter_timeout);
}
        
        input_filter_timeout=setTimeout(function(){
            xtable.search( input_filter_value ).draw();
        }, xtable.context[0].searchDelay);

    });
	return xtable;
}
function notifySuccess(msg){
  thisNotify = UIkit.notify({
        message: msg,
        status: 'success',
        timeout: 2000,
        group: null,
        pos:  'top-right'
    });  
}
function notifyError(msg){
  thisNotify = UIkit.notify({
        message: msg,
        status: 'danger',
        timeout: 3000,
        group: null,
        pos:  'top-right'
    });     
}
function closemodal(div) {
    var modal = UIkit.modal(div);
    modal.hide();
}
function openmodal(div) {
    // keyboard: false <-- kalau butuh disable esc
    var modal = UIkit.modal(div, { bgclose: false });
    modal.show();
}
function addnew(div, form) {
    $(form)[0].reset();
    openmodal(div);
}
function setupform(modulename, dttable) {
    $('#form_' + modulename).submit(function (e) {
        e.preventDefault();
        $(this).removeData("validator").removeData("unobtrusiveValidation");
        $.validator.unobtrusive.parse($(this));
        if ($(this).valid()) {
            savedata(modulename, dttable);
        }


    });
}
function savedata(modulename,dttable) {
    var form = $('#form_'+modulename).get(0);
    var formData = new FormData(form);
    $.ajax({
        data: formData,
        contentType: false,
        cache: false,
        processData: false,
        dataType: 'json',
        type: "POST",
        url: form.action,

        success: function (response) {
            if (response.success) {
                notifySuccess("Data Updated")
                dttable.draw();
                closemodal('#modal_' + modulename);
                $('#form_' + modulename)[0].reset();
            } else {
                if (response.messages) {
                    if (isArray(response.messages)) {
                        $.each(response.messages, function (i, item) {
                            notifyError(item);
                        });
                    }
  
                } else {
                    notifyError("Failed Update")
                }
            }
        }
    });
}
function isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}