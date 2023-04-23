
let modal1 = document.querySelectorAll(".mod1")[0];
let modal1C = document.querySelectorAll(".ContMod1")[0];


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

window.addEventListener("click", function (e) {
    if (e.target === modal1C) {
        modal1.classList.toggle("modal1-close");

        setTimeout(function () {
            modal1C.style.opacity = "0";
            modal1C.style.visibility = "hidden";
        }, 250)
    // } else if (e.target === modal1C2) {
    //     modal12.classList.toggle("modal1-close");
    //     setTimeout(function () {
    //         modal1C2.style.opacity = "0";
    //         modal1C2.style.visibility = "hidden";
    //     }, 250)  

    }


})
