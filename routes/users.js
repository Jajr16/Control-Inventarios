var express = require('express');
var router = express.Router();

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
module.exports = router;
