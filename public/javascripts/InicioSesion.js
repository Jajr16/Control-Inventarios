localStorage.clear();
        console.log(localStorage.getItem("token"));
        var socket = io.connect("http://192.168.1.66:3000");
        const InicioSesion = document.querySelector("#Formulario");

        InicioSesion.addEventListener('submit', (e) => {
            e.preventDefault();
            if ($("#Nombre").val() != "" && $("#Contrasena").val() != "") {

                socket.emit('LG', { User: $("#Nombre").val(), Pass: $("#Contrasena").val() });

                socket.on('logInOK', function (Respuesta) {
                    // Usuario autenticado correctamente, guardar el token en localStorage
                    localStorage.setItem('token', Respuesta.token);//Guardamos el token de sesión localmente
                    location.href = "/users/index";
                });

                socket.on('logInError', (Respuesta) => {
                    // Mostrar el mensaje de error correspondiente
                    alert(Respuesta.mensaje);
                    location.href = "/";
                });
            }

        });