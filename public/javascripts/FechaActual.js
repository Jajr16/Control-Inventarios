//Fecha actual
const hoy = new Date();

let dia = hoy.getDate();
let mes = hoy.getMonth() + 1;
let anio = hoy.getFullYear();

let formato1 = "";

if(mes < 10){
    mes = "0" + mes;
}
if(dia < 10){
    dia = "0" + dia;
}

formato1 =  `${anio}-${mes}-${dia}`;
console.log(formato1);

document.getElementById("FecActu").value = formato1;
document.getElementById("FecFact").value = formato1;