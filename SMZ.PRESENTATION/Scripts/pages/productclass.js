$(function () {
    if (!Token.isAny()) {
        Redirect.toLoginPage();
    } else {
        LoadingMask.show();
        var title = "";
        $('#ProductClassTable').DataTable({
            "ajax": {
                "url": API + "ProductClass?GetAll=true",
                "data": { Token: Token.get() }
            },
            "columns": [
                { "data": "Name", "width": "30%" },
                {
                    mRender: function (data, type, row) {
                        return convertToRupiah(row.Price);
                    }, "width": "20%"
                },
                { "data": "Description", "width": "40%" },
                {
                    mRender: function (data, type, row) {
                        var response = '<a data-id="' + row.ID + '" data-toggle="modal" data-target="#myModal">Edit</a> |' +
                                '<a data-id="' + row.ID + '" onclick="deleteData(this)" > Delete</a > '
                        return response;
                    }, "width": "20%"
                }
            ],
            "processing": true,
        });

        $('#save').on('click', function (e) {
            LoadingMask.show();

            var custData = {
                Action: title,
                ID: $("#ID").val(),
                Name: $("#Name").val(),
                Description: $("#Description").val(),
                Price: convertToAngka($("#Price").val()),
                Token: Token.get()
            }

            $.ajax({
                url: API + "ProductClass?Save=true",
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
                            $('#ProductClassTable').DataTable().ajax.reload();
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
                    url: API + "ProductClass?Load=true",
                    type: "POST",
                    data: {
                        ID: custID,
                        Token: Token.get()
                    },
                    success: function (response) {
                        if (response.IsSuccess) {
                            $("#ID").val(response.ID);
                            $("#Name").val(response.Name);
                            $("#Price").val(convertToRupiah(response.Price));
                            $("#Description").val(response.Description);

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

$('#Price').keyup(function () {

    var angka = Number(this.value.replace(/[^0-9]/g, ''));
    var rupiah = '';
    var angkarev = angka.toString().split('').reverse().join('');
    for (var i = 0; i < angkarev.length; i++) if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + '.';
    this.value = 'Rp. ' + rupiah.split('', rupiah.length - 1).reverse().join('');

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
                url: API + "ProductClass?Delete=true",
                type: "POST",
                data: {
                    ID: custID,
                    Token: Token.get()
                },
                success: function (response) {
                    if (response.IsSuccess) {
                        $('#ProductClassTable').DataTable().ajax.reload();
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
