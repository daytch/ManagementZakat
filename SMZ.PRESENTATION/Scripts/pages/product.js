$(function () {
    var options = {
        target: '#output1',   // target element(s) to be updated with server response 
        //beforeSubmit: showRequest,  // pre-submit callback 
        success: showResponse,  // post-submit callback 
        url: API + "Product/Post",
        complete: showResponse

        // other available options: 
        //url:       url         // override for form's 'action' attribute 
        //type:      type        // 'get' or 'post', override for form's 'method' attribute 
        //dataType:  null        // 'xml', 'script', or 'json' (expected server response type) 
        //clearForm: true        // clear all form fields after successful submit 
        //resetForm: true        // reset the form after successful submit 

        // $.ajax options can be used here too, for example: 
        //timeout:   3000 
    };

    if (!Token.isAny()) {
        Redirect.toLoginPage();
    } else {
        LoadingMask.show();
        var title = "";
        $('#ProductTable').DataTable({
            "ajax": {
                "url": API + "Product?GetAll=true",
                "data": { Token: Token.get() }
            },
            "columns": [
                { "data": "VendorName", "width": "20%" },
                { "data": "Name", "width": "20%" },
                { "data": "Class", "width": "20%" },
                {
                    mRender: function (data, type, row) {
                        return convertToRupiah(row.Price);
                    }, "width": "15%"
                },
                {
                    mRender: function (data, type, row) {
                        var stok = '';
                        if (CheckObj.isEmptyNullOrUndefined(row.PartOfCow)) {
                            stok = row.Stok;
                        } else {
                            var bagian = (7 - (row.PartOfCow * 7)) + "/7";
                            stok = (row.Stok - 1) + " & "+ bagian;
                        }
                        return stok;
                    }, "width": "5%"
                },
                //{
                //    mRender: function (data, type, row) {
                //        var tag = '';
                //        if (!CheckObj.isEmptyNullOrUndefined(row.Images)) {
                //            tag = '<img width="200px" heigth="200px" src="' + API.replace("api/", "") + "FileUploads/" + row.Images + '" />';
                //        }
                //        return tag;
                //    }, "width": "30%"
                //},
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

            var Name = $("#Name").val();
            var VendorID = $("#Vendor").val();
            var ClassID = $("#ProductClass").val();
            if (CheckObj.isEmptyNullOrUndefined(Name) && !CheckObj.isNumber(VendorID)
                && !CheckObj.isNumber(ClassID)) {
                LoadingMask.hide();
                swal({
                    title: 'Validation',
                    text: "Please don't Leave mandatory field empty.",
                    type: 'info'
                });
            } else {
                $.ajax({
                    url: API + "Product?Save=true",
                    type: "POST",
                    data: {
                        Action: title,
                        ID: $("#ProductID").val(),
                        Name: Name,
                        VendorID: VendorID,
                        ClassID: ClassID,
                        Price: convertToAngka($("#Price").val()),
                        //Image: ImageUrl,
                        Stok: $("#Stok").val(),
                        Token: Token.get()
                    },
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
                                $('#ProductTable').DataTable().ajax.reload();
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
            }
        });

        $("#uploadZone").change(function (evt) {
            $("#form1").ajaxSubmit(options);
        });

        $('#myModal').on('show.bs.modal', function (e) {
            var mainTitle = $('#titleBig').html();
            title = e.relatedTarget.innerText;
            $("#modalTitle").html(title + " " + mainTitle);

            LoadingMask.show();

            $.ajax({
                url: API + "Product?load=true",
                type: "POST",
                data: { Token: Token.get() },
                success: function (response) {
                    if (response.IsSuccess) {
                        var opt = '';
                        var optClass = '';
                        var vendorList = response.ListVendor;
                        var listPro = response.ListClass;
                        for (var i = 0; i < vendorList.length; i++) {
                            opt = opt + '<option class="form-control" value="' + vendorList[i].ID + '">' + vendorList[i].Name + '</option>';
                        }
                        $('#Vendor').html('');
                        $('#Vendor').html('<option class="form-control">-- Please Select --</option>');
                        $('#Vendor').append(opt);

                        for (var i = 0; i < listPro.length; i++) {
                            optClass = optClass + '<option class="form-control" value="' + listPro[i].ID + '" data-price="' + listPro[i].Price + '" data-price="' + listPro[i].Description + '">' + listPro[i].Name + '</option>';
                        }
                        $('#ProductClass').html('');
                        $('#ProductClass').html('<option class="form-control">-- Please Select --</option>');
                        $('#ProductClass').append(optClass);

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
            }).done(function () {
                if (title.toLowerCase() == 'edit') {
                    var custID = e.relatedTarget.getAttribute('data-id');

                    $.ajax({
                        url: API + "Product?GetProduct=true",
                        type: "POST",
                        data: {
                            ID: custID,
                            Token: Token.get()
                        },
                        success: function (response) {
                            if (response.IsSuccess) {
                                $("#ProductID").val(response.ID);
                                $("#Name").val(response.Name);
                                $("#Stok").val(response.Stok);
                                $("#Vendor").val(response.VendorID);
                                $("#ProductClass").val(response.ClassID);
                                $('#Price').val(convertToRupiah(response.Price));
                                $('#Price').attr("disabled", true);
                                var tagImg = '<img width="200px" heigth="200px" src="' + API.replace("api/", "") + "FileUploads/" + response.Image + '" />';
                                $("#imgPreview").append(tagImg);

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
        });
        LoadingMask.hide();
    }
});


$('#ProductClass').change(function () {
    var HargaHewan = Number($(this).find("option:selected").attr("data-price"));
    $('#Price').val(convertToRupiah(HargaHewan));
    $('#Price').attr("disabled", true);
});

// pre-submit callback 
function showRequest(formData, jqForm, options) {
    // formData is an array; here we use $.param to convert it to a string to display it 
    // but the form plugin does this for you automatically when it submits the data 
    var queryString = $.param(formData);

    // jqForm is a jQuery object encapsulating the form element.  To access the 
    // DOM element for the form do this: 
    // var formElement = jqForm[0]; 

    alert('About to submit: \n\n' + queryString);

    // here we could return false to prevent the form from being submitted; 
    // returning anything other than false will allow the form submit to continue 
    return true;
}

// post-submit callback 
function showResponse(responseText, statusText, xhr, $form) {
    // for normal html responses, the first argument to the success callback 
    // is the XMLHttpRequest object's responseText property 

    // if the ajaxForm method was passed an Options Object with the dataType 
    // property set to 'xml' then the first argument to the success callback 
    // is the XMLHttpRequest object's responseXML property 

    // if the ajaxForm method was passed an Options Object with the dataType 
    // property set to 'json' then the first argument to the success callback 
    // is the json data object returned by the server 
    ImageUrl = responseText.responseJSON.FileName;
    var tagImg = '<img width="200px" heigth="200px" src="' + API.replace("api/", "") + "FileUploads/" + ImageUrl + '" />';
    $("#imgPreview").append(tagImg);
}

var ImageUrl = "";

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
                        $('#ProductTable').DataTable().ajax.reload();
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
