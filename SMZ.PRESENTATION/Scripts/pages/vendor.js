$(function () {
    if (!Token.isAny()) {
        Redirect.toLoginPage();
    } else {
        LoadingMask.show();
        var title = "";
        $('#VendorTable').DataTable({
            "ajax": {
                "url": API + "Vendor?GetAll=true",
                "data": { Token: Token.get() }
            },
            "columns": [
                { "data": "Name", "width": "20%" },
                {
                    mRender: function (data, type, row) {

                        var listdata = '';
                        for (var i = 0; i < row.ListProduct.length; i++) {
                            if (row.ListProduct[i].Name == 'Infaq') {
                                listdata = '<li>' + row.ListProduct[i].Name + '</li>' + listdata;
                            } else {
                                listdata = '<li>' + row.ListProduct[i].Name + ' = ' + convertToRupiah(row.ListProduct[i].Price) + '</li>' + listdata;
                            }
                        }
                        return '<ol>' + listdata + '</ol>';
                    }, "width": "30%"
                },
                { "data": "Address", "width": "30%" },
                { "data": "Telp", "width": "10%" },
                {
                    mRender: function (data, type, row) {
                        var response = '';
                        if (row.Name.toLowerCase() != 'panitia') {
                            response = '<a data-id="' + row.ID + '" data-toggle="modal" data-target="#myModal">Edit</a> |' +
                                '<a data-id="' + row.ID + '" onclick="deleteData(this)" > Delete</a > '
                        } else {
                            response = '<a data-id="' + row.ID + '" data-toggle="modal" data-target="#myModal">Edit</a>';
                        }
                        return response;
                    }, "width": "10%"
                }
            ],
            "processing": true,
        });

        $('#save').on('click', function (e) {
            LoadingMask.show();
            var listFamz = [];
            var lastNumber = $('#ListProduct input').length / 2;
            for (var i = 1; i <= lastNumber; i++) {
                var input = $('#Product' + i + '');
                var harga = $('#Price' + i + '');
                var list = { ID: input.attr('data-id'), Name: input.val(), Price: harga.val() };
                if (list.Name != '') {
                    listFamz.push(list);
                }
            }
            var custData = {
                Action: title,
                ID: $("#VendorID").val(),
                Name: $("#VendorName").val(),
                Telp: $("#Phone").val(),
                Address: $("#Address").val(),
                ListProduct: listFamz,
                Token: Token.get()
            }

            $.ajax({
                url: API + "Vendor?Save=true",
                type: "POST",
                data: custData,
                success: function (response) {
                    if (response.IsSuccess) {
                        LoadingMask.hide();
                        swal({
                            title: 'Success',
                            text: response.Message,
                            type: 'success',
                            showCancelButton: false,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            $('#VendorTable').DataTable().ajax.reload();
                            $("#myModal").modal('hide');
                            resetModal();
                        })
                    } else {
                        LoadingMask.hide();
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

            LoadingMask.show();
            if (title.toLowerCase() == 'edit') {
                var custID = e.relatedTarget.getAttribute('data-id');

                $.ajax({
                    url: API + "Vendor?GetCust=true",
                    type: "POST",
                    data: {
                        ID: custID,
                        Token: Token.get()
                    },
                    success: function (response) {
                        if (response.IsSuccess) {
                            $("#VendorID").val(response.ID);
                            $("#VendorName").val(response.Name);
                            $("#Phone").val(response.Telp);
                            $("#Address").val(response.Address);

                            //jika ada list Product
                            if (response.ListProduct.length > 0) {
                                $("#1").remove();
                            }

                            var tagInput = '';
                            for (var i = 0; i < response.ListProduct.length; i++) {
                                tagInput = tagInput + '<div class="row" id="' + (i + 1) + '">' +
                                    '<input type="text" class="col-xs-5" value="' + response.ListProduct[i].Name + '" placeholder="Product" data-id="' + response.ListProduct[i].ID + '" id="Product' + (i + 1) + '">' +
                                    '<input type="text" class="col-xs-2" value="' + response.ListProduct[i].Price + '" placeholder="Harga" id="Price' + (i + 1) + '">' +
                                    '<button onclick="add();"> <i class="glyphicon-plus"></i></button><button onclick="remove(' + (i + 1) + ');"> <i class="glyphicon-minus"></i></button></div></div>';
                            }
                            $('#ListProduct').append(tagInput);
                            LoadingMask.hide();
                        } else {
                            LoadingMask.hide();
                            swal(
                                'Failed',
                                response.Message,
                                'error'
                            );
                        }
                    }
                });
            }
            else {

                LoadingMask.hide();
            }
        });
        LoadingMask.hide();
    }
});

// Reset all input in modal and remove Product input list
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
    $('#ListProduct').find("input,div").remove();
    var newList = '<div class="row form-inline" id="1" >' +
        '<input type="text" class="col-xs-5" placeholder="Product" id="Product1" data-id="">' +
        '<input type="text" class="col-xs-2" placeholder="Harga" id="Price1">' +
        '<button onclick="add();"> <i class="glyphicon-plus"></i></button></div>';
    $('#ListProduct').append(newList);
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
                url: API + "Vendor?Delete=true",
                type: "POST",
                data: {
                    ID: custID,
                    Token: Token.get()
                },
                success: function (response) {
                    if (response.IsSuccess) {
                        $('#VendorTable').DataTable().ajax.reload();
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

    var lastNumber = $('#ListProduct input').length / 2;
    var tagInput = '<div class="row form-inline" id="' + (lastNumber + 1) + '">' +
        '<input type="text" class="col-xs-5" placeholder="Product" data-id="" id="Product' + (lastNumber + 1) + '"><input type="text" class="col-xs-3" placeholder="Harga" id="Price' + (lastNumber + 1) + '"><input type="text" class="col-xs-2" placeholder="Stok" id="Stok' + (lastNumber + 1) + '">' +
        '<button onclick="add();"> <i class="glyphicon-plus"></i></button><button onclick="remove(' + (lastNumber + 1) + ');"> <i class="glyphicon-minus"></i></button></div>';
    $('#ListProduct').append(tagInput);
}

function remove(e) {
    $('#Product' + e + '').val('');
    $('#' + e + '').hide();
}
