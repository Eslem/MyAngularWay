/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var baseurl = window.location.pathname;
var user = null;

function login(elem) {
    // alert();
    $("#logo").addClass("flip");

    var data = $("#loginForm").serialize();
    console.log(data);
    setTimeout(function () {
        $.ajax({
            url: "../server/controller/administradorController.php",
            data: data,
            type: "POST",
            success: function (data) {
                console.log(data);
                if (data === "false") {
                    showError("Error en usuario o contraseña");
                } else {
                    user = data;
                }
                $("#logo").removeClass("flip");
            },
            error: function (data) {
                $("#logo").removeClass("flip");
                showError(data);
            }
        });
    }, 1000);
}

function showError(text) {
    $("#error").slideDown("slow");
    $("#error").text(text);
    setTimeout(function () {
        $("#error").slideUp();
    }, 3000);

}

