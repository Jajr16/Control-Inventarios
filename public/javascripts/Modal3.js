
let modal1 = document.querySelectorAll(".mod1")[0];
let modal1C = document.querySelectorAll(".ContMod1")[0];
let modal2 = document.querySelectorAll(".mod2")[0];
let modal2C = document.querySelectorAll(".ContMod2")[0];

function Abrir1() {
    modal1C.style.opacity = "1";
    modal1C.style.visibility = "visible";
    modal1.classList.toggle("modal1-close");
}

function Cerrar1() {
    modal1.classList.toggle("modal1-close");
    setTimeout(function () {
        modal1C.style.opacity = "1";
        modal1C.style.visibility = "hidden";
    }, 700)
}

function Abrir2() {
    modal2C.style.opacity = "1";
    modal2C.style.visibility = "visible";
    modal2.classList.toggle("modal2-close");
}

function Cerrar2() {
    modal2.classList.toggle("modal2-close");
    setTimeout(function () {
        modal2C.style.opacity = "1";
        modal2C.style.visibility = "hidden";
    }, 700)
}

window.addEventListener("click", function (e) {
    if (e.target === modal1C) {
        modal1.classList.toggle("modal1-close");

        setTimeout(function () {
            modal1C.style.opacity = "0";
            modal1C.style.visibility = "hidden";
        }, 250)
    } else if (e.target === modal2C) {
        modal2.classList.toggle("modal2-close");
        setTimeout(function () {
            modal2C.style.opacity = "0";
            modal2C.style.visibility = "hidden";
        }, 250)

    }


})
