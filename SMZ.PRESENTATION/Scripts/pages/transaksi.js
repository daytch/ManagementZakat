$(document).ready(function () {
    $("#bagian_sapi").hide();
    if (!Token.isAny()) {
        Redirect.toLoginPage();
    } else {
        var arrcustomer = [];
        $('[name="newFamz"]').hide();
        $('[name="oldFamz"]').hide();
        $('#p_bagian').hide();
        $('#p_bagian1').hide();

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

        // Initiate prop in print
        $('#p_hijriyear').html(hYear);
        $('#p_masehiyear').html(mYear);

        $('#p_hijriyear1').html(hYear);
        $('#p_masehiyear1').html(mYear);

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
        ClassID: '',
        ProductID: '',
        Infaq: '',
        Price: '',
        BiayaPemotongan: '',
        BiayaPemeliharaan: '',
        Note: '',
        CareDays: '',
        PartOfCow: ''
    },
    Customer: {
        Name: '',
        Address: '',
        Telp: '',
        ListFamily: []
    },
    Token: Token.get()
};

var stokKambing = 0;
var stokSapi = 0;
var bagianDariSapi = 0;
var BiayaTitipSapi = 0;
var BiayaTitipKambing = 0;
var HargaHewan = 0;

var source = API + "Transaksi?getCustomer=true";

function InitData() {
    LoadingMask.show();
    var NotaID = getParameterByName('NotaID');


    $.ajax({
        type: "POST",
        url: API + "Transaksi?loadProductClassAndFee=true",
        data: {
            Token: Token.get()
        },
        success: function (response) {
            if (response.IsSuccess) {

                var listPro = response.ListProductClass;
                var opt = '';
                for (var i = 0; i < listPro.length; i++) {
                    opt = opt + '<option class="form-control" value="' + listPro[i].ID + '" data-price="' + listPro[i].Price + '" data-price="' + listPro[i].Description + '">' + listPro[i].Name + '</option>';
                }

                var bPotong = convertToRupiah(response.BPemotongan);
                $('#BiayaPemotongan').val(bPotong);
                BiayaTitipSapi = response.BiayaTitipSapi;
                BiayaTitipKambing = response.BiayaTitipKambing;
                $('#producttype').append(opt);
            } else {
                swal(
                    'Failed',
                    response.Message,
                    'error'
                );
            }
        }
    });

    if (NotaID != null) {
        GetNota(NotaID);
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
                        opt = opt + '<option class="form-control" value="' + vendorList[i].ID + '" data-kambing="' + vendorList[i].StokKambing + '" data-sapi="' + vendorList[i].StokSapi + '" data-bagian="' + vendorList[i].PartOfCow + '">' + vendorList[i].Name + '</option>';
                    }
                    $('#vendor').html('');
                    $('#vendor').html('<option class="form-control">-- Please Select --</option>');
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
        })
    }
}

function GetNota(NotaID, Callback) {
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

                $('[name="newFamz"]').hide();
                $('[name="oldFamz"]').show();
                $('#stok_vendor').hide();

                var listFamz = response.Customer.ListFamily;
                var tagFamz = '<ul style="font-size:11px;">';
                var FamNota = '<ol>';
                for (var i = 0; i < listFamz.length; i++) {
                    tagFamz += '<li>' + listFamz[i].FamilyName + '</li>';
                    FamNota += '<li>' + listFamz[i].FamilyName + '</li>';
                    Data.Transaksi.FamilyID.push(listFamz[i].ID);
                }

                var date = moment.utc(response.TransactionDate, 'YYYY-MM-DD HH:mm Z');
                var local = date.locale('id').format('LL');

                var opt = '';
                var vendorList = response.ListVendor;
                for (var i = 0; i < vendorList.length; i++) {
                    opt += '<option class="form-control" value="' + vendorList[i].ID + '" >' + vendorList[i].Name + '</option>';
                }
                $('#vendor').append(opt);
                $('#vendor').val(response.VendorID);

                var optClass = '';
                var classList = response.ListProductClass;
                for (var i = 0; i < classList.length; i++) {
                    optClass += '<option class="form-control" value="' + classList[i].ID + '" >' + classList[i].Name + '</option>';
                }
                $('#producttype').append(optClass);
                $('#producttype').val(response.ClassID);

                var optProduct = '';
                var productList = response.ListProduct;
                for (var i = 0; i < productList.length; i++) {
                    optProduct += '<option class="form-control" value="' + productList[i].ID + '" >' + productList[i].Name + '</option>';
                }
                $('#product').append(optProduct);
                $('#product').val(response.ProductID);

                var biayaTitip = (response.BiayaTitipKambing > 0) ? response.BiayaTitipKambing : response.BiayaTitipSapi;
                var bPelihara = convertToRupiah(biayaTitip / response.CareDays);
                var bPotong = convertToRupiah(response.BPemotongan);
                var total = Number(response.Price) + Number(biayaTitip) + Number(response.BPemotongan) + Number(response.Infaq);
                
                if ($('#product').find("option:selected").text().toLowerCase().indexOf("sapi") != -1) {
                    var part = response.PartOfCow * 7;
                    $('#p_bagian').show();
                    $('#p_bagian1').show();
                    $('#p_bagian').html('(' + part + '/7)');
                    $('#p_bagian1').html('(' + part + '/7)');

                    $('#bagian_sapi').show();
                    $('#bagian').val(part + '/7');                    
                }
                $('#qtydays').val(response.CareDays);
                $('#BiayaPemeliharaan').val(bPelihara);
                $('#Harga').val(convertToRupiah(response.Price));
                $('#Infaq').val(convertToRupiah(response.Infaq));
                $('#Total').val(convertToRupiah(total));
                $('#Req').val(response.Note);
                $('#NoHewan').html(response.NoHewan);
                $('#NoNota').html(response.NotaCode);
                $('#NoUrut').html(response.NoUrut);
                $('#now').html(local);
                $('#Nama').val(response.Customer.Name);
                $('#Telp').val(response.Customer.Telp);
                $('#Address').val(response.Customer.Address);
                $('#family').append(FamNota);


                //Header Nota
                $('#p_now').html(local);
                $('#p_now1').html(local);
                $('#p_no_urut').html(response.NoUrut);
                $('#p_no_urut1').html(response.NoUrut);
                $('#p_no_nota').html(response.NotaCode);
                $('#p_no_nota1').html(response.NotaCode);
                $('#p_vendor').html(response.VendorName);
                $('#p_vendor1').html(response.VendorName);

                //Content Nota
                $('#p_nama').html(response.Customer.Name);
                $('#p_alamat').html(response.Customer.Telp);
                $('#p_telp').html(response.Customer.Address);
                $('#p_nama1').html(response.Customer.Name);
                $('#p_alamat1').html(response.Customer.Telp);
                $('#p_telp1').html(response.Customer.Address);

                $('#p_penerima').html(response.CreatedBy);
                $('#p_penerima1').html(response.CreatedBy);
                $('#p_customer').html(response.Customer.Name);
                $('#p_customer1').html(response.Customer.Name);
                $('#p_kelas').html(response.ClassName);
                $('#p_kelas1').html(response.ClassName);
                $('#p_note').html(response.Note);
                $('#p_note1').html(response.Note);
                $('#p_infaq').html(convertToRupiah(response.Infaq));
                $('#p_infaq1').html(convertToRupiah(response.Infaq));
                $('#p_harga').html(convertToRupiah(response.Price));
                $('#p_harga1').html(convertToRupiah(response.Price));
                $('#p_biayapemotongan').html(bPotong);
                $('#p_biayapemotongan1').html(bPotong);
                $('#p_biayapemeliharaan').html(bPelihara);
                $('#p_biayapemeliharaan1').html(bPelihara);
                $('#p_total').html(convertToRupiah(total));
                $('#p_total1').html(convertToRupiah(total));
                $('#p_family').append(tagFamz + '</ul>');
                $('#p_family1').append(tagFamz + '</ul>');

                DisableInput(['Infaq', 'product', 'producttype', 'vendor', 'Nama', 'Req', 'qtydays', 'Telp', 'Address','bagian'], true);
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
    }).done(function () {
        if (!CheckObj.isEmptyNullOrUndefined(Callback)) {
            Callback();
        }
    });
}

$('#vendor').change(function () {

    stokKambing = Number($(this).find("option:selected").attr("data-kambing"));
    stokSapi = Number($(this).find("option:selected").attr("data-sapi"));
    bagianDariSapi = Number($(this).find("option:selected").attr("data-bagian"));

    Data.Transaksi.VendorID = $(this).val();

    $.ajax({
        type: "POST",
        url: API + "Transaksi?loadProductClassAndFee=true",
        data: {
            Token: Token.get()
        },
        success: function (response) {
            if (response.IsSuccess) {

                var listPro = response.ListProductClass;
                var opt = '';
                for (var i = 0; i < listPro.length; i++) {
                    if (stokKambing < 1 && (listPro[i].Name.toLocaleLowerCase().indexOf('kambing') !== -1 || listPro[i].Name.toLocaleLowerCase().indexOf('domba') !== -1)) {

                    } else if (stokSapi < 1 && listPro[i].Name.toLocaleLowerCase().indexOf('sapi') !== -1) {

                    } else {
                        opt = opt + '<option class="form-control" value="' + listPro[i].ID + '" data-price="' + listPro[i].Price + '" data-price="' + listPro[i].Description + '">' + listPro[i].Name + '</option>';
                    }
                }

                $('#producttype').html('<option class="form-control">-- Please Select --</option>');
                $('#producttype').append(opt);
            } else {
                swal(
                    'Failed',
                    response.Message,
                    'error'
                );
            }
        }
    });

    //var tag = "<span>Stok Kambing : " + stokKambing + "</span><br /><span>Stok Sapi : " + stokSapi + "</span>";
    if (stokKambing < 1) {
        $("#stok_kambing").css('color', 'red');
    } else {
        $("#stok_kambing").css('color', 'black');
    }
    if (stokSapi < 1) {
        $("#stok_sapi").css('color', 'red');
    } else {
        $("#stok_sapi").css('color', 'black');
    }
    $("#stok_kambing").html('');
    $("#stok_kambing").append(stokKambing);
    $("#stok_sapi").html('');
    var bagian = (7 - (bagianDariSapi * 7)) + "/7";
    var s_sapi = (Number(stokSapi) - 1) + " & " + bagian;
    $("#stok_sapi").append(s_sapi);

    $("#producttype option").each(function () {
        if (stokKambing < 1 && (this.text.indexOf('kambing') !== -1 || this.text.indexOf('domba') !== -1)) {
            $(this).remove();
        }
        if (stokKambing < 1 && this.text.indexOf('sapi')) {
            $(this).remove();
        }
    });

});

$('#qtydays').change(function () {

    var days = $(this).val();
    var bPelihara = convertToAngka($('#BiayaPemeliharaan').val());

    Data.Transaksi.CareDays = days;
    Data.Transaksi.BiayaPemeliharaan = Number(days) * Number(bPelihara);
    PopulateTotal();
});

$('#Infaq, #Harga').keyup(function () {

    var angka = Number(this.value.replace(/[^0-9]/g, ''));
    var rupiah = '';
    var angkarev = angka.toString().split('').reverse().join('');
    for (var i = 0; i < angkarev.length; i++) if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + '.';
    this.value = 'Rp. ' + rupiah.split('', rupiah.length - 1).reverse().join('');

});

$('#Infaq, #Harga').change(function () {

    Data.Transaksi.Infaq = convertToAngka($("#Infaq").val());

    //set harga custom
    var bagian = $("#bagian").val();
    var pembagi = (bagian === "6/7") ? 6 / 7 : (bagian === "5/7") ? 5 / 7 : (bagian === "4/7") ? 4 / 7 : (bagian === "3/7") ? 3 / 7 : (bagian === "2/7") ? 2 / 7 : (bagian === "1/7") ? 1 / 7 : 1;
    HargaHewan = Number($('#producttype').find("option:selected").attr("data-price")) * Number(pembagi);
    Data.Transaksi.Price = Math.round(HargaHewan / 100) * 100;
    $('#Harga').val(convertToRupiah(Math.round(HargaHewan / 100) * 100));
    PopulateTotal();
});

$('#bagian').change(function () {
    var pembagi = ($(this).val() === "6/7") ? 6 / 7 : ($(this).val() === "5/7") ? 5 / 7 : ($(this).val() === "4/7") ? 4 / 7 : ($(this).val() === "3/7") ? 3 / 7 : ($(this).val() === "2/7") ? 2 / 7 : ($(this).val() === "1/7") ? 1 / 7 : 1;
    HargaHewan = Number($('#producttype').find("option:selected").attr("data-price")) * Number(pembagi);
    Data.Transaksi.Price = Math.round(HargaHewan / 100) * 100;
    Data.Transaksi.PartOfCow = '' + pembagi;
    $('#Harga').val(convertToRupiah(Math.round(HargaHewan / 100) * 100));
    PopulateTotal();
});

$('#producttype').change(function () {
    var jenisHewan = this.options[this.selectedIndex].innerHTML;
    var biayaTitip = 0;
    var isCustom = true;
    var isSapi = true;

    $('#bagian').prop('selectedIndex', 0);

    Data.Transaksi.ClassID = $(this).val();

    HargaHewan = Number($(this).find("option:selected").attr("data-price"));
    // Disabled edit harga if not custom
    if (jenisHewan.toLocaleLowerCase().indexOf('custom') == -1) {
        $('#Harga').val(convertToRupiah(HargaHewan));
        $('#Harga').attr("disabled", true);
        isCustom = false;
    } else {
        $('#Harga').val(convertToRupiah(HargaHewan));
        $('#Harga').removeAttr("disabled");
        isCustom = true;
    }

    if (jenisHewan.toLocaleLowerCase().indexOf('sapi') == -1) {
        $("#bagian_sapi").hide();
        biayaTitip = convertToRupiah(BiayaTitipKambing);
        isSapi = false;
    } else {
        $("#bagian_sapi").show();
        biayaTitip = convertToRupiah(BiayaTitipSapi);
        isSapi = true;
    }

    //Get Product list

    $.ajax({
        url: API + "Transaksi?loadProduct=true",
        data: {
            Token: Token.get(),
            VendorID: $('#vendor').val(),
            ClassID: $(this).val(),
            isCustom: isCustom,
            isSapi: isSapi
        },
        type: "POST",
        success: function (response) {
            if (response.IsSuccess) {

                product
                var listPro = response.ListProduct;
                var opt = '';
                for (var i = 0; i < listPro.length; i++) {
                    if (stokKambing < 1 && (listPro[i].Name.toLocaleLowerCase().indexOf('kambing') !== -1 || listPro[i].Name.toLocaleLowerCase().indexOf('domba') !== -1)) {

                    } else if (stokSapi < 1 && listPro[i].Name.toLocaleLowerCase().indexOf('sapi') !== -1) {

                    } else {
                        opt = opt + '<option class="form-control" value="' + listPro[i].ID + '">' + listPro[i].Name + '</option>';
                    }
                }

                $('#product').html('<option class="form-control">-- Please Select --</option>');
                $('#product').append(opt);
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

    $('#BiayaPemeliharaan').val(biayaTitip);
    $('#Total').val(0);
    Data.Transaksi.Price = HargaHewan;
    PopulateTotal();
});

$('#product').change(function () {

    $('#bagian').prop('selectedIndex', 0);

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

    var price = Number($("#producttype").find(':selected').attr('data-price'));
    Data.Transaksi.Price = price;
    PopulateTotal();
});

function PopulateTotal() {
    var infaq = (CheckObj.isEmptyNullOrUndefined($('#Infaq').val())) ? 0 : convertToAngka($('#Infaq').val());
    var bPotong = convertToAngka($('#BiayaPemotongan').val());
    var bTitip = convertToAngka($('#BiayaPemeliharaan').val());
    var totalHrTitip = (CheckObj.isEmptyNullOrUndefined($('#qtydays').val())) ? 1 : $('#qtydays').val();

    var total = infaq + bPotong + Number(Data.Transaksi.Price) + (bTitip * totalHrTitip);

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

function PrintPage() {
    window.print();
    window.location.reload();
    LoadingMask.hide();
}

function Submit() {
    LoadingMask.show();
    var bPotong = $('#BiayaPemotongan').val();
    Data.Transaksi.BiayaPemotongan = convertToAngka(bPotong);
    Data.Transaksi.Note = $('#Req').val();

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

    if (ValidateOnSubmit()) {
        $.ajax({
            type: "POST",
            url: API + "Transaksi?submit=true",
            data: Data,
            success: function (response) {
                if (response.IsSuccess) {
                    GetNota(response.NotaID, PrintPage);
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