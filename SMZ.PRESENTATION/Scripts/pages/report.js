$(function () {
    var title = "";
    $('#ReportTable').DataTable({
        "ajax": {
            "url": API + "Report?load=true",
            "data": { Token: Token.get() }
        },
        "columns": [
            { "data": "TransactionDate", "width": "10%" },
            { "data": "NotaCode", "width": "15%" },
            { "data": "CustomerName", "width": "20%" },
            {
                mRender: function (data, type, row) {

                    var date = moment.utc(row.TransactionDate, 'YYYY-MM-DD HH:mm Z');
                    var local = date.locale('id').format('LL');
                    return local;
                }, "width": "15%"
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

                    return '<a class="btn btn-info" href="' + UI + 'Transaksi?NotaID=' + row.NotaID + '" placeholfer="Info"><i class="fas fa fa-info-circle"></i></a>' +
                        '<a class="btn btn-danger" data-id="' + row.NotaID + '" placeholfer="Cancel" data-toggle="modal" data-target="#cancelModal"><i class="fas fa fa-trash-o"></i></a>';
                }, "width": "15%"
            },
        ],
        "columnDefs": [
            {
                "targets": [0],
                "visible": false
            }],
        "order": [[0, "desc"]],
        "responsive": true
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

    $('#btnSubmitCancel').on('click', function (e) {
        var ID = $('#ID').val();
        var Note = $('#Note').val();
        
        if (CheckObj.isEmptyNullOrUndefined(ID) || CheckObj.isEmptyNullOrUndefined(Note)) {
            swal('Info',"Alasan pembatalan wajib diisi.","warning");
        } else {
            var custData = {
                Token: Token.get(),
                ID: ID,
                Note: Note
            }

            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                debugger;
                if (result.value) {
                    $.ajax({
                        url: API + "Transaksi?SubmitCancellation=true",
                        type: "POST",
                        data: custData,
                        success: function (response) {
                            if (response.IsSuccess) {
                                swal({
                                    title: 'Deleted!',
                                    text: response.Message,
                                    type: 'success'
                                }).then(() => {
                                    $('#ReportTable').DataTable().ajax.reload();
                                    $("#cancelModal").modal('hide');
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
                }
            });
        }
    });

    $('#cancelModal').on('show.bs.modal', function (e) {
        var ID = e.relatedTarget.getAttribute('data-id');
        $("#ID").val(ID);
    });
});

// Reset all input in modal and remove family input list
$('[data-dismiss=modal]').on('click', function (e) {
    resetModal();
})

function resetModal() {
    var $t = $('[data-dismiss=modal]'),
        target = $t[0].href || $t.data("target") || $t.parents('.modal') || [];
    $(target)
        .find("input,textarea,select")
        .val('')
        .end()
        .find("input[type=checkbox], input[type=radio]")
        .prop("checked", "")
        .end();
}

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
