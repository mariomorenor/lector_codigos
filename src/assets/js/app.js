window.onload = () => {

    // Declaración de variables
    let bienvenida = $("#bienvenido");
    let socket_message_error = $("#socket_error_message")
    let nombres = $("#nombres");
    let apellidos = $("#apellidos");
    let cedula = $("#cedula");
    let email = $("#email");



    socket_message_error.hide()

    // Animación de Bienvenida
    setInterval(() => {
        if (bienvenida.html().length < 13) {
            bienvenida.html(bienvenida.html() + ".")
        } else {
            bienvenida.html("Bienvenid@")
        }
    }, 500);

}