var app = require('./app');
var http = require('http');
var server = http.createServer(app);
const io = require('socket.io')(server);
//Importar Base de datos
var db = require("./Conexion/BaseDatos");

//Escuchar servidor
server.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000.');
});

// Configuración de socket.io
io.on('connection', (socket) => {
    console.log('Cliente conectado');
    // Recepción de datos a través de socket.io
    socket.on('LG', async (data) => {

        console.log('Datos recibidos:', data);
        // Autenticar al usuario utilizando la lógica definida anteriormente
        db.query(`select*from usuario where User = "${data.User}" and Pass = "${data.Pass}"`, function (err, result) {
            console.log(result);
            if (err) console.log(err);//Se imprime algún error que haya ocurridp
            if (result.length > 0) {//Si sí hizo una búsqueda
                console.log(result[0].token);
                socket.emit('logInOK', { Usuario: result[0].User, token: result[0].token });//Mandar usuario y token al cliente
            } else {
                socket.emit('logInError', { mensaje: 'Nombre de usuario o contraseña incorrectos.' });//Mandar mensaje de error a cliente
            }
        });

    });

    socket.on('Alta_Prod', async (data) => {
        console.log('Productos: ', data);
        //Autentificar que no exista un producto igual
        db.query(`select*from almacen where Cod_Barras = "${data.CodBarras}"`, function (err, result) {
            console.log("El resultado de la consulta es: ", result);
            if (err) console.log("Error de búsqueda: " + err);//Se imprime algún error que haya ocurrido

            if (result.length > 0) {//Si sí hizo una búsqueda
                socket.emit('Producto_Existente', { mensaje: "Este producto ya se encuentra en existencia." });//Mandar usuario y token al cliente
            } else {
                db.query(`insert into Facturas_Almacen values(null, "${data.FecAct}")`, function (err1, result1) {//Insertar factura
                    if (err1) console.log("Error en inserción de facturas: ", err1);
                    if (result1) {
                        //Se agrega productos a la BD
                        db.query(`insert into almacen values ("${data.CodBarras}","${data.FecAct}","${data.Cate}","${data.Producto}","${data.Marca}","${data.Descripcion}","${data.Proveedor}","${data.NumFactura}","${data.Unidad}","${data.Cantidad}","${data.Cantidad}")`, function (err2, result2) {
                            console.log("A");
                            if (err2) console.log("Error de inserción de productos: ", err2);
                            db.end();
                            if (result2) {
                                console.log("Resultado de inserción de productos: ", result2);
                                socket.emit('Producto_Inexistente', { mensaje: 'Producto dado de alta.' });//Mandar mensaje de error a cliente
                            }
                        });
                    }
                });

            }
        });

    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado.');
    });
});



