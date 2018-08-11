//axios.defaults.headers.common['Authorization'] = 'pToken ' + $('meta[name="jwt_token"]').attr('content')

$(document).ready(function () {
    WarningNotif("Login first", { pos: NOTIF_BOTTOM_CENTER });

    $('#login_form').on('submit', function (e) {
        e.preventDefault()
        var form = $(this).get(0);
        var formData = $(this).serialize();

        console.log(formData);
        ajaxPostWeb('/auth/login/', formData, function (response) {
            if (response) {
                if (response.Success) {
                    SuccessNotif(response.Message, { pos: NOTIF_BOTTOM_CENTER })
                    window.location = WEB + '/Home/Index'
                } else {
                    DangerNotif(response.Message, { pos: NOTIF_BOTTOM_CENTER });
                }
            }
        })
        //ajaxGetApi('/auth/login', {
        //    username: $('#username').val(),
        //    password: $('#password').val()
        //}, function (response) {
        //    response = parseJson(response);
        //    //response = response.data            
        //    console.log(response);
        //    if (response.Success == true) {
        //        localStorage.setItem("TOKEN", response.JwtCode);
        //        console.log(localStorage.getItem("TOKEN"))
        //        var apiToken = response.JwtCode;
        //        SuccessNotif(response.Message, { pos: NOTIF_BOTTOM_CENTER })

        //        setTimeout(function () {
        //            ajaxGetWeb('/auth/savesession/' + apiToken, {},function (response) {
        //                console.log(response);
        //                 window.location = WEB + '/Home/Index'
        //            });
        //        }, 1000)
        //    } else {
        //        DangerNotif(response.Message, { pos: NOTIF_BOTTOM_CENTER });
        //    }
        //})

    })
})
