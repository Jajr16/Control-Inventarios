// Seleccionar los elementos del DOM
let modal3 = document.querySelectorAll(".mod3")[0];
let modal3C = document.querySelectorAll(".ContMod3")[0];

// Función para abrir el modal 3
function Abrir3() {
    modal3C.style.opacity = "1";
    modal3C.style.visibility = "visible";
    modal3.classList.toggle("modal3-close");
}

// Función para cerrar el modal 3
function Cerrar3() {
    modal3.classList.toggle("modal3-close");
    setTimeout(function () {
        modal3C.style.opacity = "1";
        modal3C.style.visibility = "hidden";
    }, 700);
}

// Agregar un evento para cerrar el modal haciendo clic fuera de él
window.addEventListener("click", function (e) {
    if (e.target === modal3C) {
        modal3.classList.toggle("modal3-close");
        setTimeout(function () {
            modal3C.style.opacity = "0";
            modal3C.style.visibility = "hidden";
        }, 250);
    }
});
