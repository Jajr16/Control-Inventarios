// Variable de permisos
var Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
var area = localStorage.getItem('area');

// Esto aplica para todos los usuarios
document.getElementById("Linksnav").innerHTML += `
    <li>
        <a href="/users/index">Inicio</a>
    </li>
`;

// Usuarios con permisos de Almacén
if (Permisos['ALMACÉN']) {
    // Permisos de altas
    if (Permisos['ALMACÉN'].includes('1')) {
        document.getElementById("Linksnav").innerHTML += `
        <li>
            <p>Registrar productos</p>
            <ul class="menu-vertical_nav" id = "Alma1">
                <li>
                    <div><a href="/users/ABPE">Agregar productos existentes</a></div> 
                </li>
                <li>
                    <div><a href="/users/altasPro">Registrar Productos</a></div> 
                </li>
            </ul>
        </li>
    `;
    }
    // Permisos de Bajas, Cambios y Consultas
    if (Permisos['ALMACÉN'].includes('2') || Permisos['ALMACÉN'].includes('3') || Permisos['ALMACÉN'].includes('4')) {
        document.getElementById("Alma1").innerHTML += `
        <li>
            <div><a href="/users/consulPro">Ver productos</a></div> 
        </li>
        <li>
            <div><a href="/users/FacSacProd">Registro de productos sacados</a></div>  
        </li>
    `;
    }

    // Peticiones de  productos
    if (Permisos['ALMACÉN'].includes('1') && Permisos['ALMACÉN'].includes('2') && Permisos['ALMACÉN'].includes('3') && Permisos['ALMACÉN'].includes('4')) {
        document.getElementById("Linksnav").innerHTML += `
        <li>
            <p>Peticiones de productos</p>
            <ul class="menu-vertical_nav" id = "Alma1">
                <li>
                    <div><a href="/users/sol_prod_Almacen">Peticiones a Almacenista</a></div> 
                </li>
            </ul>
        </li>
    `;
    }
}
/////// DIRECCION GENERAL ////////
if (area === 'DIRECCION GENERAL'){
    $('.request-container').append('<div><div class="not_container_request"></div><a href="/users/sol_prod"><i class="fa-solid fa-bell"></i></a></div>')
    document.getElementById("Linksnav").innerHTML += `
    <li>
        <p>Peticiones de empleados</p>
        <ul class="menu-vertical_nav" id = "Alma1">
            <li>
                <div><a href="/users/sol_prod">Peticiones de Empelados</a></div> 
            </li>
        </ul>
    </li>
    `
}

if (Permisos['PETICIONES']){
    $('.request-container').append('<div><div class="not_container_request"></div><a href="/users/sol_prod_Almacen"><i class="fa-solid fa-bell"></i></a></div>')
}

$('.truck-container').append('<div><div class="truck_not_container"></div><a href="/users/status_request"><i class="fa-solid fa-truck-arrow-right"></i></a></div>')


// Usuarios con permisos de Mobiliario
if (Permisos['MOBILIARIO']) {
    // Permisos de altas
    if (Permisos['MOBILIARIO'].includes('1')) {
        document.getElementById("Linksnav").innerHTML += `
        <li>
            <p>Registrar mobiliario</p>
            <ul class="menu-vertical_nav" id = "Mob1">
                <li>
                    <div><a href="/users/altasMob">Registrar Mobiliario</a></div> 
                </li>
            </ul>
        </li>
    `;
    }
    // Permisos de Bajas, Cambios y Consultas
    if (Permisos['MOBILIARIO'].includes('2') || Permisos['MOBILIARIO'].includes('3') || Permisos['MOBILIARIO'].includes('4')) {
        document.getElementById("Mob1").innerHTML += `
        <li>
            <div><a href="/users/consulMob">Ver Mobiliario</a></div> 
        </li>
    `;
    }
}
// Usuarios con permisos de Equipos
if (Permisos['EQUIPOS']) {
    // Permisos de altas
    if (Permisos['EQUIPOS'].includes('1')) {
        document.getElementById("Linksnav").innerHTML += `
        <li>
            <p>Registrar equipos</p>
            <ul class="menu-vertical_nav" id = "Eqp1">
                <li>
                    <div><a href="/users/altasEqp">Registrar Equipos</a></div> 
                </li>
            </ul>
        </li>
    `;
    }
    // Permisos de Bajas, Cambios y Consultas
    if (Permisos['EQUIPOS'].includes('2') || Permisos['EQUIPOS'].includes('3') || Permisos['EQUIPOS'].includes('4')) {
        document.getElementById("Eqp1").innerHTML += `
        <li>
            <div><a href="/users/consulEqp">Ver Equipos</a></div> 
        </li>
    `;
    }
}
// Usuarios con permisos de Responsivas
if (Permisos['RESPONSIVAS']) {
    if (Permisos['RESPONSIVAS'].includes('1') || Permisos['RESPONSIVAS'].includes('2') || Permisos['RESPONSIVAS'].includes('3') || Permisos['RESPONSIVAS'].includes('4')) {
        document.getElementById("Linksnav").innerHTML += `
            <li>
                <p>Crear responsivas</p>
                <ul class="menu-vertical_nav">
                <li>
                    <div><a href="/users/crear_resp">Responsivas</a></div>
                </li>
                </ul>
            </li>
        `;
    }
}
// Usuarios con permisos de modificar Usuarios
if (Permisos['USUARIOS']) {
    // Permisos de altas
    if ((Permisos['USUARIOS'].includes('1'))) {
        document.getElementById("Linksnav").innerHTML += `
        <li>
            <p>Más opciones</p>
            <ul class="menu-vertical_nav" id = "UseEmp1">
                <li>
                    <div><a href="/users/RegistrarUsuario">Registrar Usuario</a></div> 
                </li>
            </ul>
        </li>
        `;
    }
    // Permisos de Bajas, Cambios y Consultas
    if ((Permisos['USUARIOS'].includes('2') || Permisos['USUARIOS'].includes('3') || Permisos['USUARIOS'].includes('4'))) {
        document.getElementById("UseEmp1").innerHTML += `
        <li>
            <div><a href="/users/consulUsuarios">Modificar Usuario</a></div> 
        </li>
        `;
    }
}
// Usuarios con permisos de modificar Empleados
if (Permisos['EMPLEADOS']) {
    // Permisos de altas
    if (Permisos['EMPLEADOS'].includes('1')) {
        document.getElementById("UseEmp1").innerHTML += `
        <li>
            <div><a href="/users/RegistroEmpleado">Registrar Empleado</a></div> 
        </li>
    `;
    }
    // Permisos de Bajas, Cambios y Consultas
    if (Permisos['EMPLEADOS'].includes('2') || Permisos['EMPLEADOS'].includes('3') || Permisos['EMPLEADOS'].includes('4')) {
        document.getElementById("UseEmp1").innerHTML += `
        <li>
            <div><a href="/users/ModEmp">Modificar Empleado</a></div> 
        </li>
    `;
    }
}   