$(function () {
    if (!Token.isAny()) {
        Redirect.toLoginPage();
    } else {
        LoadingMask.show();
        var title = "";
        $('#Customertable').DataTable({
            "ajax": {
                "url": API + "Customer?GetAll=true",
                "data": { Token: Token.get() }
            },
            "columns": [
                { "data": "Name", "width": "20%" },
                {
                    mRender: function (data, type, row) {
                        var listdata = '';
                        for (var i = 0; i < row.ListFamily.length; i++) {
                            listdata = '<li>' + row.ListFamily[i].FamilyName + '</li>' + listdata;
                        }
                        return '<ol>' + listdata + '</ol>';
                    }, "width": "30%"
                },
                { "data": "Address", "width": "30%" },
                { "data": "Telp", "width": "10%" },
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
                ListFamily: listFamz,
                Token: Token.get()
            }

            $.ajax({
                url: API + "Customer?Save=true",
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
                    url: API + "Customer?GetCust=true",
                    type: "POST",
                    data: {
                        ID: custID,
                        Token: Token.get()
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
                url: API + "Customer?Delete=true",
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
