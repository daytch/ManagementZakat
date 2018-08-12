$(function () {
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

    $('#Nama').bind('typeahead:selected typeahead:autocompleted', function (ev, data) {
        var ID = data.id;
        Data.Transaksi.CustomerID = ID;
        $.ajax({
            type: "POST",
            url: API + "Transaksi?loadCustomer=true",
            data: {
                CustomerID: ID
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
});

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
        Price:'',
        BiayaPemotongan: '',
        BiayaPemeliharaan: '',
        Note: '',
        CareDays:''
    }
};

var BiayaTitipSapi = 0;
var BiayaTitipKambing = 0;

var source = API + "Transaksi?load=true";

function InitData() {
    var NotaID = getParameterByName('NotaID');
    if (NotaID != null) {
        $('div.form-group.visible-print').attr("hidden", "false");//removeAttr("hidden");
        var data = { NotaID: NotaID };
        $.ajax({
            url: API + "Transaksi?loadNota=true",
            data: data,
            type: "POST",
            success: function (response) {
                if (response.IsSuccess) {

                    $('#backbutton').show();
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

                    $('select[name="vendor"]').append(opt);
                    $('select[name="vendor"]').val(response.VendorID);
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
                    var bPelihara = convertToRupiah(response.BPelihara);
                    var bPotong = convertToRupiah(response.BPemotongan);
                    var total = Number(response.BPelihara) + Number(response.BPemotongan) + Number(response.Infaq);

                    $('#Req').val(response.Note);
                    $('#BiayaPemotongan').val(bPotong);
                    $('#BiayaPemeliharaan').val(bPelihara);
                    $('#Infaq').val(convertToRupiah(response.Infaq));
                    $('select[name="product"]').append(opt);
                    $('select[name="product"]').val(response.ProductID);
                    $('#Total').val(convertToRupiah(total));
                    $('#family').append(tagFamz + '</ol>');

                    $('#Infaq').attr("readonly", "readonly");
                    $('select[name="product"]').attr("readonly", "readonly");
                    $('select[name="vendor"]').attr("readonly", "readonly");
                    $('#Nama').attr("readonly", "readonly");
                    $('#Req').attr("readonly", "readonly");
                    $('#submit').hide();
                    $('#noProduct').show();
                    $('#nota').show();                    
                } else {
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
            success: function (response) {
                if (response.IsSuccess) {

                    $('#noProduct').attr("class", "visible-print");
                    $('#nota').attr("class", "visible-print");

                    var data = [];
                    var opt = '';
                    var vendorList = response.ListVendor;
                    var customerList = response.ListCustomer;
                    for (var i = 0; i < vendorList.length; i++) {
                        opt = opt + '<option class="form-control" value="' + vendorList[i].ID + '">' + vendorList[i].Name + '</option>';
                    }
                    $('select[name="vendor"]').append(opt);
                    initializeTagsTypeahead($('#Nama'), source);
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
}

$('#Infaq').change(function () {
    var product = $(this);
    Data.Transaksi.Infaq = product.val();
    PopulateTotal(product.val());
});

$('#qtydays').change(function () {
    debugger;
    var days = $(this).val();
    var bPelihara = convertToAngka($('#BiayaPemeliharaan').val());
    var total = $('#Total').val();
    total = convertToAngka(total);
    var all = (Number(days) * Number(bPelihara)) + total;
    $('#Total').val(convertToRupiah(all));
    Data.Transaksi.CareDays = days;
});

$('select[name="product"]').change(function () {
    
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

$('select[name="vendor"]').change(function () {
    var ID = $(this).val();
    Data.Transaksi.VendorID = ID;
    if (isNumber(ID)) {
        $.ajax({
            type: "POST",
            url: API + "Transaksi?loadProduct=true",
            data: {
                VendorID: ID
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
                    $('select[name="product"]').append(opt);
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
    if (!Data.Transaksi.CustomerID) {
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
    
    var qtyDays = $('#qtydays').val();
    var bPotong = $('#BiayaPemotongan').val();
    var bPelihara = $('#BiayaPemeliharaan').val();
    var totalBiayaTitip = ((qtyDays = 0) || (qtyDays = '')) ? 0 : convertToAngka(bPelihara) * Number(qtyDays);
    Data.Transaksi.BiayaPemeliharaan = totalBiayaTitip;
    Data.Transaksi.BiayaPemotongan = convertToAngka(bPotong);
    Data.Transaksi.Note = $('#Req').val();
    if (ValidateOnSubmit()) {
        $.ajax({
            type: "POST",
            url: API + "Transaksi?submit=true",
            data: Data,
            success: function (response) {
                if (response.IsSuccess) {
                    $('#NoHewan').append(response.NotaCode);
                    $('#NoNota').append(response.LastNumber);
                    window.print();
                    window.location.reload();
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
}

function back() {
    window.history.back();
}

function printAll() {
    window.print();
}