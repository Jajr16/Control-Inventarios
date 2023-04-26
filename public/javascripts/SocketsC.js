console.log(localStorage.getItem("token"));
var tok = localStorage.getItem("token");
var socket = io.connect("http://localhost:3000");

var pathname = window.location.pathname;

if (pathname == "/users/altasPro") {
    if (tok == "4dnM3k0nl9s" || tok == "4dnM3k0nl9z" || tok == "4dnM3k0nl9A") {
        if (tok == "4dnM3k0nl9s" || tok == "4dnM3k0nl9z") {
            document.getElementById("Linksnav").innerHTML += `
                <li><a href="/users/RegistrarUsuario">Registrar Usuario</a></li>
            `;

            document.getElementById("MenuCel").innerHTML += `
                <a href="/users/RegistrarUsuario">Registrar Usuario</a>
            `;
        }

        const FormProduct = document.querySelector("#AltaProductos");

        // Altas de productos
        FormProduct.addEventListener("submit", Enviar);

        var CategoriaSelect = document.getElementById('Categoria');
        var CategoriaOption;

        var UnidadSelect = document.getElementById('UnidadP');
        var UnidadOption;

        CategoriaSelect.addEventListener('change',
            function () {
                CategoriaOption = CategoriaSelect.options[CategoriaSelect.selectedIndex].text;
            });

        UnidadSelect.addEventListener('change',
            function () {
                UnidadOption = UnidadSelect.options[UnidadSelect.selectedIndex].text;
            });

        function Enviar(e) {
            e.preventDefault();
            if ($("#Cod_Barras").val() != "" && $("#FecActu").val() != "" && $("#Categoria").val() != "" && $("#NomP").val() != "" && $("#MarcActi").val() != "" && $("#DescripcionP").val() != "" && $("#Proveedor").val() != "" && $("#NumFact").val() != "" && $("#CantidadP").val() != "" && $("#UnidadP").val() != "" && $("#FecFact").val()) {

                socket.emit('Alta_Prod', { CodBarras: $("#Cod_Barras").val(), FecAct: $("#FecActu").val(), Cate: CategoriaOption, Producto: $("#NomP").val(), Marca: $("#MarcActi").val(), Descripcion: $("#DescripcionP").val(), Proveedor: $("#Proveedor").val(), NumFactura: $("#NumFact").val(), FechaFac: $("#FecFact").val(), Cantidad: $("#CantidadP").val(), Unidad: UnidadOption });

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
    } else {
        location.href = "index";
    }
} else if (pathname == "/users/consulPro") {
    if (tok == "4dnM3k0nl9s" || tok == "4dnM3k0nl9z" || tok == "4dnM3k0nl9A") {
        if (tok == "4dnM3k0nl9s" || tok == "4dnM3k0nl9z") {
            document.getElementById("Linksnav").innerHTML += `
                <li><a href="/users/RegistrarUsuario">Registrar Usuario</a></li>
            `;

            document.getElementById("MenuCel").innerHTML += `
                <a href="/users/RegistrarUsuario">Registrar Usuario</a>
            `;
        }
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
                <td id="Eliminar" class="BotonER" onclick="confirm('¿Deseas eliminar este producto?')"> Eliminar </td>
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

        function buscar1() {

            var filtro = $("#buscar1").val().toUpperCase();

            $("#DatosFacturas td").each(function () {
                var textoEnTd = $(this).text().toUpperCase();
                if (textoEnTd.indexOf(filtro) >= 0) {
                    $(this).addClass("existe");
                } else {
                    $(this).removeClass("existe");
                }
            })

            $("#DatosFacturas tbody tr").each(function () {
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
                    valoresBaja = elementosTD[0].innerHTML;
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
                let tablaCreada = false;
                //Es el botón en el que al darle clic hará una búsqueda de todas las facturas del producto
                BotonFacturasMod.addEventListener("click", function (e) {

                    socket.emit("Traer_Facturas", valores0);

                    Titulotable.innerHTML = `Modificar facturas del artículo '${valores2}'`;
                    if (tablaCreada) {
                        let tabla = document.querySelector("#DatosFacturas tbody");
                        if (tabla.rows.length > 0) {
                            tabla.innerHTML = "";
                        }
                    } else {
                        let tabla = document.querySelector("#DatosFacturas tbody");
                        tabla.innerHTML = "";
                        tablaCreada = true;
                    }
                });

                socket.on("Fact_Enviadas", (data) => {
                    let tabla = document.querySelector("#DatosFacturas tbody");
                    tabla.innerHTML = "";
                    for (let i = 0; i < data.FIngreso.length; i++) {
                        tabla.innerHTML += `
                    <tr>           
                        <td id="FIngresoV">${data.FIngreso[i]}</td>
                        <td id="CantidadV">${data.Cantidad[i]}</td>
                        <td id="NFactV">${data.NFactura[i]}</td>
                        <td id="FFacturaV">${data.FFactura[i]}</td>
                        <td id="ProveedorV">${data.Proveedor[i]}</td>
                        <td onclick="Abrir2()" class="BotonModF BotonModifyF">Modificar</td>                           
                    </tr> 
                `;
                    }
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

            var CategoriaSelect = document.getElementById('CategoriaM');
            var CategoriaOption;

            var UnidadSelect = document.getElementById('UnidadPM');
            var UnidadOption;

            CategoriaSelect.addEventListener('change',
                function () {
                    CategoriaOption = CategoriaSelect.options[CategoriaSelect.selectedIndex].text;
                });

            UnidadSelect.addEventListener('change',
                function () {
                    UnidadOption = UnidadSelect.options[UnidadSelect.selectedIndex].text;
                });

            function Enviar(e) {

                e.preventDefault();

                if ($("#Cod_BarrasM").val() != "" && $("#CategoriaM").val() != "" && $("#NomPM").val() != "" && $("#MarcActiM").val() != "" && $("#DescripcionPM").val() != "" && $("#UnidadPM").val() != "") {
                    socket.emit('Cambios_Prod', { CodBarras: $("#Cod_BarrasM").val(), Cate: CategoriaOption, Producto: $("#NomPM").val(), Marca: $("#MarcActiM").val(), Descripcion: $("#DescripcionPM").val(), Unidad: UnidadOption }, { CBO: valores0, CO: valores1, NAO: valores2, MAO: valores3, DO: valores4, UO: valores5 });

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
    } else {
        location.href = "index";
    }
} else if (pathname == "/users/ABPE") {
    if (tok == "4dnM3k0nl9s" || tok == "4dnM3k0nl9z" || tok == "4dnM3k0nl9A") {
        if (tok == "4dnM3k0nl9s" || tok == "4dnM3k0nl9z") {
            document.getElementById("Linksnav").innerHTML += `
                <li><a href="/users/RegistrarUsuario">Registrar Usuario</a></li>
            `;

            document.getElementById("MenuCel").innerHTML += `
                <a href="/users/RegistrarUsuario">Registrar Usuario</a>
            `;
        }

        var valores0 = "";
        var valores1 = "";
        var valores0E = "";
        var valores2E = "";

        socket.emit("Consul_ProdExist");
        // Consulta de productos
        socket.on('Desp_ProductosExist', async (data) => {
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
                <td id="Agregar" class="BotonMod"> Añadir producto existente </td>
                <td id="Eliminar" class="BotonER" onclick="Abrir1()"> Elimnar producto existente </td>
            </tr>
            `;
            }
        });

        // Agregar producto existente
        socket.on('AgregarProdExist', async () => {
            let AgregarProdExist = document.getElementsByClassName("BotonMod");

            for (let i = 0; i < AgregarProdExist.length; i++) {
                AgregarProdExist[i].addEventListener("click", exist);
            }
            function exist(e) {
                var elementosTD = e.srcElement.parentElement.getElementsByTagName("td");

                for (let i = 0; i < elementosTD.length; i++) {
                    // obtenemos cada uno de los valores y los ponemos en la variable "valores"
                    valores0 = elementosTD[0].innerHTML;
                    valores1 = elementosTD[6].innerHTML;
                }
                const formProdExist = document.querySelector("#AltaExist");
                formProdExist.addEventListener("submit", EnviarAlta);

                function EnviarAlta(e) {
                    e.preventDefault();
                    if ($("#FecActu").val() != "" && $("#CantidadPM").val() != "" && $("#ProveedorM").val() != "" && $("#NumFactM").val() != "" && $("#FecFact").val() != "") {
                        socket.emit('Altas_ProdExist', { Cod_Barras: valores0, FecAct: $("#FecActu").val(), Cantidad: $("#CantidadPM").val(), Proveedor: $("#ProveedorM").val(), NumFactura: $("#NumFactM").val(), FechaFac: $("#FecFact").val(), Existencia: valores1 });

                        socket.on('Factura_Agregada', function (Respuesta) {
                            alert(Respuesta.mensaje);
                            location.reload();
                        });

                        socket.on('Fallo_Factura', function (Respuesta) {
                            alert(Respuesta.mensaje);
                            location.reload();
                        });
                        socket.on('Ya_Registrado', function (Respuesta) {
                            alert(Respuesta.mensaje);
                            location.reload();
                        });
                    }
                }
            }
        });

        // Eliminar producto existente
        socket.on('EliminarProdExist', async () => {
            let EliminarProdExist = document.getElementsByClassName("BotonER");

            for (let i = 0; i < EliminarProdExist.length; i++) {
                EliminarProdExist[i].addEventListener("click", existBajas);
            }
            function existBajas(e) {
                var elementosTD = e.srcElement.parentElement.getElementsByTagName("td");

                for (let i = 0; i < elementosTD.length; i++) {
                    // obtenemos cada uno de los valores y los ponemos en la variable "valores"
                    valores0E = elementosTD[0].innerHTML;
                    valores2E = elementosTD[2].innerHTML;
                }

                document.querySelector("#TituloEliminar").innerHTML = `¿Cuántos productos de "${valores2E}" desea sacar?`;

                const formProdExistBaja = document.querySelector("#BajaExist");
                formProdExistBaja.addEventListener("submit", EnviarBaja);
                function EnviarBaja(e) {
                    e.preventDefault();
                    if ($("#CantidadP").val() != "") {
                        socket.emit('Bajas_ProdExist', { Cod_Barras: valores0E, Cantidad: $("#CantidadP").val() });

                        socket.on('Eliminacion_Realizada', function (Respuesta) {
                            alert(Respuesta.mensaje);
                            location.reload();
                        });
                        socket.on('Fallo_BajasExist', function (Respuesta) {
                            alert(Respuesta.mensaje);
                            location.reload();
                        });
                    }
                }
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
    } else {
        location.href = "index";
    }
} else if (pathname == "/users/RegistrarUsuario") {
    if (tok == "4dnM3k0nl9s" || tok == "4dnM3k0nl9z") {
        document.getElementById("Linksnav").innerHTML += `
            <li><a href="/users/RegistrarUsuario">Registrar Usuario</a></li>
        `;

        document.getElementById("MenuCel").innerHTML += `
            <a href="/users/RegistrarUsuario">Registrar Usuario</a>
        `;

        const FormRegistro = document.querySelector("#Registro");

        // Registro de usuario
        FormRegistro.addEventListener('submit', EnviarReg);

        function EnviarReg(e) {
            e.preventDefault();
            if ($("#NombreEmp").val() != "" && $("#AP").val() != "" && $("#AM").val() != "" && $("#Area").val() != "" && $("#NumJefe").val() != "" && $("#NombreUser").val() != "" && $("#ContraNueva").val() != "") {

                socket.emit('Registro_Usuario', { NombreEmp: $("#NombreEmp").val(), ApePat: $("#AP").val(), ApeMat: $("#AM").val(), Area: $("#Area").val(), NomJefe: $("#NomJefe").val(), N_User: $("#NombreUser").val(), ContraNueva: $("#ContraNueva").val() });

                socket.on('Usuario_Existente', function (Respuesta) {
                    alert(Respuesta.mensaje);
                    location.reload();
                });

                socket.on('Empleado_Existente', function (Respuesta) {
                    alert(Respuesta.mensaje);
                    location.reload();
                });

                socket.on('Usuario_Agregado', function (Respuesta) {
                    alert(Respuesta.mensaje);
                    location.reload();
                });

                socket.on('Usuario_Error', function (Respuesta) {
                    alert(Respuesta.mensaje);
                    location.reload();
                });

                socket.on('Empleado_Agregado', function (Respuesta) {
                    alert(Respuesta.mensaje);
                });

                socket.on('Empleado_Error', function (Respuesta) {
                    alert(Respuesta.mensaje);
                    location.reload();
                });
            }
        }
    } else {
        location.href = "index";
    }
}
