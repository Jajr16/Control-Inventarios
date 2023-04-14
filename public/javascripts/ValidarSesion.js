console.log(localStorage.getItem("token"));

if (localStorage.getItem("token") == null) {
    location.href = "/";
}

function CerrarSesion() {
    localStorage.clear();
    location.href = "/";
}
