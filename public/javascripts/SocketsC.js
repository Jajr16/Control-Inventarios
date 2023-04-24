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
    // Consulta de productos
    socket.on('Desp_Productos', async (data) => {
        console.log('Datos recibidos:', data.Cod_Barras);

        if (data.eliminado == 1) {
            document.querySelector("#DatosProd tbody").innerHTML += `
            <tr style="background-color: #590C09">
            <td id="Cod_Barras">${data.Cod_Barras}</td>
            <td id="Categoria">${data.Categoria}</td>
            <td id="NomP">${data.NArt}</td>
            <td id="MarcActi">${data.NMarca}</td>
            <td id="DescripcionP">${data.Desc}</td>
            <td id="UnidadP">${data.Unidad}</td>
            <td id="Existencia">${data.Existencia}</td>
            </tr>
            `;
        } else {
            document.querySelector("#DatosProd tbody").innerHTML += `
            <tr>
                <td id="Cod_Barras">${data.Cod_Barras}</td>
                <td id="Categoria">${data.Categoria}</td>
                <td id="NomP">${data.NArt}</td>
                <td id="MarcActi">${data.NMarca}</td>
                <td id="DescripcionP">${data.Desc}</td>
                <td id="UnidadP">${data.Unidad}</td>
                <td id="Existencia">${data.Existencia}</td>
                <td id="Eliminar" class="BotonER"> Eliminar </td>
                <td id="Modificar" class="BotonMod"> Modificar </td>
            </tr>
            `;
        }

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

    //Llenar datos en automático
    var valores0 = "";
    var valores1 = "";
    var valores2 = "";
    var valores3 = "";
    var valores4 = "";
    var valores5 = "";
    var valores6 = "";
    //Modificar productos
    socket.on('ButtonUp', () => {
        let BotonMod = document.getElementsByClassName("BotonMod");

        for (let i = 0; i < BotonMod.length; i++) {
            BotonMod[i].addEventListener("click", obtenerValoresMod);
        }

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
            }

            document.getElementById("Cod_BarrasM").value = valores0;
            document.getElementById("CategoriaM").value = valores1;
            document.getElementById("NomPM").value = valores2;
            document.getElementById("MarcActiM").value = valores3;
            document.getElementById("DescripcionPM").value = valores4;
            document.getElementById("UnidadPM").value = valores5;
            //Aqui iniciamos otra cosa para modificar las facturas una por una
            let BotonFacturasMod = document.getElementById("ModFact");
            let Titulotable = document.getElementById("title_table");
            //Es el botón en el que al darle clic hará una búsqueda de todas las facturas del producto
            BotonFacturasMod.addEventListener("click", function (e) {

                socket.emit("Traer_Facturas", valores0);

                Titulotable.innerHTML = `Modificar facturas del artículo '${valores2}'`;
                //Se imprimen todos los productos
                socket.on("Fact_Enviadas", (data) => {
                    document.querySelector("#DatosFacturas tbody").innerHTML += `
                        <tr>           
                            <td id="FIngresoV">${data.FIngreso}</td>
                            <td id="CantidadV">${data.Cantidad}</td>
                            <td id="NFactV">${data.NFactura}</td>
                            <td id="FFacturaV">${data.FFactura}</td>
                            <td id="ProveedorV">${data.Proveedor}</td>
                            <td onclick="Abrir2()" class="BotonModF BotonModifyF">Modificar</td>                           
                        </tr> 
                    `;

                });
            });

            socket.on("BotonModalFacturas", () => {

                //Se llenará el formulario dependiendo del producto en donde hace clic
                let BotonModFacturas = document.getElementsByClassName("BotonModifyF");

                for (let i = 0; i < BotonModFacturas.length; i++) {
                    BotonModFacturas[i].addEventListener("click", LlenarFormFact);
                }

                var valoresF0 = "";
                var valoresF1 = "";
                var valoresF2 = "";
                var valoresF3 = "";

                function LlenarFormFact(e) {
                    var elementosTD = e.srcElement.parentElement.getElementsByTagName("td");

                    for (let i = 0; i < elementosTD.length; i++) {
                        // obtenemos cada uno de los valores y los ponemos en la variable "valores"
                        valoresF0 = elementosTD[1].innerHTML;
                        valoresF1 = elementosTD[2].innerHTML;
                        valoresF2 = elementosTD[3].innerHTML;
                        valoresF3 = elementosTD[4].innerHTML;
                    }
                    document.getElementById("CantidadPMF").value = valoresF0;
                    document.getElementById("NumFactMF").value = valoresF1;
                    document.getElementById("FecFactMF").value = valoresF2;
                    document.getElementById("ProveedorMF").value = valoresF3;
                }
                //Formulario de facturas
                let FormularioFac = document.querySelector("#FacturasMody");
                FormularioFac.addEventListener("submit", function (e) {
                    e.preventDefault();

                    //Validamos que todo esté lleno para enviar el formulario
                    if ($("#CantidadPMF").val() != "" && $("#NumFactMF").val() != "" && $("#FecFactMF").val() != "" && $("#ProveedorMF").val()) {
                        socket.emit("Cambios_Facts", { CodBarras: valores0, Cantidad: $("#CantidadPMF").val(), NumFactura: $("#NumFactMF").val(), FechaFac: $("#FecFactMF").val(), Proveedor: $("#ProveedorMF").val() }, { NFO: valoresF1 });
                        //Esperamos respuesta del servidor en caso de caso exitoso
                        socket.on('Factu_Exitosa', function (Respuesta) {
                            alert(Respuesta.mensaje);
                            location.reload();
                        });
                        //Esperamos respuesta del servidor en caso de caso fallido
                        socket.on('Fallo_Fac', function (Respuesta) {
                            alert(Respuesta.mensaje);
                        });
                        //Esperamos respuesta del servidor en caso de caso fallido
                        socket.on('Fallo_ModFac', function (Respuesta) {
                            alert(Respuesta.mensaje);
                        });
                    }

                });
            })
        }

        // Cambios de productos
        const FormMod = document.querySelector("#ModProduct");

        // Cambios de productos
        FormMod.addEventListener("submit", Enviar);

        // Comprueba que no haya otro igual
        function Enviar(e) {

            e.preventDefault();

            if ($("#Cod_BarrasM").val() != "" && $("#CategoriaM").val() != "" && $("#NomPM").val() != "" && $("#MarcActiM").val() != "" && $("#DescripcionPM").val() != "" && $("#UnidadPM").val() != "") {
                socket.emit('Cambios_Prod', { CodBarras: $("#Cod_BarrasM").val(), Cate: $("#CategoriaM").val(), Producto: $("#NomPM").val(), Marca: $("#MarcActiM").val(), Descripcion: $("#DescripcionPM").val(), Unidad: $("#UnidadPM").val() }, { CBO: valores0, CO: valores1, NAO: valores2, MAO: valores3, DO: valores4, UO: valores5 });

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
} else if (pathname == "/users/ABPE") {

    socket.emit("Consul_Prod");
    // Consulta de productos
    socket.on('Desp_Productos', async (data) => {
        console.log('Datos recibidos:', data.Cod_Barras);

        if (data.eliminado == 1) {
            document.querySelector("#DatosProd tbody").innerHTML += `
            <tr style="background-color: #590C09">
            <td id="Cod_Barras">${data.Cod_Barras}</td>
            <td id="Categoria">${data.Categoria}</td>
            <td id="NomP">${data.NArt}</td>
            <td id="MarcActi">${data.NMarca}</td>
            <td id="DescripcionP">${data.Desc}</td>
            <td id="UnidadP">${data.Unidad}</td>
            <td id="Existencia">${data.Existencia}</td>
            </tr>
            `;
        } else {
            document.querySelector("#DatosProd tbody").innerHTML += `
            <tr>
                <td id="Cod_Barras">${data.Cod_Barras}</td>
                <td id="Categoria">${data.Categoria}</td>
                <td id="NomP">${data.NArt}</td>
                <td id="MarcActi">${data.NMarca}</td>
                <td id="DescripcionP">${data.Desc}</td>
                <td id="UnidadP">${data.Unidad}</td>
                <td id="Existencia">${data.Existencia}</td>
                <td id="Eliminar" class="BotonMod"> Añadir producto existente </td>
                <td id="Modificar" class="BotonER"> Elimnar de producto existente </td>
            </tr>
            `;
        }
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

    var formProdExist = document.querySelector("#AltaExist");

    FormProduct.addEventListener("submit", EnviarAlta);

    function EnviarAlta(e) {
        e.preventDefault();
        if ($("#FecActuM").val() != "" && $("#CantidadPM").val() != "" && $("#ProveedorM").val() != "" && $("#NumFactM").val() != "" && $("#FecFactM").val() != "") {
            socket.emit('Altas_ProdExist', { Cod_Barras: valores0, FecAct: $("#FecActuM").val(), Cantidad: $("#CantidadPM").val(), Proveedor: $("#ProveedorM").val(), NumFactura: $("#NumFactM").val(), FechaFac: $("#FecFactM").val()});

            socket.on('Factura_Agregada', function (Respuesta) {
                alert(Respuesta.mensaje);
                location.reload();
            });

            socket.on('Fallo_Factura', function (Respuesta) {
                alert(Respuesta.mensaje);
                location.reload();
            });
        }
    }
} 