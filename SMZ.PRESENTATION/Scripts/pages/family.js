$(function () {
    var title = "";
    $('#Customertable').DataTable({
        "ajax": API + "Family?GetAll=true",
        "columns": [
            { "data": "Name", "width": "25%" },
            {
                mRender: function (data, type, row) {
                    debugger;
                    var listdata = '';
                    for (var i = 0; i < row.ListFamily.length; i++) {
                        listdata = '<li>' + row.ListFamily[i].FamilyName + '</li>' + listdata;
                    }
                    return '<ol>'+ listdata + '</ol>';
                }, "width": "40%"
            },
            {
                mRender: function (data, type, row) {
                    return '<a data-id="' + row.ID + '" data-toggle="modal" data-target="#myModal">Edit</a> |' +
                        '<a data-id="' + row.ID + '" onclick="deleteData(this)" > Delete</a > '
                }, "width": "10%"
            }
        ]
    });

    $('#save').on('click', function (e) {
        console.log(title);
        var custData = {
            Action: title,
            ID: $("#CustomerID").val(),
            Name: $("#CustomerName").val(),
            Telp: $("#Phone").val(),
            Address: $("#Address").val()
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
