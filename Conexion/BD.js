const mysql = require('mysql');

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

function LogIn(Datos){
    
    var sql = `select*from usuario where User = "${Datos.User}" and Pass = "${Datos.Pass}"`;
    db.query(sql, function (err, result){
        if(err){
            console.error("El error fue: " + err);
        }
        if(result.length > 0){
            var resultado = result[0].User;
            console.log(resultado);
            return result;
        }else{
            console.log("Datos incorrectos");
            return "Usuario o contraseña incorrectos";
        }
    });
    db.end();
    return Respuestita;
}

module.exports.LogIn = LogIn;