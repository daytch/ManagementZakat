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