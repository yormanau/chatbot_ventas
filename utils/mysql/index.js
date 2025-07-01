const mysql = require('mysql2')
//require('dotenv').config();
require('dotenv').config({ path: '../../.env' });

const conexion = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT
})

conexion.connect((err) => {
    if (err) {
        console.error('Error de conexión: ', err)
        return;
    }
    console.log('Conexión exitosa')
})


module.exports = { conexion };