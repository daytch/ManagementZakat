
$(document).ready(function () {

    var columns = [
        {
            "data": "id",
            "title": "ID",
            "sClass": "ecol x20",
            orderable: false
        },
        {
            "data": "name",
            "title": "Name",
            "sClass": "lcol",
            orderable: false,
            "render": function (data, type, row) {
                return '<a href="javascript:void(0)" data-role="detail" data-id="' + row.id + '">' + data + '</a>';
            }
        },
        {
            "data": "date_create",
            "title": "Date Create",
            "sClass": "rcol",
            orderable: false
        },
        {
            "data": "datex",
            "title": "Date Created",
            "sClass": "rcol",
            orderable: false
        },

    ];
    var dttable = generateTable(columns, "baru/list", "table_contoh", true);
    //setupform("contoh", dttable)

    $("#table_contoh").on("click", "[data-role='detail']", function (e) {
        e.preventDefault()
        getDetailById($(this).data('id'), "baru", "#modal_contoh")
        openmodal("#modal_contoh");
    })



    $("#form_contoh").on("submit", function (e) {
        e.preventDefault()
        sendFormInput("baru", "#form_contoh")
        closemodal("#modal_contoh")
    })

    $("#form_contoh").on("click", "[data-role='delete']", function (e) {
        e.preventDefault()
        sendDelete("baru", $('input[name="id"]').val())
        closemodal("#modal_contoh")
    })


    t = $('#select_demo_1').selectize({
        valueField: 'id',
        labelField: 'name',
        searchField: ['id', 'name']
    });

    l = t[0].selectize;
    l.disable();
    l.addOption([
        {
            id: 1,
            name: 'ryan'
        },
        {
            id: 2,
            name: 'yan'
        }
    ]);
    l.enable();


})