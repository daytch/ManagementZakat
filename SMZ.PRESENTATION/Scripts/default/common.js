function convertToRupiah(angka) {
    var rupiah = '';
    var angkarev = angka.toString().split('').reverse().join('');
    for (var i = 0; i < angkarev.length; i++) if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + '.';
    return 'Rp. ' + rupiah.split('', rupiah.length - 1).reverse().join('');
}

function convertToAngka(rupiah) {
    return Number(rupiah.replace(/[^0-9]/g, ''));
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function DisableInput(obj, state) {
    if (Array.isArray(obj)) {
        $.each(obj, function (index, value) {
            if (state) {
                $('#' + value + '').attr("readonly", "readonly");
            } else {
                $('#' + value + '').removeAttr("readonly");
            }
        })
    } else {
        if (state) {
            $('#' + obj + '').attr("readonly", "readonly");
        } else {
            $('#' + obj + '').removeAttr("readonly");
        }
    }
}

function HideAll(obj, state) {
    if (Array.isArray(obj)) {
        $.each(obj, function (index, value) {
            if (state) {
                $('#' + value + '').hide();
            } else {
                $('#' + value + '').show();
            }
        })
    } else {
        if (state) {
            $('#' + obj + '').hide();
        } else {
            $('#' + obj + '').show();
        }
    }
}

post_to_url = function (path, params, method) {
    method = method || "post";

    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for (var key in params) {
        if (params.hasOwnProperty(key) && params[key] != null) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}

/*--------------------------------------------------*/
/*                 Loading Mask                     */
/*--------------------------------------------------*/
LoadingMask = {
    show: function () {
        $('#dloader').show();
    },
    hide: function () {
        $('#dloader').hide();
    }
}

function Logout() {    
    Token.delete();
    Redirect.toLoginPage();
}

/*--------------------------------------------------*/
/*                      Token                       */
/*--------------------------------------------------*/
Token = {
    get: function () {
        let token = window.localStorage.getItem('token');
        return token;
    },
    save: function (token) {
        window.localStorage.setItem('token', token);
    },
    isAny: function () {
        let token = window.localStorage.getItem('token') ? true : false;
        return token;
    },
    delete: function () {
        window.localStorage.removeItem('token');
    }
}


/*--------------------------------------------------*/
/*                   Redirect                       */
/*--------------------------------------------------*/
Redirect = {
    toLoginPage: function () {
        window.location = UI + "Login/index";
    },
    toHomePage: function () {
        window.location.href = UI + "Transaksi/";
    }
}


/*--------------------------------------------------*/
/*                   Terbilang                      */
/*--------------------------------------------------*/
var daftarAngka = new Array("", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan");

function terbilang(nilai) {
    var temp = '';
    var hasilBagi, sisaBagi;
    //batas untuk ribuan
    var batas = 3;
    //untuk menentukan ukuran array, jumlahnya sesuaikan dengan jumlah anggota dari array gradeNilai[]
    var maxBagian = 5;
    var gradeNilai = new Array("", "ribu", "juta", "milyar", "triliun");
    //cek apakah ada angka 0 didepan ==> 00098, harus diubah menjadi 98
    
    nilai = this.hapusNolDiDepan(nilai);
    var nilaiTemp = ubahStringKeArray(batas, maxBagian, nilai);
    //ubah menjadi bentuk terbilang
    var j = nilai.length;
    //menentukan batas array
    var banyakBagian = (j % batas) == 0 ? (j / batas) : Math.round(j / batas + 0.5);
    var h = 0;
    for (var i = banyakBagian - 1; i >= 0; i--) {
        var nilaiSementara = parseInt(nilaiTemp[h]);
        if (nilaiSementara == 1 && i == 1) {
            temp += "seribu ";
        } else {
            temp += this.ubahRatusanKeHuruf(nilaiTemp[h]) + " ";
            // cek apakah string bernilai 000, maka jangan tambahkan gradeNilai[i]
            if (nilaiTemp[h] != "000") {
                temp += gradeNilai[i] + " ";
            }
        }
        h++;
    }
    return temp;
}

function ubahStringKeArray(batas, maxBagian, kata) {
    // maksimal 999 milyar
    var temp = new Array(maxBagian);
    var j = kata.length;
    //menentukan batas array
    var banyakBagian = (j % batas) == 0 ? (j / batas) : Math.round(j / batas + 0.5);
    for (var i = banyakBagian - 1; i >= 0; i--) {
        var k = j - batas;
        if (k < 0) k = 0;
        temp[i] = kata.substring(k, j);
        j = k;
        if (j == 0)
            break;
    }
    return temp;
}

function ubahRatusanKeHuruf(nilai) {
    //maksimal 3 karakter 
    var batas = 2;
    //membagi string menjadi 2 bagian, misal 123 ==> 1 dan 23
    var maxBagian = 2;
    var temp = this.ubahStringKeArray(batas, maxBagian, nilai);
    var j = nilai.length;
    var hasil = "";
    //menentukan batas array
    var banyakBagian = (j % batas) == 0 ? (j / batas) : Math.round(j / batas + 0.5);
    for (var i = 0; i < banyakBagian; i++) {
        //cek string yang memiliki panjang lebih dari satu ==> belasan atau puluhan
        if (temp[i].length > 1) {
            //cek untuk yang bernilai belasan ==> angka pertama 1 dan angka kedua 0 - 9, seperti 11,16 dst
            if (temp[i].charAt(0) == '1') {
                if (temp[i].charAt(1) == '1') {
                    hasil += "sebelas";
                } else if (temp[i].charAt(1) == '0') {
                    hasil += "sepuluh";
                } else hasil += daftarAngka[temp[i].charAt(1) - '0'] + " belas ";
            }
            //cek untuk string dengan format angka  pertama 0 ==> 09,05 dst
            else if (temp[i].charAt(0) == '0') {
                hasil += daftarAngka[temp[i].charAt(1) - '0'];
            }
            //cek string dengan format selain angka pertama 0 atau 1
            else
                hasil += daftarAngka[temp[i].charAt(0) - '0'] + " puluh " + daftarAngka[temp[i].charAt(1) - '0'];
        } else {
            //cek string yang memiliki panjang = 1 dan berada pada posisi ratusan
            if (i == 0 && banyakBagian != 1) {
                if (temp[i].charAt(0) == '1')
                    hasil += " seratus ";
                else if (temp[i].charAt(0) == '0')
                    hasil += " ";
                else hasil += daftarAngka[parseInt(temp[i])] + " ratus ";
            }
            //string dengan panjang satu dan tidak berada pada posisi ratusan ==> satuan
            else hasil += daftarAngka[parseInt(temp[i])];
        }
    }
    return hasil;
}


/*--------------------------------------------------*/
/*          Variable/Object Type Utilities          */
/*--------------------------------------------------*/
var CheckObj = (function () {
    return {
        /* To check whether a supplied object/variable is an 'Boolea' object or not.
         * Will return 'True' or 'False' as output
         */
        isBoolean: function (obj) { return Object.prototype.toString.call(obj) === '[object Boolean]'; },
        /* To check whether a supplied object/variable is an 'Array' object or not.
         * Will return 'True' or 'False' as output
         */
        isArray: function (obj) { return Object.prototype.toString.call(obj) === '[object Array]'; },
        /* To check whether a supplied object/variable is an 'Empty String' object or not.
         * Will return 'True' or 'False' as output
         */
        isEmpty: function (obj) { if (this.isString(obj)) { return obj.replace(/\s+/g, '') === ''; } return false; },
        /* To check whether a supplied object/variable is a 'String' object or not.
         * Will return 'True' or 'False' as output
         */
        isString: function (obj) { return Object.prototype.toString.call(obj) === '[object String]'; },
        /* To check whether a supplied object/variable is a 'Number' object or not.
         * Will return 'True' or 'False' as output
         */
        isNumber: function (obj) { return Object.prototype.toString.call(obj) === '[object Number]'; },
        /* To check whether a supplied object/variable is a 'Null' object or not.
        * Will return 'True' or 'False' as output
        */
        isNull: function (obj) { return Object.prototype.toString.call(obj) === '[object Null]'; },
        /* To check whether a supplied object/variable is a 'Object' object or not.
         * Will return 'True' or 'False' as output
         */
        isObject: function (obj) { return Object.prototype.toString.call(obj) === '[object Object]'; },
        /* To check whether a supplied object/variable is an 'Undefined' object or not.
         * Will return 'True' or 'False' as output
         */
        isUndefined: function (obj) { return typeof obj === 'undefined'; },

        /* Composite Function */
        /* To check whether a supplied object/variable is an 'Empty String' or 'Null' or 'Undefined' object or not.
         * Will return 'True' or 'False' as output
         */
        isEmptyNullOrUndefined: function (obj) { if (this.isUndefined(obj) || this.isNull(obj) || this.isEmpty(obj)) { return true; } return false; }
    };
})(CheckObj || {});

function hapusNolDiDepan(nilai) {
    while (nilai.indexOf("0") == 0) {
        nilai = nilai.substring(1, nilai.length);
    }
    return nilai;
}