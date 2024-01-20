// Obtener la fecha actual
const hoy = new Date();

// Obtener el día, el mes y el año
let dia = hoy.getDate();
let mes = hoy.getMonth() + 1; // El mes se devuelve como base 0, por lo que se suma 1
let anio = hoy.getFullYear();

// Crear una cadena de texto para el formato deseado
let formato1 = "";

// Agregar un cero al mes y al día si son menores que 10
if (mes < 10) {
    mes = "0" + mes;
}
if (dia < 10) {
    dia = "0" + dia;
}

// Crear una cadena con el formato 'yyyy-mm-dd' (año-mes-día)
formato1 = `${anio}-${mes}-${dia}`;
console.log(formato1);

// Asignar la fecha actual a elementos HTML con los IDs "FecActu" y "FecFact"
if (document.getElementById("FecActu") && document.getElementById("FecFact")){
    document.getElementById("FecActu").value = formato1;
    document.getElementById("FecFact").value = formato1;
}
