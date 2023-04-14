console.log(localStorage.getItem("token"));
var socket = io.connect("http://localhost:3000");

const FormProduct = document.querySelector("#AltaProductos");

FormProduct.addEventListener("submit", (e)=>{
    e.preventDefault();
    if($("#Cod_Barras").val() != "" && $("#FecActu").val() != "" && $("#Categoria").val() != ""  && $("#NomP").val() != ""  && $("#MarcActi").val() != ""  && $("#DescripcionP").val() != ""  && $("#Proveedor").val() != ""  && $("#NumFact").val() != ""  && $("#CantidadP").val() != ""  && $("#UnidadP").val() != ""){
        socket.emit('Alta_Prod', {CodBarras: $("#Cod_Barras").val(), FecAct: $("#FecActu").val(), Cate: $("#Categoria").val(), Producto: $("#NomP").val(), Marca: $("#MarcActi").val(), Descripcion: $("#DescripcionP").val(), Proveedor: $("#Proveedor").val(), NumFactura: $("#NumFact").val(), Cantidad: $("#CantidadP").val(), Unidad: $("#UnidadP").val()});

        socket.on('Producto_Existente', function(Respuesta){
            alert(Respuesta.mensaje);
        });

        socket.on('Producto_Inexistente', function(Respuesta){
            alert(Respuesta.mensaje);

        });
    }
});