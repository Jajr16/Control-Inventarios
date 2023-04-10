var app = require('./app');

var http = require('http');
var server = http.createServer(app);
const io = require('socket.io')(server);

const mysql = require('mysql');

server.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000.');
  });

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'n0m3l0',
    database: 'Inventarios'
});
// Conexión a la base de datos
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conexión a la base de datos establecida');
});

// Configuración de socket.io
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Recepción de datos a través de socket.io
    socket.on('LG', async (data) => {
        console.log('Datos recibidos:', data);
        // Autenticar al usuario utilizando la lógica definida anteriormente
        db.query(`select*from usuario where User = "${data.User}" and Pass = "${data.Pass}"`, function (err, result){
            console.log(result);
            if (result.length > 0) {
                const token = Math.random().toString(36).substr(2);
                socket.emit('logInOK', { ok: true, token: token });
            } else {
                socket.emit('logInError',{ ok: false, mensaje: 'Nombre de usuario o contraseña incorrectos.' });
    
            }
        });
        
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado.');
      });
});

