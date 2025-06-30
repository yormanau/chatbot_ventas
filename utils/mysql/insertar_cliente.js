const { conexion } = require('./index.js')

function insertar_cliente(nombres, celular, edad, ciudad) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO cliente (nombres, celular, edad, ciudad) VALUES (?,?,?,?)';
    conexion.query(query, [nombres, celular, edad, ciudad], (err, results) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return resolve({ insertado: false, mensaje: 'El cliente ya existe.' });
        }
        return reject(err);
      }
      resolve({ insertado: true, id: results.insertId, nombres });
    });
  });
}

module.exports = {insertar_cliente};