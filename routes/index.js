const express = require('express');
var router = express.Router();


/* GET home page. (index.ejs)*/
router.get('/', function (req, res) {
  res.render('LogIn', { title: 'Inicie Sesión' });
});

module.exports = router;