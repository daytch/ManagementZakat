$(function () {
    if (!Token.isAny()) {
        Redirect.toLoginPage();
    } else {
        LoadingMask.show();
        var title = "";
        $('#Usertable').DataTable({
            "ajax": {
                "url": API + "User?load=true",
                "data": { Token: Token.get() }
            },
            "columns": [
                { "data": "Email", "width": "80%" },
                {
                    mRender: function (data, type, row) {
                        var elem = '';
                        if (row.Email != 'admin') {
                            elem = '<a data-id="' + row.ID + '" data-toggle="modal" data-target="#myModal">Edit</a> |' +
                                '<a data-id="' + row.ID + '" onclick="deleteData(this)" > Delete</a > ';
                        }
                        return elem;
                    }, "width": "10%"
                }
            ]
        });

        $('#save').on('click', function (e) {
            LoadingMask.show();
            var custData = {
                email: $('#UserEmail').val(),
                password: $('#Password').val(),
                Token: Token.get()
            }

            $.ajax({
                url: API + "User?save=true",
                type: "POST",
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
                            $('#Usertable').DataTable().ajax.reload();
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
                    url: API + "User?GetCust=true",
                    type: "POST",
                    data: {
                        ID: custID,
                        Token: Token.get()
                    },
                    success: function (response) {
                        if (response.IsSuccess) {

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
                url: API + "Customer?Delete=true",
                type: "POST",
                data: {
                    ID: custID
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
