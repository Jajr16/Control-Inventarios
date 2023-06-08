var tok = localStorage.getItem("token");
var socket = io.connect("http://localhost:3001");
var pathname = window.location.pathname;
//BUSCAR
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
//ENVIAR SOCKETS
function enviarSocket(identificador, mensaje) {
    socket.emit(identificador, mensaje);
}

function recibirSocket(identificador) {
    socket.once(identificador, function (Respuesta) {
        alert(Respuesta.mensaje);
        if (Respuesta.Res == "Si") {
            location.reload();
        }
    });

}

function eliminar(elementoBoton, mensaje, mensajeSocket) {
    var confirmacion = confirm(mensaje);

    if (confirmacion) {
        var fila = elementoBoton.parentNode;
        var codigoBarras = fila.querySelector("td:first-child").innerHTML;

        enviarSocket(mensajeSocket, codigoBarras);

        // Eliminar la fila de la tabla
        fila.parentNode.removeChild(fila);
    }
}

function eliminarEmp(elementoBoton, mensaje, mensajeSocket) {
    var confirmacion = confirm(mensaje);

    if (confirmacion) {
        var fila = elementoBoton.parentNode;
        var codigoBarras = fila.querySelector("td:first-child").innerHTML;

        enviarSocket(mensajeSocket, { Nemp: codigoBarras, Nus: localStorage.getItem('user') });
    }
}

function eliminarMobiliario(elementoBoton, mensaje, mensajeSocket) {
    var confirmacion = confirm(mensaje);

    if (confirmacion) {
        var fila = elementoBoton.parentNode;
        var NumInventario = fila.querySelector("td:first-child").innerHTML;

        enviarSocket(mensajeSocket, NumInventario);

        // Eliminar la fila de la tabla
        fila.parentNode.removeChild(fila);
    }
}

function eliminarEquipo(elementoBoton, mensaje, mensajeSocket) {
    var confirmacion = confirm(mensaje);

    if (confirmacion) {
        var fila = elementoBoton.parentNode;
        var NumInventario = fila.querySelector("td:first-child").innerHTML;

        enviarSocket(mensajeSocket, NumInventario);

        // Eliminar la fila de la tabla
        fila.parentNode.removeChild(fila);
    }
}


if (pathname == "/users/altasPro") {
    if (tok == "4dnM3k0nl9s" || tok == "4dnM3k0nl9z" || tok == "4dnM3k0nl9A" || tok == "FGJYGd42DSAFA" || tok == "4dnM3k0nl9w" /*TEMPOTAL*/) {

        const FormProduct = document.querySelector("#AltaProductos");

        // Altas de productos
        FormProduct.addEventListener("submit", Enviar);

        function Enviar(e) {
            e.preventDefault();
            if ($("#Cod_Barras").val() != "" && $("#FecActu").val() != "" && $("#Categoria").val() != "" && $("#NomP").val() != "" && $("#MarcActi").val() != "" && $("#DescripcionP").val() != "" && $("#Proveedor").val() != "" && $("#NumFact").val() != "" && $("#CantidadP").val() != "" && $("#UnidadP").val() != "" && $("#FecFact").val()) {

                socket.emit('Alta_Prod', { CodBarras: $("#Cod_Barras").val(), FecAct: $("#FecActu").val(), Cate: $("#Categoria").val(), Producto: $("#NomP").val(), Marca: $("#MarcActi").val(), Descripcion: $("#DescripcionP").val(), Proveedor: $("#Proveedor").val(), NumFactura: $("#NumFact").val(), FechaFac: $("#FecFact").val(), Cantidad: $("#CantidadP").val(), Unidad: $("#UnidadP").val() });

                socket.once('Fact_Exists', function (Respuesta) {
                    alert(Respuesta.mensaje);
                });

                socket.once('Producto_Existente', function (Respuesta) {
                    alert(Respuesta.mensaje);
                    location.reload();
                });

                socket.once('Producto_Inexistente', function (Respuesta) {
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

        // Asignación del evento de clic en los botones de eliminar
        window.addEventListener('DOMContentLoaded', () => {
            const botonesEliminar = document.getElementsByClassName("BotonER");

            for (let i = 0; i < botonesEliminar.length; i++) {
                botonesEliminar[i].addEventListener("click", function () {
                    eliminarProducto(this);
                });
            }
        });

        socket.emit("Consul_Prod");
        // Consulta de productos
        socket.on('Desp_Productos', async (data) => {
            const tbody = document.querySelector("#DatosProd tbody");

            if (data.eliminado == 1) {
                tbody.innerHTML += `
            <tr style="background-color: #590C09">
                <td>${data.Cod_Barras}</td>
                <td>${data.Categoria}</td>
                <td>${data.NArt}</td>
                <td>${data.NMarca}</td>
                <td>${data.Desc}</td>
                <td>${data.Unidad}</td>
                <td>${data.Existencia}</td>
                <td> - </td>
                <td> - </td>
            </tr>
            `;
            } else {
                tbody.innerHTML += `
            <tr>
                <td>${data.Cod_Barras}</td>
                <td>${data.Categoria}</td>
                <td>${data.NArt}</td>
                <td>${data.NMarca}</td>
                <td>${data.Desc}</td>
                <td>${data.Unidad}</td>
                <td>${data.Existencia}</td>
                <td class="BotonER"> Eliminar </td>
                <td class="BotonMod" onclick='Abrir()'> Modificar </td>
            </tr>
            `;
            }

            // Volver a asignar el evento de clic a los botones de eliminar
            const botonesEliminar = document.getElementsByClassName("BotonER");

            for (let i = 0; i < botonesEliminar.length; i++) {
                botonesEliminar[i].addEventListener("click", function () {
                    eliminar(this, '¿Deseas eliminar este producto?', 'Bajas_Prod');
                });
            }
        });

        socket.once('Producto_Eliminado', (data) => {
            alert(data.mensaje);
            location.reload();
        });
        socket.once('Error', (data) => {
            alert(data.mensaje);
        })

        // Crear excel
        function Excel() {
            socket.emit("Excel");

            socket.once("RespExcel", (data) => {
                alert(data.mensaje);
                location.reload();
            });
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

                    socket.once('Producto_Inexistente', function (Respuesta) {
                        alert(Respuesta.mensaje);
                        location.reload();
                    });

                    socket.once('Fallo_Mod', function (Respuesta) {
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

                    socket.once('Factura_Agregada', function (Respuesta) {
                        alert(Respuesta.mensaje);
                        location.reload();
                    });

                    socket.once('Fallo_Factura', function (Respuesta) {
                        alert(Respuesta.mensaje);
                        location.reload();
                    });
                    socket.once('Ya_Registrado', function (Respuesta) {
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

                        socket.once('Eliminacion_Realizada', function (Respuesta) {
                            alert(Respuesta.mensaje);
                            location.reload();
                        });
                        socket.once('Fallo_BajasExist', function (Respuesta) {
                            alert(Respuesta.mensaje);
                            location.reload();
                        });
                    }
                }
            }
        });

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

                socket.once('Usuario_Existente', function (Respuesta) {
                    alert(Respuesta.mensaje);
                    location.reload();
                });

                socket.once('Usuario_Agregado', function (Respuesta) {
                    alert(Respuesta.mensaje);
                    location.reload();
                });

                socket.once('Usuario_Error', function (Respuesta) {
                    alert(Respuesta.mensaje);
                    location.reload();
                });
            }
        }
    } else {
        location.href = "index";
    }
} else if (pathname == "/users/consulUsuarios") {
    if (tok == "4dnM3k0nl9s") {

        // Asignación del evento de clic en los botones de eliminar
        window.addEventListener('DOMContentLoaded', () => {
            const botonesEliminar = document.getElementsByClassName("BotonER");

            for (let i = 0; i < botonesEliminar.length; i++) {
                botonesEliminar[i].addEventListener("click", function () {
                    eliminarProducto(this);
                });
            }
        });

        socket.emit("Consul_Usuario");

        // Consulta de productos
        socket.on('Desp_Usuario', async (data) => {
            const tbody = document.querySelector("#DatosProd tbody");

            tbody.innerHTML += `
            <tr>
                <td>${data.Usuario}</td>
                <td>${data.Pass}</td>
                <td class="BotonER"> Eliminar </td>
                <td class="BotonMod" onclick='Abrir()'> Modificar </td>
            </tr>
            `;

            // Volver a asignar el evento de clic a los botones de eliminar
            const botonesEliminar = document.getElementsByClassName("BotonER");

            for (let i = 0; i < botonesEliminar.length; i++) {
                botonesEliminar[i].addEventListener("click", function () {
                    eliminarUsuario(this);
                });
            }
        });

        function eliminarUsuario(elementoBoton) {
            var confirmacion = confirm('¿Deseas eliminar este usuario?');

            if (confirmacion) {
                var fila = elementoBoton.parentNode;
                var Usuario = fila.querySelector("td:first-child").innerHTML;

                if (localStorage.getItem('user') != Usuario) {
                    enviarSocket('Bajas_Usuario', Usuario);
                    // Eliminar la fila de la tabla
                    fila.parentNode.removeChild(fila);
                } else {
                    alert("No puedes eliminar tu propio usuario.");
                }

            }
        }

        //Llenar datos en automático
        var valores0 = "";
        var valores1 = "";
        var valores2 = "";

        //Modificar usuarios
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
                }
                document.getElementById("UsuarioM").value = valores0;
                document.getElementById("PassM").value = valores1;
            }

            // Cambios de productos
            const FormMod = document.querySelector("#ModProduct");

            // Cambios de productos
            FormMod.addEventListener("submit", Enviar);

            function Enviar(e) {

                e.preventDefault();

                if ($("#UsuarioM").val() != "" && $("#Num_EmpPM").val() != "" && $("#PassM").val() != "") {
                    socket.emit('Cambios_Usuario', { Usuario: $("#UsuarioM").val(), Nom_Emp: $("#Num_EmpPM").val(), Pass: $("#PassM").val() }, { OLDUser: valores0 });

                    socket.once('Usuario_Inexistente', function (Respuesta) {
                        alert(Respuesta.mensaje);
                        location.reload();
                    });

                    socket.once('Fallo_ModUserd', function (Respuesta) {
                        alert(Respuesta.mensaje);
                    });
                }
            }
            recibirSocket('RespDelUs');
        });
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

        // Buscar por fecha
        function FiltrarFechas() {
            if ($("#fechaInicio").val() != "" && $("#fechaFin").val() != "") {
                $("#Adverticement").removeClass("anuncio");
                $("#Adverticement").text('');

                var filtroInicio = new Date($("#fechaInicio").val()); // Obtener la fecha de inicio como objeto Date
                var filtroFin = new Date($("#fechaFin").val()); // Obtener la fecha de fin como objeto Date
                filtroFin.setDate(filtroFin.getDate() + 1);
                console.log(filtroFin);

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
            } else {
                $("#Adverticement").text('Llene todos los campos.');
                $("#Adverticement").addClass("anuncio");
            }
        }

        // Crear excel de facturas
        function ExcelFacSac() {

            var filtroInicio = new Date($("#fechaInicio").val()); // Obtener la fecha de inicio como objeto Date
            var filtroFin = new Date($("#fechaFin").val()); // Obtener la fecha de fin como objeto Date
            filtroFin.setDate(filtroFin.getDate() + 1);

            socket.emit("SacarExcel", { fechaInicio: filtroInicio, fechaFin: filtroFin });

            socket.once("SacarRespExcel", (data) => {
                alert(data.mensaje);
                location.reload();
            });
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

        if ($("#Num_Serie").val() != "" && $("#Equip").val() != "" && $("#MarcE").val() != "" && $("#ModelE").val() != "" && $("#UbiE").val() != "" && $("#NombreEmp").val() != "") {
            //Enviar Equipo
            enviarSocket("Alta_Equipos", { Num_S: $("#Num_Serie").val(), Equipo: $("#Equip").val(), MarcaE: $("#MarcE").val(), ModelE: $("#ModelE").val(), UbiE: $("#UbiE").val(), NomEn: $("#NombreEmp").val() });

            //Enviar HardWare
            if ($("#HardE").val() != "" && $("#SoftE").val() != "") {
                enviarSocket("AltaPc", { Num_S: $("#Num_Serie").val(), HardE: $("#HardE").val(), SoftE: $("#SoftE").val() });
            }
            //Monitores
            if ($("#MonE").val() != "" && $("#N_Ser_M").val() != "") {
                enviarSocket("AltMon", { Num_S: $("#Num_Serie").val(), MonE: $("#MonE").val(), NSMon: $("#N_Ser_M").val() });
            }
            //Mouse
            if ($("#MouseE").val() != "") {
                enviarSocket("AltMouse", { Num_S: $("#Num_Serie").val(), MousE: $("#MouseE").val() });
            }
            //Teclado
            if ($("#TecladE").val() != "") {
                enviarSocket("AltTecla", { Num_S: $("#Num_Serie").val(), TeclaE: $("#TecladE").val() });
            }
            //Accesorios
            if ($("#AccesE").val() != "") {
                enviarSocket("AltAcces", { Num_S: $("#Num_Serie").val(), AccesE: $("#AccesE").val() });
            }
            //Respuesta
            recibirSocket("RespEquipos");
        }
    });

} else if (pathname == "/users/consulEqp") {
    // Asignación del evento de clic en los botones de eliminar
    window.addEventListener('DOMContentLoaded', () => {
        const botonesEliminar = document.getElementsByClassName("BotonER");

        for (let i = 0; i < botonesEliminar.length; i++) {
            botonesEliminar[i].addEventListener("click", function () {
                eliminarEquipo(this, '¿Deseas eliminar este producto de equipos?', 'Bajas_Equipos');
            });
        }
    });
    // desplegar lista de nombre de empleados
    window.addEventListener("load", function (event) {
        cargarNombres();
    });

    window.onpageshow = function () {
        $('#NombreEmp').select2({
            allowClear: true,
            placeholder: 'Buscar empleado'
        });
    };

    socket.emit("Consul_Equipos");

    // Consulta de productos
    socket.on('Desp_Equipos', async (data) => {
        const tbody = document.querySelector("#DatosProd tbody");

        tbody.innerHTML += `
        <tr>
            <td>${data.Num_Serie}</td>
            <td>${data.Equipo}</td>
            <td>${data.Marca}</td>
            <td>${data.Modelo}</td>
            <td>${data.NombreEmp}</td>
            <td>${data.Ubi}</td>
            <td class="BotonER"> Eliminar </td>
            <td class="BotonMod" onclick='Abrir()'> Modificar </td>
        </tr>
        `;

        // Volver a asignar el evento de clic a los botones de eliminar
        const botonesEliminar = document.getElementsByClassName("BotonER");

        for (let i = 0; i < botonesEliminar.length; i++) {
            botonesEliminar[i].addEventListener("click", function () {
                eliminarEquipo(this, '¿Deseas eliminar este producto de equipos?', 'Bajas_Equipos');
            });
        }
    });

    //Llenar datos en automático
    var valores0 = "";
    var valores1 = "";
    var valores2 = "";
    var valores3 = "";
    var valores4 = "";
    var valores5 = "";

    //Modificar usuarios
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
            }
            document.getElementById("Num_SerieM").value = valores0;
            document.getElementById("EquipM").value = valores1;
            document.getElementById("MarcEM").value = valores2;
            document.getElementById("ModelEM").value = valores3;
            document.getElementById("NombreEmp").value = valores4;
            document.getElementById("UbiEM").value = valores5;
        }

        // Cambios de equipos
        const FormMod = document.querySelector("#ModEquipos");

        // Cambios de equipos
        FormMod.addEventListener("submit", Enviar);

        function Enviar(e) {

            e.preventDefault();

            if ($("#Num_SerieM").val() != "" && $("#EquipM").val() != "" && $("#MarcEM").val() != "" && $("#ModelEM").val() != "" && $("#NombreEmp").val() != "" && $("#UbiEM").val() != "") {
                socket.emit('Cambios_Equipos', {Num_Serie: $("#Num_SerieM").val(), Equipo: $("#EquipM").val(), Marca: $("#MarcEM").val(), Modelo: $("#ModelEM").val(), NombreEmp: $("#NombreEmp").val(), Ubi: $("#UbiEM").val() }, { OLDNum_S: valores0 });
            }
        }
    });
    recibirSocket('RespDelEqp');

} else if (pathname == "/users/ModEmp") {
    if (tok == "4dnM3k0nl9s") {
        enviarSocket("DatEmp", "");

        window.addEventListener("load", function (event) {
            cargarNombres2();
        });

        window.onpageshow = function () {
            $('#NomJefe').select2({
                allowClear: true,
                placeholder: 'Buscar empleado'
            });
        };

        // Consulta de productos
        socket.on('DespEmp', async (data) => {
            const tbody = document.querySelector("#DatosProd tbody");

            tbody.innerHTML += `
            <tr>
                <td>${data.NomEmp}</td>
                <td>${data.Area}</td>
                <td>${data.NomJefe}</td>
                <td class="BotonER"> Eliminar </td>
                <td class="BotonMod"> Modificar </td>
            </tr>
            `;

            // Volver a asignar el evento de clic a los botones de eliminar
            const botonesEliminar = document.getElementsByClassName("BotonER");

            for (let i = 0; i < botonesEliminar.length; i++) {
                botonesEliminar[i].addEventListener("click", function () {
                    eliminarEmp(this, '¿Deseas eliminar este empleado?', 'EmpDelete');
                });
            }
        });

        var valores0 = "", valores1 = "", valores2 = "";
        socket.once('ButtonUpEmp', () => {
            let BotonMod = document.getElementsByClassName("BotonMod");

            for (let i = 0; i < BotonMod.length; i++) {
                BotonMod[i].addEventListener("click", LlenarFormEmp);
            }

            function LlenarFormEmp(e) {
                var elementosTD = e.srcElement.parentElement.getElementsByTagName("td");

                for (let i = 0; i < elementosTD.length; i++) {
                    // obtenemos cada uno de los valores y los ponemos en la variable "valores"
                    valores0 = elementosTD[0].innerHTML;
                    valores1 = elementosTD[1].innerHTML;
                    valores2 = elementosTD[2].innerHTML;
                }
                document.getElementById("NEM").value = valores0;
                document.getElementById("AreaME").value = valores1;
                $('#NomJefe').val(valores2).trigger('change.select2');
            }
        });

        const FormModEmp = $('#ModProduct');
        FormModEmp.on('submit', function (e) {
            e.preventDefault();

            if ($('#NEM').val() != "" && $('#AreaME').val() != "" && $('#NomJefe')) {
                socket.emit('ModEmp', { NewName: $('#NEM').val(), NewArea: $('#AreaME').val(), NewBoss: $('#NomJefe').val() }, { OldName: valores0 });
            }
        });

        recibirSocket('MensajeEmp');
    }
} else if (pathname == "/users/consulMob") {
    if (tok == "4dnM3k0nl9s" || tok == "4dnM3k0nl9z" || tok == "4dnM3k0nl9A" || tok == "FGJYGd42DSAFA" || tok == "4dnM3k0nl9w" /*TEMPOTAL*/) {
        
        // Asignación del evento de clic en los botones de eliminar
        window.addEventListener('DOMContentLoaded', () => {
            const botonesEliminar = document.getElementsByClassName("BotonER");

            for (let i = 0; i < botonesEliminar.length; i++) {
                botonesEliminar[i].addEventListener("click", function () {
                    eliminarMobiliario(this, '¿Deseas eliminar este producto de mobiliario?', 'Bajas_Mobiliario');
                });
            }
        });
        // desplegar lista de nombre de empleados
        window.addEventListener("load", function (event) {
            cargarNombres();
        });

        window.onpageshow = function () {
            $('#NombreEmp').select2({
                allowClear: true,
                placeholder: 'Buscar empleado'
            });
        };

        socket.emit("Consul_Mobiliario");

        // Consulta de mobiliario
        socket.on('Desp_Mobiliario', async (data) => {
            const tbody = document.querySelector("#DatosProd tbody");

            tbody.innerHTML += `
            <tr>
                <td>${data.Descripcion}</td>
                <td>${data.NombreEmp}</td>
                <td class="BotonER"> Eliminar </td>
                <td class="BotonMod" onclick='Abrir()'> Modificar </td>
            </tr>
            `;

            // Volver a asignar el evento de clic a los botones de eliminar
            const botonesEliminar = document.getElementsByClassName("BotonER");

            for (let i = 0; i < botonesEliminar.length; i++) {
                botonesEliminar[i].addEventListener("click", function () {
                    eliminarMobiliario(this, '¿Deseas eliminar este producto de mobiliario?', 'Bajas_Mobiliario');
                });
            }
        });

        //Llenar datos en automático
        var valores0 = "";
        var valores1 = "";

        //Modificar mobiliario
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
                }
                document.getElementById("DescM").value = valores0;
                document.getElementById("NombreEmp").value = valores1;
            }

            // Cambios de mobiliario
            const FormMod = document.querySelector("#ModMobi");

            // Cambios de mobiliario
            FormMod.addEventListener("submit", Enviar);

            function Enviar(e) {

                e.preventDefault();

                if ($("#DescM").val() != "" && $("#NombreEmp").val() != "") {
                    socket.emit('Cambios_Mobiliario', {Descripcion: $("#DescM").val(), NombreEmp: $("#NombreEmp").val() }, { OLDDesc: valores0 });
                }
            }
        });
        recibirSocket('RespDelMob');
    } else {
        location.href = "index";
    }
} else if (pathname == "/users/altasMob") {
    if (tok == "4dnM3k0nl9s" || tok == "4dnM3k0nl9z" || tok == "4dnM3k0nl9A" || tok == "FGJYGd42DSAFA" || tok == "4dnM3k0nl9w" /*TEMPOTAL*/) {

        // desplegar lista de nombre de empleados
        window.addEventListener("load", function (event) {
            cargarNombres();
        });

        window.onpageshow = function () {
            $('#NombreEmp').select2({
                allowClear: true,
                placeholder: 'Buscar empleado'
            });
        };

        const FormProduct = document.querySelector("#AltaMobiliario");

        // Altas de mobiliario
        FormProduct.addEventListener("submit", Enviar);

        function Enviar(e) {
            e.preventDefault();
            if ($("#DescM").val() != "" && $("#NombreEmp").val() != "" ) {

                socket.emit('Alta_Mob', {Descripcion: $("#DescM").val(), NombreEmp: $("#NombreEmp").val() });

                socket.once('Mobiliario_Existente', function (Respuesta) {
                    alert(Respuesta.mensaje);
                    location.reload();
                });

                socket.once('Mobiliario_Inexistente', function (Respuesta) {
                    alert(Respuesta.mensaje);
                    location.reload();
                });
            }
        }

    }
}