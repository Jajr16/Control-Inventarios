//Fecha actual
var FecAc = new Date();
document.getElementById("FecActu").value = FecAc.toJSON().slice(0,10);
document.getElementById("FecFact").value = FecAc.toJSON().slice(0,10);
