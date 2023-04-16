console.log(localStorage.getItem("token"));
var socket = io.connect("http://localhost:3000");

var recentData = undefined;

const FormProduct = document.querySelector("#AltaProductos");

// Altas de productos
FormProduct.addEventListener("submit", (e) => {
    e.preventDefault();
    if ($("#Cod_Barras").val() != "" && $("#FecActu").val() != "" && $("#Categoria").val() != "" && $("#NomP").val() != "" && $("#MarcActi").val() != "" && $("#DescripcionP").val() != "" && $("#Proveedor").val() != "" && $("#NumFact").val() != "" && $("#CantidadP").val() != "" && $("#UnidadP").val() != "" && $("#FecFact").val()) {
        socket.emit('Alta_Prod', { CodBarras: $("#Cod_Barras").val(), FecAct: $("#FecActu").val(), Cate: $("#Categoria").val(), Producto: $("#NomP").val(), Marca: $("#MarcActi").val(), Descripcion: $("#DescripcionP").val(), Proveedor: $("#Proveedor").val(), NumFactura: $("#NumFact").val(), FechaFac: $("#FecFact").val(), Cantidad: $("#CantidadP").val(), Unidad: $("#UnidadP").val() });

        socket.on('Producto_Existente', function (Respuesta) {
            alert(Respuesta.mensaje);
            location.reload();
        });

        socket.on('Producto_Inexistente', function (Respuesta) {
            alert(Respuesta.mensaje);
            location.reload();
        });
    }
});
