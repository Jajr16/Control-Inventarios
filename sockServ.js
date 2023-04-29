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
        db.query('select*from usuario where Usuario = BINARY  ? and Pass = BINARY  ?', [data.User, data.Pass], function (err, result) {
            console.log(result);
            if (err) console.log(err);//Se imprime algún error que haya ocurrido
            if (result.length > 0) {//Si sí hizo una búsqueda
                console.log(result[0].token);
                socket.emit('logInOK', { Usuario: result[0].User, token: result[0].token });//Mandar usuario y token al cliente
            } else {
                console.log(result);
                socket.emit('logInError', { mensaje: 'Nombre de usuario o contraseña incorrectos.' });//Mandar mensaje de error a cliente
            }
        });

    });

    // Consultas de productos
    socket.on('Consul_Prod', async () => {

        // Autenticar que haga las consultas
        db.query('select *from almacen order by eliminado', function (err, result) {
            if (err) console.log("Error de búsqueda: " + err);//Se imprime algún error que haya ocurrido
            if (result.length > 0) {//Si sí hizo una búsqueda
                for (var i = 0; i < result.length; i++) {
                    //FIngreso: FechasIngresos.toISOString().slice(0, 10),

                    socket.emit('Desp_Productos', { Cod_Barras: result[i].Cod_Barras, Categoria: result[i].Categoria, NArt: result[i].Articulo, NMarca: result[i].Marca, Desc: result[i].Descripcion, Unidad: result[i].Unidad, Existencia: result[i].Existencia, eliminado: result[i].eliminado });//Mandar usuario y token al cliente
                }
                socket.emit('ButtonDelete');
                socket.emit('ButtonUp');
            } else {
                socket.emit('Productos_Inexistentes', { mensaje: 'No hay datos para mostrar' });//Mandar mensaje de error a cliente
            }
            result.length = 0;
        });

    });
    //Buscar facturas
    socket.on('Traer_Facturas', async (data) => {
        db.query('select almacen.Articulo, factus_productos.Nfactura, factus_productos.Cantidad, factus_productos.FIngreso, facturas_almacen.Ffact, facturas_almacen.Proveedor from factus_productos inner join facturas_almacen on facturas_almacen.Num_Fact = factus_productos.Nfactura inner join almacen on factus_productos.Cod_Barras = almacen.Cod_Barras where factus_productos.Cod_Barras = ?', data, function (err, result) {
            if (err) console.log("Error de búsqueda: " + err);//Se imprime algún error que haya ocurrido
            if (result.length > 0) {//Si sí hizo una búsqueda
                let FecFactura = [];
                let NumFactu = [];
                let Canti = [];
                let FIngre = [];
                let Prove = [];

                for (var i = 0; i < result.length; i++) {
                    var FechasIngresos = new Date(result[i].FIngreso);
                    var Fecha_Factura = new Date(result[i].Ffact);
                    //Agregar datos al arreglo
                    FecFactura.push(Fecha_Factura.toISOString().slice(0, 10));
                    NumFactu.push(result[i].Nfactura);
                    Canti.push(result[i].Cantidad);
                    FIngre.push(FechasIngresos.toISOString().slice(0, 10));
                    Prove.push(result[i].Proveedor);

                }
                socket.emit("Fact_Enviadas", { NomProd: result[0].Articulo, NFactura: NumFactu, Cantidad: Canti, FIngreso: FIngre, FFactura: FecFactura, Proveedor: Prove });

                socket.emit("BotonModalFacturas");
            } else {
                socket.emit("Facturas_Vacias", "No se encontraron facturas");
            }
        });
    });

    // Altas de productos
    socket.on('Alta_Prod', async (data) => {

        //Autentificar que no exista un producto igual
        db.query('select*from almacen where Cod_Barras = ?', [data.CodBarras], function (err, result) {

            if (err) console.log("Error de búsqueda: " + err);//Se imprime algún error que haya ocurrido

            if (result.length > 0) {//Si sí hizo una búsqueda
                socket.emit('Producto_Existente', { mensaje: "Este artículo ya estaba registrado.\nEn caso de que quiera agregar más cantidad de este producto, por favor ingrese a la página de 'Ingresar más productos'." });
            } else {
                //Se agrega productos a la BD
                db.query('insert into almacen values (?,?,?,?,?,?,?,?)', [data.CodBarras, data.Cate, data.Producto, data.Marca, data.Descripcion, data.Unidad, data.Cantidad, 0], function (err2, result) {
                    if (err2) console.log("Error de inserción de productos: ", err2);
                    if (result) {
                        db.query('insert into Facturas_Almacen values(?,?,?)', [data.NumFactura, data.FechaFac, data.Proveedor], function (err1, result) {//Insertar factura
                            if (err1) console.log("Error en inserción de facturas: ", err1);
                            if (result) {
                                db.query('insert into factus_productos values(?,?,?,?)', [data.CodBarras, data.NumFactura, data.Cantidad, data.FecAct], function () {
                                    if (err) console.log("Error en inserción de facturas: ", err)
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
                db.query('update almacen set eliminado = 1 where Cod_Barras = ?;', [data], function (err, result) {

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
        db.query('update almacen set Cod_Barras = ?, Categoria = ?, Articulo = ?, Marca = ?, Descripcion = ?, Unidad = ? where Cod_Barras = ?', [data.CodBarras, data.Cate, data.Producto, data.Marca, data.Descripcion, data.Unidad, dataOld.CBO], function (err2, result) {
            if (err2) console.log("Error de inserción de productos: ", err2);

            if (result.affectedRows > 0) {
                socket.emit('Producto_Inexistente', { mensaje: 'Artículo modificado con éxito.' });//Mandar mensaje a cliente
            } else {
                socket.emit('Fallo_Mod', { mensaje: "No se pudo modificar el artículo." })
            }
        });
    });

    // Cambios en facturas
    socket.on("Cambios_Facts", async (data, dataOld) => {

        db.query('update factus_productos set Cantidad = ? where Nfactura = ? and Cod_Barras = ?', [data.Cantidad, dataOld.NFO, data.CodBarras], function (err, result) {
            if (err) console.log("Error en inserción de facturas: ", err);
            if (result.affectedRows > 0) {
                db.query('update Facturas_Almacen set Num_Fact = ?, Ffact = ?, Proveedor = ? where Num_Fact = ?', [data.NumFactura, data.FechaFac, data.Proveedor, dataOld.NFO], function (err1, result) {//Insertar factura
                    if (err1) console.log("Error en inserción de facturas: ", err1);
                    if (result.affectedRows > 0) {
                        socket.emit("Factu_Exitosa", { mensaje: "La factura fue modificada con éxito." });
                    } else {
                        socket.emit('Fallo_Fac', { mensaje: "No se pudo modificar la factura." })
                    }
                });
            } else {
                socket.emit('Fallo_ModFac', { mensaje: "No se pudo modificar la factura de almacen." })
            }
        });
    });

    // Consultas de productos existentes
    socket.on('Consul_ProdExist', async () => {

        // Autenticar que haga las consultas
        db.query('select *from almacen order by eliminado', function (err, result) {
            if (err) console.log("Error de búsqueda: " + err);//Se imprime algún error que haya ocurrido
            if (result.length > 0) {//Si sí hizo una búsqueda
                for (var i = 0; i < result.length; i++) {
                    //FIngreso: FechasIngresos.toISOString().slice(0, 10),

                    socket.emit('Desp_ProductosExist', { Cod_Barras: result[i].Cod_Barras, Categoria: result[i].Categoria, NArt: result[i].Articulo, NMarca: result[i].Marca, Desc: result[i].Descripcion, Unidad: result[i].Unidad, Existencia: result[i].Existencia, eliminado: result[i].eliminado });//Mandar usuario y token al cliente
                }
                socket.emit('AgregarProdExist');
                socket.emit('EliminarProdExist');
            } else {
                socket.emit('Productos_Inexistentes', { mensaje: 'No hay datos para mostrar' });//Mandar mensaje de error a cliente
            }
            result.length = 0;
        });

    });

    // Cambios en productos existentes
    socket.on('Altas_ProdExist', async (data) => {
        db.query('select*from facturas_almacen where Num_Fact = ?', [data.NumFactura], function (err2, result) {
            if (err2) console.log("Error de inserción de productos: ", err2);

            if (result.length > 0) {
                db.query('select*from Factus_Productos where Nfactura = ? and Cod_Barras = ?', [data.NumFactura, data.Cod_Barras], function (err2, result1) {
                    if (err2) console.log("Error de inserción de productos: ", err2);
                    if (result1.length > 0) {
                        socket.emit('Ya_Registrado', { mensaje: 'Factura registrada anteriormente para este producto.' });
                    } else {
                        db.query('insert into Factus_Productos values (?,?,?,?)', [data.Cod_Barras, data.NumFactura, data.Cantidad, data.FecAct], function (err, result) {
                            if (err) console.log("Error de inserción de productos: ", err2);
                            if (result) {
                                db.query('update almacen set Existencia = ? where Cod_Barras = ?', [(parseInt(data.Existencia) + parseInt(data.Cantidad)), data.Cod_Barras], function (err2, result1) {
                                    if (err) console.log("Error de inserción de productos: ", err2);
                                    if (result.affectedRows > 0) {
                                        socket.emit('Factura_Agregada', { mensaje: 'Factura agregada con éxito.' });//Mandar mensaje a cliente
                                    } else {
                                        socket.emit('Fallo_Factura', { mensaje: "No se pudo actualizar la existencia de productos." })
                                    }
                                });
                            } else {
                                socket.emit('Fallo_Factura', { mensaje: "No se pudo agregar la factura de productos." })
                            }
                        });
                    }
                });
            } else {
                //Se agrega productos a la BD
                db.query('insert into facturas_almacen values (?,?,?)', [data.NumFactura, data.FechaFac, data.Proveedor], function (err2, result) {
                    if (err2) console.log("Error de inserción de productos: ", err2);

                    if (result) {
                        console.log(data);

                        db.query('insert into Factus_Productos values (?,?,?,?)', [data.Cod_Barras, data.NumFactura, data.Cantidad, data.FecAct], function (err, result) {
                            if (result) {
                                db.query('update almacen set Existencia = ? where Cod_Barras = ?', [(parseInt(data.Existencia) + parseInt(data.Cantidad)), data.Cod_Barras], function (err2, result1) {
                                    if (err) console.log("Error de inserción de productos: ", err2);
                                    if (result.affectedRows > 0) {
                                        socket.emit('Factura_Agregada', { mensaje: 'Factura agregada con éxito.' });//Mandar mensaje a cliente
                                    } else {
                                        socket.emit('Fallo_Factura', { mensaje: "No se pudo actualizar la existencia de productos." })
                                    }
                                });
                            } else {
                                socket.emit('Fallo_Factura', { mensaje: "No se pudo agregar la factura de productos." })
                            }
                        });
                    } else {
                        socket.emit('Fallo_Factura', { mensaje: "No se pudo agregar la factura." })
                    }
                });
            }
        });
    });

    const hoy = new Date();

    let dia = hoy.getDate();
    let mes = hoy.getMonth() + 1;
    let anio = hoy.getFullYear();

    let formato1 = "";

    if (mes < 10) {
        mes = "0" + mes;
    }
    if (dia < 10) {
        dia = "0" + dia;
    }

    formato1 = `${anio}-${mes}-${dia}`;

    // Bajas en productos existentes
    socket.on('Bajas_ProdExist', async (data) => {
        console.log(data);
        db.query('select Existencia from almacen where Cod_Barras = ?', [data.Cod_Barras], function (err, result) {

            if (err) console.log("Error de eliminación de productos: ", err);
            if (result.length > 0) {
                if (parseInt(result[0].Existencia) > 0 && parseInt(data.Cantidad) <= parseInt(result[0].Existencia)) {
                    db.query('select num_emp from empleado where Nom = ?', [data.Emp], function (err, res) {
                        if (err) console.log("Error de busqueda de empleados: ", err);
                        console.log(res);
                        if (res.length > 0) {
                            db.query('insert into salidas_productos values (?,?,?,?)', [data.Cod_Barras, formato1, res[0].num_emp, data.Cantidad], function (err2, result) {
                                if (err2) console.log("Error de inserción de productos: ", err2);
                                if (result.affectedRows > 0) {
                                    socket.emit('Eliminacion_Realizada', { mensaje: 'Productos sacados con éxito.' });//Mandar mensaje a cliente
                                } else {
                                    socket.emit('Fallo_BajasExist', { mensaje: "No se pudo actualizar la existencia de productos." })
                                }
                            });
                        } else {
                            socket.emit('Fallo_BajasExist', { mensaje: "No se encontró ningún empleado con ese nombre, actualice la página." })
                        }
                    });
                } else {
                    socket.emit('Fallo_BajasExist', { mensaje: "Cantidad de productos a sacar superior a existencia." })
                }
            }
        });
    });

    // Altas de Usuarios
    socket.on('Registro_Usuario', async (data) => {
        //Autentificar que no exista un usuario igual
        db.query('select*from Empleado where Nom = ?', [data.NombreEmp], function (err, resultG) {

            if (err) console.log("Error de búsqueda: " + err);//Se imprime algún error que haya ocurrido

            if (resultG.length > 0) {//Si sí hizo una búsqueda

                db.query('select*from Usuario where Usuario = ?', [data.N_User], function (err, result) {

                    if (err) console.log("Error de búsqueda: " + err);//Se imprime algún error que haya ocurrido

                    if (result.length > 0) {//Si sí hizo una búsqueda
                        socket.emit('Usuario_Existente', { mensaje: "Este usuario ya está registrado." });
                    } else {
                        db.query('select tokens.token from tokens inner join empleado on tokens.area = empleado.Área where empleado.Num_Emp = ?', resultG[0].Num_emp, function (err, result) {
                            if (err) console.log("El error en la búsqueda fue: ", err);
                            if (result.length > 0) {
                                db.query('insert into Usuario values (?,?,?,?)', [resultG[0].Num_emp, data.N_User, data.ContraNueva, result[0].token], function (err, result) {

                                    if (err) console.log("Error de inserción de Usuario: ", err);

                                    if (result) {
                                        console.log("Resultado de inserción de Usuario: ", result);
                                        socket.emit('Usuario_Agregado', { mensaje: "Usuario agregado con éxito." });
                                    } else {
                                        socket.emit('Usuario_Error', { mensaje: "Error al agregar el usuario." });
                                    }
                                });
                            }
                        });

                    }
                });
            } else {
                socket.emit('Usuario_Error', { mensaje: "No se encontró el usuario, inténtelo de nuevo, si el problema persiste, llame a los encargados de sistemas." });
            }
        });
    });

    socket.on('Reg_Emp', async (data) => {
        console.log(data);
        db.query('select*from Empleado where Nom = ?', [data.NombreEmp], function (err, result) {

            if (err) console.log("Error de búsqueda: " + err);//Se imprime algún error que haya ocurrido
            if (result.length > 0) {//Si sí hizo una búsqueda
                socket.emit('Res_Emp', { mensaje: "Este empleado ya está registrado." });
            } else {
                db.query('select Num_emp from Empleado where Nom = ?', [data.NomJefe], function (err, result) {
                    if (err) console.log("Error de búsqueda: " + err);//Se imprime algún error que haya ocurrido
                    console.log(result);
                    if (result.length > 0) {//Si sí hizo una búsqueda
                        db.query('insert into Empleado values(null, ?, ?, ?)',[data.NombreEmp, data.Area, result[0].Num_emp],function(err, res){
                            if(res){
                                socket.emit('Res_Emp', { mensaje: "Empleado dado de alta." });
                            }
                        });
                    } else {
                        socket.emit('Res_Emp', { mensaje: "El jefe que seleccionó no se encontró, recargue la página o llame al encargado de sistemas." });
                    }
                });
            }
        });
    });

    socket.on('List_empleados', (data) => {
        db.query('select Nom from empleado', function (err, res) {
            if (err) console.log("El error fue: ", err)
            if (res.length > 0) {
                for (var i = 0; i < res.length; i++) {
                    if(data == "Jefes") socket.emit('ListaNombres2', { Nombres: res[i].Nom });
                    else if(data == "Empleados") socket.emit('ListaNombres', { Nombres: res[i].Nom });
                    
                }
            }

        });
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado.');
    });
});
