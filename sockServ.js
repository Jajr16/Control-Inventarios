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

    // Login
    socket.on('LG', async (data) => {

        console.log('Datos recibidos:', data);
        // Autenticar al usuario utilizando la lógica definida anteriormente
        db.query('select*from usuario where User = ? and Pass = ?', [data.User, data.Pass], function (err, result) {
            console.log(result);
            if (err) console.log(err);//Se imprime algún error que haya ocurrido
            if (result.length > 0) {//Si sí hizo una búsqueda
                console.log(result[0].token);
                socket.emit('logInOK', { Usuario: result[0].User, token: result[0].token });//Mandar usuario y token al cliente
            } else {
                socket.emit('logInError', { mensaje: 'Nombre de usuario o contraseña incorrectos.' });//Mandar mensaje de error a cliente
            }
        });

    });

    // Consultas de productos
    socket.on('Consul_Prod', async () => {
        // Autenticar que haga las consultas
        db.query('select almacen.Cod_Barras, almacen.FIngreso, almacen.Categoria, almacen.Articulo, almacen.Marca, almacen.Descripcion, almacen.Unidad, almacen.Existencia, almacen.Proveedor, facturas_almacen.Num_Fact, facturas_almacen.Ffact from almacen natural join facturas_almacen', function (err, result) {
            if (err) console.log("Error de búsqueda: " + err);//Se imprime algún error que haya ocurrido
            if (result.length > 0) {//Si sí hizo una búsqueda

                for (var i = 0; i < result.length; i++) {
                    var FechasIngresos = new Date(result[i].FIngreso);
                    var Fecha_Factura = new Date(result[i].Ffact);

                    socket.emit('Desp_Productos', { Cod_Barras: result[i].Cod_Barras, FIngreso: FechasIngresos.toISOString().slice(0, 10), Categoria: result[i].Categoria, NArt: result[i].Articulo, NMarca: result[i].Marca, Desc: result[i].Descripcion, Prov: result[i].Proveedor, Unidad: result[i].Unidad, NFact: result[i].Num_Fact, Ffact: Fecha_Factura.toISOString().slice(0, 10), Existencia: result[i].Existencia });//Mandar usuario y token al cliente
                }
                socket.emit('ButtonDelete');
                socket.emit('ButtonUp');
            } else {
                socket.emit('Productos_Inexistentes', { mensaje: 'No hay datos para mostrar' });//Mandar mensaje de error a cliente
            }
        });

    });

    // Altas de productos
    socket.on('Alta_Prod', async (data) => {

        //Autentificar que no exista un producto igual
        db.query('select*from almacen where Cod_Barras = ?', [data.CodBarras], function (err, result) {

            if (err) console.log("Error de búsqueda: " + err);//Se imprime algún error que haya ocurrido

            if (result.length > 0) {//Si sí hizo una búsqueda
                socket.emit('Producto_Existente', { mensaje: "Este producto ya se encuentra en existencia." });//Mandar usuario y token al cliente
            } else {
                db.query('select*from Facturas_Almacen where Num_Fact = ?', [data.NumFactura], function (err, result) {
                    if (err) console.log("Error en búsqueda: ", err);
                    if (result.length > 0) {
                        socket.emit('Fact_Exists', { mensaje: "Ese número de factura ya fue agregado con anterioridad." });
                    } else {
                        //Se agrega productos a la BD
                        db.query('insert into almacen values (?,?,?,?,?,?,?,?,?)', [data.CodBarras, data.FecAct, data.Cate, data.Producto, data.Marca, data.Descripcion, data.Proveedor, data.Unidad, data.Cantidad], function (err2, result) {
                            if (err2) console.log("Error de inserción de productos: ", err2);
                            if (result) {
                                db.query('insert into Facturas_Almacen values(?,?,?,?)', [data.NumFactura, data.FechaFac, data.CodBarras, data.Cantidad], function (err1, result) {//Insertar factura
                                    if (err1) console.log("Error en inserción de facturas: ", err1);
                                    if (result) {
                                        console.log("Resultado de inserción de productos: ", result);
                                        socket.emit('Producto_Inexistente', { mensaje: 'Producto dado de alta.' });//Mandar mensaje de error a cliente
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
        data.length = 0;
    });

    // Bajas en productos
    socket.on('Bajas_Prod', async (data) => {
        // Autenticar que haga las consultas
        db.query('select*from almacen', function (err, result) {
            if (err) console.log("Error de búsqueda: " + err);//Se imprime algún error que haya ocurrido
            if (result.length > 0) {//Si sí hizo una búsqueda
                db.query('delete from almacen where Cod_Barras = ?;', [data], function (err, result) {

                    if (err) console.log("Error de inserción de productos: ", err);
                    if (result.affectedRows > 0) {
                        console.log("Resultado de eliminacion de productos: ", result);
                        socket.emit('Producto_Eliminado', { mensaje: 'Producto dado de baja.' });//Mandar mensaje de éxito a cliente
                    } else {
                        socket.emit('Error', { mensaje: "Producto no eliminado, inténtelo de nuevo." });
                    }
                });

            } else {
                socket.emit('Productos_Inexistentes', { mensaje: 'No hay datos para mostrar' });//Mandar mensaje de error a cliente
            }
        });
    });

    // Cambios en productos
    socket.on('Cambios_Prod', async (data, dataOld) => {

        //Se agrega productos a la BD
        db.query('update almacen set Cod_Barras = ?, FIngreso = ?, Categoria = ?, Articulo = ?, Marca = ?, Descripcion = ?, Proveedor = ?, Unidad = ?, Existencia = ? where Cod_Barras = ?', [data.CodBarras, data.FecAct, data.Cate, data.Producto, data.Marca, data.Descripcion, data.Proveedor, data.Unidad, data.Existencia, dataOld.CBO], function (err2, result) {
            if (err2) console.log("Error de inserción de productos: ", err2);
            if (result) {
                db.query('update Facturas_Almacen set Num_Fact = ?, Ffact = ?, Cod_Barras = ? where Num_Fact = ?', [data.NumFactura, data.FechaFac, data.CodBarras, dataOld.NFO], function (err1, result) {//Insertar factura
                    if (err1) console.log("Error en inserción de facturas: ", err1);
                    if (result) {
                        console.log("Resultado de inserción de productos: ", result);
                        socket.emit('Producto_Inexistente', { mensaje: 'Artículo modificado con éxito.' });//Mandar mensaje a cliente
                    }else {
                        socket.emit('Fallo_Mod', {mensaje: "No se pudo modificar el artículo."})
                    }
                });
            }
        });





        data.length = 0;
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado.');
    });
});
