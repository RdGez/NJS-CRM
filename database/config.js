/* 
Usuario: mean_user
Contraseñá: EumLdR8HELSi0hyG 
*/

require('dotenv').config();

// Realizar conexión a base de datos:
const mongoose = require("mongoose");
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    // Configuramos las funciones de nuevas versiones:
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);

    console.log('Conectado a la base de datos');
  } catch (error) {
    console.log(error);
    throw new Error("Error al hacer conexión a la base de datos");
  }
};

module.exports = {
    dbConnection
}