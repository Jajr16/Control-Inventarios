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

/*** Consultas ***/
// Consulta de equipos
router.get('/consulEqp', function (req, res, next) {
  res.render('consulEqp', { title: 'Consultar Equipos', layout: 'consul_layout' });
});
// Consulta de mobiliario
router.get('/consulMob', function (req, res, next) {
  res.render('consulMob', { title: 'Consultar Mobiliario', layout: 'consul_layout' });
});
// Consulta de productos
router.get('/consulPro', function (req, res, next) {
  res.render('consulPro', { title: 'Consultar Productos', layout: 'consul_layout' });
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

/*** Añadir o borrar registros existentes ***/
router.get('/ABPE', function (req, res, next) {
  res.render('ABPE', { title: 'Productos registrados', layout: 'consul_layout' });
});

/*** Consultar registro de productos sacados ***/
router.get('/FacSacProd', function (req, res, next) {
  res.render('FacSacProd', { title: 'Registro de productos sacados', layout: 'consul_layout' });
});

// Usuario nuevo
router.get('/RegistrarUsuario', function (req, res, next) {
  res.render('RegistrarUsuario', { title: 'Crear nuevo usuario' });
});
// Consultar usuarios
router.get('/consulUsuarios', function (req, res, next) {
  res.render('consulUsuarios', { title: 'Usuarios registrados', layout: 'consul_layout' });
});
//Empleado nuevo
router.get('/RegistroEmpleado', function (req, res, next) {
  res.render('RegistroEmpleado', { title: 'Registrar Empleado' });
});
// Modificar empleados
router.get('/ModEmp', function (req, res, next) {
  res.render('ModEmp', { title: 'Modificar Empleado', layout: 'consul_layout' });
});

/*** Crear responsivas ***/
router.get('/crear_resp', function (req, res, next) {
  res.render('crear_resp', { title: 'Crear responsivas' });
});

/*** Carritos solicitados ***/
router.get('/sol_prod', function (req, res, next) {
  res.render('dir_car', { title: 'Productos solicitados', layout: 'consul_layout' });
});

router.get('/carrito', function (req, res, next) {
  res.render('cart', { title: 'Productos solicitados', layout: 'consul_layout' });
});

module.exports = router;