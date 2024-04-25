const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    nombre: String,
    datos: Buffer,
    contentType: String,
})

const Imagen = mongoose.model('Imagen', imageSchema)

module.exports = Imagen