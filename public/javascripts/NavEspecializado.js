var tok = localStorage.getItem("token");

if (tok == "4dnM3k0nl9s" || tok == "4dnM3k0nl9z") {
        
    document.getElementById("Linksnav").innerHTML += `
            <li><a href="/users/RegistrarUsuario">Registrar Usuario</a></li>
            <li><a href="/users/RegistroEmpleado">Registrar Empleado</a></li>
        `;

    document.getElementById("MenuCel").innerHTML += `
            <a href="/users/RegistrarUsuario">Registrar Usuario</a>
            <a href="/users/RegistroEmpleado">Registrar Empleado</a>
        `;
}