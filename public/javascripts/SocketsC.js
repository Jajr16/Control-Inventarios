console.log(localStorage.getItem("token"));
var socket = io.connect("http://localhost:3000");

var pathname = window.location.pathname;

if (pathname == "/users/altasPro") {
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

} else if (pathname == "/users/consulPro") {
    socket.emit("Consul_Prod");

    // Consulta de productos
    socket.on('Desp_Productos', async (data) => {
        console.log('Datos recibidos:', data.Cod_Barras);

        document.querySelector("#DatosProd tbody").innerHTML += `
        <tr>
            <td id="F_Ingreso">${data.FIngreso}</td>
            <td id="Cod_Barras">${data.Cod_Barras}</td>
            <td id="Categoria">${data.Categoria}</td>
            <td id="NomP">${data.NArt}</td>
            <td id="MarcActi">${data.NMarca}</td>
            <td id="DescripcionP">${data.Desc}</td>
            <td id="Proveedor">${data.Prov}</td>
            <td id="UnidadP">${data.Unidad}</td>
            <td id="CantidadP">${data.Cant}</td>
            <td id="NumFact">${data.NFact}</td>
            <td id="Existencia">${data.Existencia}</td>
            <td id="Eliminar" class="BotonER"> Eliminar </td>
            <td id="Eliminar" class="BotonAG"> Modificar </td>
        </tr>
        `;

    });
} 