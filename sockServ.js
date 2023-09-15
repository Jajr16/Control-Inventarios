// Importar módulos necesarios
var app = require('./app');  // Importar la aplicación Express definida en 'app.js'
var http = require('http');   // Importar el módulo HTTP de Node.js
var server = http.createServer(app);  // Crear un servidor HTTP utilizando la aplicación Express

const io = require('socket.io')(server);  // Configurar Socket.io para trabajar con el servidor HTTP

// Importar Base de datos y otras dependencias
var db = require("./Conexion/BaseDatos"); // Importar la conexión a la base de datos
const Excel = require('exceljs');  // Importar la librería para trabajar con archivos Excel
const path = require('path');   // Importar el módulo 'path' de Node.js para trabajar con rutas de archivos

const fs = require('fs');  // Importar el módulo 'fs' para trabajar con el sistema de archivos

// Definir variables de fecha y contador
const date = new Date();  // Obtener la fecha y hora actual
let fechaDia = date.getDate();
let fechaMes = date.getMonth() + 1;
let fechaAño = date.getFullYear();
let fechaHora = date.getHours();
let fechaMinutos = date.getMinutes();

// Formatear la fecha y hora para que tengan dos dígitos en caso necesario
if (fechaMes < 10) {
    fechaMes = "0" + fechaMes;
}
if (fechaDia < 10) {
    fechaDia = "0" + fechaDia;
}

var contador = 1;
var contadorS = 1;

// Importar funciones para generar archivos PDF
const { mobiliario_generatePDF } = require('./PDF_mobiliario.js');
const { equipos_generatePDF } = require('./PDF_equipos.js');

// Definir mensaje de error
var MensajeError = "Hubo un error, favor de contactar al personal de sistemas.";

// Escuchar en el puerto 3001 y mostrar mensaje en consola cuando el servidor se inicie
server.listen(3001, () => {
    console.log('Servidor iniciado en el puerto 3001.');
});

// Función para manejar errores y escribir en un archivo de registro
async function Errores(Data) {
    fs.appendFile('ErrorLogs.txt', (Data.toString() + ` | Error obtenido el -> ${fechaDia}/${fechaMes}/${fechaAño} ${fechaHora}:${fechaMinutos}\n`), (error) => {
        if (error) {
            throw error;
        }
        console.log('Errores escritos');
    });
}

// Configuración de Socket.io para manejar conexiones de clientes
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Generar nombres de archivos basados en la fecha y hora
    let nombreArchivoA = "Almacen" + "-" + fechaDia + "_" + fechaMes + "_" + fechaAño + "--" + fechaHora + "-" + fechaMinutos;
    let nombreArchivoM = "Mobiliario" + "-" + fechaDia + "_" + fechaMes + "_" + fechaAño + "--" + fechaHora + "-" + fechaMinutos;
    let nombreArchivoE = "Equipo" + "-" + fechaDia + "_" + fechaMes + "_" + fechaAño + "--" + fechaHora + "-" + fechaMinutos;
    let nombreSacarProd = "Retiro_Almacen" + "-" + fechaDia + "_" + fechaMes + "_" + fechaAño + "--" + fechaHora + "-" + fechaMinutos;

    // Manejar eventos de inicio de sesión (Login)
    socket.on('LG', async (data) => {
        // Autenticar al usuario utilizando la base de datos
        db.query('select*from usuario where Usuario = BINARY  ? and Pass = BINARY  ?', [data.User, data.Pass], function (err, result) {
            console.log(result);
            if (err) {
                Errores(err);
                socket.emit('SystemError');
            } else {
                if (result.length > 0) {
                    // Si el usuario existe en la base de datos, enviar información al cliente
                    // Incluye permisos de módulos
                    db.query("select permiso, modulo from permisos where Usuario = BINARY ?", [data.User], function (err, res) {
                        if (err) {
                            Errores(err);
                            socket.emit('SystemError');
                        }
                        if (res.length > 0) {
                            // Organizar permisos por módulo y enviar al cliente
                            let permisosModulos = {};
                            res.forEach(row => {
                                if (!permisosModulos[row.modulo]) {
                                    permisosModulos[row.modulo] = [];
                                }
                                permisosModulos[row.modulo].push(row.permiso);
                            });
                            socket.emit('logInOK', { Usuario: result[0].Usuario, permisosModulos });
                        }
                    });
                } else {
                    console.log(result);
                    socket.emit('logInError', { mensaje: 'Nombre de usuario o contraseña incorrectos.' });
                }
            }
        });
    });

    // Manejar consultas de productos (Consultas de productos)
    socket.on('Consul_Prod', async () => {
        // Consultar productos en la base de datos y enviar al cliente
        db.query('select *from almacen order by eliminado', function (err, result) {
            if (err) {
                Errores(err);
                socket.emit('SystemError');
            } else {
                if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        socket.emit('Desp_Productos', { Cod_Barras: result[i].Cod_Barras, Categoria: result[i].Categoria, NArt: result[i].Articulo, NMarca: result[i].Marca, Desc: result[i].Descripcion, Unidad: result[i].Unidad, Existencia: result[i].Existencia, eliminado: result[i].eliminado });
                    }
                    socket.emit('ButtonUp');
                }
                result.length = 0;
            }
        });
    });

    // Buscar facturas
    socket.on('Traer_Facturas', async (data) => {
        // Consultar facturas y productos relacionados en la base de datos
        db.query('select almacen.Articulo, factus_productos.Nfactura, factus_productos.Cantidad, factus_productos.FIngreso, facturas_almacen.Ffact, facturas_almacen.Proveedor from factus_productos inner join facturas_almacen on facturas_almacen.Num_Fact = factus_productos.Nfactura inner join almacen on factus_productos.Cod_Barras = almacen.Cod_Barras where factus_productos.Cod_Barras = ?', data, function (err, result) {
            if (err) {
                Errores(err);
                socket.emit('SystemError');
            } else {
                if (result.length > 0) {
                    // Procesar y enviar datos de facturas al cliente
                    let FecFactura = [];
                    let NumFactu = [];
                    let Canti = [];
                    let FIngre = [];
                    let Prove = [];

                    for (var i = 0; i < result.length; i++) {
                        var FechasIngresos = new Date(result[i].FIngreso);
                        var Fecha_Factura = new Date(result[i].Ffact);
                        // Agregar datos al arreglo
                        FecFactura.push(Fecha_Factura.toISOString().slice(0, 10));
                        NumFactu.push(result[i].Nfactura);
                        Canti.push(result[i].Cantidad);
                        FIngre.push(FechasIngresos.toISOString().slice(0, 10));
                        Prove.push(result[i].Proveedor);
                    }
                    // Enviar datos de facturas al cliente
                    socket.emit("Fact_Enviadas", { NomProd: result[0].Articulo, NFactura: NumFactu, Cantidad: Canti, FIngreso: FIngre, FFactura: FecFactura, Proveedor: Prove });

                    socket.emit("BotonModalFacturas");
                } else {
                    socket.emit("Facturas_Vacias", "No se encontraron facturas");
                }
            }
        });
    });

    // Altas de productos
    socket.on('Alta_Prod', async (data) => {
        // Autenticar si un producto con el mismo código de barras ya existe en la base de datos
        db.query('select*from almacen where Cod_Barras = ?', [data.CodBarras], function (err, result) {
            if (err) {
                Errores(err);
                socket.emit('SystemError');
            } else {
                if (result.length > 0) {
                    // Enviar mensaje al cliente si el producto ya existe
                    socket.emit('Producto_Existente', { mensaje: "Este artículo ya estaba registrado.\nEn caso de que quiera agregar más cantidad de este producto, por favor ingrese a la página de 'Ingresar más productos'." });
                } else {
                    // Agregar un nuevo producto a la base de datos
                    db.query('insert into almacen values (?,?,?,?,?,?,?,?)', [data.CodBarras, data.Cate, data.Producto, data.Marca, data.Descripcion, data.Unidad, data.Cantidad, 0], function (err2, result) {
                        if (err2) {
                            Errores(err2);
                            socket.emit('SystemError');
                        } else {
                            if (result) {
                                // Insertar la factura relacionada con el producto
                                db.query('insert into Facturas_Almacen values(?,?,?)', [data.NumFactura, data.FechaFac, data.Proveedor], function (err1, result) {
                                    if (err1) {
                                        Errores(err1);
                                        socket.emit('SystemError');
                                    } else {
                                        if (result) {
                                            // Insertar la relación entre producto y factura
                                            db.query('insert into factus_productos values(?,?,?,?)', [data.CodBarras, data.NumFactura, data.Cantidad, data.FecAct], function (err, result) {
                                                if (err) {
                                                    Errores(err);
                                                    socket.emit('SystemError');
                                                } else {
                                                    if (result) {
                                                        console.log("Resultado de inserción de productos: ", result);
                                                        socket.emit('Producto_Inexistente', { mensaje: 'Producto dado de alta.' });
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
        data.length = 0;
    });

    // Bajas en productos
    socket.on('Bajas_Prod', async (data) => {
        // Consultar productos en la base de datos y marcar como eliminado
        db.query('select*from almacen', function (err, result) {
            if (err) {
                Errores(err);
                socket.emit('SystemError');
            } else {
                if (result.length > 0) {
                    db.query('update almacen set eliminado = 1 where Cod_Barras = ?;', [data], function (err, result) {
                        if (err) {
                            Errores(err);
                            socket.emit('SystemError');
                        } else {
                            if (result.affectedRows > 0) {
                                console.log("Resultado de eliminacion de productos: ", result);
                                socket.emit('Producto_Eliminado', { mensaje: 'Producto dado de baja.' });
                            } else {
                                socket.emit('Error', { mensaje: "Producto no eliminado, inténtelo de nuevo." });
                            }
                        }
                    });
                } else {
                    socket.emit('Productos_Inexistentes', { mensaje: 'No hay datos para mostrar' });
                }
            }
        });
    });

    // Cambios en productos
    socket.on('Cambios_Prod', async (data, dataOld) => {
        // Actualizar datos de productos en la base de datos
        db.query('update almacen set Cod_Barras = ?, Categoria = ?, Articulo = ?, Marca = ?, Descripcion = ?, Unidad = ? where Cod_Barras = ?', [data.CodBarras, data.Cate, data.Producto, data.Marca, data.Descripcion, data.Unidad, dataOld.CBO], function (err2, result) {
            if (err2) {
                Errores(err2);
                socket.emit('SystemError');
            } else {
                if (result.affectedRows > 0) {
                    socket.emit('Producto_Inexistente', { mensaje: 'Artículo modificado con éxito.' });
                } else {
                    socket.emit('Fallo_Mod', { mensaje: "No se pudo modificar el artículo." });
                }
            }
        });
    });

    // Cambios en facturas
    socket.on("Cambios_Facts", async (data, dataOld) => {
        // Actualizar datos de facturas en la base de datos
        db.query('update factus_productos set Cantidad = ? where Nfactura = ? and Cod_Barras = ?', [data.Cantidad, dataOld.NFO, data.CodBarras], function (err, result) {
            if (err) {
                Errores(err);
                socket.emit('SystemError');
            } else {
                if (result.affectedRows > 0) {
                    db.query('select*from factus_productos where Num_Fact = ? ', [data.NumFactu], function () {
                        if (result.length > 0) {
                            socket.emit('Fallo_Fac', { mensaje: 'Ese número de factura ya está registrado, favor de ingresar otro.' });
                        } else {
                            db.query('update Facturas_Almacen set Num_Fact = ?, Ffact = ?, Proveedor = ? where Num_Fact = ?', [data.NumFactura, data.FechaFac, data.Proveedor, dataOld.NFO], function (err1, result) {
                                if (err1) {
                                    Errores(err1);
                                    socket.emit('SystemError');
                                } else {
                                    if (result.affectedRows > 0) {
                                        socket.emit("Factu_Exitosa", { mensaje: "La factura fue modificada con éxito." });
                                    } else {
                                        socket.emit('Fallo_Fac', { mensaje: "No se pudo modificar la factura." });
                                    }
                                }
                            });
                        }
                    });
                } else {
                    socket.emit('Fallo_ModFac', { mensaje: "No se pudo modificar la factura de almacen." });
                }
            }
        });
    });

    // Consultas de productos existentes
    socket.on('Consul_ProdExist', async () => {
        // Realizar una consulta a la base de datos para obtener productos existentes
        db.query('select *from almacen order by eliminado', function (err, result) {
            if (err) {
                Errores(err);
                socket.emit('SystemError');
            } else {
                if (result.length > 0) {
                    // Enviar información de productos existentes al cliente
                    for (var i = 0; i < result.length; i++) {
                        socket.emit('Desp_ProductosExist', {
                            Cod_Barras: result[i].Cod_Barras,
                            Categoria: result[i].Categoria,
                            NArt: result[i].Articulo,
                            NMarca: result[i].Marca,
                            Desc: result[i].Descripcion,
                            Unidad: result[i].Unidad,
                            Existencia: result[i].Existencia,
                            eliminado: result[i].eliminado
                        });
                    }
                    // Habilitar opciones para agregar y eliminar productos existentes
                    socket.emit('AgregarProdExist');
                    socket.emit('EliminarProdExist');
                } else {
                    socket.emit('Productos_Inexistentes', { mensaje: 'No hay datos para mostrar' });
                }
                result.length = 0;
            }
        });
    });

    // Altas de productos existentes
    socket.on('Altas_ProdExist', async (data) => {
        // Verificar si la factura ya existe en la base de datos
        db.query('select*from facturas_almacen where Num_Fact = ?', [data.NumFactura], function (err2, result) {
            if (err2) {
                Errores(err2);
                socket.emit('SystemError');
            } else {
                if (result.length > 0) {
                    // Verificar si la relación entre producto y factura ya existe
                    db.query('select*from Factus_Productos where Nfactura = ? and Cod_Barras = ?', [data.NumFactura, data.Cod_Barras], function (err2, result1) {
                        if (err2) {
                            Errores(err2);
                            socket.emit('SystemError');
                        } else {
                            if (result1.length > 0) {
                                // Enviar mensaje al cliente si la factura ya está registrada para este producto
                                socket.emit('Ya_Registrado', { mensaje: 'Factura registrada anteriormente para este producto.' });
                            } else {
                                // Agregar la relación entre producto y factura
                                db.query('insert into Factus_Productos values (?,?,?,?)', [data.Cod_Barras, data.NumFactura, data.Cantidad, data.FecAct], function (err, result) {
                                    if (err) {
                                        Errores(err);
                                        socket.emit('SystemError');
                                    } else {
                                        if (result) {
                                            // Actualizar la existencia de productos
                                            db.query('update almacen set Existencia = ? where Cod_Barras = ?', [(parseInt(data.Existencia) + parseInt(data.Cantidad)), data.Cod_Barras], function (err2, result1) {
                                                if (err2) {
                                                    Errores(err2);
                                                    socket.emit('SystemError');
                                                } else {
                                                    if (result.affectedRows > 0) {
                                                        socket.emit('Factura_Agregada', { mensaje: 'Factura agregada con éxito.' });
                                                    } else {
                                                        socket.emit('Fallo_Factura', { mensaje: "No se pudo actualizar la existencia de productos." });
                                                    }
                                                }
                                            });
                                        } else {
                                            socket.emit('Fallo_Factura', { mensaje: "No se pudo agregar la factura de productos." });
                                        }
                                    }
                                });
                            }
                        }
                    });
                } else {
                    // Agregar una nueva factura y la relación entre producto y factura
                    db.query('insert into facturas_almacen values (?,?,?)', [data.NumFactura, data.FechaFac, data.Proveedor], function (err2, result) {
                        if (err2) {
                            Errores(err2);
                            socket.emit('SystemError');
                        } else {
                            if (result) {
                                db.query('insert into Factus_Productos values (?,?,?,?)', [data.Cod_Barras, data.NumFactura, data.Cantidad, data.FecAct], function (err, result) {
                                    if (result) {
                                        db.query('update almacen set Existencia = ? where Cod_Barras = ?', [(parseInt(data.Existencia) + parseInt(data.Cantidad)), data.Cod_Barras], function (err2, result1) {
                                            if (err2) {
                                                Errores(err2);
                                                socket.emit('SystemError');
                                            } else {
                                                if (result.affectedRows > 0) {
                                                    socket.emit('Factura_Agregada', { mensaje: 'Factura agregada con éxito.' });
                                                } else {
                                                    socket.emit('Fallo_Factura', { mensaje: "No se pudo actualizar la existencia de productos." });
                                                }
                                            }
                                        });
                                    } else {
                                        socket.emit('Fallo_Factura', { mensaje: "No se pudo agregar la factura de productos." });
                                    }
                                });
                            } else {
                                socket.emit('Fallo_Factura', { mensaje: "No se pudo agregar la factura." });
                            }
                        }
                    });
                }
            }
        });
    });

    // Obtener la fecha y hora actual
    const hoy = new Date();

    // Obtener el día, el mes y el año
    let dia = hoy.getDate();
    let mes = hoy.getMonth() + 1; // Los meses comienzan desde 0, por lo que se agrega 1 para obtener el mes actual
    let anio = hoy.getFullYear();

    // Obtener los segundos, minutos y horas
    let segundos = hoy.getSeconds();
    let minutos = hoy.getMinutes();
    let horas = hoy.getHours();

    // Inicializar una variable para el formato de fecha y hora
    let formato1 = "";

    // Agregar ceros a la izquierda si es necesario para asegurarse de que tengan dos dígitos
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

    // Crear una cadena de formato de fecha y hora en el formato deseado (YYYY-MM-DD HH:mm:ss)
    formato1 = `${anio}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;


    // Bajas en productos existentes
    socket.on('Bajas_ProdExist', async (data) => {
        // Consultar la existencia actual del producto en la base de datos
        db.query('select Existencia from almacen where Cod_Barras = ? and Articulo = ?', [data.Cod_Barras, data.Articulo], function (err, result) {
            if (err) {
                Errores(err);
                socket.emit('SystemError');
            } else {
                if (result.length > 0) {
                    // Verificar si la cantidad a sacar no excede la existencia del producto
                    if (parseInt(result[0].Existencia) > 0 && parseInt(data.Cantidad) <= parseInt(result[0].Existencia)) {
                        // Consultar el número de empleado a partir del nombre del empleado
                        db.query('select num_emp from empleado where Nom = ?', [data.Emp], function (err, res) {
                            if (err) {
                                Errores(err);
                                socket.emit('SystemError');
                            } else {
                                if (res.length > 0) {
                                    // Registrar la salida de productos en la tabla de salidas_productos
                                    db.query('insert into salidas_productos values (?,?,?,?)', [data.Cod_Barras, formato1, res[0].num_emp, data.Cantidad], function (err2, result) {
                                        if (err2) {
                                            Errores(err2);
                                            socket.emit('SystemError');
                                        } else {
                                            if (result.affectedRows > 0) {
                                                socket.emit('Eliminacion_Realizada', { mensaje: 'Productos sacados con éxito.' });
                                            } else {
                                                socket.emit('Fallo_BajasExist', { mensaje: "No se pudo actualizar la existencia de productos." });
                                            }
                                        }
                                    });
                                } else {
                                    socket.emit('Fallo_BajasExist', { mensaje: "No se encontró ningún empleado con ese nombre, actualice la página." });
                                }
                            }
                        });
                    } else {
                        socket.emit('Fallo_BajasExist', { mensaje: "Cantidad de productos a sacar superior a existencia." });
                    }
                }
            }
        });
    });

    // Consultas de usuario
    socket.on('Consul_Usuario', async () => {
        // Realizar una consulta para obtener información de usuarios
        db.query('select empleado.Nom, usuario.Usuario, usuario.Pass from usuario inner join empleado on usuario.Num_Emp = empleado.Num_emp;', function (err, result) {
            if (err) {
                Errores(err);
                socket.emit('SystemError');
            } else {
                if (result.length > 0) {
                    // Enviar información de usuarios al cliente
                    for (var i = 0; i < result.length; i++) {
                        socket.emit('Desp_Usuario', { Empleado: result[i].Nom, Usuario: result[i].Usuario, Pass: result[i].Pass });
                    }
                    // Enviar señal para actualizar la interfaz del cliente
                    socket.emit('ButtonUp');
                }
                result.length = 0;
            }
        });
    });

    socket.on('PermisosUser', async (data) => {
        db.query('select permiso, modulo from permisos where usuario = ?', [data], function (err, res) {
            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {
                if (res.length > 0) {
                    for (var i = 0; i < res.length; i++) {
                        socket.emit('Desp_Permisos', { modulos: res[i].modulo, permisos: res[i].permiso });
                    }
                }
            }
        });
    });

    // Altas de Usuarios
    socket.on('Registro_Usuario', async (data) => {
        // Autenticar que no exista un usuario igual en la base de datos de Empleado
        db.query('select * from Empleado where Nom = ?', [data.NombreEmp], function (err, resultG) {
            if (err) {
                Errores(err);
                socket.emit('SystemError');
            } else {
                if (resultG.length > 0) {
                    // Verificar si el usuario ya está registrado
                    db.query('select * from Usuario where Usuario = ?', [data.N_User], function (err, result) {
                        if (err) {
                            Errores(err);
                            socket.emit('SystemError');
                        } else {
                            if (result.length > 0) {
                                socket.emit('Usuario_Existente', { mensaje: "Este usuario ya está registrado." });
                            } else {
                                // Insertar el nuevo usuario en la tabla de Usuario
                                db.query('insert into Usuario values (?,?,?)', [resultG[0].Num_emp, data.N_User, data.ContraNueva], function (err, result) {
                                    if (err) {
                                        Errores(err);
                                        socket.emit('SystemError');
                                    }
                                    if (result) {
                                        var errores = false; // Variable para rastrear si hubo errores
                                        data.permisos.forEach(function (permisoUser) {
                                            var accion = 0;
                                            if (permisoUser.accion === 'Altas') accion = 1;
                                            else if (permisoUser.accion === 'Bajas') accion = 2;
                                            else if (permisoUser.accion === 'Cambios') accion = 3;
                                            else if (permisoUser.accion === 'Consultas') accion = 4;

                                            console.log(permisoUser.modulo.slice(1));
                                            // Insertar permisos en la tabla de permisos
                                            db.query('insert into permisos values (?,?,?)', [accion, data.N_User, permisoUser.modulo.slice(1)], function (err, res) {
                                                if (err) {
                                                    Errores(err);
                                                    socket.emit('SystemError');
                                                    errores = true;
                                                } else if (res) {
                                                    console.log("Permiso dado");
                                                }
                                            });
                                        });
                                        if (!errores) {
                                            socket.emit('Usuario_Agregado', { mensaje: "Usuario agregado con éxito." });
                                        }
                                    } else {
                                        socket.emit('Usuario_Error', { mensaje: "Error al agregar el usuario." });
                                    }
                                });
                            }
                        }
                    });
                } else {
                    socket.emit('Usuario_Error', { mensaje: "No se encontró el usuario, inténtelo de nuevo o llame a los encargados de sistemas." });
                }
            }
        });
    });

    // Bajas en usuarios
    socket.on('Bajas_Usuario', async (data) => {
        // Consultar la tabla de Usuario para eliminar un usuario
        db.query('select * from Usuario', function (err, result) {
            if (err) {
                Errores(err);
                socket.emit('SystemError');
            } else {
                if (result.length > 0) {
                    // Eliminar el usuario de la tabla Usuario
                    db.query('delete from Usuario where Usuario = ?', data, function (err, result) {
                        if (err) {
                            Errores(err);
                            socket.emit('SystemError');
                        } else {
                            if (result.affectedRows > 0) {
                                console.log("Resultado de eliminación de usuario: ", result);
                                socket.emit('RespDelUs', { mensaje: 'Usuario dado de baja.' });
                            } else {
                                socket.emit('RespDelUs', { mensaje: "Usuario no eliminado, inténtelo de nuevo." });
                            }
                        }
                    });
                } else {
                    socket.emit('RespDelUs', { mensaje: 'No hay datos para mostrar' });
                }
            }
        });
    });

    // Cambios en usuarios
    socket.on('Cambios_Usuario', async (data, dataOld) => {
        // Actualizar información de usuario en la tabla Usuario
        db.query('update Usuario set Usuario = ?, Pass = ? where Usuario = ?', [data.Usuario, data.Pass, dataOld.OLDUser], function (err2, result) {
            if (err2) { Errores(err2); socket.emit('SystemError'); } // Se hace un control de errores
            else {
                if (result.affectedRows > 0) {
                    db.query('delete from permisos where Usuario = ?', [data.Usuario], function (err, res) {
                        if (err) { Errores(err); socket.emit('SystemError'); errores = true; } // Se hace un control de errores
                        else {
                            if (res.affectedRows > 0) {
                                var errores = false; // Variable para rastrear si hubo errores
                                data.permisos.forEach(function (permisoUser) {
                                    var accion = 0;
                                    if (permisoUser.accion === 'Altas') accion = 1;
                                    else if (permisoUser.accion === 'Bajas') accion = 2;
                                    else if (permisoUser.accion === 'Cambios') accion = 3;
                                    else if (permisoUser.accion === 'Consultas') accion = 4;

                                    db.query('insert into permisos values (?,?,?)', [accion, data.Usuario, permisoUser.modulo.slice(1)], function (err, res) {
                                        if (err) { Errores(err); socket.emit('SystemError'); errores = true; } // Se hace un control de errores
                                        else if (res) {
                                            console.log("Permiso dado");
                                        }
                                    });
                                });
                                if (!errores) {
                                    socket.emit('RespDelUs', { mensaje: 'Usuario modificado con éxito.', Res: 'Si' });//Mandar mensaje a cliente
                                }
                            }
                        }
                    });
                } else {
                    socket.emit('RespDelUs', { mensaje: "No se pudo modificar el usuario." });
                }
            }
        });
    });

    // Altas de empleado
    socket.on('Reg_Emp', async (data) => {
        console.log(data);
        // Consultar si el empleado ya está registrado
        db.query('select * from Empleado where Nom = ?', [data.NombreEmp], function (err, result) {
            if (err) {
                Errores(err);
                socket.emit('SystemError');
            } else {
                if (result.length > 0) {
                    socket.emit('Res_Emp', { mensaje: "Este empleado ya está registrado." });
                } else {
                    // Consultar el número de empleado del jefe
                    db.query('select Num_emp from Empleado where Nom = ?', [data.NomJefe], function (err, result) {
                        if (err) {
                            Errores(err);
                            socket.emit('SystemError');
                        } else {
                            if (result.length > 0) {
                                // Insertar el nuevo empleado en la tabla Empleado
                                db.query('insert into Empleado values(null, ?, ?, ?)', [data.NombreEmp, data.Area, result[0].Num_emp], function (err, res) {
                                    if (err) {
                                        Errores(err);
                                        socket.emit('SystemError');
                                    } else {
                                        if (res) {
                                            socket.emit('Res_Emp', { mensaje: "Empleado dado de alta." });
                                        }
                                    }
                                });
                            } else {
                                socket.emit('Res_Emp', { mensaje: "El jefe que seleccionó no se encontró, recargue la página o llame al encargado de sistemas." });
                            }
                        }
                    });
                }
            }
        });
    });

    // Lista de empleados
    socket.on('List_empleados', (data) => {
        // Consultar la lista de nombres de empleados
        db.query('select Nom from empleado', function (err, res) {
            if (err) {
                Errores(err);
                socket.emit('SystemError');
            } else {
                if (res.length > 0) {
                    for (var i = 0; i < res.length; i++) {
                        if (data == "Jefes") socket.emit('ListaNombres2', { Nombres: res[i].Nom });
                        else if (data == "Empleados") socket.emit('ListaNombres', { Nombres: res[i].Nom });
                    }
                }
            }
        });
    });

    // Crear excel de consultas de almacen
    socket.on('ExcelA', async () => {
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
            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {

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
                    const pathExcel = path.join(DOWNLOAD_DIR, nombreArchivoA + '_' + contador + '.xlsx');
                    await workbook.xlsx.writeFile(pathExcel);
                    socket.emit("RespExcel", { mensaje: "Excel descargado en la carpeta Descargas" });
                    contador++;
                } else {
                    socket.emit("RespExcel", { mensaje: "No se puede descargar un excel de un registro vacío" });
                }
            }
        });
        console.log("File is written");
    });

    // Crear excel de consultas de almacen
    socket.on('ExcelE', async () => {
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("My Sheet");

        worksheet.columns = [
            { header: 'N. Inv', key: 'N_Inv', width: 11 },
            { header: 'N. Serie', key: 'NS', width: 18 },
            { header: 'Equipo', key: 'Eqp', width: 30, },
            { header: 'Marca', key: 'Marca', width: 25, },
            { header: 'Modelo', key: 'Modelo', width: 30, },
            { header: 'Hardware', key: 'Hardware', width: 30, },
            { header: 'Software', key: 'Software', width: 30, },
            { header: 'Monitor', key: 'Monitor', width: 30, },
            { header: 'Teclado', key: 'Teclado', width: 15, },
            { header: 'Mouse', key: 'Mouse', width: 20, },
            { header: 'Accesorio', key: 'Acces', width: 20, },
            { header: 'No.S.M.', key: 'NSM', width: 12, },
            { header: 'No.I.M.', key: 'NIM', width: 12, },
            { header: 'Encargado', key: 'Encargado', width: 40, }
        ];

        db.query('SELECT DISTINCT Equipo.N_Inventario, Equipo.Num_Serie, Equipo.Equipo, Equipo.Marca, Equipo.Modelo, Empleado.Nom, IFNULL(pcs.Hardware,"-") Hardware, IFNULL(pcs.Software,"-") Software, IFNULL(monitor.Monitor,"-") Monitor, IFNULL(monitor.Num_Serie_Monitor,"-") NSM, IFNULL(monitor.Num_Inv_Mon,"-") NIM, IFNULL(mouse.Mouse,"-") Mouse, IFNULL(teclado.Teclado,"-") Teclado, IFNULL(accesorio.Accesorio,"-") Accesorio FROM Equipo LEFT JOIN PCs ON Equipo.Num_Serie = PCs.Num_Serie LEFT JOIN Monitor ON Equipo.Num_Serie = Monitor.Num_Serie LEFT JOIN Mouse ON Equipo.Num_Serie = Mouse.Num_Serie LEFT JOIN Teclado ON Equipo.Num_Serie = Teclado.Num_Serie LEFT JOIN Accesorio ON Equipo.Num_Serie = Accesorio.Num_Serie inner join empleado on equipo.Num_emp = empleado.Num_emp;', async function (err, res) {
            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {

                if (res.length > 0) {
                    for (var i = 0; i < res.length; i++) {
                        worksheet.addRow({ N_Inv: res[i].N_Inventario, NS: res[i].Num_Serie, Eqp: res[i].Equipo, Marca: res[i].Marca, Modelo: res[i].Modelo, Hardware: res[i].Hardware, Software: res[i].Software, Monitor: res[i].Monitor, NSM: res[i].NSM, NIM: res[i].NIM, Mouse: res[i].Mouse, Teclado: res[i].Teclado, Acces: res[i].Accesorio, Encargado: res[i].Nom });
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

                    worksheet.getCell('H1').fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'F003A9E' }
                    };
                    worksheet.getCell('H1').font = {
                        name: 'Arial',
                        color: { argb: 'FFFFFF' },
                        bold: true
                    };

                    worksheet.getCell('I1').fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'F003A9E' }
                    };
                    worksheet.getCell('I1').font = {
                        name: 'Arial',
                        color: { argb: 'FFFFFF' },
                        bold: true
                    };

                    worksheet.getCell('J1').fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'F003A9E' }
                    };
                    worksheet.getCell('J1').font = {
                        name: 'Arial',
                        color: { argb: 'FFFFFF' },
                        bold: true
                    };

                    worksheet.getCell('K1').fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'F003A9E' }
                    };
                    worksheet.getCell('K1').font = {
                        name: 'Arial',
                        color: { argb: 'FFFFFF' },
                        bold: true
                    };

                    worksheet.getCell('L1').fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'F003A9E' }
                    };
                    worksheet.getCell('L1').font = {
                        name: 'Arial',
                        color: { argb: 'FFFFFF' },
                        bold: true
                    };

                    worksheet.getCell('M1').fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'F003A9E' }
                    };
                    worksheet.getCell('M1').font = {
                        name: 'Arial',
                        color: { argb: 'FFFFFF' },
                        bold: true
                    };

                    worksheet.getCell('N1').fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'F003A9E' }
                    };
                    worksheet.getCell('N1').font = {
                        name: 'Arial',
                        color: { argb: 'FFFFFF' },
                        bold: true
                    };

                    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
                    worksheet.autoFilter = 'A:N';

                    //Ruta del archivo
                    var DOWNLOAD_DIR = path.join(process.env.HOME || process.env.USERPROFILE, 'downloads/');
                    const pathExcel = path.join(DOWNLOAD_DIR, nombreArchivoE + '_' + contador + '.xlsx');
                    await workbook.xlsx.writeFile(pathExcel);
                    socket.emit("RespExcel", { mensaje: "Excel descargado en la carpeta Descargas" });
                    contador++;
                } else {
                    socket.emit("RespExcel", { mensaje: "No se puede descargar un excel de un registro vacío" });
                }
            }
        });
        console.log("File is written");
    });

    // Crear excel de consultas de almacen
    socket.on('ExcelM', async () => {
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("My Sheet");

        worksheet.columns = [
            { header: 'N. Inv', key: 'N_Inv', width: 11 },
            { header: 'Descripción', key: 'Desc', width: 50 },
            { header: 'Ubicación', key: 'Ubi', width: 40 },
            { header: 'Cantidad', key: 'Cant', width: 15 },
            { header: 'Área', key: 'Area', width: 25 },
            { header: 'Encargado', key: 'Encargado', width: 40 }
        ];

        db.query('select mobiliario.Num_Inventario, mobiliario.Descripcion, mobiliario.Ubicacion, mobiliario.Cantidad, mobiliario.AreaM,empleado.Nom from mobiliario inner join empleado on mobiliario.Num_emp = empleado.Num_emp', async function (err, res) {
            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {
                if (res.length > 0) {
                    for (var i = 0; i < res.length; i++) {
                        worksheet.addRow({ N_Inv: res[i].Num_Inventario, Desc: res[i].Descripcion, Ubi: res[i].Ubicacion, Cant: res[i].Cantidad, Area: res[i].AreaM, Encargado: res[i].Nom });
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
                    var DOWNLOAD_DIR = path.join(process.env.HOME || process.env.USERPROFILE, 'downloads/');
                    const pathExcel = path.join(DOWNLOAD_DIR, nombreArchivoM + '_' + contador + '.xlsx');
                    await workbook.xlsx.writeFile(pathExcel);
                    socket.emit("RespExcel", { mensaje: "Excel descargado en la carpeta Descargas" });
                    contador++;
                } else {
                    socket.emit("RespExcel", { mensaje: "No se puede descargar un excel de un registro vacío" });
                }
            }
        });
        console.log("File is written");
    });

    // Consulta de registro de productos
    socket.on('Consul_RegProSac', async () => {

        // Autenticar que haga las consultas
        db.query('select Salidas_Productos.Cod_BarrasS, almacen.Articulo, almacen.Existencia, empleado.Nom, salidas_productos.Cantidad_Salida, salidas_productos.FSalida from salidas_productos inner join almacen on salidas_productos.Cod_BarrasS = almacen.Cod_Barras inner join empleado on salidas_productos.Num_EmpS = empleado.Num_emp', function (err, result) {
            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {
                if (result.length > 0) {//Si sí hizo una búsqueda
                    for (var i = 0; i < result.length; i++) {
                        socket.emit('Desp_Productos', { Cod_BarrasS: result[i].Cod_BarrasS, Articulo: result[i].Articulo, Existencia: result[i].Existencia, Nom: result[i].Nom, Cantidad_Salida: result[i].Cantidad_Salida, FSalida: result[i].FSalida });//Mandar usuario y token al cliente
                    }
                }
                result.length = 0;
            }
        });
    });

    // Crear excel de consultas de almacen con filtro de fechas
    socket.on('SacarExcel', async (data) => {

        const workbook = new Excel.Workbook();
        var DOWNLOAD_DIR = path.join(process.env.HOME || process.env.USERPROFILE, 'downloads/');

        if ((data.fechaInicio && data.fechaFin) == undefined) {

            const worksheet = workbook.addWorksheet('My Sheet');

            worksheet.columns = [
                { header: 'Código de Barras', key: 'CB', width: 25 },
                { header: 'Artículo', key: 'Articulo', width: 40, },
                { header: 'En existencia', key: 'Exist', width: 20, },
                { header: 'Encargado', key: 'Encargado', width: 45, },
                { header: 'Cantidad a sacar', key: 'CantSac', width: 30, },
                { header: 'Fecha de salida', key: 'FecSac', width: 30, }
            ];

            db.query('select Salidas_Productos.Cod_BarrasS, almacen.Articulo, almacen.Existencia, empleado.Nom, salidas_productos.Cantidad_Salida, salidas_productos.FSalida from salidas_productos inner join almacen on salidas_productos.Cod_BarrasS = almacen.Cod_Barras inner join empleado on salidas_productos.Num_EmpS = empleado.Num_emp', async function (err, result) {
                // If si marca error
                if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
                else {
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
                }
            });
        } else {
            const worksheet = workbook.addWorksheet('My Sheet');

            worksheet.columns = [
                { header: 'Código de Barras', key: 'CB', width: 25 },
                { header: 'Artículo', key: 'Articulo', width: 40, },
                { header: 'En existencia', key: 'Exist', width: 20, },
                { header: 'Encargado', key: 'Encargado', width: 45, },
                { header: 'Cantidad a sacar', key: 'CantSac', width: 30, },
                { header: 'Fecha de salida', key: 'FecSac', width: 30, }
            ];
            console.log(data);
            db.query('select Salidas_Productos.Cod_BarrasS, almacen.Articulo, almacen.Existencia, empleado.Nom, salidas_productos.Cantidad_Salida, salidas_productos.FSalida from salidas_productos inner join almacen on salidas_productos.Cod_BarrasS = almacen.Cod_Barras inner join empleado on salidas_productos.Num_EmpS = empleado.Num_emp where FSalida BETWEEN ? and ?', [data.fechaInicio, data.fechaFin], function (err, result) {
                // If si marca error
                if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
                else {
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
                }
            });
        }
        socket.emit("SacarRespExcel", { mensaje: "Excel descargado en la carpeta Descargas" });
    });

    // Consultas de equipos
    socket.on('Consul_Equipos', async () => {

        // Autenticar que haga las consultas
        db.query('SELECT eqp.*, e.Nom FROM equipo eqp JOIN empleado e ON eqp.Num_emp = e.Num_emp', function (err, result) {
            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {
                if (result.length > 0) {//Si sí hizo una búsqueda
                    for (var i = 0; i < result.length; i++) {
                        socket.emit('Desp_Equipos', { Num_Serie: result[i].Num_Serie, Equipo: result[i].Equipo, Marca: result[i].Marca, Modelo: result[i].Modelo, NombreEmp: result[i].Nom, Ubi: result[i].Ubi });//Mandar usuario y token al cliente
                    }
                    socket.emit('ButtonUp');
                }
                result.length = 0;
            }
        });
    });

    // Bajas en equipos
    socket.on('Bajas_Equipos', async (data) => {

        // Autenticar que haga las consultas
        db.query('select*from equipo', function (err, result) {
            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {
                if (result.length > 0) { //Si sí hizo una búsqueda
                    db.query('delete from equipo where Num_Serie = ?', data, function (err, result) {
                        if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
                        else {
                            if (result.affectedRows > 0) {
                                console.log("Resultado de eliminacion de equipos: ", result);
                                socket.emit('RespDelEqp', { mensaje: 'Equipo dado de baja.' });//Mandar mensaje de éxito a cliente
                            } else {
                                socket.emit('RespDelEqp', { mensaje: "Equipo no eliminado, inténtelo de nuevo." });
                            }
                        }
                    });

                } else {
                    socket.emit('RespDelEqp', { mensaje: 'No hay datos para mostrar' });//Mandar mensaje de error a cliente
                }
            }
        });

    });

    // Cambios en equipos
    socket.on('Cambios_Equipos', async (data, dataOld) => {
        db.query('SELECT Num_Emp FROM empleado WHERE Nom = ?', [data.NombreEmp], function (err, result) {
            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {
                if (result.length > 0) { //Si sí hizo una búsqueda
                    var num_emp = result[0].Num_Emp; // Obtener el valor de Num_Emp del primer elemento del arreglo result
                    //Se agrega productos a la BD
                    db.query('update equipo set Num_Serie = ?, Equipo = ?, Marca = ?, Modelo = ?, Num_emp = ?, Ubi = ? where Num_Serie = ?', [data.Num_Serie, data.Equipo, data.Marca, data.Modelo, num_emp, data.Ubi, dataOld.OLDNum_S], function (err2, result) {
                        if (err2) { Errores(err2); socket.emit('SystemError'); } // Se hace un control de errores
                        else {
                            if (result.affectedRows > 0) { //Si sí hizo una búsqueda
                                socket.emit('RespEquipos', { mensaje: 'Equipo modificado con éxito.', Res: 'Si' });//Mandar mensaje a cliente
                            } else {
                                socket.emit('RespEquipos', { mensaje: "No se pudo modificar el equipo." })
                            }
                        }
                    });
                }
            }
        });
    });
    // Cambios de PC
    socket.on('CambiosPc', async (data, dataOld) => {
        db.query('select * from pcs where Num_Serie = ?', [data.Num_S], async function (err, result) {
            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {
                if (result.length > 0) {
                    db.query('update pcs set Num_Serie = ?, Hardware = ?, Software = ? where Num_Serie = ?', [data.Num_S, data.HardE, data.SoftE, dataOld.OLDNum_S], async function (err, result) {
                        if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
                        else {
                            if (!result) {
                                socket.emit("RespEquipos", { mensaje: "No se pudo actualizar los datos de la PC." });
                            }
                        }
                    });
                } else {
                    db.query('insert into pcs values(?,?,?)', [data.Num_S, data.HardE, data.SoftE], async function (err, result) {
                        if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
                        else {
                            if (!result) {
                                socket.emit("RespEquipos", { mensaje: "No se pudo dar de alta los datos de la PC, agréguelo por separado." });
                            }
                        }
                    });
                }
            }
        });
    });
    // Cambios de monitor
    socket.on('CambiosMon', async (data, dataOld) => {
        console.log(data);
        db.query('select * from monitor where Num_Inv_Mon = ?', [data.NIME], async function (err, result) {
            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {
                if (result.length > 0) {
                    socket.emit("RespEquipos", { mensaje: "Ese número de inventario ya está registrado, inténtelo de nuevo." });
                } else {
                    db.query('select * from monitor where Num_Serie = ?', [data.Num_S], async function (err, result) {
                        if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
                        else {
                            if (result.length > 0) {
                                db.query('update monitor set Num_Serie = ?, Monitor = ?, Num_Serie_Monitor = ?, Num_Inv_Mon = ? where Num_Serie = ?', [data.Num_S, data.MonE, data.NSMon, data.NIME, dataOld.OLDNum_S], async function (err, result) {
                                    if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
                                    else {
                                        if (!result) {
                                            socket.emit("RespEquipos", { mensaje: "No se pudo actualizar los datos del monitor." });
                                        }
                                    }
                                });
                            } else {
                                db.query('insert into monitor values(?,?,?,?)', [data.Num_S, data.MonE, data.NSMon, data.NIME], async function (err, result) {
                                    if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
                                    else {
                                        if (!result) {
                                            socket.emit("RespEquipos", { mensaje: "No se pudo dar de alta los datos del monitor, agréguelo por separado." });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    });
    // Cambios de mouse
    socket.on('CambiosMouse', async (data, dataOld) => {
        db.query('select * from Mouse where Num_Serie = ?', [data.Num_S], async function (err, result) {
            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {
                if (result.length > 0) {
                    db.query('update Mouse set Num_Serie = ?, Mouse = ? where Num_Serie = ?', [data.Num_S, data.MousE, dataOld.OLDNum_S], async function (err, result) {
                        if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
                        else {
                            if (!result) {
                                socket.emit("RespEquipos", { mensaje: "No se pudo actualizar los datos del mouse." });
                            }
                        }
                    });
                } else {
                    db.query('insert into Mouse values(?,?)', [data.Num_S, data.MousE], async function (err, result) {
                        if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
                        else {
                            if (!result) {
                                socket.emit("RespEquipos", { mensaje: "No se pudo dar de alta los datos del mouse, agréguelo por separado." });
                            }
                        }
                    });
                }
            }
        });
    });
    // Cambios de teclado
    socket.on('CambiosTecla', async (data, dataOld) => {
        db.query('select * from Teclado where Num_Serie = ?', [data.Num_S], async function (err, result) {
            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {
                if (result.length > 0) {
                    db.query('update Teclado set Num_Serie = ?, Teclado = ? where Num_Serie = ?', [data.Num_S, data.TeclaE, dataOld.OLDNum_S], async function (err, result) {
                        if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
                        else {
                            if (!result) {
                                socket.emit("RespEquipos", { mensaje: "No se pudo actualizar los datos del teclado." });
                            }
                        }
                    });
                } else {
                    db.query('insert into Teclado values(?,?)', [data.Num_S, data.TeclaE], async function (err, result) {
                        if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
                        else {
                            if (!result) {
                                socket.emit("RespEquipos", { mensaje: "No se pudo dar de alta los datos del teclado, agréguelo por separado." });
                            }
                        }
                    });
                }
            }
        });
    });
    // Cambio de accesorio
    socket.on('CambiosAcces', async (data, dataOld) => {
        db.query('select * from Accesorio where Num_Serie = ?', [data.Num_S], async function (err, result) {
            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {
                if (result.length > 0) {
                    db.query('update Accesorio set Num_Serie = ?, Accesorio = ? where Num_Serie = ?', [data.Num_S, data.AccesE, dataOld.OLDNum_S], async function (err, result) {
                        if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
                        else {
                            if (!result) {
                                socket.emit("RespEquipos", { mensaje: "No se pudo actualizar los accesorios." });
                            }
                        }
                    });
                } else {
                    db.query('insert into Accesorio values(?,?)', [data.Num_S, data.AccesE], async function (err, result) {
                        if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
                        else {
                            if (!result) {
                                socket.emit("RespEquipos", { mensaje: "No se pudo dar de alta los accesorios, agréguelos por separado." });
                            }
                        }
                    });
                }
            }
        });
    });

    // altas de equipos
    socket.on('Alta_Equipos', async (data) => {
        db.query('SELECT Num_Emp, Área FROM empleado WHERE Nom = ?', [data.NomEn], function (err, result) {
            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {
                if (result.length > 0) {//Si sí hizo una búsqueda

                    db.query('insert into equipo values(null,?,?,?,?,(select Num_emp from empleado where Nom = ?),?)', [data.Num_S, data.Equipo, data.MarcaE, data.ModelE, data.NomEn, data.UbiE], async function (err, result) {
                        if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
                        else {
                            if (result) {
                                console.log("Resultado de inserción de productos: ", result);
                                socket.emit('Equipo_Respuesta', { mensaje: 'Equipo dado de alta.', Res: 'Si' });//Mandar mensaje de error a cliente
                            } else {
                                socket.emit('Equipo_Respuesta', { mensaje: 'No se pudo dar de alta el equipo, inténtelo de nuevo.', Res: 'Si' });
                            }
                        }
                    });
                }
            }
        });
        data.length = 0;
    });

    // Alta de PC
    socket.on('AltaPc', async (data) => {
        db.query('select * from pcs where Num_Serie = ?', [data.Num_S], async function (err, result) {
            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {
                if (result.length > 0) {
                    socket.emit("Equipo_Respuesta", { mensaje: "Esta computadora ya está registrada, ingrese otra." });
                } else {
                    db.query('insert into pcs values(?,?,?)', [data.Num_S, data.HardE, data.SoftE], async function (err, result) {
                        if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
                        else {
                            if (!result) {
                                socket.emit("Equipo_Respuesta", { mensaje: "No se pudo dar de alta los datos de la PC, agréguelo por separado." });
                            }
                        }
                    });
                }
            }
        });
    });
    // Alta de monitor
    socket.on('AltMon', async (data) => {
        db.query('select * from monitor where Num_Serie = ?', [data.Num_S], async function (err, result) {
            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {
                if (result.length > 0) {
                    socket.emit("Equipo_Respuesta", { mensaje: "Este monitor ya está registrado, ingrese otro." });
                } else {
                    db.query('insert into monitor values(?,?,?,?)', [data.Num_S, data.MonE, data.NSMon, data.NIME], async function (err, result) {
                        if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
                        else {
                            if (!result) {
                                socket.emit("Equipo_Respuesta", { mensaje: "No se pudo dar de alta los datos del monitor, agréguelo por separado." });
                            }
                        }
                    });
                }
            }
        });
    });
    // Alta de mouse
    socket.on('AltMouse', async (data) => {
        db.query('select * from Mouse where Num_Serie = ?', [data.Num_S], async function (err, result) {
            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {
                if (result.length > 0) {
                    socket.emit("Equipo_Respuesta", { mensaje: "Este mouse ya está registrado, ingrese otro." });
                } else {
                    db.query('insert into Mouse values(?,?)', [data.Num_S, data.MousE], async function (err, result) {
                        if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
                        else {
                            if (!result) {
                                socket.emit("Equipo_Respuesta", { mensaje: "No se pudo dar de alta los datos del mouse, agréguelo por separado." });
                            }
                        }
                    });
                }
            }
        });
    });
    // Alta de teclado
    socket.on('AltTecla', async (data) => {
        db.query('select * from Teclado where Num_Serie = ?', [data.Num_S], async function (err, result) {
            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {
                if (result.length > 0) {
                    socket.emit("Equipo_Respuesta", { mensaje: "Este teclado ya está registrado, ingrese otro." });
                } else {
                    db.query('insert into Teclado values(?,?)', [data.Num_S, data.TeclaE], async function (err, result) {
                        if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
                        else {
                            if (!result) {
                                socket.emit("Equipo_Respuesta", { mensaje: "No se pudo dar de alta los datos del teclado, agréguelo por separado." });
                            }
                        }
                    });
                }
            }
        });
    });
    // Alta de accesorio
    socket.on('AltAcces', async (data) => {
        db.query('select * from Accesorio where Num_Serie = ?', [data.Num_S], async function (err, result) {
            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {
                if (result.length > 0) {
                    socket.emit("Equipo_Respuesta", { mensaje: "Estos accesorios ya están registrados, ingrese otros." });
                } else {
                    db.query('insert into Accesorio values(?,?)', [data.Num_S, data.AccesE], async function (err, result) {
                        if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
                        else {
                            if (!result) {
                                socket.emit("Equipo_Respuesta", { mensaje: "No se pudo dar de alta los accesorios, agréguelos por separado." });
                            }
                        }
                    });
                }
            }
        });
    });

    socket.on("DatEmp", async () => {
        db.query('select empleado.Nom, empleado.Área, (select Nom from empleado as Jefe where Jefe.Num_emp = empleado.Num_Jefe) Nom_Jefe from empleado;', async function (err, result) {
            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {
                if (result.length > 0) {//Si sí hizo una búsqueda
                    for (var i = 0; i < result.length; i++) {
                        socket.emit('DespEmp', { NomEmp: result[i].Nom, Area: result[i].Área, NomJefe: result[i].Nom_Jefe });//Mandar usuario y token al cliente
                    }
                    socket.emit('ButtonUpEmp');
                }
                result.length = 0;
            }
        });
    });

    socket.on('EmpDelete', async (data) => {
        db.query('select empleado.Nom from empleado inner join usuario on empleado.Num_emp = usuario.Num_Emp where usuario.Usuario = ?', data.Nus, function (err, result) {
            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {
                if (result.length > 0) {
                    if (data.Nemp != result[0].Nom) {
                        db.query('delete from empleado where Num_emp in (select Num_Emp from (select Num_Emp from empleado where Nom = ?) Emp)', data.Nemp, function (err, result) {
                            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
                            else {
                                if (result.affectedRows > 0) {
                                    socket.emit('MensajeEmp', { mensaje: 'Empleado eliminado con éxito.', Res: 'Si' });
                                } else {
                                    socket.emit('MensajeEmp', { mensaje: 'No se pudo eliminar al empleado, inténtelo de nuevo.', Res: 'Si' });
                                }
                            }
                        });
                    } else {
                        socket.emit('MensajeEmp', { mensaje: "No puedes eliminarte a ti mismo.", Res: 'Si' });
                    }
                }
            }
        });
    });

    socket.on('ModEmp', async (dataNew, dataOld) => {
        db.query('update empleado set Nom = ?, Área = ?, Num_Jefe = (select Num_emp from (select Num_Emp from empleado where Nom = ?) Jefe) where Num_emp = (select Num_emp from (select Num_Emp from empleado where Nom = ?) Empleado)', [dataNew.NewName, dataNew.NewArea, dataNew.NewBoss, dataOld.OldName], function (err, result) {
            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {
                if (result.affectedRows > 0) {
                    socket.emit('MensajeEmp', { mensaje: 'Empleado modificado con éxito.', Res: 'Si' });//Mandar mensaje a cliente
                } else {
                    socket.emit('MensajeEmp', { mensaje: "No se pudo modificar el empleado." });
                }
            }
        });
    });

    // Consultas de mobiliario
    socket.on('Consul_Mobiliario', async (data) => {
        db.query('select Área from empleado inner join usuario on empleado.Num_emp = usuario.Num_emp where usuario = ?', [data], function (err, res) {

            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {
                if (res.length > 0) {//Si sí hizo una búsqueda
                    if (!(res[0].Área === 'SISTEMAS')) {  
                        db.query('SELECT m.*, e.Nom FROM mobiliario m JOIN empleado e ON m.Num_emp = e.Num_emp where e.nom = (select empleado.nom from empleado inner join usuario on empleado.Num_emp = usuario.Num_Emp where usuario.Usuario = ?);', [data], function (err, result) {
                            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
                            else {
                                if (result.length > 0) {//Si sí hizo una búsqueda
                                    for (var i = 0; i < result.length; i++) {
                                        socket.emit('Desp_Mobiliario', { Descripcion: result[i].Descripcion, Ubicacion: result[i].Ubicacion, Cantidad: result[i].Cantidad, NombreCom: result[i].NombreCom, Area: result[i].Area });//Mandar usuario y token al cliente
                                    }
                                    socket.emit('ButtonUp');
                                }
                                result.length = 0;
                            }
                        });
                    } else {
                        db.query('SELECT m.*, e.Nom FROM mobiliario m JOIN empleado e ON m.Num_emp = e.Num_emp', function (err, result) {
                            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
                            else {
                                if (result.length > 0) {//Si sí hizo una búsqueda
                                    for (var i = 0; i < result.length; i++) {
                                        socket.emit('Desp_Mobiliario', { Descripcion: result[i].Descripcion, Ubicacion: result[i].Ubicacion, Cantidad: result[i].Cantidad, NombreCom: result[i].NombreCom, Area: result[i].Area });//Mandar usuario y token al cliente
                                    }
                                    socket.emit('ButtonUp');
                                }
                                result.length = 0;
                            }
                        });
                    }
                }
            }
        });

    });

    // Altas de mobiliario
    socket.on('Alta_Mob', async (data) => {

        db.query('SELECT e.Num_Emp, e.Área, e.Nom FROM empleado e WHERE e.Num_Emp = (SELECT u.Num_Emp FROM Usuario u WHERE u.Usuario = ?)', [data.NombreEmp], function (err, result) {
            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {
                if (result.length > 0) {//Si sí hizo una búsqueda

                    var num_emp = result[0].Num_Emp; // Obtener el valor de Num_Emp del primer elemento del arreglo result
                    var area = result[0].Área; // Se obtiene el area del arreglo
                    var nomComp = result[0].Nom; // Se obtiene el nombre completo del empleado

                    db.query('insert into mobiliario values (NULL,?,?,?,?,?,?)', [data.Descripcion, num_emp, data.Ubicacion, data.Cantidad, nomComp, area], function (err2, result) {
                        if (err2) { Errores(err2); socket.emit('SystemError'); } // Se hace un control de errores
                        else {
                            if (result) {
                                console.log("Resultado de inserción de productos: ", result);

                                socket.emit('Mobiliario_Respuesta', { mensaje: 'Mobiliario dado de alta.', Res: 'Si' });//Mandar mensaje de error a cliente
                            }
                        }
                    });
                }
            }
        });
        data.length = 0;
    });

    // Bajas en mobiliario
    socket.on('Bajas_Mobiliario', async (data) => {

        // Autenticar que haga las consultas
        db.query('select*from mobiliario', function (err, result) {
            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {
                if (result.length > 0) { //Si sí hizo una búsqueda
                    db.query('delete from mobiliario where Descripcion = ?', data, function (err, result) {
                        if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
                        else {
                            if (result.affectedRows > 0) {
                                socket.emit('RespDelMob', { mensaje: 'Mobiliario dado de baja.' });//Mandar mensaje de éxito a cliente
                            } else {
                                socket.emit('RespDelMob', { mensaje: "Mobiliario no eliminado, inténtelo de nuevo." });
                            }
                        }
                    });

                } else {
                    socket.emit('RespDelMob', { mensaje: 'No hay datos para mostrar' });//Mandar mensaje de error a cliente
                }
            }
        });

    });


    // Cambios en mobiliario
    socket.on('Cambios_Mobiliario', async (data, dataOld) => {
        db.query('SELECT Num_Emp FROM empleado WHERE Nom = ?', [data.NombreEmp], function (err, result) {
            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {
                if (result.length > 0) { //Si sí hizo una búsqueda
                    var num_emp = result[0].Num_Emp; // Obtener el valor de Num_Emp del primer elemento del arreglo result
                    //Se agrega productos a la BD
                    db.query('update mobiliario set Descripcion = ?, Ubicacion = ?, Cantidad = ?, AreaM = ?, Num_emp = ? where Descripcion = ?', [data.Descripcion, data.Ubicacion, data.Cantidad, data.AreaM, num_emp, dataOld.OLDDesc], function (err2, result) {
                        if (err2) { Errores(err2); socket.emit('SystemError'); } // Se hace un control de errores
                        else {
                            if (result.affectedRows > 0) { //Si sí hizo una búsqueda
                                socket.emit('RespDelMob', { mensaje: 'Mobiliario modificado con éxito.', Res: 'Si' });//Mandar mensaje a cliente
                            } else {
                                socket.emit('RespDelMob', { mensaje: "No se pudo modificar el mobiliario." })
                            }
                        }
                    });
                }
            }
        });
    });

    socket.on('Crea_Resp', async (data) => {
        db.query('SELECT Num_Emp, Área from empleado where Nom = ?', [data.NombreEmp], function (err, res) {
            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {
                if (res) {
                    var num_emp = res[0].Num_Emp; // Obtener el valor de Num_Emp del primer elemento del arreglo result
                    var areaEmp = res[0].Área;

                    if (data.Responsiva == "MOBILIARIO") {
                        db.query('select*from mobiliario where Num_emp = ?;', [num_emp], function (err, res) {
                            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
                            else {
                                if (res) {
                                    mobiliario_generatePDF(num_emp, areaEmp, data.NombreEmp, res)
                                        .then((pdfBuffer) => {
                                            socket.emit('Responsiva_Respuesta', { mensaje: 'Responsiva de mobiliario generada.', Res: 'Si', pdfBuffer });//Mandar mensaje de error a cliente
                                        }).catch(error => {
                                            socket.emit('Responsiva_Respuesta', { mensaje: 'No se pudo generar la responsiva, inténtelo de nuevo', Res: 'Si' });
                                            console.error('Error al generar o descargar el PDF:', error);
                                        });
                                }
                            }
                        });
                    } else if (data.Token == "4dnM3k0nl9s" && data.Responsiva == "EQUIPOS") {
                        db.query('SELECT DISTINCT Equipo.N_Inventario, Equipo.Num_Serie, Equipo.Equipo, Equipo.Marca, Equipo.Modelo, Equipo.Num_emp, PCs.Hardware, PCs.Software, Monitor.Monitor, Monitor.Num_Serie_Monitor, Monitor.Num_Inv_Mon, Mouse.Mouse, Teclado.Teclado, Accesorio.Accesorio FROM Equipo LEFT JOIN PCs ON Equipo.Num_Serie = PCs.Num_Serie LEFT JOIN Monitor ON Equipo.Num_Serie = Monitor.Num_Serie LEFT JOIN Mouse ON Equipo.Num_Serie = Mouse.Num_Serie LEFT JOIN Teclado ON Equipo.Num_Serie = Teclado.Num_Serie LEFT JOIN Accesorio ON Equipo.Num_Serie = Accesorio.Num_Serie WHERE Num_emp = ?;', [num_emp], function (err, res) {
                            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
                            else {
                                if (res) {
                                    equipos_generatePDF(num_emp, areaEmp, data.NombreEmp, res)
                                        .then((pdfBuffer) => {
                                            socket.emit('Responsiva_Respuesta', { mensaje: 'Responsiva generada.', Res: 'Si', pdfBuffer });//Mandar mensaje de error a cliente
                                        }).catch(error => {
                                            socket.emit('Responsiva_Respuesta', { mensaje: 'No se pudo generar el PDF, inténtelo de nuevo', Res: 'Si' });
                                            console.error('Error al generar o descargar el PDF:', error);
                                        });
                                }
                            }
                        });
                    }
                }
            }
        });
    });

    socket.on('BuscarCPU', (Num_Serie) => {
        db.query('select equipo.Num_Serie, pcs.Hardware, pcs.Software, monitor.Monitor, monitor.Num_Serie_Monitor, monitor.Num_Inv_Mon, mouse.Mouse, teclado.Teclado, accesorio.Accesorio from equipo left join monitor on equipo.Num_Serie = monitor.Num_Serie left join mouse on equipo.Num_Serie = mouse.Num_Serie left join pcs on equipo.Num_Serie = pcs.Num_Serie left join Teclado on equipo.Num_Serie = teclado.Num_Serie left join accesorio on equipo.Num_Serie = accesorio.Num_Serie where equipo = "CPU" and equipo.Num_Serie = ?;', [Num_Serie], function (err, res) {
            if (err) { Errores(err); socket.emit('SystemError'); } // Se hace un control de errores
            else {
                if (res) {
                    socket.emit('ImpCPU', res);
                }
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado.');
    });
});