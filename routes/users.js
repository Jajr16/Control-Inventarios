var express = require('express');
var router = express.Router();

/* GET home page. (nosotros.ejs)*/
router.get('/Inicio', function (req, res, next) {
  res.render('Inicio', { title: '--- Menú ---' });
});

/* GET home page. (Productos.ejs)*/
router.get('/Productos', function (req, res, next) {
  res.render('Productos', { title: 'Agregar productos' });
});

module.exports = router;
