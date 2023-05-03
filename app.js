var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ExcelJS = require('exceljs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//var session_middleware = require("./routes/middleware");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
//app.use("/app", session_middleware);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

// Fecha para generar excel
const date = new Date();
let fechaDia = date.getDate();
let fechaMes = date.getMonth() + 1;
let fechaAño = date.getFullYear();
let fechaHora = date.getHours();
let fechaMinutos = date.getMinutes();

if (fechaMes < 10) {
  fechaMes = "0" + fechaMes;
}
if (fechaDia < 10) {
  fechaDia = "0" + fechaDia;
}

// Router para generar excel
app.post('/descargar-excel', function (req, res) {

  let jsonData = req.body.datos;

  res.send('Datos recibidos correctamente');
  
  // Crear archivo Excel
  var workbook = new ExcelJS.Workbook();
  var worksheet = workbook.addWorksheet('Productos');

  // Create a new instance of a Workbook class
  let nombreArchivo = "Almacen" + "_" + fechaDia + "_" + fechaMes + "_" + fechaAño + "_" + fechaHora + "-" + fechaMinutos;

  // Crear estilos
  var cualColumnaEstilo = workbook.createStyle({
    font: {
      name: 'Arial',
      color: '#000000',
      size: 12,
      bold: true,
    }
  });

  var contenidoEstilo = workbook.createStyle({
    font: {
      name: 'Arial',
      color: '#494949',
      size: 11,
    }
  });

  //Nombres de las columnas
  worksheet.cell(1, 1).string("CÓDIGO DE BARRAS").style(cualColumnaEstilo);
  worksheet.cell(1, 2).string("CATEGORÍA").style(cualColumnaEstilo);
  worksheet.cell(1, 3).string("NOMBRE DEL ARTÍCULO").style(cualColumnaEstilo);
  worksheet.cell(1, 4).string("MARCA DEL ARTÍCULO").style(cualColumnaEstilo);
  worksheet.cell(1, 5).string("DESCRIPCIÓN").style(cualColumnaEstilo);
  worksheet.cell(1, 6).string("UNIDAD").style(cualColumnaEstilo);
  worksheet.cell(1, 7).string("EN EXISTENCIA").style(cualColumnaEstilo);

  let cualFila = 2;

  // FOR - creación de datos
  for (let i = 0; i < jsonData.length; i++) {

    let productoActual = jsonData[i]; // cada posición del arreglo

    // Nombre
    worksheet.cell(cualFila, 1).string(productoActual.CodBarrasJSON).style(contenidoEstilo);
    // apellido
    worksheet.cell(cualFila, 2).string(productoActual.CategoriaJSON).style(contenidoEstilo);
    // edad
    worksheet.cell(cualFila, 3).number(productoActual.NomPJSON).style(contenidoEstilo);
    // id
    worksheet.cell(cualFila, 4).number(productoActual.MarcaJSON).style(contenidoEstilo);
    // teléfono
    worksheet.cell(cualFila, 5).number(productoActual.DescripcionJSON).style(contenidoEstilo);
    // correo
    worksheet.cell(cualFila, 6).string(productoActual.UnidadJSON).style(contenidoEstilo);
    // correo
    worksheet.cell(cualFila, 7).string(productoActual.ExistenciaJSON).style(contenidoEstilo);

    // Aumenta de fila
    cualFila = cualFila + 1;
  }

  // Descargar archivo Excel
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=datos.xlsx');
  workbook.xlsx.write(res).then(function () {
    res.end();
  });
});

module.exports = app;
