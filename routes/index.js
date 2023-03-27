const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mysql = require('mysql');
var router = express.Router();


// Configuración de la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'n0m3l0',
  database: 'Inventarios'
});
console.log("sds");
// Configuración de socket.io
io.on('connection', (socket) => {
  console.log('Cliente conectado');


  // Conexión a la base de datos
  db.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('Conexión a la base de datos establecida');
  });
  // Envío de datos a través de socket.io
  socket.emit('Server', 'Datos enviados desde el servidor');

  // Recepción de datos a través de socket.io
  socket.on('Server', (data) => {
    console.log('Datos recibidos:', data);
    const sql = 'SELECT * FROM usuario';
    db.query(sql, (err, result) => {
      if (err) {
        throw "DAW:" + err;
      }
      console.log("asdsa");
      res.json(result);
    });
    // // Creación de hilo para procesar datos
    // const worker = new Worker('./worker.js', { workerData: data });

    // // Recepción de datos desde el hilo
    // worker.on('message', (result) => {
    //   console.log('Resultado del procesamiento de datos:', result);
    // });
  });
});

/* GET home page. (index.ejs)*/
router.get('/', function (req, res, next) {
  res.render('LogIn', { title: 'Inicie Sesión' });
});

/* GET home page. (nosotros.ejs)*/
router.get('/Inicio', function (req, res, next) {
  res.render('Inicio', { title: '--- Menú ---' });
});

/* GET home page. (Productos.ejs)*/
router.get('/Productos', function (req, res, next) {
  res.render('Productos', { title: 'Agregar productos' });
});

module.exports = router;

// Inicio del servidor
server.listen(8080, () => {
  console.log('Servidor iniciado en el puerto 3000');
});
