var socket = io.connect("http://localhost:3001");

socket.on('SystemError', async function(data) {
    location.href = "/ErrorPage";
});