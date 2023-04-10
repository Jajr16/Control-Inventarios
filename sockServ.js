const _ = require('lodash');
var BaseClarac = require("./Conexion/BD");



function Iniciar(server) {
    

    const io = require('socket.io')(server);
    // Configuración de socket.io
    io.on('connection', (socket) => {
        console.log('Cliente conectado');

        // Recepción de datos a través de socket.io
        socket.on('LG', (data) => {
            console.log('Datos recibidos:', data);
            //Se va a la Clase de Base de Datos y recibe el return
            BaseClarac.LogIn(data, function(DataSearch){
                data = DataSearch;
                console.log("Aver " + DataSearch);
                 socket.emit('LG', DataSearch);
            });

           // console.log("xsadsa" + ResultLogIn);
           

        });
    });
    module.exports.server = server;
}

module.exports.Iniciar = Iniciar;
