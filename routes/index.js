var express = require('express');
var router = express.Router();
/* Pagina inicial - iniciar sesion */
router.get('/', function (req, res) {
  res.render('login', { title: 'Iniciar Sesión', layout: false });
});

/* Menu */
router.get('/index', function (req, res, next) {
  res.render('index', { title: 'Menú', layout: false });
});

/*** Errores ***/
router.get('/ErrorPage', function(req, res, next){
  res.render('ErrorPage', { title: 'Error inesperado', layout: false });
});



module.exports = router;
