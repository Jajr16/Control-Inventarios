var app = require('./app');
var http = require('http');
var server = http.createServer(app);
const io = require('socket.io')(server);
//Importar Base de datos
var db = require("./Conexion/BaseDatos");
const Excel = require('exceljs');
const path = require('path');
const fs = require('fs');
var contador = 1;
var contadorS = 1;
//MENSAJE DE ERROR A ENVIAR
var MensajeError = "Hubo un error, favor de contactar al personal de sistemas.";
//Escuchar servidor
server.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000.');
});

// Configuración de socket.io
io.on('connection', (socket) => {
    console.log('Cliente conectado');
    // Recepción de datos a través de socket.io

    // Fecha para generar excel
    const date = new Date();
    let fechaDia = date.getDate();
    let fechaMes = date.getMonth() + 1;
    let fechaAño = date.getFullYear();
    let fechaHora = date.getHours();
    let fechaMinutos = date.getMinutes();

    if (fechaMes < 10) {
        fechaMes = "0" + fechaMes;
    }
    if (fechaDia < 10) {
        fechaDia = "0" + fechaDia;
    }

    let nombreArchivo = "Almacen" + "-" + fechaDia + "_" + fechaMes + "_" + fechaAño + "--" + fechaHora + "-" + fechaMinutos;
    let nombreSacarProd = "Retiro_Almacen";

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
                    socket.emit('Desp_Productos', { Cod_Barras: result[i].Cod_Barras, Categoria: result[i].Categoria, NArt: result[i].Articulo, NMarca: result[i].Marca, Desc: result[i].Descripcion, Unidad: result[i].Unidad, Existencia: result[i].Existencia, eliminado: result[i].eliminado });//Mandar usuario y token al cliente
                }
                socket.emit('ButtonUp');
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
            if (err2) socket.emit('Fallo_Mod', MensajeError);
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
                db.query('select*from factus_productos where Num_Fact = ? ', [data.NumFactu], function () {
                    if (result.length > 0) {
                        socket.emit('Fallo_Fac', { mensaje: 'Ese número de factura ya está registrado, favor de ingresar otro.' })
                    } else {
                        db.query('update Facturas_Almacen set Num_Fact = ?, Ffact = ?, Proveedor = ? where Num_Fact = ?', [data.NumFactura, data.FechaFac, data.Proveedor, dataOld.NFO], function (err1, result) {//Insertar factura
                            if (err1) console.log("Error en inserción de facturas: ", err1);
                            if (result.affectedRows > 0) {
                                socket.emit("Factu_Exitosa", { mensaje: "La factura fue modificada con éxito." });
                            } else {
                                socket.emit('Fallo_Fac', { mensaje: "No se pudo modificar la factura." })
                            }
                        });
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

    let segundos = hoy.getSeconds();
    let minutos = hoy.getMinutes();
    let horas = hoy.getHours();

    let formato1 = "";

    if (segundos < 10) {
        segundos = "0" + segundos;
    }
    if (minutos < 10) {
        minutos = "0" + minutos;
    }
    if (horas < 10) {
        horas = "0" + horas;
    }
    if (mes < 10) {
        mes = "0" + mes;
    }
    if (dia < 10) {
        dia = "0" + dia;
    }

    formato1 = `${anio}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;

    // Bajas en productos existentes
    socket.on('Bajas_ProdExist', async (data) => {

        var DOWNLOAD_DIR = path.join(process.env.HOME || process.env.USERPROFILE, 'downloads/');
        const workbook = new Excel.Workbook();

        db.query('select Existencia from almacen where Cod_Barras = ? and Articulo = ?', [data.Cod_Barras, data.Articulo], function (err, result) {

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

    // Consultas de productos
    socket.on('Consul_Usuario', async () => {

        // Autenticar que haga las consultas
        db.query('select*from Usuario', function (err, result) {
            if (err) console.log("Error de búsqueda: " + err);//Se imprime algún error que haya ocurrido
            if (result.length > 0) {//Si sí hizo una búsqueda
                for (var i = 0; i < result.length; i++) {
                    socket.emit('Desp_Usuario', { Num_Emp: result[i].Num_Emp, Usuario: result[i].Usuario, Pass: result[i].Pass });//Mandar usuario y token al cliente
                }
                socket.emit('ButtonUp');
            }
            result.length = 0;
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

    // Bajas en usuarios
    socket.on('Bajas_Usuario', async (data) => {

        // Autenticar que haga las consultas
        db.query('select*from Usuario', function (err, result) {
            if (err) console.log("Error de búsqueda: " + err); //Se imprime algún error que haya ocurrido
            if (result.length > 0) { //Si sí hizo una búsqueda
                db.query('delete from Usuario where Usuario = ?', data, function (err, result) {
                    if (err) socket.emit('RespDelUs',MensajeError);
                    console.log(data);
                    if (result.affectedRows > 0) {
                        console.log("Resultado de eliminacion de usuario: ", result);
                        socket.emit('RespDelUs', { mensaje: 'Usuario dado de baja.' });//Mandar mensaje de éxito a cliente
                    } else {
                        socket.emit('RespDelUs', { mensaje: "Usuario no eliminado, inténtelo de nuevo." });
                    }
                });

            } else {
                socket.emit('Usuarios_Inexistentes', { mensaje: 'No hay datos para mostrar' });//Mandar mensaje de error a cliente
            }
        });

    });

    // Cambios en usuarios
    socket.on('Cambios_Usuario', async (data, dataOld) => {

        //Se agrega productos a la BD
        db.query('update Usuario set Usuario = ?, Num_Emp = ?, Pass = ? where Usuario = ?', [data.Usuario, data.Nom_Emp, data.Pass, dataOld.OLDUser], function (err2, result) {
            if (err2) socket.emit('RespDelUs', MensajeError) //Se imprime algún error que haya ocurrido
            if (result.affectedRows > 0) { //Si sí hizo una búsqueda
                socket.emit('RespDelUs', { mensaje: 'Usuario modificado con éxito.', Res: 'Si'});//Mandar mensaje a cliente
            } else {
                socket.emit('RespDelUs', { mensaje: "No se pudo modificar el usuario." })
            }
        });
    });

    // Altas de empleado
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
                        db.query('insert into Empleado values(null, ?, ?, ?)', [data.NombreEmp, data.Area, result[0].Num_emp], function (err, res) {
                            if (res) {
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

    // Lista de empleados
    socket.on('List_empleados', (data) => {
        db.query('select Nom from empleado', function (err, res) {
            if (err) console.log("El error fue: ", err)
            if (res.length > 0) {
                for (var i = 0; i < res.length; i++) {
                    if (data == "Jefes") socket.emit('ListaNombres2', { Nombres: res[i].Nom });
                    else if (data == "Empleados") socket.emit('ListaNombres', { Nombres: res[i].Nom });
                }
            }
        });
    });

    // Crear excel de consultas de almacen
    socket.on('Excel', async () => {
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("My Sheet");

        worksheet.columns = [
            { header: 'Código de Barras', key: 'CB', width: 25 },
            { header: 'Categoría', key: 'Cat', width: 18 },
            { header: 'Nombre del Artículo', key: 'NomAr', width: 30, },
            { header: 'Marca del Artículo', key: 'MarcArt', width: 25, },
            { header: 'Descripción', key: 'Desc', width: 30, },
            { header: 'Unidad', key: 'Uni', width: 15, },
            { header: 'En existencia', key: 'Exist', width: 20, }
        ];

        db.query('select *from almacen order by eliminado', async function (err, res) {
            if (err) console.log(err);

            if (res.length > 0) {
                for (var i = 0; i < res.length; i++) {
                    worksheet.addRow({ CB: res[i].Cod_Barras, Cat: res[i].Categoria, NomAr: res[i].Articulo, MarcArt: res[i].Marca, Desc: res[i].Descripcion, Uni: res[i].Unidad, Exist: res[i].Existencia });
                }
                // save under export.xlsx

                //ESTILO DE EXCEL
                worksheet.getCell('A1').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'F003A9E' }
                };
                worksheet.getCell('A1').font = {
                    name: 'Arial',
                    color: { argb: 'FFFFFF' },
                    bold: true
                };

                worksheet.getCell('B1').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'F003A9E' }
                };
                worksheet.getCell('B1').font = {
                    name: 'Arial',
                    color: { argb: 'FFFFFF' },
                    bold: true
                };

                worksheet.getCell('C1').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'F003A9E' }
                };
                worksheet.getCell('C1').font = {
                    name: 'Arial',
                    color: { argb: 'FFFFFF' },
                    bold: true
                };

                worksheet.getCell('D1').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'F003A9E' }
                };
                worksheet.getCell('D1').font = {
                    name: 'Arial',
                    color: { argb: 'FFFFFF' },
                    bold: true
                };

                worksheet.getCell('E1').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'F003A9E' }
                };
                worksheet.getCell('E1').font = {
                    name: 'Arial',
                    color: { argb: 'FFFFFF' },
                    bold: true
                };

                worksheet.getCell('F1').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'F003A9E' }
                };
                worksheet.getCell('F1').font = {
                    name: 'Arial',
                    color: { argb: 'FFFFFF' },
                    bold: true
                };

                worksheet.getCell('G1').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'F003A9E' }
                };
                worksheet.getCell('G1').font = {
                    name: 'Arial',
                    color: { argb: 'FFFFFF' },
                    bold: true
                };

                worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
                worksheet.autoFilter = 'A:G';

                //Ruta del archivo
                var DOWNLOAD_DIR = path.join(process.env.HOME || process.env.USERPROFILE, 'downloads/');
                const pathExcel = path.join(DOWNLOAD_DIR, nombreArchivo + '_' + contador + '.xlsx');
                await workbook.xlsx.writeFile(pathExcel);
                socket.emit("RespExcel", { mensaje: "Excel descargado en la carpeta Descargas" });
                contador++;
            } else {
                socket.emit("RespExcel", { mensaje: "Hubo un error, favor de contactar a encargados de sistemas" });
            }
        });
        console.log("File is written");
    });

    // Consulta de registro de productos
    socket.on('Consul_RegProSac', async (data) => {

        // Autenticar que haga las consultas
        db.query('select Salidas_Productos.Cod_BarrasS, almacen.Articulo, almacen.Existencia, empleado.Nom, salidas_productos.Cantidad_Salida, salidas_productos.FSalida from salidas_productos inner join almacen on salidas_productos.Cod_BarrasS = almacen.Cod_Barras inner join empleado on salidas_productos.Num_EmpS = empleado.Num_emp', function (err, result) {
            if (err) console.log("Error de búsqueda: " + err);//Se imprime algún error que haya ocurrido
            if (result.length > 0) {//Si sí hizo una búsqueda
                for (var i = 0; i < result.length; i++) {
                    socket.emit('Desp_Productos', { Cod_BarrasS: result[i].Cod_BarrasS, Articulo: result[i].Articulo, Existencia: result[i].Existencia, Nom: result[i].Nom, Cantidad_Salida: result[i].Cantidad_Salida, FSalida: result[i].FSalida });//Mandar usuario y token al cliente
                }
            }
            result.length = 0;
        });
    });

    // Crear excel de consultas de almacen
    socket.on('SacarExcel', async (data) => {

        const workbook = new Excel.Workbook();
        var DOWNLOAD_DIR = path.join(process.env.HOME || process.env.USERPROFILE, 'downloads/');

        workbook.xlsx.readFile(path.join(DOWNLOAD_DIR, nombreSacarProd + '_' + (contadorS - 1) + '.xlsx')).then(async () => {

            const newWorkbook = new Excel.Workbook();//Cargamos una copia de archivo anterior
            await newWorkbook.xlsx.readFile(path.join(DOWNLOAD_DIR, nombreSacarProd + '_' + (contadorS - 1) + '.xlsx'));

            const Newworksheet = newWorkbook.getWorksheet('My Sheet');

            Newworksheet.columns = [
                { header: 'Código de Barras', key: 'CB', width: 25 },
                { header: 'Artículo', key: 'Articulo', width: 40, },
                { header: 'En existencia', key: 'Exist', width: 20, },
                { header: 'Encargado', key: 'Encargado', width: 45, },
                { header: 'Cantidad a sacar', key: 'CantSac', width: 30, },
                { header: 'Fecha de salida', key: 'FecSac', width: 30, }
            ];
            db.query('select Salidas_Productos.Cod_BarrasS, almacen.Articulo, almacen.Existencia, empleado.Nom, salidas_productos.Cantidad_Salida, salidas_productos.FSalida from salidas_productos inner join almacen on salidas_productos.Cod_BarrasS = almacen.Cod_Barras inner join empleado on salidas_productos.Num_EmpS = empleado.Num_emp where FSalida BETWEEN ? and ?', [data.fechaInicio, data.fechaFin], function (err, result) {
                // If si marca error
                if (err) console.log(err);
                if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        Newworksheet.addRow({ CB: result[i].Cod_BarrasS, Articulo: result[i].Articulo, Exist: result[i].Existencia, Encargado: result[i].Nom, CantSac: result[i].Cantidad_Salida, FecSac: result[i].FSalida });
                    }
                    //Ruta del archivo
                    const pathExcel = path.join(DOWNLOAD_DIR, nombreSacarProd + '_' + (contadorS) + '.xlsx');
                    console.log("a", pathExcel);
                    newWorkbook.xlsx.writeFile(pathExcel);
                    contadorS = contadorS + 1;
                }
            });
            // Si el documuento no existe
        }).catch(() => {
            const worksheet = workbook.addWorksheet('My Sheet');

            worksheet.columns = [
                { header: 'Código de Barras', key: 'CB', width: 25 },
                { header: 'Artículo', key: 'Articulo', width: 40, },
                { header: 'En existencia', key: 'Exist', width: 20, },
                { header: 'Encargado', key: 'Encargado', width: 45, },
                { header: 'Cantidad a sacar', key: 'CantSac', width: 30, },
                { header: 'Fecha de salida', key: 'FecSac', width: 30, }
            ];

            db.query('select Salidas_Productos.Cod_BarrasS, almacen.Articulo, almacen.Existencia, empleado.Nom, salidas_productos.Cantidad_Salida, salidas_productos.FSalida from salidas_productos inner join almacen on salidas_productos.Cod_BarrasS = almacen.Cod_Barras inner join empleado on salidas_productos.Num_EmpS = empleado.Num_emp where FSalida BETWEEN ? and ?', [data.fechaInicio, data.fechaFin], function (err, result) {
                // If si marca error
                if (err) console.log(err);
                if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        worksheet.addRow({ CB: result[i].Cod_BarrasS, Articulo: result[i].Articulo, Exist: result[i].Existencia, Encargado: result[i].Nom, CantSac: result[i].Cantidad_Salida, FecSac: result[i].FSalida });
                    }

                    //ESTILO DE EXCEL
                    worksheet.getCell('A1').fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'F003A9E' }
                    };
                    worksheet.getCell('A1').font = {
                        name: 'Arial',
                        color: { argb: 'FFFFFF' },
                        bold: true
                    };

                    worksheet.getCell('B1').fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'F003A9E' }
                    };
                    worksheet.getCell('B1').font = {
                        name: 'Arial',
                        color: { argb: 'FFFFFF' },
                        bold: true
                    };

                    worksheet.getCell('C1').fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'F003A9E' }
                    };
                    worksheet.getCell('C1').font = {
                        name: 'Arial',
                        color: { argb: 'FFFFFF' },
                        bold: true
                    };

                    worksheet.getCell('D1').fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'F003A9E' }
                    };
                    worksheet.getCell('D1').font = {
                        name: 'Arial',
                        color: { argb: 'FFFFFF' },
                        bold: true
                    };

                    worksheet.getCell('E1').fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'F003A9E' }
                    };
                    worksheet.getCell('E1').font = {
                        name: 'Arial',
                        color: { argb: 'FFFFFF' },
                        bold: true
                    };

                    worksheet.getCell('F1').fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'F003A9E' }
                    };
                    worksheet.getCell('F1').font = {
                        name: 'Arial',
                        color: { argb: 'FFFFFF' },
                        bold: true
                    };

                    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
                    worksheet.autoFilter = 'A:F';

                    //Ruta del archivo
                    const pathExcel = path.join(DOWNLOAD_DIR, nombreSacarProd + '_' + contadorS + '.xlsx');
                    workbook.xlsx.writeFile(pathExcel);
                    console.log("b", pathExcel);
                    contadorS = contadorS + 1;
                }
            });
        });
        socket.emit("SacarRespExcel", { mensaje: "Excel descargado en la carpeta Descargas" });
    });

    socket.on('Alta_Equipos', async (data) => {
        db.query('select * from equipo where Num_Serie = ?', [data.Num_S], async function (err, result) {
            if (err) socket.emit(MensajeError);
            if (result.length > 0) {
                socket.emit("RespEquipos", { mensaje: "Este producto ya está registrado, ingrese otro." });
            } else {
                db.query('insert into equipo values(null,?,?,?,?,(select Num_emp from empleado where Nom = ?),?)', [data.Num_S, data.Equipo, data.MarcaE, data.ModelE, data.NomEn, data.UbiE], async function (err, result) {
                    if (err) socket.emit(MensajeError);
                    if (result) {
                        socket.emit("RespEquipos", { mensaje: "Equipo dado de alta exitosamente.", Res: "Si" });
                    } else {
                        socket.emit("RespEquipos", { mensaje: "No se pudo dar de alta el equipo, inténtelo de nuevo." });
                    }
                });
            }
        });
    });

    socket.on('AltaPc', async (data) => {
        db.query('select * from pcs where Num_Serie = ?', [data.Num_S], async function (err, result) {
            if (err) socket.emit(MensajeError);
            if (result.length > 0) {
                socket.emit("RespEquipos", { mensaje: "Esta computadora ya está registrada, ingrese otra." });
            } else {
                db.query('insert into pcs values(?,?,?)', [data.Num_S, data.HardE, data.SoftE], async function (err, result) {
                    if (err) socket.emit(MensajeError);
                    if (!result) {
                        socket.emit("RespEquipos", { mensaje: "No se pudo dar de alta los datos de la PC, agréguelo por separado." });
                    }
                });
            }
        });
    });

    socket.on('AltMon', async (data) => {
        db.query('select * from monitor where Num_Serie = ?', [data.Num_S], async function (err, result) {
            if (err) socket.emit(MensajeError);
            if (result.length > 0) {
                socket.emit("RespEquipos", { mensaje: "Este monitor ya está registrado, ingrese otro." });
            } else {
                db.query('insert into monitor values(?,?,?)', [data.Num_S, data.MonE, data.NSMon], async function (err, result) {
                    if (err) socket.emit(MensajeError);
                    if (!result) {
                        socket.emit("RespEquipos", { mensaje: "No se pudo dar de alta los datos del monitor, agréguelo por separado." });
                    }
                });
            }
        });
    });

    socket.on('AltMouse', async (data) => {
        db.query('select * from Mouse where Num_Serie = ?', [data.Num_S], async function (err, result) {
            if (err) socket.emit(MensajeError);
            if (result.length > 0) {
                socket.emit("RespEquipos", { mensaje: "Este mouse ya está registrado, ingrese otro." });
            } else {
                db.query('insert into Mouse values(?,?)', [data.Num_S, data.MousE], async function (err, result) {
                    if (err) socket.emit(MensajeError);
                    if (!result) {
                        socket.emit("RespEquipos", { mensaje: "No se pudo dar de alta los datos del mouse, agréguelo por separado." });
                    }
                });
            }
        });
    });

    socket.on('AltTecla', async (data) => {
        db.query('select * from Teclado where Num_Serie = ?', [data.Num_S], async function (err, result) {
            if (err) socket.emit(MensajeError);
            if (result.length > 0) {
                socket.emit("RespEquipos", { mensaje: "Este teclado ya está registrado, ingrese otro." });
            } else {
                db.query('insert into Teclado values(?,?)', [data.Num_S, data.TeclaE], async function (err, result) {
                    if (err) socket.emit(MensajeError);
                    if (!result) {
                        socket.emit("RespEquipos", { mensaje: "No se pudo dar de alta los datos del teclado, agréguelo por separado." });
                    }
                });
            }
        });
    });

    socket.on('AltAcces', async (data) => {
        db.query('select * from Accesorio where Num_Serie = ?', [data.Num_S], async function (err, result) {
            if (err) socket.emit(MensajeError);
            if (result.length > 0) {
                socket.emit("RespEquipos", { mensaje: "Estos accesorios ya están registrados, ingrese otros." });
            } else {
                db.query('insert into Accesorio values(?,?)', [data.Num_S, data.AccesE], async function (err, result) {
                    if (err) socket.emit(MensajeError);
                    if (!result) {
                        socket.emit("RespEquipos", { mensaje: "No se pudo dar de alta los accesorios, agréguelos por separado." });
                    }
                });
            }
        });
    });

    socket.on("DatEmp", async () => {
        db.query('select empleado.Nom, empleado.Área, (select Nom from empleado as Jefe where Jefe.Num_emp = empleado.Num_Jefe) Nom_Jefe from empleado;', async function (err, result) {
            if (err) socket.emit('MensajeEmp', MensajeError);
            if (result.length > 0) {//Si sí hizo una búsqueda
                for (var i = 0; i < result.length; i++) {
                    socket.emit('DespEmp', { NomEmp: result[i].Nom, Area: result[i].Área, NomJefe: result[i].Nom_Jefe });//Mandar usuario y token al cliente
                }
                socket.emit('ButtonUpEmp');
            }
            result.length = 0;
        });
    });

    socket.on('EmpDelete', async (data) => {
        db.query('delete from empleado where Num_emp in (select Num_Emp from (select Num_Emp from empleado where Nom = ?) Emp)', [data], function (err, result) {
            if (err) socket.emit('MensajeEmp', MensajeError);
            if (result.affectedRows > 0) {
                socket.emit('MensajeEmp', { mensaje: 'Empleado eliminado con éxito.' });
            } else {
                socket.emit('MensajeEmp', { mensaje: 'No se pudo eliminar al empleado, inténtelo de nuevo.' });
            }
        });
    });

    socket.on('ModEmp', async (dataNew, dataOld) => {
        db.query('update empleado set Nom = ?, Área = ?, Num_Jefe = (select Num_emp from (select Num_Emp from empleado where Nom = ?) Jefe) where Num_emp = (select Num_emp from (select Num_Emp from empleado where Nom = ?) Empleado)', [dataNew.NewName, dataNew.NewArea, dataNew.NewBoss, dataOld.OldName], function (err, result) {
            if (err) socket.emit("MensajeEmp", MensajeError);
            console.log(result);
            if (result.affectedRows > 0) {
                socket.emit('MensajeEmp', { mensaje: 'Empleado modificado con éxito.', Res: 'Si' });//Mandar mensaje a cliente
            } else {
                socket.emit('MensajeEmp', { mensaje: "No se pudo modificar el empleado." });
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado.');
    });
});
