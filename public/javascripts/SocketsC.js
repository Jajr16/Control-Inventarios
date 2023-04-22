console.log(localStorage.getItem("token"));
var socket = io.connect("http://localhost:3000");

var pathname = window.location.pathname;

if (pathname == "/users/altasPro") {
    const FormProduct = document.querySelector("#AltaProductos");

    // Altas de productos
    FormProduct.addEventListener("submit", Enviar);

    function Enviar(e) {
        e.preventDefault();
        if ($("#Cod_Barras").val() != "" && $("#FecActu").val() != "" && $("#Categoria").val() != "" && $("#NomP").val() != "" && $("#MarcActi").val() != "" && $("#DescripcionP").val() != "" && $("#Proveedor").val() != "" && $("#NumFact").val() != "" && $("#CantidadP").val() != "" && $("#UnidadP").val() != "" && $("#FecFact").val()) {
            socket.emit('Alta_Prod', { CodBarras: $("#Cod_Barras").val(), FecAct: $("#FecActu").val(), Cate: $("#Categoria").val(), Producto: $("#NomP").val(), Marca: $("#MarcActi").val(), Descripcion: $("#DescripcionP").val(), Proveedor: $("#Proveedor").val(), NumFactura: $("#NumFact").val(), FechaFac: $("#FecFact").val(), Cantidad: $("#CantidadP").val(), Unidad: $("#UnidadP").val() });

            socket.on('Fact_Exists', function (Respuesta) {
                alert(Respuesta.mensaje);
            });

            socket.on('Producto_Existente', function (Respuesta) {
                alert(Respuesta.mensaje);
                location.reload();
            });

            socket.on('Producto_Inexistente', function (Respuesta) {
                alert(Respuesta.mensaje);
                location.reload();
            });
        }
    }

} else if (pathname == "/users/consulPro") {

    socket.emit("Consul_Prod");
    var FechaFactura = "";
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
            <td id="NumFact">${data.NFact}</td>
            <td id="Existencia">${data.Existencia}</td>
            <td id="Ffact" style="display:none;">${data.Ffact}</td>
            <td id="Eliminar" class="BotonER"> Eliminar </td>
            <td id="Modificar" class="BotonMod"> Modificar </td>
        </tr>
        `;

    });

    // Barra de busqueda
    function buscar() {

        var filtro = $("#buscar").val().toUpperCase();

        $("#DatosProd td").each(function () {
            var textoEnTd = $(this).text().toUpperCase();
            if (textoEnTd.indexOf(filtro) >= 0) {
                $(this).addClass("existe");
            } else {
                $(this).removeClass("existe");
            }
        })

        $("#DatosProd tbody tr").each(function () {
            if ($(this).children(".existe").length > 0) {
                $(this).show();
            } else {
                $(this).hide();
            }
        })

    }

    // bajas de productos
    socket.on('ButtonDelete', () => {

        let BotonBajas = document.getElementsByClassName("BotonER");

        for (var i = 0; i < BotonBajas.length; i++) {
            BotonBajas[i].addEventListener("click", obtenerValoresDeBaja);
        }

        function obtenerValoresDeBaja(e) {
            var valoresBaja = "";

            // vamos al elemento padre (<tr>) y buscamos todos los elementos <td>
            // que contenga el elemento padre
            var elementosTD = e.srcElement.parentElement.getElementsByTagName("td");

            // recorremos cada uno de los elementos del array de elementos <td>
            for (let i = 0; i < elementosTD.length; i++) {

                // obtenemos cada uno de los valores y los ponemos en la variable "valores"
                valoresBaja = elementosTD[1].innerHTML;
            }
            socket.emit('Bajas_Prod', valoresBaja);
            socket.on('Producto_Eliminado', (data) => {
                alert(data.mensaje);
                location.reload();
            });
            socket.on('Error', (data) => {
                alert(data.mensaje);
            })
        }

    });

    socket.on('ButtonUp', () => {
        let BotonMod = document.getElementsByClassName("BotonMod");

        for (let i = 0; i < BotonMod.length; i++) {
            BotonMod[i].addEventListener("click", obtenerValoresMod);
        }

        //Llenar datos en automático
        var valores0 = "";
        var valores1 = "";
        var valores2 = "";
        var valores3 = "";
        var valores4 = "";
        var valores5 = "";
        var valores6 = "";
        var valores7 = "";
        var valores9 = "";
        var valores10 = "";

        function obtenerValoresMod(e) {


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
                valores7 = elementosTD[7].innerHTML;
                valores8 = elementosTD[8].innerHTML;
                valores9 = elementosTD[9].innerHTML;
                valores10 = elementosTD[10].innerHTML;
            }

            document.getElementById("FecActuM").value = valores0;
            document.getElementById("Cod_BarrasM").value = valores1;
            document.getElementById("CategoriaM").value = valores2;
            document.getElementById("NomPM").value = valores3;
            document.getElementById("MarcActiM").value = valores4;
            document.getElementById("DescripcionPM").value = valores5;
            document.getElementById("ProveedorM").value = valores6;
            document.getElementById("UnidadPM").value = valores7;
            document.getElementById("NumFactM").value = valores8;
            document.getElementById("FecFactM").value = valores10;
        }


        // Cambios de productos
        const FormMod = document.querySelector("#ModProduct");

        // Cambios de productos
        FormMod.addEventListener("submit", Enviar);

        // Comprueba que no haya otro igual
        function Enviar(e) {
            
            e.preventDefault();

            if ($("#Cod_BarrasM").val() != "" && $("#FecActuM").val() != "" && $("#CategoriaM").val() != "" && $("#NomPM").val() != "" && $("#MarcActiM").val() != "" && $("#DescripcionPM").val() != "" && $("#ProveedorM").val() != "" && $("#NumFactM").val() != "" && $("#CantidadPM").val() != "" && $("#UnidadPM").val() != "" && $("#FecFactM").val()) {
                socket.emit('Cambios_Prod', { CodBarras: $("#Cod_BarrasM").val(), FecAct: $("#FecActuM").val(), Cate: $("#CategoriaM").val(), Producto: $("#NomPM").val(), Marca: $("#MarcActiM").val(), Descripcion: $("#DescripcionPM").val(), Proveedor: $("#ProveedorM").val(), NumFactura: $("#NumFactM").val(), FechaFac: $("#FecFactM").val(), Existencia: (parseInt($("#CantidadPM").val()) +  parseInt(valores9)), Unidad: $("#UnidadPM").val() }, { FIO: valores0, CBO: valores1, CO: valores2, NAO: valores3, MAO: valores4, DO: valores5, PO: valores6, UO: valores7, NFO: valores8, FFactO: valores10 });

                socket.on('Producto_Inexistente', function (Respuesta) {
                    alert(Respuesta.mensaje);
                    location.reload();
                });

                socket.on('Fallo_Mod', function (Respuesta) {
                    alert(Respuesta.mensaje);
                });
            }
        }

    });


} 