$(function () {
    var title = "";
    $('#ReportTable').DataTable({
        "ajax": API + "Report?load=true",
        "columns": [
            { "data": "TransactionDate", "width": "10%" },
            { "data": "NotaCode", "width": "15%" },
            { "data": "CustomerName", "width": "25%" },
            {
                mRender: function (data, type, row) {

                    var date = moment.utc(row.TransactionDate, 'YYYY-MM-DD HH:mm Z');
                    var local = date.locale('id').format('LL');
                    return local;
                }, "width": "20%"
            },
            {
                mRender: function (data, type, row) {
                    var listdata = '';
                    if (row.ListDetail.length > 1) {
                        for (var i = 0; i < row.ListDetail.length; i++) {
                            listdata = '<li>' + row.ListDetail[i].Name + ' = ' + convertToRupiah(row.ListDetail[i].Price) + '</li>' + listdata;
                        }
                        return '<ol>' + listdata + '</ol>';
                    } else {
                        for (var i = 0; i < row.ListDetail.length; i++) {
                            listdata = row.ListDetail[i].Name + ' = ' + convertToRupiah(row.ListDetail[i].Price);
                        }
                        return listdata
                    }
                }, "width": "30%"
            },
            {
                mRender: function (data, type, row) {
                    return convertToRupiah(row.Total)
                }, "width": "10%"
            },
            {
                mRender: function (data, type, row) {
                    
                    return '<a class="btn btn-info" href="' + UI + 'Transaksi?NotaID=' + row.NotaID + '">Info</a>'
                }, "width": "10%"
            },
        ],
        "columnDefs": [
            {
                "targets": [0],
                "visible": false
            }]
        /*,
        "footerCallback": function (row, data, start, end, display) {
            var api = this.api(), data;
            
            // Remove the formatting to get integer data for summation
            var intVal = function (i) {
                return typeof i === 'string' ?
                    i.replace(/[^0-9]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };
            // Total over all pages
            total = api
                .column(5)
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);

            // Total over this page
            pageTotal = api
                .column(5, { page: 'current' })
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);

            // Update footer
            $(api.column(5).footer()).html(
                '$' + pageTotal + ' ( $' + total + ' total)'
            );
        }*/
    });

    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            var min = $('#min').datepicker("getDate");
            var max = $('#max').datepicker("getDate");
            var startDate = new Date(data[0]);
            if (min == null && max == null) { return true; }
            if (min == null && startDate <= max) { return true; }
            if (max == null && startDate >= min) { return true; }
            if (startDate <= max && startDate >= min) { return true; }
            return false;
        }
    );


    $("#min").datepicker({ onSelect: function () { table.draw(); }, changeMonth: true, changeYear: true });
    $("#max").datepicker({ onSelect: function () { table.draw(); }, changeMonth: true, changeYear: true });
    var table = $('#ReportTable').DataTable();

    // Event listener to the two range filtering inputs to redraw on input
    $('#min, #max').change(function () {
        table.draw();
    });

    $('#save').on('click', function (e) {

        var listFamz = [];
        var lastNumber = $('#listFamily input').length;
        for (var i = 1; i <= lastNumber; i++) {
            var input = $('#Family' + i + '');
            var list = { ID: input.attr('data-id'), FamilyName: input.val() };
            listFamz.push(list);
        }
        var custData = {
            Action: title,
            ID: $("#CustomerID").val(),
            Name: $("#CustomerName").val(),
            Telp: $("#Phone").val(),
            Address: $("#Address").val(),
            ListFamily: listFamz
        }

        $.ajax({
            url: API + "Customer?Save=true",
            type: "POST",
            data: custData,
            success: function (response) {
                if (response.IsSuccess) {
                    swal({
                        title: 'Success',
                        text: response.Message,
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        $('#Customertable').DataTable().ajax.reload();
                        $("#myModal").modal('hide');
                        resetModal();
                    })
                } else {
                    swal(
                        'Failed',
                        response.Message,
                        'error'
                    );
                }
            }
        });
    });

    $('#myModal').on('show.bs.modal', function (e) {

        var mainTitle = $('#titleBig').html();
        title = e.relatedTarget.innerText;
        $("#modalTitle").html(title + " " + mainTitle);

        if (title.toLowerCase() == 'edit') {
            var custID = e.relatedTarget.getAttribute('data-id');

            $.ajax({
                url: API + "Customer?GetCust=true",
                type: "POST",
                data: {
                    ID: custID
                },
                success: function (response) {
                    if (response.IsSuccess) {
                        $("#CustomerID").val(response.ID);
                        $("#CustomerName").val(response.Name);
                        $("#Phone").val(response.Telp);
                        $("#Address").val(response.Address);

                        //jika ada list family
                        if (response.ListFamily.length > 0) {
                            $("#1").remove();
                        }

                        var tagInput = '';
                        for (var i = 0; i < response.ListFamily.length; i++) {
                            tagInput = tagInput + '<div class="row" id="' + (i + 1) + '"><div class="col-md-8" >' +
                                '<input type="text" class="form-control" value="' + response.ListFamily[i].FamilyName + '" placeholder="Family" data-id="' + response.ListFamily[i].ID + '" id="Family' + (i + 1) + '"></div>' +
                                '<div class="col-md-4"><button onclick="add();"> <i class="glyphicon-plus"></i></button>&nbsp;<button onclick="remove(' + (i + 1) + ');"> <i class="glyphicon-minus"></i></button></div></div>';
                        }
                        $('#listFamily').append(tagInput);
                    } else {
                        swal(
                            'Failed',
                            response.Message,
                            'error'
                        );
                    }
                }
            });
        }
    });

});

function deleteData(e) {
    var custID = e.getAttribute('data-id');
    swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: API + "Customer?Delete=true",
                type: "POST",
                data: {
                    ID: custID
                },
                success: function (response) {
                    if (response.IsSuccess) {
                        $('#Customertable').DataTable().ajax.reload();
                        swal(
                            'Deleted!',
                            response.Message,
                            'success'
                        )
                    } else {
                        swal(
                            'Failed',
                            response.Message,
                            'error'
                        );
                    }
                }
            });
        }
    })
}
