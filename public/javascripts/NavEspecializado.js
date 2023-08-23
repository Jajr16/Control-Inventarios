var tok = localStorage.getItem("token");

document.getElementById("Linksnav").innerHTML += `
    <li>
        <a href="/users/index">Inicio</a>
    </li>
    <li>
        <p>Registrar productos</p>
        <ul class="menu-vertical_nav">
        <li>
            <div><a href="/users/consulPro">Ver productos</a></div> 
        </li>
        <li>
            <div><a href="/users/ABPE">Agregar productos existentes</a></div> 
        </li>
        <li>
            <div><a href="/users/altasPro">Registrar Productos</a></div> 
        </li>
        <li>
            <div><a href="/users/FacSacProd">Registro de productos sacados</a></div> 
        </li>
        </ul>
    </li>
    <li>
        <p>Registrar mobiliario</p>
        <ul class="menu-vertical_nav">
        <li>
            <div><a href="/users/consulMob">Ver Mobiliario</a></div> 
        </li>
        <li>
            <div><a href="/users/altasMob">Registrar Mobiliario</a></div> 
        </li>
        </ul>
    </li>
    <li>
        <p>Registrar equipos</p>
        <ul class="menu-vertical_nav">
        <li>
            <div><a href="/users/consulEqp">Ver Equipos</a></div> 
        </li>
        <li>
            <div><a href="/users/altasEqp">Registrar Equipos</a></div> 
        </li>
        </ul>
    </li>
    <li>
        <p>Crear responsivas</p>
        <ul class="menu-vertical_nav">
        <li>
            <div><a href="/users/crear_resp">Responsivas</a></div> 
        </li>
        </ul>
    </li>
    <li>
        <p>Más opciones</p>
        <ul class="menu-vertical_nav">
        <li>
            <div><a href="/users/RegistrarUsuario">Registrar Usuario</a></div> 
        </li>
        <li>
            <div><a href="/users/consulUsuarios">Modificar Usuario</a></div> 
        </li>
        <li>
            <div><a href="/users/RegistroEmpleado">Registrar Empleado</a></div> 
        </li>
        <li>
            <div><a href="/users/ModEmp">Modificar Empleado</a></div> 
        </li>
        </ul>
    </li>
        `;

if (tok == "4dnM3k0nl9s" || tok == "4dnM3k0nl9z") {

    document.getElementById("MenuCel").innerHTML += `
            <a href="/users/RegistrarUsuario">Registrar Usuario</a>
            <a href="/users/RegistroEmpleado">Registrar Empleado</a>
        `;
}