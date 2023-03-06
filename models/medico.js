const { Schema, model } = require('mongoose');

const MedicoSchema = Schema({
    nombre: {
        type: String,
        require: true
    },
    img: {
        type: String,
    },
    usuario: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    hospital: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Hospital'
    }
});

// Cambiar el nombre de un atributo: Ej. _id
MedicoSchema.method('toJSON', function(){
    const { __v, _id, password,...object } = this.toObject();

    object.uid = _id;
    return object;
});

module.exports = model('Medico', MedicoSchema);