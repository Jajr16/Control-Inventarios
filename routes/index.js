var express = require('express');
var router = express.Router();
const xl = require('excel4node');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const ejs = require('ejs');

//FECHA
let date = new Date();
let fechaDia = date.getUTCDate();
let fechaMes = (date.getUTCMonth()) + 1;
let fechaAño = date.getUTCFullYear();
let fechaHora = date.getUTCHours();
let fechaMinuto = date.getUTCMinutes();

// usuarios de prueba
let usuarios = [
  {
    nombre: "daniel",
    apellido: "perez",
    edad: 27,
    id: 45345645,
    telefono: 344564576,
    correo: "daniel@gmail.com",
  },
  {
    nombre: "Pedro",
    apellido: "suarez",
    edad: 25,
    id: 45345645111,
    telefono: 3445645722226,
    correo: "petro@gmail.com",
  },
  {
    nombre: "alejandra",
    apellido: "ospina",
    edad: 29,
    id: 453456434235,
    telefono: 3445234236457,
    correo: "alejandra@gmail.com",
  },
  {
    nombre: "gabriel",
    apellido: "arias",
    edad: 22,
    id: 4534564523423,
    telefono: 3445645734236,
    correo: "gabriel@gmail.com",
  },
  {
    nombre: "camilo",
    apellido: "buitrago",
    edad: 28,
    id: 4534523645,
    telefono: 3445645712316,
    correo: "camilo@gmail.com",
  },
  {
    nombre: "sebastian",
    apellido: "garcia",
    edad: 29,
    id: 453456412315,
    telefono: 34456123124576,
    correo: "sebastian@gmail.com",
  },
];

/* Pagina inicial - iniciar sesion */
router.get('/', function (req, res) {
  res.render('login', { title: 'Iniciar Sesión' });
});

/* Menu */
router.get('/index', function (req, res, next) {
  res.render('index', { title: 'Menú' });
});

/* productos */
router.get('/productos', function (req, res, next) {
  res.render('productos', { title: 'Productos' });
});


/*** Consultas ***/
// Consulta de equipos
router.get('/consulEqp', function (req, res, next) {
  res.render('consulEqp', { title: 'Consultar Equipos' });
});
// Consulta de mobiliario
router.get('/consulMob', function (req, res, next) {
  res.render('consulMob', { title: 'Consultar Mobiliario' });
});
// Consulta de productos
router.get('/consulPro', function (req, res, next) {
  res.render('consulPro', { title: 'Consultar Productos' });
});
/*** Finaliza consultas ***/


/*** Altas ***/
// Altas de equipos
router.get('/altasEqp', function (req, res, next) {
  res.render('altasEqp', { title: 'Agregar Equipos' });
});
// Altas de mobiliario
router.get('/altasMob', function (req, res, next) {
  res.render('altasMob', { title: 'Agregar Mobiliario' });
});
// Altas de productos
router.get('/altasPro', function (req, res, next) {
  res.render('altasPro', { title: 'Agregar Productos' });
});
/*** Finaliza altas ***/


/*** Bajas ***/
// Bajas de equipos
router.get('/bajasEqp', function (req, res, next) {
  res.render('bajasEqp', { title: 'Eliminar Equipos' });
});
// Bajas de mobiliario
router.get('/bajasMob', function (req, res, next) {
  res.render('bajasMob', { title: 'Eliminar Mobiliario' });
});
// Bajas de productos
router.get('/bajasPro', function (req, res, next) {
  res.render('bajasPro', { title: 'Eliminar Productos' });
});
/*** Finaliza bajas ***/


/*** Cambios ***/
// cambios de equipos
router.get('/cambiosEqp', function (req, res, next) {
  res.render('cambiosEqp', { title: 'Modificar Equipos' });
});
// cambios de mobiliario
router.get('/cambiosMob', function (req, res, next) {
  res.render('cambiosMob', { title: 'Modificar Mobiliario' });
});
// cambios de productos
router.get('/cambiosPro', function (req, res, next) {
  res.render('cambiosPro', { title: 'Modificar Productos' });
});
/*** Finaliza cambios ***/


/*** Añadir o borrar registros existentes ***/
// Añadir o borrar equipos existentes
router.get('/ABEE', function (req, res, next) {
  res.render('ABEE', { title: 'Equipos registrados' });
});
// Añadir o borrar productos existentes
router.get('/ABPE', function (req, res, next) {
  res.render('ABPE', { title: 'Productos registrados' });
});
// Añadir o borrar mobiliario existente
router.get('/ABME', function (req, res, next) {
  res.render('ABME', { title: 'Mobiliario registrado' });
});
/*** Termina añadir o borrar registros existentes ***/

// Usuario nuevo
router.get('/RegistrarUsuario', function (req, res, next) {
  res.render('RegistrarUsuario', { title: 'Crear nuevo usuario' });
});
//Empleado nuevo
router.get('/RegistroEmpleado', function (req, res, next) {
  res.render('RegistroEmpleado', { title: 'Crear nuevo usuario' });
});

// Crear archivo excel
router.get('/descargar-excel', function (req, res, next) {

  // Configurar excel4node
  // Create a new instance of a Workbook class
  var wb = new xl.Workbook();
  let nombreArchivo = "Productos" + fechaDia + "_" + fechaMes + "_" + fechaAño + ".";
  var ws = wb.addWorksheet(nombreArchivo);

  // Crear estilos
  var cualColumnaEstilo = wb.createStyle({
    font: {
      name: 'Arial',
      color: '#000000',
      size: 12,
      bold: true,
    }
  });

  var contenidoEstilo = wb.createStyle({
    font: {
      name: 'Arial',
      color: '#494949',
      size: 11,
    }
  });

  //Nombres de las columnas
  ws.cell(1, 1).string("Nombre").style(cualColumnaEstilo);
  ws.cell(1, 2).string("Apellido").style(cualColumnaEstilo);
  ws.cell(1, 3).string("Edad").style(cualColumnaEstilo);
  ws.cell(1, 4).string("ID").style(cualColumnaEstilo);
  ws.cell(1, 5).string("Teléfono").style(cualColumnaEstilo);
  ws.cell(1, 6).string("Correo").style(cualColumnaEstilo);

  let cualFila = 2;

  // FOR - creación de datos
  for (let i = 0; i < usuarios.length; i++) {

    let usuarioActual = usuarios[i]; // cada posición del arreglo

    // Nombre
    ws.cell(cualFila, 1).string(usuarioActual.nombre).style(contenidoEstilo);
    // apellido
    ws.cell(cualFila, 2).string(usuarioActual.apellido).style(contenidoEstilo);
    // edad
    ws.cell(cualFila, 3).number(usuarioActual.edad).style(contenidoEstilo);
    // id
    ws.cell(cualFila, 4).number(usuarioActual.id).style(contenidoEstilo);
    // teléfono
    ws.cell(cualFila, 5).number(usuarioActual.telefono).style(contenidoEstilo);
    // correo
    ws.cell(cualFila, 6).string(usuarioActual.correo).style(contenidoEstilo);

    // Aumenta de fila
    cualFila = cualFila + 1;
  }

  //Ruta del archivo
  const pathExcel = path.join(__dirname, 'excel', nombreArchivo + '.xlsx');
  //Escribir o guardar
  wb.write(pathExcel, function (err, stats) {
    if (err) console.log(err);
    else {

      // Crear función y descargar archivo
      function downloadFile() { res.download(pathExcel); }
      downloadFile();

      // Borrar archivo
      fs.rm(pathExcel, function (err) {
        if (err) console.log(err);
        else console.log("Archivo descargado y borrado del servidor correctamente");
      });
    }
  });
});

module.exports = router;
