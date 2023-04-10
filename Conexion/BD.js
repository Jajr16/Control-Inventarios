const mysql = require('mysql');
const async = require('async');

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

function LogIn(Datos, callback){
    
    var sql = `select*from usuario where User = "${Datos.User}" and Pass = "${Datos.Pass}"`;
    db.query(sql, function (err, result){
        usuario = []
        if(err){
            console.error("El error fue: " + err);
        }
        if(result.length > 0){
            result.forEach(element => {
                usuario.push({
                    NumeroE: element.Num_Emp,
                    NombUser: element.User
                });
            });
           
            var resultado = result[0].User;
            console.log("La BD dice: " + resultado);
            callback(usuario);
            
        }else{
            console.log("Datos incorrectos");
        }
       
    });
    db.end();
}

module.exports.LogIn = LogIn;