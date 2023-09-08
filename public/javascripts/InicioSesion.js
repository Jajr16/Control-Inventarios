localStorage.clear();
        console.log(localStorage.getItem("token"));
        var socket = io.connect("http://localhost:3001");
        const InicioSesion = document.querySelector("#Formulario");

        InicioSesion.addEventListener('submit', (e) => {
            e.preventDefault();
            if ($("#Nombre").val() != "" && $("#Contrasena").val() != "") {

                socket.emit('LG', { User: $("#Nombre").val(), Pass: $("#Contrasena").val() });

                socket.on('logInOK', function (Respuesta) {
                    // Usuario autenticado correctamente, guardar el token en localStorage
                    localStorage.setItem('user', Respuesta.Usuario);
                    localStorage.setItem('permisosModulos', JSON.stringify(Respuesta.permisosModulos)); // Guardar el objeto completo
                    console.log(Respuesta.permisosModulos);
                    location.href = "/users/index";
                });

                socket.on('logInError', (Respuesta) => {
                    // Mostrar el mensaje de error correspondiente
                    alert(Respuesta.mensaje);
                    location.href = "/";
                });
            }

        });