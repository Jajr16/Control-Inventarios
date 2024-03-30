const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/Clarac'

// Conexión a la base de datos mongoose
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Eventos para manejar la conexión
mongoose.connection.on('connected', () => {
  console.log('Conexión establecida con MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Error al conectar con MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Conexión a MongoDB cerrada');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Conexión a MongoDB cerrada debido a terminación de la aplicación');
    process.exit(0);
  });
});

module.exports = mongoose.connection;