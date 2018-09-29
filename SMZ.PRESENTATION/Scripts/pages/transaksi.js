$(document).ready(function() {
    if (!Token.isAny()) {
        Redirect.toLoginPage();
    } else {
        var arrcustomer = [];
        $('[name="newFamz"]').hide();
        $('[name="oldFamz"]').hide();
        var hYear = getIslamicYear();
        var mYear = new Date().getFullYear();
        var local = moment();
        local.locale('id');
        
        var now = local.format('LL');
        $('#hijriyear').html(hYear);
        $('#masehiyear').html(mYear);
        $('#now').html(now);
        $('#noProduct').hide();
        $('#nota').hide();
        $('#backbutton').hide();

        InitData();

        $('#Nama').on('change', function (evt, data) {
            var val = $('#Nama').val();

            if (typeof (arrCustpmer.find(x => x.Nama.toLowerCase() == val.toLowerCase())) == 'undefined') {
                $('#Telp').val('');
                $('#Address').val('');

                $('[name="newFamz"]').show();
                $('[name="oldFamz"]').hide();

                Data.Transaksi.FamilyID = [];
            }
        })

        $('#Nama').bind('typeahead:selected typeahead:autocompleted', function (ev, data) {
            $('[name="newFamz"]').hide();
            $('[name="oldFamz"]').show();
            var ID = data.id;
            Data.Transaksi.CustomerID = ID;
            $.ajax({
                type: "POST",
                url: API + "Transaksi?loadCustomer=true",
                data: {
                    CustomerID: ID,
                    Token: Token.get()
                },
                success: function (response) {
                    if (response.IsSuccess) {
                        var cust = response.Customer;
                        var listFamz = cust.ListFamily;
                        var tagFamz = '<ol>';
                        $('#Telp').val(cust.Telp);
                        $('#Address').val(cust.Address);
                        for (var i = 0; i < listFamz.length; i++) {
                            tagFamz = tagFamz + '<li>' + listFamz[i].FamilyName + '</li>';
                            Data.Transaksi.FamilyID.push(listFamz[i].ID);
                        }
                        $('#family').html('');
                        $('#family').append(tagFamz + '</ol>');
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
    }
})

function initializeTagsTypeahead(typeaheadInputBox, dataSource) {
    var tags = new Bloodhound({
        datumTokenizer: function (datum) {
            
            return Bloodhound.tokenizers.whitespace(datum.name);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: {
            type: "POST",
            url: dataSource,
            cache: false,
            transform: function (response) {
                arrCustpmer = response.ListCustomer;
                return $.map(response.ListCustomer, function (tag) {
                    return {
                        name: tag.Nama,
                        id: tag.ID
                    }
                });
            }
        }
    });

    typeaheadInputBox.typeahead({
        minLength: 1,
        highlight: true
    }, {
            name: 'tags-dataset',
            source: tags,
            display: 'name'
        });
}

var Data = {
    Transaksi: {
        CustomerID: '',
        FamilyID: [],
        VendorID: '',
        ProductID: '',
        Infaq: '',
        Price: '',
        BiayaPemotongan: '',
        BiayaPemeliharaan: '',
        Note: '',
        CareDays: ''
    },
    Customer: {
        Name: '',
        Address: '',
        Telp: '',
        ListFamily: []
    },
    Token: Token.get()
};

var BiayaTitipSapi = 0;
var BiayaTitipKambing = 0;

var source = API + "Transaksi?getCustomer=true";

function InitData() {
    LoadingMask.show();
    var NotaID = getParameterByName('NotaID');
    if (NotaID != null) {
        $('div.form-group.visible-print').attr("hidden", "false");//removeAttr("hidden");
        var data = {
            NotaID: NotaID,
            Token: Token.get()
        };
        $.ajax({
            url: API + "Transaksi?loadNota=true",
            data: data,
            type: "POST",
            success: function (response) {
                if (response.IsSuccess) {

                    var data = [];
                    var opt = '';
                    var vendorList = response.ListVendor;
                    var customerList = response.ListCustomer;
                    for (var i = 0; i < vendorList.length; i++) {
                        opt = opt + '<option class="form-control" value="' + vendorList[i].ID + '">' + vendorList[i].Name + '</option>';
                    }

                    var listFamz = response.Customer.ListFamily;
                    var tagFamz = '<ol>';
                    for (var i = 0; i < listFamz.length; i++) {
                        tagFamz = tagFamz + '<li>' + listFamz[i].FamilyName + '</li>';
                        Data.Transaksi.FamilyID.push(listFamz[i].ID);
                    }

                    var date = moment.utc(response.TransactionDate, 'YYYY-MM-DD HH:mm Z');
                    var local = date.locale('id').format('LL');

                    $('#vendor').append(opt);
                    $('#vendor').val(response.VendorID);
                    $('#NoHewan').html(response.NoHewan);
                    $('#NoNota').html(response.NotaCode);
                    $('#now').html(local);
                    $('#Nama').val(response.Customer.Name);
                    $('#Telp').val(response.Customer.Telp);
                    $('#Address').val(response.Customer.Address);

                    var listPro = response.ListProduct;
                    for (var i = 0; i < listPro.length; i++) {
                        opt = opt + '<option class="form-control" value="' + listPro[i].ID + '" data-price="' + listPro[i].Price + '">' + listPro[i].Name + '</option>';
                    }
                    var biayaTitip = (response.BiayaTitipKambing > 0) ? response.BiayaTitipKambing : response.BiayaTitipSapi;
                    var bPelihara = convertToRupiah(biayaTitip / response.CareDays);
                    var bPotong = convertToRupiah(response.BPemotongan);
                    var total = Number(response.Price) + Number(biayaTitip) + Number(response.BPemotongan) + Number(response.Infaq);

                    $('#qtydays').val(response.CareDays);
                    $('#Req').val(response.Note);
                    $('#BiayaPemotongan').val(bPotong);
                    $('#BiayaPemeliharaan').val(bPelihara);
                    $('#Infaq').val(convertToRupiah(response.Infaq));
                    $('#product').append(opt);
                    $('#product').val(response.ProductID);
                    $('#Total').val(convertToRupiah(total));
                    $('#family').append(tagFamz + '</ol>');

                    DisableInput(['Infaq', 'product', 'vendor', 'Nama', 'Req', 'qtydays','Telp','Address'], true);
                    HideAll(['noProduct', 'nota', 'backbutton'], false);
                    HideAll('submit', true);

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
    } else {
        $.ajax({
            url: API + "Transaksi?load=true",
            type: "POST",
            data: { Token: Token.get() },
            success: function (response) {
                if (response.IsSuccess) {
                    Token.save(response.Token);
                    $('#noProduct').attr("class", "visible-print");
                    $('#nota').attr("class", "visible-print");

                    var data = [];
                    var opt = '';
                    var vendorList = response.ListVendor;
                    var customerList = response.ListCustomer;
                    for (var i = 0; i < vendorList.length; i++) {
                        opt = opt + '<option class="form-control" value="' + vendorList[i].ID + '">' + vendorList[i].Name + '</option>';
                    }
                    $('#vendor').append(opt);
                    initializeTagsTypeahead($('#Nama'), source);

                    LoadingMask.hide();
                } else if (!response.IsSuccess && response.Token == "") {
                    Token.delete();
                    LoadingMask.hide();
                    swal(
                        'Failed',
                        response.Message,
                        'error'
                    ).then(() => {
                        Redirect.toLoginPage();
                    });

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
}

$('#Infaq').change(function () {
    var product = $(this);
    Data.Transaksi.Infaq = product.val();
    PopulateTotal(product.val());
});

$('#qtydays').change(function () {

    var days = $(this).val();
    var bPelihara = convertToAngka($('#BiayaPemeliharaan').val());
    var total = $('#Total').val();
    total = convertToAngka(total);
    var all = (Number(days) * Number(bPelihara)) + total;
    $('#Total').val(convertToRupiah(all));
    Data.Transaksi.CareDays = days;
    Data.Transaksi.BiayaPemeliharaan = Number(days) * Number(bPelihara);
});

$('#product').change(function () {

    Data.Transaksi.ProductID = $(this).val();
    var jenisHewan = this.options[this.selectedIndex].innerHTML;
    var biayaTitip = 0;
    if (jenisHewan.toLocaleLowerCase().indexOf('sapi') == -1) {
        biayaTitip = convertToRupiah(BiayaTitipKambing);
    } else {
        biayaTitip = convertToRupiah(BiayaTitipSapi);
    }
    $('#BiayaPemeliharaan').val(biayaTitip);
    $('#Total').val(0);
    var product = $(this);
    var price = this.options[this.selectedIndex].getAttribute('data-price');
    Data.Transaksi.Price = price;
    PopulateTotal(price);
});

$('#vendor').change(function () {
    var ID = $(this).val();
    Data.Transaksi.VendorID = ID;
    if (isNumber(ID)) {
        $.ajax({
            type: "POST",
            url: API + "Transaksi?loadProduct=true",
            data: {
                VendorID: ID,
                Token: Token.get()
            },
            success: function (response) {
                if (response.IsSuccess) {

                    var listPro = response.ListProduct;
                    var opt = '';
                    for (var i = 0; i < listPro.length; i++) {
                        opt = opt + '<option class="form-control" value="' + listPro[i].ID + '" data-price="' + listPro[i].Price + '">' + listPro[i].Name + '</option>';
                    }

                    var bPotong = convertToRupiah(response.BPemotongan);
                    $('#BiayaPemotongan').val(bPotong);
                    BiayaTitipSapi = response.BiayaTitipSapi;
                    BiayaTitipKambing = response.BiayaTitipKambing;
                    $('#product').append(opt);
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

function PopulateTotal(amount) {

    var infaq = ($('#Infaq').val()) ? 0 : $('#Infaq').val();
    var total = $('#Total').val();
    var bPotong = $('#BiayaPemotongan').val();
    if (total < 1) {
        total = convertToAngka(bPotong) + Number(amount) + Number(infaq);
    } else {
        total = convertToAngka(total);
        total = Number(total) + Number(amount);
    }
    var totalRupiah = convertToRupiah(total);
    $('#Total').val(totalRupiah);
}

function ValidateOnSubmit() {
    var result = true;
    var msg = '';
    if (!Data.Transaksi.CustomerID && $('#Nama').val() == '') {
        msg = msg + '<strong>Nama pengQurban wajib diisi.</strong><br />';
        result = false;
    }
    if (!Data.Transaksi.VendorID) {
        msg = msg + '<strong>Nama Vendor wajib diisi.</strong><br />';
        result = false;
    }
    if (!Data.Transaksi.ProductID) {
        msg = msg + '<strong>Hewan qurban harus diisi.</strong>';
        result = false;
    }

    if (!result) {
        swal({
            title: 'Validation',
            type: 'warning',
            html: msg,
            focusConfirm: false
        })
    }
    return result;
}

function Submit() {
    LoadingMask.show();
    var qtyDays = $('#qtydays').val();
    var bPotong = $('#BiayaPemotongan').val();
    Data.Transaksi.BiayaPemotongan = convertToAngka(bPotong);
    Data.Transaksi.Note = $('#Req').val();

    if (Data.Transaksi.FamilyID.length == 0) {
        Data.Customer.Name = $('#Nama').val();
        Data.Customer.Address = $('#Address').val();
        Data.Customer.Telp = $('#Telp').val();

        var lastNumber = $('#listFamily input').length;
        for (var i = 1; i <= lastNumber; i++) {
            var input = $('#Family' + i + '');
            var list = { ID: input.attr('data-id'), FamilyName: input.val() };
            if (typeof (input.val()) != 'undefined') {
                Data.Customer.ListFamily.push(list);
            }
        }
        var tagFamz = '';
        for (var i = 0; i < Data.Customer.ListFamily.length; i++) {
            tagFamz = tagFamz + '<li>' + Data.Customer.ListFamily[i].FamilyName + '</li>';
        }
        $('#newFamily').html('');
        $('#newFamily').append(tagFamz + '</ol>');
    }

    if (ValidateOnSubmit()) {
        $.ajax({
            type: "POST",
            url: API + "Transaksi?submit=true",
            data: Data,
            success: function (response) {
                if (response.IsSuccess) {
                    $('#NoNota').append(response.NotaCode);
                    $('#NoHewan').append(response.LastNumber);
                    window.print();
                    window.location.reload();
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
    } else {
        LoadingMask.hide();
    }
}

function back() {
    window.history.back();
}

function printAll() {
    window.print();
}

function add() {

    var lastNumber = $('#listFamily input').length;
    var tagInput = '<div class="row hidden-print" id="' + (lastNumber + 1) + '"><div class="col-md-8" >' +
        '<input type="text" class="form-control" placeholder="Family" data-id="" id="Family' + (lastNumber + 1) + '"></div>' +
        '<div class="col-md-4"><button onclick="add();"> <i class="glyphicon-plus"></i></button>&nbsp;<button onclick="remove(' + (lastNumber + 1) + ');"> <i class="glyphicon-minus"></i></button></div>';
    $('#listFamily').append(tagInput);
}

function remove(e) {
    $('#Family' + e + '').val('');
    $('#' + e + '').hide();
}