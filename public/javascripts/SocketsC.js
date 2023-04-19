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
    
    socket.on('Desp_Productos', async (data) => {
        console.log('Datos recibidos:', data.Cod_Barras);

        document.querySelector("#DatosProd tbody").innerHTML += `
        <tr>
            <td id="F_Ingreso">${data.FIngreso}</td>
            <td id="Cod_Barras">${data.Cod_Barras}</td>
            <td id="Cod_Barras">${data.Categoria}</td>
            <td id="Cod_Barras">${data.NArt}</td>
            <td id="Cod_Barras">${data.NMarca}</td>
            <td id="Cod_Barras">${data.Desc}</td>
            <td id="Cod_Barras">${data.Prov}</td>
            <td id="Cod_Barras">${data.Unidad}</td>
            <td id="Cod_Barras">${data.Cant}</td>
            <td id="Cod_Barras">${data.NFact}</td>
            <td id="Cod_Barras">${data.Existencia}</td>
            <td><a href="#" class="BotonER">Eliminar</a><a href="/users/cambiosPro" class="BotonMod">Modificar</a></td>
        </tr>`;
            
    });
}

