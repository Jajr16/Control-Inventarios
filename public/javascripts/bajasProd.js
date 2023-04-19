console.log(localStorage.getItem("token"));
var socket = io.connect("http://localhost:3000");

var pathname = window.location.pathname;

if (pathname == "/users/consulPro") {

    const borrarProduct = document.querySelector("#BajaProductos");
    // bajas de productos
    borrarProduct.addEventListener("submit", (e) => {
        if ($("#Cod_Barras").val() != "" && $("#NomP").val() != "") {
            
            socket.emit('Bajas_Prod', { CodBarras: $("#Cod_Barras").val(), Producto: $("#NomP").val() });
            
            socket.on('Producto_Eliminado', function (Respuesta) {
                alert(Respuesta.mensaje);
                location.reload();
            });

            socket.on('Producto_Inexistente', function (Respuesta) {
                alert(Respuesta.mensaje);
                location.reload();
            });
        }
    });
}
