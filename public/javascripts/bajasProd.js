console.log(localStorage.getItem("token"));
var socket = io.connect("http://localhost:3000");

var pathname = window.location.pathname;

window.onload = function () {
    let BotonBajas = document.getElementsByClassName("BotonER");
    let BotonCambios = document.getElementsByClassName("BotonMod");
    for (let i = 0; i < BotonBajas.length; i++) {
        BotonBajas[i].addEventListener("click", obtenerValoresDeBaja);
    }

    for (let i = 0; i < BotonCambios.length; i++) {
        BotonCambios[i].addEventListener("click", obtenerValoresDeCambios);
    }
}

function obtenerValoresDeBaja(e) {
    var valores0 = "";
    var valores1 = "";
    var valores2 = "";

    // vamos al elemento padre (<tr>) y buscamos todos los elementos <td>
    // que contenga el elemento padre
    var elementosTD = e.srcElement.parentElement.getElementsByTagName("td");

    // recorremos cada uno de los elementos del array de elementos <td>
    for (let i = 0; i < elementosTD.length; i++) {

        // obtenemos cada uno de los valores y los ponemos en la variable "valores"
        valores0 = elementosTD[0].innerHTML;
        valores1 = elementosTD[1].innerHTML;
        valores2 = elementosTD[2].innerHTML;
        valoresBaja = elemBajas[0].innerHTML;
    }
    document.getElementById("F_Ingreso").value = valores0;
    document.getElementById("Cod_Barras").value = valores1;
    document.getElementById("NomP").value = valores2;

}

// funcion que se ejecuta cada vez que se hace clic
function obtenerValoresDeCambios(e) {
    var valores0 = "";
    var valores1 = "";
    var valores2 = "";
    var valores3 = "";
    var valores4 = "";
    var valores5 = "";
    var valores6 = "";
    var valores7 = "";
    var valores8 = "";
    var valores9 = "";
    var valores10 = "";

    // vamos al elemento padre (<tr>) y buscamos todos los elementos <td>
    // que contenga el elemento padre
    var elementosTD = e.srcElement.parentElement.getElementsByTagName("td");

    // recorremos cada uno de los elementos del array de elementos <td>
    for (let i = 0; i < elementosTD.length; i++) {
        // obtenemos cada uno de los valores y los ponemos en la variable "valores"
        valores0 = elementosTD[0].innerHTML;
        valores1 = elementosTD[1].innerHTML;
        valores2 = elementosTD[2].innerHTML;
        valores3 = elementosTD[3].innerHTML;
        valores4 = elementosTD[4].innerHTML;
        valores5 = elementosTD[5].innerHTML;
        valores6 = elementosTD[6].innerHTML;
        valores6 = elementosTD[7].innerHTML;
        valores6 = elementosTD[8].innerHTML;
        valores6 = elementosTD[9].innerHTML;
        valores6 = elementosTD[10].innerHTML;
    }

    document.getElementById("F_Ingreso").value = valores0;
    document.getElementById("Cod_Barras").value = valores1;
    document.getElementById("Categoria").value = valores2;
    document.getElementById("NomP").value = valores3;
    document.getElementById("MarcActi").value = valores4;
    document.getElementById("DescripcionP").value = valores5;
    document.getElementById("Proveedor").value = valores6;
    document.getElementById("UnidadP").value = valores7;
    document.getElementById("CantidadP").value = valores8;
    document.getElementById("NumFact").value = valores9;
    document.getElementById("Existencia").value = valores10;
}

if (pathname == "/users/consulPro") {

    const borrarProduct = document.querySelector("#DatosProd");
    // bajas de productos
    borrarProduct.addEventListener("submit", (e) => {
        if ($("#Cod_Barras").val() != "" && $("#NomP").val() != "") {

            socket.emit('Bajas_Prod', { CodBarras: $("#Cod_Barras").val(), Producto: $("#NomP").val() });

            socket.on('Producto_Eliminado', function (Respuesta) {
                console.log('Datos recibidos:', data.CodBarras);
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