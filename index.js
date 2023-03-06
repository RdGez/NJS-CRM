require('dotenv').config();
const path = require('path');

const express = require("express");
const cors = require('cors');

const { dbConnection } = require('./database/config');

// Iniciar express.js:
const app = express();

// Configurar los CORS:
app.use(cors());

// Parseo del body:
app.use(express.json());

// Conexión a base de datos:
dbConnection();

// Directorio Publico:
app.use(express.static('public'));

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto: ' + process.env.PORT);
});

// Rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/search', require('./routes/busquedas.routes'));
app.use('/api/medicos', require('./routes/medicos.routes'));
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/hospitales', require('./routes/hospitales.routes'));
app.use('/api/upload', require('./routes/upload.routes'));

// Deespliegue de APP
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});