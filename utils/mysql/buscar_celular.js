/*const { conexion } = require('./index.js')

function buscar_numero_celular(celular) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM cliente WHERE celular = ?';
    conexion.query(query, [celular], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null); // No existe
      resolve(results[0]); // Devuelve { nombres: ... }
    });
  });
}

async function buscar(celular) {
    try {
        const cliente = await buscar_numero_celular(celular)
        if (cliente) {
            console.log(cliente.nombres)
        } else {
            console.log('Numero no registrado')
        }
    } catch (error) {
        console.error('Error al buscar el numero', error)
    }
}
//buscar('573108063653')
module.exports = { buscar_numero_celular  }*/
const { pool } = require('./index.js');

function buscar_numero_celular(celular) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM cliente WHERE celular = ?';
    pool.query(query, [celular], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null); // No existe
      resolve(results[0]); // Devuelve { nombres: ... }
    });
  });
}

async function buscar(celular) {
  try {
    const cliente = await buscar_numero_celular(celular);
    if (cliente) {
      console.log(cliente.nombres);
    } else {
      console.log('Número no registrado');
    }
  } catch (error) {
    console.error('Error al buscar el número', error);
  }
}

// buscar('573108063653');
module.exports = { buscar_numero_celular };
