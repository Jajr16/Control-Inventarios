var Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
var carrito = JSON.parse(localStorage.getItem('carrito')) || [];
var area = localStorage.getItem('area');
var user = localStorage.getItem('user');
var socket = io.connect("http://localhost:3001");
var pathname = window.location.pathname;
//////////////////////// CARRITO //////////////////////

$(document).ready(function () {
    socket.emit('CNPC', user)

    socket.once('ECBSR', function (data) {
        if (data !== 0) {
            notification = $('.notification-circle')
            notification.css("visibility", "visible");
            notification.text(parseInt(data))
        }
    })

    if (Permisos['PETICIONES']) {
        socket.emit('CNPE', 'PETICIONES')
    }

    if (area === 'DIRECCION GENERAL') {
        socket.emit('CNPE', 'DIRECCION GENERAL')
    }

    socket.once('ECNPER', function (data) {
        console.log(data)
        if (data != 0) {
            notificacionD = $('.not_container_request')
            notificacionD.css("visibility", "visible")
            notificacionD.text(parseInt(data))
        }
    })
})


//////////////////////// PERMISOS /////////////////////
// Configuración de permisos por módulo
var permisosPorModulo = [
    { modulo: '#ALMACÉN', contenedor: '#listaCheckboxesA', checks: ['[id$="A"]'], permisos: { Altas: '#1A', Bajas: '#2A', Cambios: '#3A', Consultas: '#4A' } },
    { modulo: '#MOBILIARIO', contenedor: '#listaCheckboxesM', checks: ['[id$="M"]'], permisos: { Altas: '#1M', Bajas: '#2M', Cambios: '#3M', Consultas: '#4M' } },
    { modulo: '#EQUIPOS', contenedor: '#listaCheckboxesEqp', checks: ['[id$="E"]'], permisos: { Altas: '#1E', Bajas: '#2E', Cambios: '#3E', Consultas: '#4E' } },
    { modulo: '#RESPONSIVAS', contenedor: '#listaCheckboxesR', checks: ['[id$="R"]'], permisos: { Altas: '#1R', Bajas: '#2R', Cambios: '#3R', Consultas: '#4R' } },
    { modulo: '#USUARIOS', contenedor: '#listaCheckboxesU', checks: ['[id$="U"]'], permisos: { Altas: '#1U', Bajas: '#2U', Cambios: '#3U', Consultas: '#4U' } },
    { modulo: '#EMPLEADOS', contenedor: '#listaCheckboxesE', checks: ['[id$="EM"]'], permisos: { Altas: '#1EM', Bajas: '#2EM', Cambios: '#3EM', Consultas: '#4EM' } },
];

function PermisosGenerales() {
    $(document).ready(function () {
        // Manejar el evento de cambio en los checkboxes principales
        permisosPorModulo.forEach(function (permiso) {
            $(permiso.modulo).change(function () {
                $(permiso.contenedor).toggle(this.checked);
                if (!this.checked) {
                    permiso.checks.forEach(function (check) {
                        $(check).prop('checked', false);
                    });
                }
            });
        });
    });
}
function obtenerPermisosSeleccionadosConModulo() {
    var permisosSeleccionados = [];

    permisosPorModulo.forEach(function (permiso) {
        var modulo = permiso.modulo;
        var permisos = permiso.permisos;

        if ($(modulo).is(':checked')) {
            Object.keys(permisos).forEach(function (accion) {
                var checkboxId = permisos[accion];
                if ($(checkboxId).is(':checked')) {
                    var permisoSeleccionado = {
                        modulo: modulo,
                        accion: accion
                    };
                    permisosSeleccionados.push(permisoSeleccionado);
                }
            });
        }
    });

    return permisosSeleccionados;
}
//////////////////////////////////// EXCEL //////////////////////////////////////
// Crear excel
function Excel(Excel) {
    socket.emit(Excel);

    socket.once("RespExcel", (data) => {
        Swal.fire(data.mensaje).then(() => {
            location.reload();
        });
    });
}

//BUSCAR
// Barra de busqueda
function cargarSelect(IdType) {
    // desplegar lista de nombre de empleados
    window.addEventListener("load", function (event) {
        cargarNombres();
    });

    window.onpageshow = function () {
        $(IdType).select2({
            allowClear: true,
            placeholder: 'Buscar empleado'
        });
    };
}

function cargarSelect2(IdType) {
    // desplegar lista de nombre de empleados
    window.addEventListener("load", function (event) {
        cargarNombres2();
    });

    window.onpageshow = function () {
        $(IdType).select2({
            allowClear: true,
            placeholder: 'Buscar empleado'
        });
    };
}

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
    var selectNombres = document.getElementById("NombreEmp");

    var opcion = document.createElement("option");

    opcion.text = Nombr;

    selectNombres.add(opcion);
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
    patron = /[A-Za-z0-9ñÑ]/;
    tecla_final = String.fromCharCode(tecla);
    return patron.test(tecla_final);
}

/////////////////// EMPTY TABLE ////////////////////
function empty_table(tabla, n) {
    $('#' + tabla + ' tbody').append($('<tr><td colspan="' + n + '"><center><h3>En este momento no hay nada agregado.</h3></center></td></tr>'))
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
        Swal.fire(Respuesta.mensaje).then(() => {
            if (Respuesta.Res) {
                location.reload();
            }
        });
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
if (pathname === "/users/RegistroEmpleado" || pathname === "/users/ModEmp") {
    if (!Permisos['EMPLEADOS']) {
        location.href = "index";
    } else {
        if (pathname === "/users/RegistroEmpleado" && Permisos['EMPLEADOS'].includes('1')) {
            cargarSelect2('#NomJefe');

            const FormRegistro = document.querySelector("#Registro");
            // Registro de usuario
            FormRegistro.addEventListener('submit', EnviarReg);

            function EnviarReg(e) {
                e.preventDefault();

                if ($("#Area").val() != "" && $("#NombreEmp").val() != "" && $("#NomJefe").val() != "") {

                    socket.emit('Reg_Emp', { NombreEmp: $("#NombreEmp").val(), Area: $("#Area").val(), NomJefe: $("#NomJefe").val() });

                    recibirSocket('Res_Emp')
                }
            }
        } else if (pathname === "/users/ModEmp" && (Permisos['EMPLEADOS'].includes('4') || Permisos['EMPLEADOS'].includes('2') || Permisos['EMPLEADOS'].includes('3'))) {
            cargarSelect2('#NomJefe');

            enviarSocket("DatEmp", "");
            const thead = document.querySelector("#firstrow");

            let CabHTML = "";

            if (Permisos['EMPLEADOS'].includes('2')) {
                CabHTML += `<th>Eliminar</th>`;
            }
            if (Permisos['EMPLEADOS'].includes('3')) {
                CabHTML += `<th>Modificar</th>`;
            }

            thead.innerHTML += CabHTML;

            // Consulta de productos
            socket.on('DespEmp', async (data) => {
                const tbody = document.querySelector("#DatosProd tbody");

                let filaHTML = `
            <tr>
                <td>${data.NomEmp}</td>
                <td>${data.Area}</td>
                <td>${data.NomJefe}</td>`;
                if (Permisos['EMPLEADOS'].includes('2')) {
                    filaHTML += `<td class="BotonER"> Eliminar </td>`;
                }
                if (Permisos['EMPLEADOS'].includes('3')) {
                    filaHTML += `<td class="BotonMod" > Modificar </td>`;
                }
                filaHTML += `</tr>`;

                tbody.innerHTML += filaHTML;

                if (Permisos['EMPLEADOS'].includes('2')) {
                    // Volver a asignar el evento de clic a los botones de eliminar
                    const botonesEliminar = document.getElementsByClassName("BotonER");

                    for (let i = 0; i < botonesEliminar.length; i++) {
                        botonesEliminar[i].addEventListener("click", function () {
                            eliminarEmp(this, '¿Deseas eliminar este empleado?', 'EmpDelete');
                        });
                    }
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
                    $('#NomJefe').val(valores2.replace(/\s+$/, '')).trigger('change.select2');
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
        } else {
            location.href = "index";
        }
    }
} else if (pathname === "/users/RegistrarUsuario" || pathname === "/users/consulUsuarios") {
    if (!Permisos['USUARIOS']) {
        location.href = 'index';
    } else {
        if (pathname === "/users/RegistrarUsuario" && Permisos['USUARIOS'].includes('1')) {
            cargarSelect('#NombreEmp');

            PermisosGenerales();

            const FormRegistro = document.querySelector("#Registro");

            // Registro de usuario
            FormRegistro.addEventListener('submit', EnviarReg);

            function EnviarReg(e) {

                var permisosDados = obtenerPermisosSeleccionadosConModulo();

                e.preventDefault();
                if ($("#NombreEmp").val() != "" && $("#NombreUser").val() != "" && $("#ContraNueva").val() != "") {
                    socket.emit('Registro_Usuario', { NombreEmp: $("#NombreEmp").val(), N_User: $("#NombreUser").val(), ContraNueva: $("#ContraNueva").val(), permisos: permisosDados });

                    recibirSocket('Usuario_Ans')
                }
            }
        } else if (pathname === "/users/consulUsuarios" && (Permisos['USUARIOS'].includes('4') || Permisos['USUARIOS'].includes('2') || Permisos['USUARIOS'].includes('3'))) {
            // Asignación del evento de clic en los botones de eliminar
            window.addEventListener('DOMContentLoaded', () => {
                const botonesEliminar = document.getElementsByClassName("BotonER");

                for (let i = 0; i < botonesEliminar.length; i++) {
                    botonesEliminar[i].addEventListener("click", function () {
                        eliminarProducto(this);
                    });
                }
            });

            const thead = document.querySelector("#firstrow");

            let CabHTML = "";

            if (Permisos['USUARIOS'].includes('2')) {
                CabHTML += `<th>Eliminar</th>`;
            }
            if (Permisos['USUARIOS'].includes('3')) {
                CabHTML += `<th>Modificar</th>`;
            }

            thead.innerHTML += CabHTML;

            socket.emit("Consul_Usuario");

            // Consulta de usuarios
            socket.on('Desp_Usuario', async (data) => {
                const tbody = document.querySelector("#DatosProd tbody");
                let filaHTML = `
            <tr>
                <td>${data.Empleado}</td>
                <td>${data.Usuario}</td>
                <td>${data.Pass}</td>`;
                if (Permisos['USUARIOS'].includes('2')) {
                    filaHTML += `<td class="BotonER"> Eliminar </td>`;
                }
                if (Permisos['USUARIOS'].includes('3')) {
                    filaHTML += `<td class="BotonMod" > Modificar </td>`;
                }

                filaHTML += `</tr>`;
                tbody.innerHTML += filaHTML;

                if (Permisos['USUARIOS'].includes('2')) {
                    // Volver a asignar el evento de clic a los botones de eliminar
                    const botonesEliminar = document.getElementsByClassName("BotonER");

                    for (let i = 0; i < botonesEliminar.length; i++) {
                        botonesEliminar[i].addEventListener("click", function () {
                            eliminarUsuario(this);
                        });
                    }
                }
            });

            function eliminarUsuario(elementoBoton) {
                var confirmacion = confirm('¿Deseas eliminar este usuario?');

                if (confirmacion) {
                    var fila = elementoBoton.parentNode;
                    var Usuario = fila.querySelector("td:nth-child(2)").innerHTML;
                    if (localStorage.getItem('user') != Usuario) {
                        enviarSocket('Bajas_Usuario', Usuario);
                        // Eliminar la fila de la tabla
                        fila.parentNode.removeChild(fila);
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Oye!!!",
                            text: "No puedes eliminar tu propio usuario.",
                        });
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
                    $(":checkbox").prop("checked", false);
                    // Ocultar todos los contenedores
                    permisosPorModulo.forEach(function (permiso) {
                        $(permiso.contenedor).hide();
                    });

                    var elementosTD = e.srcElement.parentElement.getElementsByTagName("td");
                    // recorremos cada uno de los elementos del array de elementos <td>
                    for (let i = 0; i < elementosTD.length; i++) {
                        // obtenemos cada uno de los valores y los ponemos en la variable "valores"
                        valores0 = elementosTD[1].innerHTML;
                        valores1 = elementosTD[2].innerHTML;
                    }
                    document.getElementById("UsuarioM").value = valores0;
                    document.getElementById("PassM").value = valores1;

                    enviarSocket('PermisosUser', valores0);
                    PermisosGenerales();

                    socket.on('Desp_Permisos', async (data) => {
                        $(`#${data.modulos}`).prop('checked', true);
                        // Mostrar solo el contenedor del módulo correspondiente
                        const moduloCorrespondiente = permisosPorModulo.find(permiso => permiso.modulo === `#${data.modulos}`);
                        if (moduloCorrespondiente) {
                            $(moduloCorrespondiente.contenedor).show();
                            permisosPorModulo.forEach(function (permiso) {
                                if (data.modulos === 'ALMACÉN' && permiso.modulo.slice(1) === 'ALMACÉN') {
                                    if (data.permisos.includes(1)) { $(permiso.permisos.Altas).prop('checked', true); }
                                    if (data.permisos.includes(2)) { $(permiso.permisos.Bajas).prop('checked', true); }
                                    if (data.permisos.includes(3)) { $(permiso.permisos.Cambios).prop('checked', true); }
                                    if (data.permisos.includes(4)) { $(permiso.permisos.Consultas).prop('checked', true); }
                                }
                                if (data.modulos === 'MOBILIARIO' && permiso.modulo.slice(1) === 'MOBILIARIO') {
                                    if (data.permisos.includes(1)) { $(permiso.permisos.Altas).prop('checked', true); }
                                    if (data.permisos.includes(2)) { $(permiso.permisos.Bajas).prop('checked', true); }
                                    if (data.permisos.includes(3)) { $(permiso.permisos.Cambios).prop('checked', true); }
                                    if (data.permisos.includes(4)) { $(permiso.permisos.Consultas).prop('checked', true); }
                                }
                                if (data.modulos === 'EQUIPOS' && permiso.modulo.slice(1) === 'EQUIPOS') {
                                    if (data.permisos.includes(1)) { $(permiso.permisos.Altas).prop('checked', true); }
                                    if (data.permisos.includes(2)) { $(permiso.permisos.Bajas).prop('checked', true); }
                                    if (data.permisos.includes(3)) { $(permiso.permisos.Cambios).prop('checked', true); }
                                    if (data.permisos.includes(4)) { $(permiso.permisos.Consultas).prop('checked', true); }
                                }
                                if (data.modulos === 'RESPONSIVAS' && permiso.modulo.slice(1) === 'RESPONSIVAS') {
                                    if (data.permisos.includes(1)) { $(permiso.permisos.Altas).prop('checked', true); }
                                }
                                if (data.modulos === 'USUARIOS' && permiso.modulo.slice(1) === 'USUARIOS') {
                                    if (data.permisos.includes(1)) { $(permiso.permisos.Altas).prop('checked', true); }
                                    if (data.permisos.includes(2)) { $(permiso.permisos.Bajas).prop('checked', true); }
                                    if (data.permisos.includes(3)) { $(permiso.permisos.Cambios).prop('checked', true); }
                                    if (data.permisos.includes(4)) { $(permiso.permisos.Consultas).prop('checked', true); }
                                }
                                if (data.modulos === 'EMPLEADOS' && permiso.modulo.slice(1) === 'EMPLEADOS') {
                                    if (data.permisos.includes(1)) { $(permiso.permisos.Altas).prop('checked', true); }
                                    if (data.permisos.includes(2)) { $(permiso.permisos.Bajas).prop('checked', true); }
                                    if (data.permisos.includes(3)) { $(permiso.permisos.Cambios).prop('checked', true); }
                                    if (data.permisos.includes(4)) { $(permiso.permisos.Consultas).prop('checked', true); }
                                }
                            });
                        }
                    });

                }

                // Cambios de productos
                const FormMod = document.querySelector("#ModProduct");

                // Cambios de productos
                FormMod.addEventListener("submit", Enviar);

                function Enviar(e) {

                    var permisosDados = obtenerPermisosSeleccionadosConModulo();

                    e.preventDefault();

                    if ($("#UsuarioM").val() != "" && $("#Num_EmpPM").val() != "" && $("#PassM").val() != "") {
                        socket.emit('Cambios_Usuario', { Usuario: $("#UsuarioM").val(), Nom_Emp: $("#Num_EmpPM").val(), Pass: $("#PassM").val(), permisos: permisosDados }, { OLDUser: valores0 });
                    }
                }
                recibirSocket('RespDelUs');
            });
        } else {
            location.href = "index";
        }
    }
} else if (pathname === "/users/altasPro" || pathname === "/users/consulPro" || pathname == "/users/ABPE" || pathname === "/users/FacSacProd") {
    if (!Permisos['ALMACÉN']) {
        location.href = "index";
    } else {
        if (pathname === "/users/altasPro" && Permisos['ALMACÉN'].includes('1')) {
            const FormProduct = document.querySelector("#AltaProductos");

            // Altas de productos
            FormProduct.addEventListener("submit", Enviar);

            function Enviar(e) {
                e.preventDefault();
                if ($("#Cod_Barras").val() != "" && $("#FecActu").val() != "" && $("#Categoria").val() != "" && $("#NomP").val() != "" && $("#MarcActi").val() != "" && $("#DescripcionP").val() != "" && $("#Proveedor").val() != "" && $("#NumFact").val() != "" && $("#CantidadP").val() != "" && $("#UnidadP").val() != "" && $("#FecFact").val()) {

                    socket.emit('Alta_Prod', { CodBarras: $("#Cod_Barras").val(), FecAct: $("#FecActu").val(), Cate: $("#Categoria").val(), Producto: $("#NomP").val(), Marca: $("#MarcActi").val(), Descripcion: $("#DescripcionP").val(), Proveedor: $("#Proveedor").val(), NumFactura: $("#NumFact").val(), FechaFac: $("#FecFact").val(), Cantidad: $("#CantidadP").val(), Unidad: $("#UnidadP").val() });

                    recibirSocket('Producto_Ans')
                }
            }
        } else if (pathname === "/users/consulPro" && (Permisos['ALMACÉN'].includes('4') || Permisos['ALMACÉN'].includes('2') || Permisos['ALMACÉN'].includes('3'))) {
            // Asignación del evento de clic en los botones de eliminar
            window.addEventListener('DOMContentLoaded', () => {
                const botonesEliminar = document.getElementsByClassName("BotonER");

                for (let i = 0; i < botonesEliminar.length; i++) {
                    botonesEliminar[i].addEventListener("click", function () {
                        eliminarProducto(this);
                    });
                }
            });

            const thead = document.querySelector("#firstrow");

            let CabHTML = "";

            if (Permisos['ALMACÉN'].includes('2')) {
                CabHTML += `<th>Eliminar</th>`;
            }
            if (Permisos['ALMACÉN'].includes('3')) {
                CabHTML += `<th>Modificar</th>`;
            }
            if (Permisos['ALMACÉN'].includes('4')) {
                CabHTML += `<th>Solicitar Artículo</th>`;
            }

            thead.innerHTML += CabHTML;

            socket.emit("Consul_Prod");
            // Consulta de productos
            socket.on('Desp_Productos', async (data) => {
                const tbody = document.querySelector("#DatosProd tbody");

                let filaHTML = `
                <tr>
                    <td>${data.Cod_Barras}</td>
                    <td>${data.Categoria}</td>
                    <td>${data.NArt}</td>
                    <td>${data.NMarca}</td>
                    <td>${data.Desc}</td>
                    <td>${data.Unidad}</td>
                    <td>${data.Existencia}</td>`;

                if (data.eliminado == 1) {
                    if (Permisos['ALMACÉN'].includes('2')) {
                        filaHTML += `<td> - </td>`;
                    }
                    if (Permisos['ALMACÉN'].includes('3')) {
                        filaHTML += `<td> - </td>`;
                    }
                    if (Permisos['ALMACÉN'].includes('4')) {
                        filaHTML += `<td> - </td>`;
                    }
                } else {
                    // Verifica los permisos y agrega los botones correspondientes
                    if (Permisos['ALMACÉN'].includes('2')) {
                        filaHTML += `<td class="BotonER"> Eliminar </td>`;
                    }
                    if (Permisos['ALMACÉN'].includes('3')) {
                        filaHTML += `<td class="BotonMod"> Modificar </td>`;
                    }

                    filaHTML += `<td class="BotonAC Carrito_Cant" id="Carrito_Cant"> Solicitar artículo </td>`;

                }

                // Cierra la fila
                filaHTML += `</tr>`;

                // Agrega la fila completa al tbody
                tbody.innerHTML += filaHTML;


                if (Permisos['ALMACÉN'].includes('2')) {
                    // Volver a asignar el evento de clic a los botones de eliminar
                    const botonesEliminar = document.getElementsByClassName("BotonER");

                    for (let i = 0; i < botonesEliminar.length; i++) {
                        botonesEliminar[i].addEventListener("click", function () {
                            eliminar(this, '¿Deseas eliminar este producto?', 'Bajas_Prod');
                        });
                    }
                }

                if (Permisos['ALMACÉN'].includes('4')) {
                    const botonesCarritos = document.getElementsByClassName("BotonAC");

                    for (let i = 0; i < botonesCarritos.length; i++) {
                        botonesCarritos[i].addEventListener("click", function (e) {
                            const btnClickeado = this;

                            if (btnClickeado.classList.contains('BotonAC')) {
                                // Elimina la clase 'BotonAC'
                                btnClickeado.classList.remove('BotonAC');
                                // Crea un nuevo elemento <div> con el input y los íconos
                                const nuevoContenido = document.createElement('div');
                                nuevoContenido.innerHTML = '<input type="text" class="Cantidad_Carrito" id="Cantidad_Carrito" name="Cantidad_Carrito" autocomplete="off" onkeypress="return checkN(event)"><span class="icon-check">✔</span><span class="icon-cross">✘</span>';

                                // Reemplaza el contenido del td con el nuevo elemento
                                btnClickeado.innerHTML = '';
                                btnClickeado.appendChild(nuevoContenido);

                                const check_icon = nuevoContenido.querySelector(".icon-check");

                                check_icon.addEventListener("click", function (e) {

                                    const palomita = this.parentElement.parentElement.parentElement;
                                    const inputCarrito = palomita.querySelector(".Cantidad_Carrito");

                                    if (inputCarrito.value.trim() === '') {
                                        Swal.fire({
                                            icon: "error",
                                            title: "Ey!!!",
                                            text: "Ingresa un valor válido.",
                                        });
                                        return;
                                    }

                                    const padreInput = palomita.getElementsByTagName("td");

                                    var codigoBarras = padreInput[0].innerHTML;

                                    var fecha = Fecha() + ' ' + Hora()

                                    enviarSocket('ECBS', { CBP: codigoBarras, CP: parseFloat(inputCarrito.value), US: user, DATE: fecha })
                                    recibirSocket('ECBSRF')

                                    socket.emit('CNPC', user)

                                    socket.once('ECBSR', function (data) {
                                        if (data !== 0) {
                                            notification = $('.notification-circle')
                                            notification.css("visibility", "visible");
                                            notification.text(parseInt(data))
                                        }
                                    })
                                });

                                const cancel_icon = nuevoContenido.querySelector(".icon-cross");

                                cancel_icon.addEventListener("click", function (e) {
                                    e.stopPropagation(); // Detener la propagación del clic en el ícono
                                    if (!btnClickeado.classList.contains('BotonAC')) {
                                        nuevoContenido.remove();
                                        btnClickeado.classList.add('BotonAC');
                                        btnClickeado.innerHTML = 'Solicitar articulo';
                                    }
                                });
                            }
                        });
                    }

                }
            });
            recibirSocket('Delete_Prod_Ans')

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
                    recibirSocket('Update_Fac_Ans')
                });

                // Cambios de productos
                const FormMod = document.querySelector("#ModProduct");

                // Cambios de productos
                FormMod.addEventListener("submit", Enviar);

                function Enviar(e) {

                    e.preventDefault();

                    if ($("#Cod_BarrasM").val() != "" && $("#CategoriaM").val() != "" && $("#NomPM").val() != "" && $("#MarcActiM").val() != "" && $("#DescripcionPM").val() != "" && $("#UnidadPM").val() != "") {
                        socket.emit('Cambios_Prod', { CodBarras: $("#Cod_BarrasM").val(), Cate: $("#CategoriaM").val(), Producto: $("#NomPM").val(), Marca: $("#MarcActiM").val(), Descripcion: $("#DescripcionPM").val(), Unidad: $("#UnidadPM").val() }, { CBO: valores0, CO: valores1, NAO: valores2, MAO: valores3, DO: valores4, UO: valores5 });

                        recibirSocket('Mod_Prod_Ans')
                    }
                }
            });
        } else if (pathname === "/users/ABPE" && Permisos['ALMACÉN'].includes('1')) {
            cargarSelect('#NombreEmp');

            var valores0 = "";
            var valores1 = "";
            var valores0E = "";
            var valores2E = "";

            socket.emit("Consul_ProdExist");
            // Consulta de productos
            socket.on('Desp_ProductosExist', async (data) => {

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
                <td id="Eliminar" class="BotonERR" onclick="Abrir1()"> Sacar productos</td>
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

                        recibirSocket('Add_ProdExist_Ans')
                    }
                }
            });

            // Sacar producto existente
            socket.on('EliminarProdExist', async () => {
                let EliminarProdExist = document.getElementsByClassName("BotonERR");

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

                            recibirSocket('Del_ProdExists_Ans')
                        }
                    }
                }
            });
        } else if (pathname === "/users/FacSacProd" && Permisos['ALMACÉN'].includes('4')) {
            //Desplegar facturas existentes
            socket.emit("Consul_RegProSac");
            // Consulta de productos
            socket.on('Desp_Productos', async (data) => {

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

                recibirSocket('SacarRespExcel')
            }
        } else {
            location.href = "index";
        }
    }
} else if (pathname == "/users/altasEqp" || pathname === "/users/consulEqp") {
    if (!Permisos['EQUIPOS']) {
        location.href = "index";
    } else {
        if (pathname == "/users/altasEqp" && Permisos['EQUIPOS'].includes('1')) {
            cargarSelect('#NombreEmp');
            //Formulario desplegable
            const Equipos = $('#Equip');
            const Menu = $("#Desplegable");

            const Hardware = $('#HardE');
            const Software = $('#SoftE');

            const Monitor = $('#MonE');
            const NIMES = $('#NIME');
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
                    NIMES.prop('required', false);
                    Monitor.prop('required', false);
                    //Pone valores vacío
                    Hardware.val('');
                    Software.val('');
                    NSMon.val('');
                    NIMES.val('');
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
                    NIMES.prop('required', true);
                    Monitor.prop('required', true);
                } else {
                    NSMon.prop('required', false);
                    NIMES.prop('required', true);
                    Monitor.prop('required', false);
                }
            });

            Listeners(NSMon, 'input', function (e) {

                if (NSMon.val() != "") {
                    NSMon.prop('required', true);
                    NIMES.prop('required', true);
                    Monitor.prop('required', true);
                } else {
                    NSMon.prop('required', false);
                    NIMES.prop('required', true);
                    Monitor.prop('required', false);
                }
            });

            Listeners(NIMES, 'input', function (e) {

                if (NIMES.val() != "") {
                    NSMon.prop('required', true);
                    NIMES.prop('required', true);
                    Monitor.prop('required', true);
                } else {
                    NSMon.prop('required', false);
                    NIMES.prop('required', true);
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
                    if ($("#MonE").val() != "" && $("#NIME").val() != "" && $("#N_Ser_M").val() != "") {
                        enviarSocket("AltMon", { Num_S: $("#Num_Serie").val(), MonE: $("#MonE").val(), NIME: $("#NIME").val(), NSMon: $("#N_Ser_M").val() });
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
                    recibirSocket('Equipo_Respuesta');
                }
            });
        } else if (pathname == "/users/consulEqp" && (Permisos['EQUIPOS'].includes('4') || Permisos['EQUIPOS'].includes('2') || Permisos['EQUIPOS'].includes('3'))) {
            cargarSelect('#NombreEmp');

            const thead = document.querySelector("#firstrow");

            let CabHTML = "";

            if (Permisos['EQUIPOS'].includes('2')) {
                CabHTML += `<th>Eliminar</th>`;
            }
            if (Permisos['EQUIPOS'].includes('3')) {
                CabHTML += `<th>Modificar</th>`;
            }

            thead.innerHTML += CabHTML;

            //Formulario desplegable
            const Equipos = $('#EquipM');
            const Menu = $("#Desplegable");

            const Hardware = $('#HardE');
            const Software = $('#SoftE');

            const Monitor = $('#MonE');
            const NIMES = $('#NIME');
            const NSMon = $('#N_Ser_M');

            const Mouse = $('#MouseE');
            const Teclado = $('#TecladE');
            const Accesorio = $('#AccesE');

            //Formulario.reset();
            Equipos.on('change', function () {
                if (Equipos.val() == 'CPU') {
                    enviarSocket('BuscarCPU', (document.getElementById("Num_SerieM").value));

                    socket.on('ImpCPU', (CompCPU) => {
                        const Componentes = CompCPU || [];

                        Componentes.forEach(CPU => {
                            $('#HardE').val(CPU.Hardware);
                            $('#SoftE').val(CPU.Software);
                            $('#MonE').val(CPU.Monitor);
                            $('#NIME').val(CPU.Num_Inv_Mon);
                            $('#N_Ser_M').val(CPU.Num_Serie_Monitor);
                            $('#MouseE').val(CPU.Mouse);
                            $('#TecladE').val(CPU.Teclado);
                            $('#AccesE').val(CPU.Accesorio);
                        });
                        // Muestra el contenido del div con id "Desplegable"
                        Menu.show();
                    });
                } else {
                    Menu.slideUp();//Lo cierra
                    //Quita los required
                    Hardware.prop('required', false);
                    Software.prop('required', false);
                    NSMon.prop('required', false);
                    NIMES.prop('required', false);
                    Monitor.prop('required', false);
                    //Pone valores vacío
                    Hardware.val('');
                    Software.val('');
                    NSMon.val('');
                    NIMES.val('');
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
                    NIMES.prop('required', true);
                    Monitor.prop('required', true);
                } else {
                    NSMon.prop('required', false);
                    NIMES.prop('required', true);
                    Monitor.prop('required', false);
                }
            });

            Listeners(NSMon, 'input', function (e) {

                if (NSMon.val() != "") {
                    NSMon.prop('required', true);
                    NIMES.prop('required', true);
                    Monitor.prop('required', true);
                } else {
                    NSMon.prop('required', false);
                    NIMES.prop('required', true);
                    Monitor.prop('required', false);
                }
            });

            Listeners(NIMES, 'input', function (e) {

                if (NIMES.val() != "") {
                    NSMon.prop('required', true);
                    NIMES.prop('required', true);
                    Monitor.prop('required', true);
                } else {
                    NSMon.prop('required', false);
                    NIMES.prop('required', true);
                    Monitor.prop('required', false);
                }
            });

            socket.emit("Consul_Equipos");

            // Consulta de productos
            socket.on('Desp_Equipos', async (data) => {
                const tbody = document.querySelector("#DatosProd tbody");
                let filaHTML = `
                <tr>
                    <td>${data.Num_Serie}</td>
                    <td>${data.Equipo}</td>
                    <td>${data.Marca}</td>
                    <td>${data.Modelo}</td>
                    <td>${data.NombreEmp}</td>
                    <td>${data.Ubi}</td>`;
                if (Permisos['EQUIPOS'].includes('2')) {
                    filaHTML += `<td class="BotonER"> Eliminar </td>`;
                }
                if (Permisos['EQUIPOS'].includes('3')) {
                    filaHTML += `<td class="BotonMod"> Modificar </td>`;
                }
                filaHTML += `</tr>`;

                tbody.innerHTML += filaHTML;

                if (Permisos['EQUIPOS'].includes('2')) {
                    // Volver a asignar el evento de clic a los botones de eliminar
                    const botonesEliminar = document.getElementsByClassName("BotonER");

                    for (let i = 0; i < botonesEliminar.length; i++) {
                        botonesEliminar[i].addEventListener("click", function () {
                            eliminarEquipo(this, '¿Deseas eliminar este producto de equipos?', 'Bajas_Equipos');
                        });
                    }
                }
            });

            //Llenar datos en automático
            var valores0 = "";
            var valores1 = "";
            var valores2 = "";
            var valores3 = "";
            var valores4 = "";
            var valores5 = "";
            var NIMEviejo = "";
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
                    $('#NombreEmp').val(valores4.replace(/\s+$/, '')).trigger('change.select2');
                    document.getElementById("UbiEM").value = valores5;

                    if (document.getElementById("EquipM").value == "CPU") {
                        enviarSocket('BuscarCPU', (document.getElementById("Num_SerieM").value));

                        socket.on('ImpCPU', (CompCPU) => {
                            const Componentes = CompCPU || [];

                            Componentes.forEach(CPU => {
                                $('#HardE').val(CPU.Hardware);
                                $('#SoftE').val(CPU.Software);
                                $('#MonE').val(CPU.Monitor);
                                $('#NIME').val(CPU.Num_Inv_Mon);
                                $('#N_Ser_M').val(CPU.Num_Serie_Monitor);
                                $('#MouseE').val(CPU.Mouse);
                                $('#TecladE').val(CPU.Teclado);
                                $('#AccesE').val(CPU.Accesorio);
                                NIMEviejo = CPU.Num_Inv_Mon;
                            });
                            const FormMod = document.querySelector("#ModEquipos");
                            FormMod.addEventListener("submit", function () {
                                if ($("#Num_SerieM").val() != "" && $("#EquipM").val() != "" && $("#MarcEM").val() != "" && $("#ModelEM").val() != "" && $("#NombreEmp").val() != "" && $("#UbiEM").val() != "") {
                                    //Monitores
                                    if ($("#MonE").val() != "" && $("#NIME").val() != "" && $("#N_Ser_M").val() != "") {
                                        socket.emit('CambiosMon', { Num_S: $("#Num_SerieM").val(), MonE: $("#MonE").val(), NIME: $("#NIME").val(), NSMon: $("#N_Ser_M").val() }, { OLDNum_S: valores0, OldNIME: NIMEviejo });
                                    }
                                }
                            });

                            // Muestra el contenido del div con id "Desplegable"
                            Menu.show();
                        });

                    } else {
                        // Oculta el contenido del div con id "Desplegable" si no es "CPU"
                        Menu.hide();
                    }
                }
                // Cambios de equipos
                const FormMod = document.querySelector("#ModEquipos");

                // Cambios de equipos
                FormMod.addEventListener("submit", Enviar);

                function Enviar(e) {

                    e.preventDefault();

                    if ($("#Num_SerieM").val() != "" && $("#EquipM").val() != "" && $("#MarcEM").val() != "" && $("#ModelEM").val() != "" && $("#NombreEmp").val() != "" && $("#UbiEM").val() != "") {
                        //Enviar HardWare
                        if ($("#HardE").val() != "" && $("#SoftE").val() != "") {
                            socket.emit('CambiosPc', { Num_S: $("#Num_SerieM").val(), HardE: $("#HardE").val(), SoftE: $("#SoftE").val() }, { OLDNum_S: valores0 });
                        }
                        //Mouse
                        if ($("#MouseE").val() != "") {
                            socket.emit('CambiosMouse', { Num_S: $("#Num_SerieM").val(), MousE: $("#MouseE").val() }, { OLDNum_S: valores0 });
                        }
                        //Teclado
                        if ($("#TecladE").val() != "") {
                            socket.emit('CambiosTecla', { Num_S: $("#Num_SerieM").val(), TeclaE: $("#TecladE").val() }, { OLDNum_S: valores0 });
                        }
                        //Accesorios
                        if ($("#AccesE").val() != "") {
                            socket.emit('CambiosAcces', { Num_S: $("#Num_SerieM").val(), AccesE: $("#AccesE").val() }, { OLDNum_S: valores0 });
                        }

                        socket.emit('Cambios_Equipos', { Num_Serie: $("#Num_SerieM").val(), Equipo: $("#EquipM").val(), Marca: $("#MarcEM").val(), Modelo: $("#ModelEM").val(), NombreEmp: $("#NombreEmp").val(), Ubi: $("#UbiEM").val() }, { OLDNum_S: valores0 });
                        //Respuesta
                        recibirSocket('RespEquipos');
                    }
                }
            });
        } else {
            location.href = "index";
        }
    }
} else if (pathname == "/users/consulMob" || pathname === "/users/altasMob") {
    if (!Permisos['MOBILIARIO']) {
        location.href = "index";
    } else {
        if (pathname == "/users/consulMob" && (Permisos['MOBILIARIO'].includes('4') || Permisos['MOBILIARIO'].includes('2') || Permisos['MOBILIARIO'].includes('3'))) {

            socket.emit("Consul_Mobiliario", localStorage.getItem('user'));

            //Formulario desplegable
            const ArtiDesp = $('#ArtM');
            const MenuM = $("#DesplegableM");

            const otrosM = $('#OtrosM');

            MenuM.hide();
            //Formulario.reset();
            ArtiDesp.on('change', function () {
                if (ArtiDesp.val() == 'OTRO') {
                    MenuM.slideDown();//Lo abre
                } else {
                    MenuM.slideUp();//Lo cierra
                    //Quita los required
                    otrosM.prop('required', false);

                    //Pone valores vacío
                    otrosM.val('');
                }
            });
            //VALIDAR FORMULARIO DEPENDIENDO SI LLENAN CAMPOS
            //Funcion general
            function Listeners(elemento, evento, funcion) {
                elemento.on(evento, funcion);
            }

            Listeners(otrosM, 'input', function (e) {

                if (otrosM.val() != "") {
                    otrosM.prop('required', true);
                } else {
                    otrosM.prop('required', false);
                }
            });

            const thead = document.querySelector("#firstrow");

            let CabHTML = "";

            if (Permisos['MOBILIARIO'].includes('2')) {
                CabHTML += `<th>Eliminar</th>`;
            }
            if (Permisos['MOBILIARIO'].includes('3')) {
                CabHTML += `<th>Modificar</th>`;
            }

            thead.innerHTML += CabHTML;

            // Consulta de mobiliario
            socket.on('Desp_Mobiliario', async (data) => {
                const tbody = document.querySelector("#DatosProd tbody");
                let filaHTML = `
                <tr>
                    <td>${data.Articulo}</td>
                    <td>${data.Descripcion}</td>
                    <td>${data.Ubicacion}</td>
                    <td>${data.Cantidad}</td>
                    <td>${data.Area}</td>
                    `;

                if (Permisos['MOBILIARIO'].includes('2')) {
                    filaHTML += `<td class="BotonER"> Eliminar </td>`;
                }
                if (Permisos['MOBILIARIO'].includes('3')) {
                    filaHTML += ` <td class="BotonMod" > Modificar </td>`;
                }

                filaHTML += `</tr>`;

                tbody.innerHTML += filaHTML;

                if (Permisos['MOBILIARIO'].includes('2')) {
                    // Volver a asignar el evento de clic a los botones de eliminar
                    const botonesEliminar = document.getElementsByClassName("BotonER");

                    for (let i = 0; i < botonesEliminar.length; i++) {
                        botonesEliminar[i].addEventListener("click", function () {
                            eliminarMobiliario(this, '¿Deseas eliminar este producto de mobiliario?', 'Bajas_Mobiliario');
                        });
                    }
                }
            });

            //Llenar datos en automático
            var valores0 = "";
            var valores1 = "";
            var valores2 = "";
            var valores3 = "";

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
                        valores2 = elementosTD[2].innerHTML;
                        valores3 = elementosTD[3].innerHTML;
                    }
                    document.getElementById("ArtM").value = valores0;
                    document.getElementById("DescM").value = valores1;
                    document.getElementById("UbiM").value = valores2;
                    document.getElementById("CantidadM").value = valores3;
                }

                // Cambios de mobiliario
                const FormMod = document.querySelector("#ModMobi");

                // Cambios de mobiliario
                FormMod.addEventListener("submit", Enviar);

                function Enviar(e) {

                    e.preventDefault();

                    if ($("#ArtM").val() != "" && $("#DescM").val() != "" && $("#UbiM").val() != "" && $("#CantidadM").val() != "") {

                        //Si pone otros
                        if ($("#OtrosM").val() != "") {
                            socket.emit('Cambios_Mobiliario', { Articulo: $("#OtrosM").val(), Descripcion: $("#DescM").val(), Ubicacion: $("#UbiM").val(), Cantidad: $("#CantidadM").val() }, { OLDArtM: valores0 });
                        }
                        else {
                            socket.emit('Cambios_Mobiliario', { Articulo: $("#ArtM").val(), Descripcion: $("#DescM").val(), Ubicacion: $("#UbiM").val(), Cantidad: $("#CantidadM").val() }, { OLDArtM: valores0 });
                        }

                    }
                }
            });
            recibirSocket('RespDelMob');
        } else if (pathname == "/users/altasMob" && Permisos['MOBILIARIO'].includes('1')) {

            const FormProduct = document.querySelector("#AltaMobiliario");

            //Formulario desplegable
            const ArtiDesp = $('#ArtM');
            const MenuM = $("#DesplegableM");

            const otrosM = $('#OtrosM');

            MenuM.hide();
            //Formulario.reset();
            ArtiDesp.on('change', function () {
                if (ArtiDesp.val() == 'OTRO') {
                    MenuM.slideDown();//Lo abre
                } else {
                    MenuM.slideUp();//Lo cierra
                    //Quita los required
                    otrosM.prop('required', false);

                    //Pone valores vacío
                    otrosM.val('');
                }
            });
            //VALIDAR FORMULARIO DEPENDIENDO SI LLENAN CAMPOS
            //Funcion general
            function Listeners(elemento, evento, funcion) {
                elemento.on(evento, funcion);
            }

            Listeners(otrosM, 'input', function (e) {

                if (otrosM.val() != "") {
                    otrosM.prop('required', true);
                } else {
                    otrosM.prop('required', false);
                }
            });

            // Altas de mobiliario
            FormProduct.addEventListener("submit", Enviar);

            function Enviar(e) {
                e.preventDefault();
                if ($("#ArtM").val() != "" && $("#DescM").val() != "" && $("#UbiM").val() != "" && $("#CantidadM").val() != "") {

                    //Si pone otros
                    if ($("#OtrosM").val() != "") {
                        enviarSocket("Alta_Mob", { Articulo: $("#OtrosM").val(), Descripcion: $("#DescM").val(), Ubicacion: $("#UbiM").val(), Cantidad: $("#CantidadM").val(), User: user });
                    }
                    else {
                        enviarSocket('Alta_Mob', { Articulo: $("#ArtM").val(), Descripcion: $("#DescM").val(), Ubicacion: $("#UbiM").val(), Cantidad: $("#CantidadM").val(), User: user });
                    }

                    recibirSocket('Mobiliario_Respuesta');
                }
            }
        } else {
            location.href = "index";
        }
    }
} else if (pathname == "/users/crear_resp") {
    if (!Permisos['RESPONSIVAS']) {
        location.href = "index";
    } else {
        if (pathname == "/users/crear_resp" && Permisos['RESPONSIVAS'].includes('1')) {
            cargarSelect('#NombreEmp');
            // desplegar lista de nombre de empleados
            window.addEventListener("load", function (event) {
                var selectResponsiva = document.getElementById("Resp");
                var opcion = document.createElement("option");
                var opcion1 = document.createElement("option");

                if (Permisos['RESPONSIVAS']) {
                    opcion.text = "MOBILIARIO";
                    opcion1.text = "EQUIPOS";
                }

                selectResponsiva.add(opcion);
                selectResponsiva.add(opcion1);
            });

            const FormResp = document.querySelector("#crearRespon");

            FormResp.addEventListener("submit", Enviar);

            function Enviar(e) {
                e.preventDefault();
                if ($("#DescM").val() != "" && $("#NombreEmp").val() != "") {

                    enviarSocket('Crea_Resp', { Responsiva: $("#Resp").val(), NombreEmp: $("#NombreEmp").val() });

                    socket.on('Responsiva_Respuesta', function (Respuesta) {

                        Swal.fire(Respuesta.mensaje).then(() => {
                            // Crear un blob a partir del PDF buffer recibido
                            const blob = new Blob([Respuesta.pdfBuffer], { type: 'application/pdf' });

                            // Crear una URL a partir del blob para mostrar el PDF en una nueva ventana del navegador
                            const pdfUrl = URL.createObjectURL(blob);

                            // Abrir el PDF en una nueva ventana o pestaña
                            window.open(pdfUrl, '_blank');
                            setTimeout(() => {
                                location.reload();
                            }, 1000)
                        });
                    });
                }
            }
        } else {
            location.href = "index";
        }
    }
} else if (pathname == '/users/sol_prod') {
    if (area !== 'DIRECCION GENERAL') {
        window.location.href = "index";
    } else {
        enviarSocket('get_applicants')
        table = $("#Requests")

        socket.on('return_applicants', async (data) => {
            // Add requests process
            $.each(data, function (_, item) {
                var row = $('<tr></tr>');
                $.each(item, function (clave, value) {

                    if (clave === 'request_date') {
                        // Fecha obtenida
                        var fechaJS = new Date(value);
                        var año = fechaJS.getFullYear();
                        var mes = ('0' + (fechaJS.getMonth() + 1)).slice(-2);
                        var dia = ('0' + fechaJS.getDate()).slice(-2);
                        var horas = ('0' + fechaJS.getHours()).slice(-2);
                        var minutos = ('0' + fechaJS.getMinutes()).slice(-2);
                        var segundos = ('0' + fechaJS.getSeconds()).slice(-2);

                        var fechaFormateada = año + '-' + mes + '-' + dia + ' ' + horas + ':' + minutos + ':' + segundos;
                        row.append("<td>" + fechaFormateada + "</td>");

                    } else if (clave === 'cerrada') {
                        if (item.cerrada == 1 && item.Acept == 0) {
                            row.addClass('decline')
                            row.append('<td><div>Rechazada :(</div></td>')
                        } else if ((item.cerrada == 1 && item.Acept == 1)) {
                            row.addClass('accepted')
                            row.append('<td><div>Aceptada :)</div></td>')
                        } else if (item.cerrada == 0 && item.Acept == 1) {
                            row.addClass('pending')
                            row.append('<td><div>Pendiente...</div></td>')
                        } else
                            row.append('<td><div><span class="icon-check">✔</span><span class="icon-cross">✘</span></div></td>')
                    } else if (clave === 'Acept') {
                    } else {
                        row.append("<td>" + value + "</td>");
                    }
                })
                table.append(row)
            })
            // Continue with all requests events (accept and decline requests)
            var accepted = document.getElementsByClassName('icon-check')
            var declined = document.getElementsByClassName('icon-cross')

            for (let i = 0; i < accepted.length; i++) {
                accepted[i].addEventListener("click", getRequestssolicitants)
                declined[i].addEventListener("click", getRequestssolicitants)
            }

            var valores = []

            function getRequestssolicitants(e) {
                class_button = Array.from(e.srcElement.classList)[0]
                boton = ''
                if (class_button == 'icon-check') {
                    valores.push('accepted')
                    boton = 'aceptar'
                } else if (class_button == 'icon-cross') {
                    valores.push('declined')
                    boton = 'denegar'
                }
                Swal.fire({
                    title: "¿Estás seguro de " + boton + " la solicitud?",
                    text: "No puedes revertir el cambio!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Si, seguro!"
                }).then((result) => {
                    if (result.isConfirmed) {

                        var elementosTD = e.srcElement.parentElement.parentElement.parentElement.getElementsByTagName("td");
                        // recorremos cada uno de los elementos del array de elementos <td>
                        for (let i = 0; i < elementosTD.length - 1; i++) {
                            valores.push(elementosTD[i].innerHTML); // obtenemos cada uno de los valores y los ponemos en la variable "valores"
                        }

                        enviarSocket('updateCar', valores)

                        socket.once('request_answered', (Respuesta) => {
                            Swal.fire({
                                icon: "success",
                                title: "Solicitud exitosa",
                                text: Respuesta.mensaje
                            }).then(() => {
                                location.reload();
                            });
                        })
                    } else {
                        valores = []
                    }
                })
            }


        });
    }

} else if (pathname == '/users/carrito') {
    enviarSocket('RPC', user)

    socket.on('RPCR', async (data) => {
        if (data.length > 0) {
            table = $('#Requests tbody')
            $.each(data, function (_, row) {
                fila = $('<tr></tr>')
                $.each(row, function (clave, value) {
                    if (clave == 'request_date') {
                        // Fecha obtenida
                        var fechaJS = new Date(value);
                        var año = fechaJS.getFullYear();
                        var mes = ('0' + (fechaJS.getMonth() + 1)).slice(-2);
                        var dia = ('0' + fechaJS.getDate()).slice(-2);
                        var horas = ('0' + fechaJS.getHours()).slice(-2);
                        var minutos = ('0' + fechaJS.getMinutes()).slice(-2);
                        var segundos = ('0' + fechaJS.getSeconds()).slice(-2);

                        var fechaFormateada = año + '-' + mes + '-' + dia + ' ' + horas + ':' + minutos + ':' + segundos;
                        fila.append("<td>" + fechaFormateada + "</td>");

                    } else {
                        fila.append('<td>' + value + '</td>')
                    }
                })
                fila.append('<td><div><span class="icon-cross">✘</span></div></td>')
                table.append(fila)
            })

            cancel = document.getElementsByClassName('icon-cross')

            for (let i = 0; i < cancel.length; i++) {
                cancel[i].addEventListener("click", (e) => {
                    let fpcdd = e.srcElement.parentNode.parentNode.parentNode.getElementsByTagName("td")[0].innerHTML;
                    let pcdd = e.srcElement.parentNode.parentNode.parentNode.getElementsByTagName("td")[1].innerHTML;

                    enviarSocket('EPC', { fpcdd, pcdd, user })
                    location.reload()
                })
            }

            $('#productos').append('<button class="BotonExcel" style="width: 100%; color: white;">Enviar todo</button>')

            $('.BotonExcel').on('click', function () {
                enviarSocket('AAPIC', user)
                recibirSocket('AAPICRE')
            })
        }
    })

    socket.on('RPCRN', () => {
        empty_table('Requests', 6)
    })
} else if (pathname == '/users/sol_prod_Almacen') {
    if (Permisos['PETICIONES']) {
        enviarSocket('consul_almacenista', user)

        socket.on('desplegar_almacenista', async (data) => {
            if (data.length > 0) {
                table = $('#Requests tbody')
                $.each(data, function (_, row) {
                    fila = $('<tr></tr>')
                    $.each(row, function (clave, value) {
                        if (clave == 'request_date') {
                            // Fecha obtenida
                            var fechaJS = new Date(value);
                            var año = fechaJS.getFullYear();
                            var mes = ('0' + (fechaJS.getMonth() + 1)).slice(-2);
                            var dia = ('0' + fechaJS.getDate()).slice(-2);
                            var horas = ('0' + fechaJS.getHours()).slice(-2);
                            var minutos = ('0' + fechaJS.getMinutes()).slice(-2);
                            var segundos = ('0' + fechaJS.getSeconds()).slice(-2);

                            var fechaFormateada = año + '-' + mes + '-' + dia + ' ' + horas + ':' + minutos + ':' + segundos;
                            fila.append("<td>" + fechaFormateada + "</td>");

                        } else if (clave == 'delivered_ware') {
                            if (value == 0) {
                                fila.append("<td>" + "No entregado" + "</td>")
                            } else {
                                fila.append("<td>" + "Entregado" + "</td>")
                            }
                        } else if (clave == 'delivered_soli') {
                            if (value == 0) {
                                fila.append("<td>" + "No recibido" + "</td>")
                            } else {
                                fila.append("<td>" + "Recibido" + "</td>")
                            }
                        }
                        else {
                            fila.append('<td>' + value + '</td>')
                        }
                    })
                    fila.append('<td class="BotonAC icon-entregar">Entregado</td>')
                    table.append(fila)
                })

                // Proceso a realizar cuando le da clic a un boton
                entregar = document.getElementsByClassName('icon-entregar')

                // Entregar peticion
                for (let i = 0; i < entregar.length; i++) {
                    entregar[i].addEventListener("click", (e) => {
                        let fpcdd = e.srcElement.parentNode.parentNode.parentNode.getElementsByTagName("td")[0].innerHTML;
                        let pcdd = e.srcElement.parentNode.parentNode.parentNode.getElementsByTagName("td")[1].innerHTML;

                        enviarSocket('entregar_peti_alma', { fpcdd, pcdd, user, sended: 'A' })
                        location.reload()
                    })
                }
            }
        })

        socket.on('error_desplegar', () => {
            empty_table('Requests', 14)
        })
    }
} else if (pathname == '/users/status_request') {

    enviarSocket('consul_requests', user)

    socket.on('desplegar_almacenista', async (data) => {
        if (data.length > 0) {
            table = $('#Requests tbody')
            $.each(data, function (_, row) {
                fila = $('<tr></tr>')
                $.each(row, function (clave, value) {
                    if (clave == 'request_date') {
                        // Fecha obtenida
                        var fechaJS = new Date(value);
                        var año = fechaJS.getFullYear();
                        var mes = ('0' + (fechaJS.getMonth() + 1)).slice(-2);
                        var dia = ('0' + fechaJS.getDate()).slice(-2);
                        var horas = ('0' + fechaJS.getHours()).slice(-2);
                        var minutos = ('0' + fechaJS.getMinutes()).slice(-2);
                        var segundos = ('0' + fechaJS.getSeconds()).slice(-2);

                        var fechaFormateada = año + '-' + mes + '-' + dia + ' ' + horas + ':' + minutos + ':' + segundos;
                        fila.append("<td>" + fechaFormateada + "</td>");

                    } else if (clave == 'delivered_ware') {
                        if (value == 0) {
                            fila.append("<td>" + "No entregado" + "</td>")
                        } else {
                            fila.append("<td>" + "Entregado" + "</td>")
                        }
                    } else if (clave == 'delivered_soli') {
                        if (value == 0) {
                            fila.append("<td>" + "No recibido" + "</td>")
                        } else {
                            fila.append("<td>" + "Recibido" + "</td>")
                        }
                    }
                    else {
                        fila.append('<td>' + value + '</td>')
                    }
                })
                fila.append('<td class="BotonAC icon-entregar">Entregado</td>')
                table.append(fila)
            })

            // Proceso a realizar cuando le da clic a un boton
            entregar = document.getElementsByClassName('icon-entregar')

            // Entregar peticion
            for (let i = 0; i < entregar.length; i++) {
                entregar[i].addEventListener("click", (e) => {
                    let fpcdd = e.srcElement.parentNode.parentNode.parentNode.getElementsByTagName("td")[0].innerHTML;
                    let pcdd = e.srcElement.parentNode.parentNode.parentNode.getElementsByTagName("td")[1].innerHTML;

                    enviarSocket('entregar_peti_alma', { fpcdd, pcdd, user, sended: 'S' })
                    location.reload()
                })
            }
        }
    })

    socket.on('error_desplegar', () => {
        empty_table('Requests', 14)
    })

}
