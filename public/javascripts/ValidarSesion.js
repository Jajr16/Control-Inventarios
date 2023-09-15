// Comentarios en el código

// Esta línea muestra un comentario que está comentado con doble barra. 
// No está activo y no afecta la ejecución del código.
// console.log(localStorage.getItem("token"));

// Esta línea muestra en la consola el contenido almacenado en la clave 'permisosModulos' del almacenamiento local.
//console.log(JSON.parse(localStorage.getItem('permisosModulos')));

// Esta estructura condicional verifica si la clave 'permisosModulos' en el almacenamiento local es nula (null).
// Si es nula, redirige a la página de inicio (ruta '/').
if (localStorage.getItem("permisosModulos") == null) {
    location.href = "/";
}

// Esta función se llama CerrarSesion y se encarga de limpiar todo el almacenamiento local y redirigir a la página de inicio.
function CerrarSesion() {
    localStorage.clear(); // Limpia todo el almacenamiento local
    location.href = "/"; // Redirige a la página de inicio (ruta '/')
}
