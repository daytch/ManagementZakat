(function ($) {
    /*
    ZakatCalc (c) Al Farisi & Indokreatif Teknologi
    Website :
    - http://indokreatif.net
    - https://github.com/alfarisi/zakatcalc
    - http://alfarisi.web.id
    */


    $.ajax({
        url: API + "Kalkulator?GetEmas=true",
        type: "POST",
        data: { Token: Token.get() },
        success: function (response) {
            if (response.IsSuccess) {
                $('#harga_emas').val(convertToRupiah(response.Emas));
                $('#harga_emas').attr("disabled", true);
                $('#harga_perak').val(convertToRupiah(response.Perak));
                $('#harga_perak').attr("disabled", true);
                $('#harga_emas_uang').val(convertToRupiah(response.Emas));
                $('#harga_emas_uang').attr("disabled", true);
                nisab_emas_uang();
                zc_mal_hitung();
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
                swal(
                    'Failed',
                    response.Message,
                    'error'
                );
            }
        }
    });

    validasiAngka = function (field) {
        var Char;
        var sudahkoma = false;
        var belakangkoma = 2;
        var k = 1;
        Char = "";
        for (i = 0; i < (field.value.length); i++) {
            if (isNaN(field.value.charAt(i)) && field.value.charAt(i) != '.' && field.value.charAt(i) != ',') {
                break;
            } else {
                if (sudahkoma == true) {
                    if (field.value.charAt(i) == '.' || k > belakangkoma) {
                        break;
                    }
                    k++;
                }
                if (field.value.charAt(i) == ',') {
                    sudahkoma = true;
                }
                Char = Char + field.value.charAt(i);
            }
        }
        field.value = Char;
    }

    validasi_float = function (num) {
        numfloat = parseFloat(Number(num)).toFixed(2);
        if (isNaN(numfloat)) {
            numfloat = 0.00;
        }
        return numfloat;
    }

    nisab_emas = function () {
        harga = $('#harga_emas').val();
        harga = parseFloat(Number(harga)).toFixed(2);

        nisab = 85 * harga;
        $('#nisab_emas_float').val(nisab);

        nisab = parseFloat(Number(nisab)).toFixed(2);
        $('#nisab_emas').val(nisab);
    }

    nisab_emas_uang = function () {
        
        harga = convertToAngka($('#harga_emas_uang').val());
        harga = Number(harga);

        nisab = 85 * harga;
        $('#nisab_emas_uang_float').val(nisab);

        nisab = Number(nisab);
        $('#nisab_emas_uang').val(convertToRupiah(nisab));
    }

    nisab_emas_niaga = function () {
        harga = $('#harga_emas_niaga').val();
        harga = parseFloat(Number(harga)).toFixed(2);

        nisab = 85 * harga;
        $('#nisab_emas_niaga_float').val(nisab);

        nisab = parseFloat(Number(nisab)).toFixed(2);
        $('#nisab_emas_niaga').val(nisab);
    }

    nisab_beras = function () {
        harga = $('#harga_beras').val();
        harga = parseFloat(Number(harga)).toFixed(2);

        nisab = 524 * harga;
        $('#nisab_beras_float').val(nisab);

        nisab = parseFloat(Number(nisab)).toFixed(2);
        $('#nisab_beras').val(nisab);
    }

    nisab_gabah = function () {
        harga = $('#harga_gabah').val();
        harga = parseFloat(Number(harga)).toFixed(2);

        nisab = 653 * harga;
        $('#nisab_gabah_float').val(nisab);

        nisab = parseFloat(Number(nisab)).toFixed(2);
        $('#nisab_gabah').val(nisab);
    }

    /* zakat mal */
    zc_mal_total_pendapatan_jasa = function () {
        pendapatan = $('#pendapatan').val();
        jasa = $('#jasa').val();

        pendapatan = parseFloat(Number(pendapatan)).toFixed(2);
        jasa = parseFloat(Number(jasa)).toFixed(2);

        total_pendapatan_jasa = pendapatan + jasa;
        $('#total_pendapatan_jasa_float').val(total_pendapatan_jasa);

        total_pendapatan_jasa = parseFloat(Number(total_pendapatan_jasa)).toFixed(2);
        $('#total_pendapatan_jasa').val(total_pendapatan_jasa);

        zc_pendapatan_jasa_hitung();
    }

    zc_pendapatan_jasa_hitung = function () {
        nisab = $('#nisab_beras_float').val();
        pendapatan_jasa = $('#total_pendapatan_jasa_float').val();

        nisab = validasi_float(nisab);
        pendapatan_jasa = validasi_float(pendapatan_jasa);


        if (pendapatan_jasa >= nisab) {
            zakat = 0.025 * pendapatan_jasa;
            $('#ket_pendapatan_jasa').html('Pendapatan dan Jasa SUDAH mencapai nishab. Dikenakan KEWAJIBAN ZAKAT.');
        } else {
            zakat = 0.00;
            $('#ket_pendapatan_jasa').html('Pendapatan dan Jasa BELUM mencapai nishab. Tidak dikenai kewajiban zakat.');
        }

        $('#zakat_pendapatan_jasa').val(parseFloat(Number(zakat)).toFixed(2));
    }

    zc_mal_total_harta = function () {
        uang_tabungan = $('#uang_tabungan').val();
        saham = $('#saham').val();
        piutang = $('#piutang').val();

        uang_tabungan =  Number(uang_tabungan);
        saham =  Number(saham);
        piutang =  Number(piutang);

        total_harta = uang_tabungan + saham + piutang;
        $('#total_harta_float').val(total_harta);

        total_harta = Number(total_harta);
        $('#total_harta').val(convertToRupiah(total_harta));

        zc_mal_hitung();
    }

    zc_mal_total_kewajiban = function () {
        hutang = $('#hutang').val();
        hutang = parseFloat(Number(hutang)).toFixed(2);

        total_kewajiban = hutang;
        $('#total_kewajiban_float').val(total_kewajiban);

        total_kewajiban = Number(total_kewajiban);
        $('#total_kewajiban').val(convertToRupiah(total_kewajiban));

        zc_mal_hitung();
    }

    zc_mal_hitung = function () {
        debugger;
        nisab = convertToAngka($('#nisab_emas_uang').val());
        harta = convertToAngka($('#total_harta').val());
        kewajiban = convertToAngka($('#total_kewajiban').val());
        
        selisih_harta = Number(harta) - Number(kewajiban);
        selisih_harta = (selisih_harta < 0) ? 0 : selisih_harta;
        $('#selisih_harta').val(convertToRupiah(selisih_harta));

        if (selisih_harta >= nisab) {
            zakat = 0.025 * selisih_harta;
            $('#ket_mal').html('Harta SUDAH mencapai nishab. Dikenakan KEWAJIBAN ZAKAT.');
        } else {
            zakat = 0.00;
            $('#ket_mal').html('Harta BELUM mencapai nishab. Tidak dikenai kewajiban zakat.');
        }

        $('#zakat_harta').val(convertToRupiah(zakat));
    }

    /* zakat perdagangan */
    zc_dagang_total_harta = function () {
        uang = $('#uang_dagang').val();
        stok = $('#stok_dagang').val();
        piutang = $('#piutang_dagang').val();

        uang = parseFloat(Number(uang)).toFixed(2);
        stok = parseFloat(Number(stok)).toFixed(2);
        piutang = parseFloat(Number(piutang)).toFixed(2);

        total_harta_dagang = uang + stok + piutang;
        $('#total_harta_dagang_float').val(total_harta_dagang);
        $('#total_harta_dagang').val(parseFloat(Number(total_harta_dagang)).toFixed(2));

        zc_dagang_hitung();
    }

    zc_dagang_total_kewajiban = function () {
        hutang = $('#hutang_dagang').val();
        hutang = parseFloat(Number(hutang)).toFixed(2);

        biaya = $('#biaya_dagang').val();
        biaya = parseFloat(Number(biaya)).toFixed(2);

        kewajiban = hutang + biaya;

        $('#total_kewajiban_dagang_float').val(kewajiban);
        $('#total_kewajiban_dagang').val(parseFloat(Number(kewajiban)).toFixed(2));

        zc_dagang_hitung();
    }

    zc_dagang_hitung = function () {
        nisab = $('#nisab_emas_float').val();
        harta = $('#total_harta_dagang_float').val();
        kewajiban = $('#total_kewajiban_dagang_float').val();

        nisab = validasi_float(nisab);

        harta = validasi_float(harta);
        kewajiban = validasi_float(kewajiban);

        selisih_harta = harta - kewajiban;
        $('#selisih_harta_dagang').val(parseFloat(Number(selisih_harta)).toFixed(2));

        if (selisih_harta >= nisab) {
            zakat = 0.025 * selisih_harta;
            $('#ket_dagang').html('Harta SUDAH mencapai nishab. Dikenakan KEWAJIBAN ZAKAT.');
        } else {
            zakat = 0.00;
            $('#ket_dagang').html('Harta BELUM mencapai nishab. Tidak dikenai kewajiban zakat.');
        }

        $('#zakat_dagang').val(parseFloat(Number(zakat)).toFixed(2));
    }

    /* zakat temuan */
    zc_harta_temuan = function () {
        harta = $('#harta').val();
        harta = parseFloat(Number(harta)).toFixed(2);

        if (harta > 0) {
            zakat = 0.2 * harta;
        } else {
            zakat = 0.00;
        }

        $('#zakat_temuan').val(parseFloat(Number(zakat)).toFixed(2));
    }

    /* zakat ternak */
    zc_ternak_kambing = function () {
        kambing = $('#kambing').val();
        kambing = parseFloat(Number(kambing)).toFixed(2);

        if (kambing < 5) {
            $('#zakat_kambing').val('0');
            $('#keterangan_kambing').html('Kambing BELUM mencapai nishab. Tidak dikenakan kewajiban zakat.');
            return 1;
        } else if (kambing < 10) {
            $('#zakat_kambing').val('1');
        } else if (kambing < 15) {
            $('#zakat_kambing').val('2');
        } else if (kambing < 20) {
            $('#zakat_kambing').val('3');
        } else {
            $('#zakat_kambing').val('4');
            /*zakat = kambing / 100;
            zakat = Math.ceil(zakat);
            $('#zakat_kambing').val(zakat);*/
        }

        $('#keterangan_kambing').html('Kambing SUDAH mencapai nishab. Dikenakan KEWAJIBAN ZAKAT.');
    }
    zc_ternak_sapi = function () {
        sapi_jantan = $('#sapi_jantan').val();
        sapi_betina = $('#sapi_betina').val();
        sapi_jantan = parseFloat(Number(sapi_jantan)).toFixed(2);
        sapi_betina = parseFloat(Number(sapi_betina)).toFixed(2);
        sapi = sapi_jantan + sapi_betina;
        $('#label_sapi_jantan').html('Zakat Anak Sapi Jantan');
        if (sapi < 30) {
            $('#zakat_sapi_jantan').val('0');
            $('#zakat_sapi_betina').val('0');
            $('#keterangan_sapi').html('Sapi BELUM mencapai nishab. Tidak dikenakan kewajiban zakat.');
            return 1;
        } else if (sapi < 60) {
            $('#zakat_sapi_jantan').val('0');
            $('#zakat_sapi_betina').val('1');
        } else if (sapi < 70) {
            $('#zakat_sapi_jantan').val('2');
            $('#zakat_sapi_betina').val('0');
        } else if (sapi < 80) {
            $('#zakat_sapi_jantan').val('1');
            $('#zakat_sapi_betina').val('1');
        } else if (sapi < 90) {
            $('#zakat_sapi_jantan').val('0');
            $('#zakat_sapi_betina').val('2');
        } else if (sapi < 100) {
            $('#zakat_sapi_jantan').val('3');
            $('#zakat_sapi_betina').val('0');
        } else if (sapi < 120) {
            $('#zakat_sapi_jantan').val('1');
            $('#zakat_sapi_betina').val('2');
        } else {
            $('#zakat_sapi_jantan').val('3');
            $('#zakat_sapi_betina').val('3');
            $('#label_sapi_jantan').html('<tanda>atau</tanda> Zakat Anak Sapi Jantan');
        }

        $('#keterangan_sapi').html('Sapi SUDAH mencapai nishab. Dikenakan KEWAJIBAN ZAKAT.');
    }


    /* zakat emas dan perak */
    zc_emas_perak = function () {
         
        emas = $('#emas').val();
        emas = parseFloat(Number(emas));

        if (emas < 85) {
            zakat_emas = 0;
            $('#zakat_emas').val(zakat_emas);
        } else {
            zakat_emas = 0.025 * emas;
            $('#zakat_emas').val(parseFloat(Number(zakat_emas)).toFixed(2));
        }

        perak = $('#perak').val();
        perak = parseFloat(Number(perak));

        if (perak < 595) {
            zakat_perak = 0;
            $('#zakat_perak').val(zakat_perak);
        } else {
            zakat_perak = 0.025 * perak;
            $('#zakat_perak').val(parseFloat(Number(zakat_perak)).toFixed(2));
        }

        harga_emas = parseFloat(convertToAngka($('#harga_emas').val()));
        harga_perak = parseFloat(convertToAngka($('#harga_perak').val()));

        zakat_emas_uang = zakat_emas * harga_emas;
        zakat_perak_uang = zakat_perak * harga_perak;
        zakat_total_uang = zakat_emas_uang + zakat_perak_uang;

        $('#zakat_emas_uang').val(convertToRupiah(zakat_emas_uang));
        $('#zakat_perak_uang').val(convertToRupiah(zakat_perak_uang));
        $('#zakat_total_uang').val(convertToRupiah(zakat_total_uang));
    }


    /* zakat pertanian */
    zc_pertanian = function () {
        panen = $('#panen').val();
        panen = parseFloat(Number(panen)).toFixed(2);

        if (panen < 653) {
            $('#zakat').val('0');
            $('#keterangan').html('Hasil panen BELUM mencapai nishab. Tidak dikenakan kewajiban zakat.');
        } else {
            persen_zakat = $('#persen_zakat').val();
            persen_zakat = validasi_float(persen_zakat);

            zakat = persen_zakat * panen;
            $('#zakat').val(parseFloat(Number(zakat)).toFixed(2));
            $('#keterangan').html('Hasil panen SUDAH mencapai nishab. Dikenakan KEWAJIBAN ZAKAT.');
        }
    }

})(jQuery);