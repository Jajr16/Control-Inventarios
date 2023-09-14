// Conexión al servidor de Socket.io en el puerto 3001 del localhost
var socket = io.connect("http://localhost:3001");

// Manejo del evento 'SystemError' enviado desde el servidor
socket.on('SystemError', async function(data) {
    // Redireccionar a la página de error en caso de un error del sistema
    location.href = "/ErrorPage";
});
