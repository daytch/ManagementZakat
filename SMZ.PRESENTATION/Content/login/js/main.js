
$(document).ready(function () {
    // Code that uses jQuery's $ can follow here.

    $('#login').click(function (e) {
        var user = $('[name="username"]').val();
        var pass = $('[name="password"]').val();
        if (user != "" && pass != "") {
            e.preventDefault();
            $.busyLoadFull("show", {
                spinner: "cube-grid", // pump, accordion, pulsar, cube, cubes, circle-line, circles, cube-<a href="https://www.jqueryscript.net/tags.php?/grid/">grid</a>
                image: false,
                fontawesome: false, // "fa fa-refresh fa-spin fa-2x fa-fw"
                custom: false, // jQuery Object
                color: "#fff",
                background: "rgba(0, 0, 0, 0.21)",
                maxSize: "50px", // Integer/String only for spinners & images, not fontawesome & custom
                minSize: "20px", // Integer/String only for spinners & images, not fontawesome & custom
                text: false,
                textColor: false, // default is color
                textMargin: ".5rem",
                textPosition: "right", // left, right, top, bottom
                fontSize: "1rem",
                fullScreen: false,
                animation: false, // fade, slide
                animationDuration: "fast",  // String, Integer
                containerClass: "busy-load-container",
                containerItemClass: "busy-load-container-item",
                spinnerClass: "busy-load-spinner",
                textClass: "busy-load-text"
            });
            $.ajax({
                url: API + "Login?login=true",
                method: "POST",
                contentType: "application/x-www-form-urlencoded",
                data: {
                    username: user,
                    password: pass
                },
                success: function (response) {
                    if (response.IsSuccess) {
                        $.busyLoadFull("hide", {});
                        Token.save(response.Token);
                        
                        window.location = UI + "Kalkulator";
                        return false;
                    } else {
                        $.busyLoadFull("hide", {});
                        swal(
                            'Failed',
                            response.Message,
                            'error'
                        );
                        return false;
                    }
                }
            });
            return false;
        } else {
            swal(
                'Failed',
                "Username and Password cannot be empty",
                'error'
            );
            return false;
        }
    })
});