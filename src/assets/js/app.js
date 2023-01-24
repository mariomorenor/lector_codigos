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

    let timeInterval;

    ipcRenderer.on("datos", (event, data) => {
        if (timeInterval) {
            clearInterval(timeInterval)
        }
        try {
            mostrar_datos(data);
            timeInterval = setTimeout(() => {
                limpiar_datos();
            }, 3000)
        } catch (error) {
            console.log("No existen datos")
        }

    });

    ipcRenderer.on("no_data", () => {
        Swal.fire({
            icon: "error",
            title: "Lo sentimos :c",
            text: "No existen datos para la información ingresada",
            timer:2000
        })
    })

    function mostrar_datos(data) {
        nombres.val(data.nombres);
        apellidos.val(data.apellidos);
        cedula.val(data.cedula);
        email.val(data.email);
    }

    function limpiar_datos() {
        nombres.val("");
        apellidos.val("");
        cedula.val("");
        email.val("");
    }

}