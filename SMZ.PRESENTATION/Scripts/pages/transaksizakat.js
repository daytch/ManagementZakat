$(document).ready(function () {
    if (!Token.isAny()) {
        Redirect.toLoginPage();
    } else {
        var hYear = getIslamicYear();
        var mYear = new Date().getFullYear();
        var local = moment();
        local.locale('id');

        var now = local.format('L');
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

                Data.Customer.FamilyID = [];
            }
        })

        $('#Nama').bind('typeahead:selected typeahead:autocompleted', function (ev, data) {
            var ID = data.id;
            Data.Customer.ID = ID;
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

                        var count = 1;
                        var tagInput = "";
                        if (listFamz.length > 0) {
                            $('#listFamily').html('');
                        }
                        for (var i = 0; i < listFamz.length; i++) {
                            if (count > 1) {
                                tagInput = '<div class="row hidden-print" id="' + (count) + '"><div class="col-md-8" >' +
                                    '<input type="text" class="form-control" placeholder="Nama Muzaki" data-id="' + listFamz[i].ID + '" id="Family' + (count) + '" value="' + listFamz[i].FamilyName + '"></div>' +
                                    '<div class="col-md-4"><button onclick="add();"> <i class="glyphicon-plus"></i></button>&nbsp;<button onclick="remove(' + (count) + ');"> <i class="glyphicon-minus"></i></button></div>';
                            } else {
                                tagInput = '<div class="row hidden-print" id="' + (count) + '"><div class="col-md-8" >' +
                                    '<input type="text" class="form-control" placeholder="Nama Muzaki" data-id="' + listFamz[i].ID + '" id="Family' + (count) + '" value="' + listFamz[i].FamilyName + '"></div>' +
                                    '<div class="col-md-4"><button onclick="add();"> <i class="glyphicon-plus"></i></button></div>';
                            }
                            count += 1;
                            $('#listFamily').append(tagInput);
                        }
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

function add() {

    var lastNumber = $('#listFamily input').length;
    var tagInput = '<div class="row hidden-print" id="' + (lastNumber + 1) + '"><div class="col-md-8" >' +
        '<input type="text" class="form-control" placeholder="Nama Muzaki" data-id="" id="Family' + (lastNumber + 1) + '"></div>' +
        '<div class="col-md-4"><button onclick="add();"> <i class="glyphicon-plus"></i></button>&nbsp;<button onclick="remove(' + (lastNumber + 1) + ');"> <i class="glyphicon-minus"></i></button></div>';
    $('#listFamily').append(tagInput);
}

function remove(e) {
    $('#Family' + e + '').val('');
    $('#' + e + '').hide();
}

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

var BiayaTitipSapi = 0;
var BiayaTitipKambing = 0;

var source = API + "Transaksi?getCustomer=true";

function InitData() {
    LoadingMask.show();
    GetTypeOfZakat();
    var NotaID = getParameterByName('NotaZakatID');
    if (NotaID != null) {
        $('#backbutton').show();
        window.onbeforeprint = function () {
            $('#content_area').attr("class", "hidden-print");
            $('footer').attr("class", "hidden-print");
            $('#print_area_content').css({ "position": "relative", "margin-top": "-50px" });
            $('#print_area').attr("class", "visible-print");
        };
        window.onafterprint = function () {
            $('#content_area').attr("class", "visible-print");
            $('footer').attr("class", "visible-print");
            $('#print_area_content').attr("style", '');
            $('#print_area').attr("class", "hidden-print");
        }

        $('#content_area').attr("class", "visible-print");
        $('footer').attr("class", "visible-print");
        $('#print_area_content').attr("style", '');
        $('#print_area').attr("class", "hidden-print");

        var data = {
            ID: NotaID,
            Token: Token.get()
        };
        $.ajax({
            url: API + "Zakat?loadReport=true",
            data: data,
            type: "POST",
            success: function (response) {
                if (response.IsSuccess) {
                    var data = response.data;
                    $('#NoNota').append(data[0].NotaCode);
                    Data.Customer.Name = data[0].CustomerName;
                    Data.Customer.Address = data[0].Address;
                    Data.Customer.Telp = data[0].Telp;
                    var listDetail = data[0].ListDetail;
                    for (var i = 0; i < listDetail.length; i++) {
                        switch (listDetail[i].Name) {
                            case "Zakat Fitrah (uang)":
                                Data.Print.z_uang_nominal = listDetail[i].Nominal;
                                Data.Print.z_uang_jumlah = listDetail[i].Jumlah;
                                Data.Print.z_uang_total = listDetail[i].Total;
                                break;
                            case "Zakat Fitrah (beras)":
                                Data.Print.z_beras_nominal = listDetail[i].Nominal;
                                Data.Print.z_beras_jumlah = listDetail[i].Jumlah;
                                Data.Print.z_beras_total = listDetail[i].Total;
                                break;
                            case "Zakat Maal":
                                Data.Print.z_maal = listDetail[i].Total;
                                break;
                            case "Zakat Perniagaan":
                                Data.Print.z_niaga = listDetail[i].Total;
                                break;
                            case "Fidyah (uang)":
                                Data.Print.f_uang_nominal = listDetail[i].Nominal;
                                Data.Print.f_uang_jumlah = listDetail[i].Jumlah;
                                Data.Print.f_uang_total = listDetail[i].Total;
                                break;
                            case "Fidyah (beras)":
                                Data.Print.f_beras_nominal = listDetail[i].Nominal;
                                Data.Print.f_beras_jumlah = listDetail[i].Jumlah;
                                Data.Print.f_beras_total = listDetail[i].Total;
                                break;
                            case "Infaq / Shadaqah":
                                Data.Print.infaq = listDetail[i].Total;
                                break;
                            case "Infaq Pembangunan":
                                Data.Print.i_pembangunan = listDetail[i].Total;
                                break;
                            default:
                        }
                    }
                    Data.Name = response.Name;
                    var listFamz = response.data[0].ListFamily;
                    var tagFamz = '<ol style="margin-top: -14px;margin-left: 41px;" >';
                    for (var i = 0; i < listFamz.length; i++) {
                        tagFamz = tagFamz + '<li>' + listFamz[i].FamilyName + '</li>';
                        Data.Customer.ListFamily.push({ ID: listFamz[i].ID, FamilyName: listFamz[i].FamilyName });
                        Data.Customer.FamilyID.push(listFamz[i].ID);
                    }
                    RenderPrint();
                    LoadingMask.hide();
                }
                else {
                    LoadingMask.hide();
                    swal(
                        'Failed',
                        response.Message,
                        'error'
                    ).then(() => {
                        Redirect.toLoginPage();
                    });
                }
            }
        });
    }
    else {
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

$('#zakat_uang, #zakat_maal, #zakat_niaga, #fidyah_uang, #infaq, #infaq_bangunan').keyup(function () {

    var angka = Number(this.value.replace(/[^0-9]/g, ''));
    var rupiah = '';
    var angkarev = angka.toString().split('').reverse().join('');
    for (var i = 0; i < angkarev.length; i++) if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + '.';
    this.value = 'Rp. ' + rupiah.split('', rupiah.length - 1).reverse().join('');

});

function ValidateOnSubmit() {
    var result = true;
    var msg = '';

    if (CheckObj.isEmptyNullOrUndefined($('#zakat_uang').val()) && CheckObj.isEmptyNullOrUndefined($('#zakat_beras').val()) && CheckObj.isEmptyNullOrUndefined($('#zakat_maal').val()) && CheckObj.isEmptyNullOrUndefined($('#zakat_niaga').val())
        && CheckObj.isEmptyNullOrUndefined($('#fidyah_uang').val()) && CheckObj.isEmptyNullOrUndefined($('#fidyah_beras').val()) && CheckObj.isEmptyNullOrUndefined($('#infaq').val()) && CheckObj.isEmptyNullOrUndefined($('#infaq_bangunan').val())) {
        msg = msg + '<strong>Zakat wajib diisi.</strong><br />';
        result = false;
    }
    if (!$('#Nama').val()) {
        msg = msg + '<strong>Muzaki wajib diisi.</strong><br />';
        result = false;
    }
    if (!$('#Address').val()) {
        msg = msg + '<strong>Alamat Muzaki wajib diisi.</strong><br />';
        result = false;
    }
    if (!$('#Telp').val()) {
        msg = msg + '<strong>Telp Muzaki wajib diisi.</strong><br />';
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

var Data = {
    Name: '',
    Nota: {},
    NotaDetail: [],
    Customer: {
        FamilyID: [],
        ID: '',
        Name: '',
        Address: '',
        Telp: '',
        CreatedBy: '',
        ListFamily: []
    },
    Action: '',
    Print: {
        z_uang_nominal: 0,
        z_uang_jumlah: 0,
        z_uang_total: 0,
        z_beras_nominal: 0,
        z_beras_jumlah: 0,
        z_beras_total: 0,
        z_maal: 0,
        z_niaga: 0,
        f_uang_nominal: 0,
        f_uang_jumlah: 0,
        f_uang_total: 0,
        f_beras_nominal: 0,
        f_beras_jumlah: 0,
        f_beras_total: 0,
        infaq: 0,
        i_pembangunan: 0
    },
    Token: Token.get()
};

function PopulateData() {
    
    Data.Customer.Name = $('#Nama').val();
    Data.Customer.Address = $('#Address').val();
    Data.Customer.Telp = $('#Telp').val();

    var lastNumber = $('#listFamily input').length;
    for (var i = 1; i <= lastNumber; i++) {
        var input = $('#Family' + i + '');
        var list = { ID: input.attr('data-id'), FamilyName: input.val() };
        if (typeof (input.val()) != 'undefined' && input.val() != "") {
            Data.Customer.ListFamily.push(list);
        }
    }
    var tagFamz = '';
    for (var i = 0; i < Data.Customer.ListFamily.length; i++) {
        tagFamz = tagFamz + '<li>' + Data.Customer.ListFamily[i].FamilyName + '</li>';
    }
    $('#newFamily').html('');
    $('#newFamily').append(tagFamz + '</ol>');

    var zu = {
        TypeOfZakatID: '',
        Jumlah: '',
        Nominal: '',
        Total: ''
    }
    var zb = Object.assign({}, zu), zm = Object.assign({}, zu), zn = Object.assign({}, zu), fu = Object.assign({}, zu), fb = Object.assign({}, zu), infaq = Object.assign({}, zu), ib = Object.assign({}, zu);
    if ($('#zakat_uang').val()) {
        zu.TypeOfZakatID = $('#zakat_uang_id').val();
        zu.Jumlah = ($('#jml_zakat_uang').val() == '' || $('#jml_zakat_uang').val() == 0) ? 1 : $('#jml_zakat_uang').val();
        zu.Total = convertToAngka($('#zakat_uang').val());
        zu.Nominal = Number(zu.Total) / Number(zu.Jumlah);
        zu.Nominal = zu.Nominal.toFixed(2);
        Data.NotaDetail.push(zu);
        Data.Print.z_uang_nominal = zu.Nominal;
        Data.Print.z_uang_jumlah = zu.Jumlah;
        Data.Print.z_uang_total = zu.Total;
    }

    if ($('#zakat_beras').val()) {
        zb.TypeOfZakatID = $('#zakat_beras_id').val();
        zb.Jumlah = ($('#jml_zakat_beras').val() == '' || $('#jml_zakat_beras').val() == 0) ? 1 : $('#jml_zakat_beras').val();
        zb.Total = $('#zakat_beras').val();
        zb.Nominal = Number(zb.Total) / Number(zb.Jumlah);
        zb.Nominal = zb.Nominal.toFixed(2);
        Data.NotaDetail.push(zb);
        Data.Print.z_beras_nominal = zb.Nominal;
        Data.Print.z_beras_jumlah = zb.Jumlah;
        Data.Print.z_beras_total = zb.Total;
    }

    if ($('#zakat_maal').val()) {
        zm.TypeOfZakatID = $('#zakat_maal_id').val();
        zm.Jumlah = 1;
        zm.Total = convertToAngka($('#zakat_maal').val());
        zm.Nominal = Number(zm.Total) / Number(zm.Jumlah);
        Data.NotaDetail.push(zm);
        Data.Print.z_maal = zm.Total;
    }

    if ($('#zakat_niaga').val()) {
        zn.TypeOfZakatID = $('#zakat_niaga_id').val();
        zn.Jumlah = 1;
        zn.Total = convertToAngka($('#zakat_niaga').val());
        zn.Nominal = Number(zn.Total) / Number(zn.Jumlah);
        Data.NotaDetail.push(zn);
        Data.Print.z_niaga = zn.Total;
    }

    if ($('#fidyah_uang').val()) {
        fu.TypeOfZakatID = $('#fidyah_uang_id').val();
        fu.Jumlah = ($('#jml_fidyah_uang').val() == '' || $('#jml_fidyah_uang').val() == 0) ? 1 : $('#jml_fidyah_uang').val();
        fu.Total = convertToAngka($('#fidyah_uang').val());
        fu.Nominal = Number(fu.Total) / Number(fu.Jumlah);
        fu.Nominal = fu.Nominal.toFixed(2);
        Data.NotaDetail.push(fu);
        Data.Print.f_uang_nominal = fu.Nominal;
        Data.Print.f_uang_jumlah = fu.Jumlah;
        Data.Print.f_uang_total = fu.Total;
    }

    if ($('#fidyah_beras').val()) {
        fb.TypeOfZakatID = $('#fidyah_beras_id').val();
        fb.Jumlah = ($('#jml_fidyah_beras').val() == '' || $('#jml_fidyah_beras').val() == 0) ? 1 : $('#jml_fidyah_beras').val();
        fb.Total = $('#fidyah_beras').val();
        fb.Nominal = Number(fb.Total) / Number(fb.Jumlah);
        fb.Nominal = fb.Nominal.toFixed(2);
        Data.NotaDetail.push(fb);
        Data.Print.f_beras_nominal = fb.Nominal;
        Data.Print.f_beras_jumlah = fb.Jumlah;
        Data.Print.f_beras_total = fb.Total;
    }

    if ($('#infaq').val()) {
        infaq.TypeOfZakatID = $('#infaq_id').val();
        infaq.Jumlah = 1;
        infaq.Total = convertToAngka($('#infaq').val());
        infaq.Nominal = Number(infaq.Total) / Number(infaq.Jumlah);
        Data.NotaDetail.push(infaq);
        Data.Print.infaq = infaq.Total;
    }

    if ($('#infaq_bangunan').val()) {
        ib.TypeOfZakatID = $('#infaq_bangunan_id').val();
        ib.Jumlah = 1;
        ib.Total = convertToAngka($('#infaq_bangunan').val());
        ib.Nominal = Number(ib.Total) / Number(ib.Jumlah);
        Data.NotaDetail.push(ib);
        Data.Print.i_pembangunan = ib.Total;
    }
}

function Submit() {
    LoadingMask.show();
    PopulateData();
    if (ValidateOnSubmit()) {
        RenderPrint();
        $.ajax({
            type: "POST",
            url: API + "Zakat?submit=true",
            data: Data,
            success: function (response) {
                if (response.IsSuccess) {
                    Data.Name = response.Name;
                    $('#i_admin').append(Data.Name);
                    $('#NoNota').append(response.NotaCode);
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

function RenderPrint() {

    var total_nominal = Number(Data.Print.z_uang_total) + Number(Data.Print.f_uang_total) + Number(Data.Print.z_maal) + Number(Data.Print.infaq) + Number(Data.Print.i_pembangunan);
    var ListFamily = Data.Customer.ListFamily;
    var tagFamz = "<ol style='margin-top: -14px; margin-left: 41px;'><li>" + Data.Customer.Name + "</li>";
    
    for (var i = 0; i < ListFamily.length; i++) {
        tagFamz += '<li>' + ListFamily[i].FamilyName + '</li>';
    }
    var i_admin = (CheckObj.isEmptyNullOrUndefined(Data.Customer.CreatedBy)) ? Data.Name : Data.Customer.CreatedBy;
    $('#i_user').append(Data.Customer.Name);
    $('#i_admin').append(i_admin);

    $('#i_nama').append(tagFamz + "</ol>");
    $('#i_alamat').append(Data.Customer.Address);
    $('#i_tlp').append(Data.Customer.Telp);

    $('#z_uang_nominal').append(convertToRupiah(Math.floor(Data.Print.z_uang_nominal)));
    $('#z_uang_jumlah').append(Data.Print.z_uang_jumlah);
    $('#z_uang_total').append(convertToRupiah(Data.Print.z_uang_total));

    $('#z_beras_nominal').append(Data.Print.z_beras_nominal + ' kg');
    $('#z_beras_jumlah').append(Data.Print.z_beras_jumlah);
    $('#z_beras_total').append(Data.Print.z_beras_total + ' kg');

    $('#z_maal').append(convertToRupiah(Data.Print.z_maal));
    $('#z_niaga').append(convertToRupiah(Data.Print.z_niaga));

    $('#f_uang_nominal').append(convertToRupiah(Math.floor(Data.Print.f_uang_nominal)));
    $('#f_uang_jumlah').append(Data.Print.f_uang_jumlah);
    $('#f_uang_total').append(convertToRupiah(Data.Print.f_uang_total));

    $('#f_beras_nominal').append(Data.Print.f_beras_nominal + ' kg');
    $('#f_beras_jumlah').append(Data.Print.f_beras_jumlah);
    $('#f_beras_total').append(Data.Print.f_beras_total + ' kg');

    $('#i_infaq').append(convertToRupiah(Data.Print.infaq));
    $('#i_pembangunan').append(convertToRupiah(Data.Print.i_pembangunan));
    $('#terbilang').append(terbilang(total_nominal + '') + ' rupiah');
}

function GetTypeOfZakat() {
    $.ajax({
        type: "POST",
        url: API + "Zakat?getTypeOfZakat=true",
        data: { Token: Token.get() },
        success: function (response) {
            if (response.IsSuccess) {
                var ListType = response.ListType;
                for (var i = 0; i < ListType.length; i++) {
                    switch (ListType[i].Name) {
                        case "Zakat Fitrah (uang)":
                            $('#zakat_uang_id').val(ListType[i].ID);
                            break;
                        case "Zakat Fitrah (beras)":
                            $('#zakat_beras_id').val(ListType[i].ID);
                            break;
                        case "Zakat Maal":
                            $('#zakat_maal_id').val(ListType[i].ID);
                            break;
                        case "Zakat Perniagaan":
                            $('#zakat_niaga_id').val(ListType[i].ID);
                            break;
                        case "Fidyah (uang)":
                            $('#fidyah_uang_id').val(ListType[i].ID);
                            break;
                        case "Fidyah (beras)":
                            $('#fidyah_beras_id').val(ListType[i].ID);
                            break;
                        case "Infaq / Shadaqah":
                            $('#infaq_id').val(ListType[i].ID);
                            break;
                        case "Infaq Pembangunan":
                            $('#infaq_bangunan_id').val(ListType[i].ID);
                            break;
                        default:
                    }
                }
                LoadingMask.hide();
            } else {
                LoadingMask.hide();
                swal(
                    'Failed',
                    response.Message,
                    'error'
                ).then(() => {
                    Redirect.toLoginPage();
                });
            }
        }
    });
}