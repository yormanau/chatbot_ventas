const mysql = require('mysql2')

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'ventas_chatbot'
})

conexion.connect((err) => {
    if (err) {
        console.error('Error de conexión: ', err)
        return;
    }
    console.log('Conexión exitosa')
})

module.exports = { conexion };