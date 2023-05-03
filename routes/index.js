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


module.exports = router;
