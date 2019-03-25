$(function () {
    if (!Token.isAny()) {
        Redirect.toLoginPage();
    } else {
        LoadingMask.show();
        var title = "";
        $('#Customertable').DataTable({
            "ajax": {
                "url": API + "Zakat?GetMasterZakat=true",
                "data": { Token: Token.get() }
            },
            "columns": [
                { "data": "Name", "width": "20%" },
                {
                    mRender: function (data, type, row) {
                        return '<a data-id="' + row.ID + '" data-toggle="modal" data-target="#myModal">Edit</a> |' +
                            '<a data-id="' + row.ID + '" onclick="deleteData(this)" > Delete</a > '
                    }, "width": "10%"
                }
            ]
        });

        $('#save').on('click', function (e) {
            LoadingMask.show();

            var custData = {
                Action: title,
                ID: $("#ID").val(),
                Name: $("#Name").val(),
                Token: Token.get()
            }

            $.ajax({
                url: API + "Zakat?Save=true",
                type: "POST",
                dataType: "JSON",
                data: custData,
                success: function (response) {
                    LoadingMask.hide();
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
                    url: API + "Zakat?GetZakat=true",
                    type: "POST",
                    data: {
                        ID: custID,
                        Token: Token.get()
                    },
                    success: function (response) {
                        if (response.IsSuccess) {
                            $("#ID").val(response.ID);
                            $("#Name").val(response.Name);

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
        LoadingMask.hide();
    }
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
    $('#listFamily').find("input,div").remove();
    var newList = '<div class="row" id="1"><div class="col-md-8">' +
        '<input type="text" class="form-control" placeholder="Family" id="Family1"></div>' +
        '<div class="col-md-4"><button onclick="add();"> <i class="glyphicon-plus"></i></button></div></div>';
    $('#listFamily').append(newList);
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
        LoadingMask.show();
        if (result.value) {
            $.ajax({
                url: API + "Zakat?Delete=true",
                type: "POST",
                data: {
                    ID: custID,
                    Token: Token.get()
                },
                success: function (response) {
                    LoadingMask.hide();
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

function add() {
    var lastNumber = $('#listFamily input').length;
    var tagInput = '<div class="row" id="' + (lastNumber + 1) + '"><div class="col-md-8" >' +
        '<input type="text" class="form-control" placeholder="Family" data-id="" id="Family' + (lastNumber + 1) + '"></div>' +
        '<div class="col-md-4"><button onclick="add();"> <i class="glyphicon-plus"></i></button>&nbsp;<button onclick="remove(' + (lastNumber + 1) + ');"> <i class="glyphicon-minus"></i></button></div>';
    $('#listFamily').append(tagInput);
}

function remove(e) {
    $('#Family' + e + '').val('');
    $('#' + e + '').hide();
}
