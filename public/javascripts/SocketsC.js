console.log(localStorage.getItem("token"));
var tok = localStorage.getItem("token");
var socket = io.connect("http://localhost:3000");

var pathname = window.location.pathname;
//SELECTS
function ListaNombres(Nombr) {
    var selectNombres2 = document.getElementById("NombreEmp");

    var opcion = document.createElement("option");

    opcion.text = Nombr;

    selectNombres2.add(opcion);
}

function ListaNombres2(Nombr) {
    var selectNombres2 = document.getElementById("NomJefe");

    var opcion = document.createElement("option");

    opcion.text = Nombr;

    selectNombres2.add(opcion);
}

function cargarNombres() {
    socket.emit('List_empleados', "Empleados");
    socket.on('ListaNombres', (data) => {
        ListaNombres(data.Nombres);
    });
}
function cargarNombres2() {
    socket.emit('List_empleados', "Jefes");
    socket.on('ListaNombres2', (data) => {
        ListaNombres2(data.Nombres);
    });
}
//CAMPOS SOLO LETRAS Y NÚMEROS
function check(e) {
    tecla = (document.all) ? e.keyCode : e.which;

    //Tecla de retroceso para borrar, siempre la permite
    if (tecla == 8 || tecla == 32) {
        return true;
    }

    // Patrón de entrada, en este caso solo acepta numeros y letras
    patron = /[A-Za-z]/;
    tecla_final = String.fromCharCode(tecla);
    return patron.test(tecla_final);
}

function checkN(e) {
    tecla = (document.all) ? e.keyCode : e.which;

    //Tecla de retroceso para borrar, siempre la permite
    if (tecla == 8 || tecla == 32) {
        return true;
    }

    // Patrón de entrada, en este caso solo acepta numeros y letras
    patron = /[0-9]/;
    tecla_final = String.fromCharCode(tecla);
    return patron.test(tecla_final);
}

function checkA(e) {
    tecla = (document.all) ? e.keyCode : e.which;

    //Tecla de retroceso para borrar, siempre la permite
    if (tecla == 8 || tecla == 32) {
        return true;
    }

    // Patrón de entrada, en este caso solo acepta numeros y letras
    patron = /[A-Za-z0-9]/;
    tecla_final = String.fromCharCode(tecla);
    return patron.test(tecla_final);
}

// SEGURIDAD
// document.addEventListener("contextmenu", function(event){//Deshabilitar click derecho
//     event.preventDefault();
// }, false);
// //No permite tecla Ctrl
// document.addEventListener('keydown', (e) => {
//     if(e.keyCode == 123){
//         e.preventDefault();
//         return false;
//     }
// });

// document.addEventListener("copy", function(event){//Deshabilitar copiar y pegar
//     // Change the copied text if you want
//     event.clipboardData.setData("text/plain", "No se permite copiar en esta página web");
//     // Prevent the default copy action
//     event.preventDefault();
// }, false);

if (pathname == "/users/altasPro") {
    if (tok == "4dnM3k0nl9s" || tok == "4dnM3k0nl9z" || tok == "4dnM3k0nl9A" || tok == "FGJYGd42DSAFA" || tok == "4dnM3k0nl9w" /*TEMPOTAL*/) {

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
    } else {
        location.href = "index";
    }
} else if (pathname == "/users/consulPro") {
    if (tok == "4dnM3k0nl9s" || tok == "4dnM3k0nl9z" || tok == "4dnM3k0nl9A" || tok == "FGJYGd42DSAFA" || tok == "4dnM3k0nl9w" /*TEMPOTAL*/) {

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
            <td> - </td>
            <td> - </td>
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
                <td id="Eliminar" class="BotonER" onclick="eliminar()"> Eliminar </td>
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

        // Crear excel
        function Excel() {
            socket.emit("Excel");

            socket.on("RespExcel", (data) => {
                alert(data.mensaje);
                location.reload();
            });
        }

        // bajas de productos
        function eliminar() {
            var letrero = confirm('¿Deseas eliminar este producto?');

            if (letrero) {
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
            } else location.reload();
        }

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
                console.log(document.getElementById("UnidadPM").value);
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


            }
            socket.once("BotonModalFacturas", () => {

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

                    }

                });
                //Esperamos respuesta del servidor en caso de caso exitoso
                socket.once('Factu_Exitosa', function (Respuesta) {
                    alert(Respuesta.mensaje);
                    location.reload();
                });
                //Esperamos respuesta del servidor en caso de caso fallido
                socket.once('Fallo_Fac', function (Respuesta) {
                    alert(Respuesta.mensaje);
                });
                //Esperamos respuesta del servidor en caso de caso fallido
                socket.once('Fallo_ModFac', function (Respuesta) {
                    alert(Respuesta.mensaje);
                });
            });

            // Cambios de productos
            const FormMod = document.querySelector("#ModProduct");

            // Cambios de productos
            FormMod.addEventListener("submit", Enviar);

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
    } else {
        location.href = "index";
    }
} else if (pathname == "/users/ABPE") {
    if (tok == "4dnM3k0nl9s" || tok == "4dnM3k0nl9z" || tok == "4dnM3k0nl9A" || tok == "FGJYGd42DSAFA" /*TEMPOTAL*/) {

        window.addEventListener("load", function (event) {
            cargarNombres();
        });

        window.onpageshow = function () {
            $('#NombreEmp').select2({
                allowClear: true,
                placeholder: 'Buscar empleado'
            });
        };

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
            <td> - </td>
            <td> - </td>
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
                <td id="Agregar" class="BotonMod"> Añadir productos</td>
                <td id="Eliminar" class="BotonER" onclick="Abrir1()"> Sacar productos</td>
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
        });

        // Sacar producto existente
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
                    if ($("#CantidadP").val() != "" && $("#NomJefe") != "") {
                        socket.emit('Bajas_ProdExist', { Cod_Barras: valores0E, Cantidad: $("#CantidadP").val(), Emp: $("#NombreEmp").val(), Articulo: valores2E });

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
    if (tok == "4dnM3k0nl9s") {

        window.addEventListener("load", function (event) {
            cargarNombres();
        });

        window.onpageshow = function () {
            $('#NombreEmp').select2({
                allowClear: true,
                placeholder: 'Buscar empleado'
            });
        };

        const FormRegistro = document.querySelector("#Registro");

        // Registro de usuario
        FormRegistro.addEventListener('submit', EnviarReg);

        function EnviarReg(e) {
            e.preventDefault();
            if ($("#NombreEmp").val() != "" && $("#NombreUser").val() != "" && $("#ContraNueva").val() != "") {

                socket.emit('Registro_Usuario', { NombreEmp: $("#NombreEmp").val(), N_User: $("#NombreUser").val(), ContraNueva: $("#ContraNueva").val() });

                socket.on('Usuario_Existente', function (Respuesta) {
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
            }
        }
    } else {
        location.href = "index";
    }
} else if (pathname == "/users/RegistroEmpleado") {
    if (tok == "4dnM3k0nl9s") {

        window.addEventListener("load", function (event) {
            cargarNombres2();
        });

        window.onpageshow = function () {
            $('#NomJefe').select2({
                allowClear: true,
                placeholder: 'Buscar empleado'
            });
        };

        const FormRegistro = document.querySelector("#Registro");
        // Registro de usuario
        FormRegistro.addEventListener('submit', EnviarReg);

        function EnviarReg(e) {
            e.preventDefault();

            if ($("#Area").val() != "" && $("#NombreEmp").val() != "" && $("#NomJefe").val() != "") {

                socket.emit('Reg_Emp', { NombreEmp: $("#NombreEmp").val(), Area: $("#Area").val(), NomJefe: $("#NomJefe").val() });

                socket.once('Res_Emp', (Respuesta) => {
                    alert(Respuesta.mensaje);
                    location.reload();
                });

            }
        }
    }
} else if (pathname == "/users/FacSacProd") {
    if (tok == "4dnM3k0nl9s" || tok == "4dnM3k0nl9z" || tok == "4dnM3k0nl9A" || tok == "FGJYGd42DSAFA" /*TEMPOTAL*/) {

        //Desplegar facturas existentes
        socket.emit("Consul_RegProSac");
        // Consulta de productos
        socket.on('Desp_Productos', async (data) => {
            console.log('Datos recibidos:', data.Cod_BarrasS);

            document.querySelector("#DatosProSac tbody").innerHTML += `
            <tr>
                <td id="Cod_BarrasS">${data.Cod_BarrasS}</td>
                <td id="ArticuloS">${data.Articulo}</td>
                <td id="ExistenciaS">${data.Existencia}</td>
                <td id="EncargadoS">${data.Nom}</td>
                <td id="Cantidad_Salida">${data.Cantidad_Salida}</td>
                <td id="FSalida">${data.FSalida}</td>
            </tr>
            `;
        });

        // Buscar por nombre
        function BuscarFechas() {
            var filtro = $("#buscarFac").val().toUpperCase();

            $("#DatosProSac td").each(function () {
                var textoEnTd = $(this).text().toUpperCase();

                if (textoEnTd.indexOf(filtro) >= 0) {
                    $(this).addClass("existe");
                } else {
                    $(this).removeClass("existe");
                }
            });

            $("#DatosProSac tbody tr").each(function () {
                if ($(this).children(".existe").length > 0) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }

        // Buscar por fecha
        function FiltrarFechas() {

            var filtroInicio = new Date($("#fechaInicio").val()); // Obtener la fecha de inicio como objeto Date
            var filtroFin = new Date($("#fechaFin").val()); // Obtener la fecha de fin como objeto Date

            $("#DatosProSac td").each(function () {
                var fechaEnTd = new Date($(this).text());

                // Comprobar si la fecha en el td está dentro del rango filtrado
                if (!isNaN(fechaEnTd) && fechaEnTd >= filtroInicio && fechaEnTd <= filtroFin) {
                    $(this).addClass("existe");
                } else {
                    $(this).removeClass("existe");
                }
            });

            $("#DatosProSac tbody tr").each(function () {
                if ($(this).children(".existe").length > 0) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }

        // Crear excel de facturas
        function ExcelFacSac() {

            var filtroInicio = $("#fechaInicio").val(); // Obtener la fecha de inicio como objeto Date
            var filtroFin = $("#fechaFin").val(); // Obtener la fecha de fin como objeto Date

            if (filtroInicio != "" && filtroFin != "") {
                socket.emit("SacarExcel", { fechaInicio: filtroInicio, fechaFin: filtroFin });

                socket.on("SacarRespExcel", (data) => {
                    alert(data.mensaje);
                    location.reload();
                });
            }
        }

    } else {
        location.href = "index";
    }
} else if (pathname == "/users/altasEqp") {
    window.addEventListener("load", function (event) {
        cargarNombres();
    });
    //Formulario desplegable
    const Equipos = $('#Equip');
    const Menu = $("#Desplegable");

    const Hardware = $('#HardE');
    const Software = $('#SoftE');

    const Monitor = $('#MonE');
    const NSMon = $('#N_Ser_M');

    const Mouse = $('#MouseE');
    const Teclado = $('#TecladE');
    const Accesorio = $('#AccesE');

    Menu.hide();
    //Formulario.reset();
    Equipos.on('change', function () {
        if (Equipos.val() == 'CPU') {
            Menu.slideDown();//Lo abre
        } else {
            Menu.slideUp();//Lo cierra
            //Quita los required
            Hardware.prop('required', false);
            Software.prop('required', false);
            NSMon.prop('required', false);
            Monitor.prop('required', false);
            //Pone valores vacío
            Hardware.val('');
            Software.val('');
            NSMon.val('');
            Monitor.val('');
            Mouse.val('');
            Teclado.val('');
            Accesorio.val('');
        }
    });
    //VALIDAR FORMULARIO DEPENDIENDO SI LLENAN CAMPOS
    //Funcion general
    function Listeners(elemento, evento, funcion) {
        elemento.on(evento, funcion);
    }

    Listeners(Hardware, 'input', function (e) {

        if (Hardware.val() != "") {
            Hardware.prop('required', true);
            Software.prop('required', true);
        } else {
            Hardware.prop('required', false);
            Software.prop('required', false);
        }
    });

    Listeners(Software, 'input', function (e) {

        if (Software.val() != "") {
            Hardware.prop('required', true);
            Software.prop('required', true);
        } else {
            Hardware.prop('required', false);
            Software.prop('required', false);
        }
    });

    Listeners(Monitor, 'input', function (e) {

        if (Monitor.val() != "") {
            NSMon.prop('required', true);
            Monitor.prop('required', true);
        } else {
            NSMon.prop('required', false);
            Monitor.prop('required', false);
        }
    });

    Listeners(NSMon, 'input', function (e) {

        if (NSMon.val() != "") {
            NSMon.prop('required', true);
            Monitor.prop('required', true);
        } else {
            NSMon.prop('required', false);
            Monitor.prop('required', false);
        }
    });

    const FormEquip = $('#AltaEquip');
    FormEquip.on('submit', function (e) {
        e.preventDefault();

    });
}