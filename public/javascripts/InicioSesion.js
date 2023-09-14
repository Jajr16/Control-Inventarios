// Limpiar el almacenamiento local
localStorage.clear();
console.log(localStorage.getItem("token"));

// Conectar con el servidor mediante socket.io
var socket = io.connect("http://localhost:3001");

// Obtener el formulario de inicio de sesión por su ID
const InicioSesion = document.querySelector("#Formulario");

// Agregar un evento al formulario cuando se envía
InicioSesion.addEventListener('submit', (e) => {
    e.preventDefault();
    // Verificar si los campos de nombre y contraseña no están vacíos
    if ($("#Nombre").val() != "" && $("#Contrasena").val() != "") {

        // Emitir un evento 'LG' al servidor con los datos del usuario
        socket.emit('LG', { User: $("#Nombre").val(), Pass: $("#Contrasena").val() });

        // Escuchar la respuesta del servidor cuando el inicio de sesión es exitoso
        socket.on('logInOK', function (Respuesta) {
            // Usuario autenticado correctamente, guardar el nombre de usuario y los permisos en localStorage
            localStorage.setItem('user', Respuesta.Usuario);
            localStorage.setItem('permisosModulos', JSON.stringify(Respuesta.permisosModulos)); // Guardar el objeto completo
            console.log(Respuesta.permisosModulos);
            // Redirigir a la página de inicio de sesión exitosa
            location.href = "/users/index";
        });

        // Escuchar la respuesta del servidor cuando el inicio de sesión falla
        socket.on('logInError', (Respuesta) => {
            // Mostrar el mensaje de error correspondiente
            alert(Respuesta.mensaje);
            // Redirigir de vuelta a la página de inicio de sesión
            location.href = "/";
        });
    }
});
