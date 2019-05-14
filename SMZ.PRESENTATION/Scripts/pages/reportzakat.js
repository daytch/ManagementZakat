$(function () {
    var title = "";
    $('#ReportTable').DataTable({
        "ajax": {
            "type": "POST",
            "url": API + "Zakat?loadReport=true",
            "data": { Token: Token.get() }
        },
        "columns": [
            { "data": "NotaID", "width": "15%" },
            { "data": "NotaCode", "width": "15%" },
            { "data": "CustomerName", "width": "15%" },
            {
                mRender: function (data, type, row) {
                    var date = moment.utc(row.TransactionDate, 'YYYY-MM-DD HH:mm Z');
                    var local = date.locale('id').format('LL');
                    return local;
                }, "width": "10%"
            },
            {
                mRender: function (data, type, row) {
                    var listdata = '';

                    if (row.ListDetail.length > 1) {
                        for (var i = 0; i < row.ListDetail.length; i++) {
                            if (row.ListDetail[i].Name.indexOf('beras') == -1) {
                                listdata = '<li>' + row.ListDetail[i].Name + ' = ' + convertToRupiah(row.ListDetail[i].Nominal) + ' @ untuk ' + row.ListDetail[i].Jumlah + ' jiwa, Total: ' + convertToRupiah(row.ListDetail[i].Total) + '</li>' + listdata;
                            } else {
                                listdata = '<li>' + row.ListDetail[i].Name + ' = ' + convertToRupiah(row.ListDetail[i].Nominal) + ' @ untuk ' + row.ListDetail[i].Jumlah + ' jiwa, Total: ' + row.ListDetail[i].Total + 'Kg </li>' + listdata;
                            }
                        }
                        return '<ol style="font-size:11px">' + listdata + '</ol>';
                    } else {
                        for (var i = 0; i < row.ListDetail.length; i++) {
                            if (row.ListDetail[i].Name.indexOf('beras') == -1) {
                                listdata = row.ListDetail[i].Name + ' = ' + convertToRupiah(row.ListDetail[i].Nominal) + ' @ untuk ' + row.ListDetail[i].Jumlah + ' jiwa, Total: ' + convertToRupiah(row.ListDetail[i].Total);
                            } else {
                                listdata = row.ListDetail[i].Name + ' = ' + convertToRupiah(row.ListDetail[i].Nominal) + ' @ untuk ' + row.ListDetail[i].Jumlah + ' jiwa, Total: ' + row.ListDetail[i].Total + ' Kg';
                            }
                        }
                        return '<span style="font-size:11px">' + listdata + '</span>';
                    }
                }, "width": "45%"
            },
            {
                mRender: function (data, type, row) {
                    return convertToRupiah(row.Total)
                }, "width": "10%"
            },
            {
                mRender: function (data, type, row) {
                    return '<a class="btn btn-info" href="' + UI + 'Zakat?NotaZakatID=' + row.NotaID + '">Info</a>'
                }, "width": "10%"
            },
        ],
        "columnDefs": [{
            "visible": false, "targets": [0]
        }],
        "order": [[0, "desc"]],
        "responsive": true
    });

    $.fn.dataTable.ext.errMode = function (settings, helpPage, message) {
        console.log(message);
    };

    //$.fn.dataTable.ext.search.push(
    //    function (settings, data, dataIndex) {
    //        var min = $('#min').datepicker("getDate");
    //        var max = $('#max').datepicker("getDate");
    //        var startDate = new Date(data[0]);
    //        if (min == null && max == null) { return true; }
    //        if (min == null && startDate <= max) { return true; }
    //        if (max == null && startDate >= min) { return true; }
    //        if (startDate <= max && startDate >= min) { return true; }
    //        return false;
    //    }
    //);


    //$("#min").datepicker({ onSelect: function () { table.draw(); }, changeMonth: true, changeYear: true });
    //$("#max").datepicker({ onSelect: function () { table.draw(); }, changeMonth: true, changeYear: true });
    //var table = $('#ReportTable').DataTable();

    //// Event listener to the two range filtering inputs to redraw on input
    //$('#min, #max').change(function () {
    //    table.draw();
    //});

});


function Download() {
    post_to_url(API + "Zakat?downloadExcel=true", {
        'Token': Token.get()
    });
}