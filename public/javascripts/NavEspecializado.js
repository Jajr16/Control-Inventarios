var tok = localStorage.getItem("token");

if (tok == "4dnM3k0nl9s" || tok == "4dnM3k0nl9z") {

    document.getElementById("Linksnav").innerHTML += `
    <li>
        <a href="/users/index">Inicio</a>
    </li>
    <li>
        <p>Registrar productos</p>
        <ul class="menu-vertical_nav">
        <li>
            <div><a href="/users/consulPro" class="BotonAG TamBAG">Ver productos</a></div> 
        </li>
        <li>
            <div><a href="/users/ABPE" class="BotonAG TamBAG">Agregar productos existentes</a></div> 
        </li>
        <li>
            <div><a href="/users/altasPro" class="BotonAG TamBAG">Registrar Productos</a></div> 
        </li>
        <li>
            <div><a href="/users/FacSacProd" class="BotonAG TamBAG">Registro de productos sacados</a></div> 
        </li>
        </ul>
    </li>
    <li>
        <p>Registrar mobiliario</p>
        <ul class="menu-vertical_nav">
        <li>
            <div><a href="/users/consulMob" class="BotonMOBA TamBAG">Ver Mobiliario</a></div> 
        </li>
        <li>
            <div><a href="/users/altasMob" class="BotonMOBA TamBAG">Registrar Mobiliario</a></div> 
        </li>
        </ul>
    </li>
    <li>
        <p>Registrar equipos</p>
        <ul class="menu-vertical_nav">
        <li>
            <div><a href="/users/consulEqp" class="BotonEQPA TamBAG">Ver Equipos</a></div> 
        </li>
        <li>
            <div><a href="/users/altasEqp" class="BotonEQPA TamBAG">Registrar Equipos</a></div> 
        </li>
        </ul>
    </li>
    <li>
        <p>Crear responsivas</p>
        <ul class="menu-vertical_nav">
        <li>
            <div><a href="/users/crear_resp" class="BotonResp TamBAG">Responsivas</a></div> 
        </li>
        </ul>
    </li>
    <li>
        <p>Más opciones</p>
        <ul class="menu-vertical_nav">
        <li>
            <div><a href="/users/RegistrarUsuario" class="BotonABE TamBAG">Registrar Usuario</a></div> 
        </li>
        <li>
            <div><a href="/users/consulUsuarios" class="BotonABE TamBAG">Modificar Usuario</a></div> 
        </li>
        <li>
            <div><a href="/users/RegistroEmpleado" class="BotonABE TamBAG">Registrar Empleado</a></div> 
        </li>
        <li>
            <div><a href="/users/ModEmp" class="BotonABE TamBAG">Modificar Empleado</a></div> 
        </li>
        </ul>
    </li>
        `;

    document.getElementById("MenuCel").innerHTML += `
            <a href="/users/RegistrarUsuario">Registrar Usuario</a>
            <a href="/users/RegistroEmpleado">Registrar Empleado</a>
        `;
}