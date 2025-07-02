const { pool } = require('./index.js')
const { detectar_pais } = require('./guardar_pais.js')

function insertar_cliente(nombres, celular, edad, ciudad) {
  return new Promise((resolve, reject) => {
    const pais = detectar_pais(celular)
    const query = 'INSERT INTO cliente (nombres, celular, edad, ciudad, pais) VALUES (?,?,?,?,?)';
    pool.query(query, [nombres, celular, edad, ciudad, pais], (err, results) => {
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