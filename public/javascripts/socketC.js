var socket = io.connect("http://localhost:3000");
const InicioSesion = document.querySelector("#Formulario");

InicioSesion.addEventListener('submit', (e) => {
    e.preventDefault();
    if ($("#Nombre").val() != "" && $("#Contrasena").val() != "") {

        socket.emit('LG', { User: $("#Nombre").val(), Pass: $("#Contrasena").val() });

        socket.on('LG', function (Respuesta) {

            console.log("Hola: " + Respuesta);

            if (Respuesta.length == 0) {
                alert("Inténtelo de nuevo");
                location.href = "/LogIn";
            } else {

                alert("Redirigiendo...");
                location.href = "/Inicio";
            }
        });
    }
});