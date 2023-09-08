//console.log(localStorage.getItem("token"));
console.log(JSON.parse(localStorage.getItem('permisosModulos')));

if (localStorage.getItem("permisosModulos") == null) {
    location.href = "/";
}

function CerrarSesion() {
    localStorage.clear();
    location.href = "/";
}
