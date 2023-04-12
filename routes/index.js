const express = require('express');
var router = express.Router();


/* Pagina inicial - iniciar sesion */
router.get('/', function (req, res) {
  res.render('login', { title: 'Inicie Sesión' });
});

/* Menu */
router.get('/index', function (req, res, next) {
  res.render('index', { title: 'Menú' });
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
// Consulta de Productos
router.get('/consulPro', function (req, res, next) {
  res.render('consulPro', { title: 'Consultar Productos' });
});

/*** Finaliza consultas ***/

/* Altas */
router.get('/altas', function (req, res, next) {
  res.render('altas', { title: 'Agregar productos' });
});

/* Bajas */
router.get('/bajas', function (req, res, next) {
  res.render('bajas', { title: 'Eliminar productos' });
});

/* Cambios */
router.get('/cambios', function (req, res, next) {
  res.render('cambios', { title: 'Modificar productos' });
});

module.exports = router;