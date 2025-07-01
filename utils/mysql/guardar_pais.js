/*const { conexion } = require('./index.js')

conexion.query('SELECT id_cliente, celular FROM cliente', async (err, res) => {
    if (err) {
        console.error('Error al traer los datos', err)
        return;
    }

    for (const cliente of res) {
        const pais = detectar_pais(cliente.celular);
        console.log(`Actualizando cliente ${cliente.id_cliente} => ${pais}`)

        conexion.query(`
            UPDATE cliente SET pais = ? WHERE id_cliente = ?`,
            [pais, cliente.id_cliente],
            err => {
                if (err) {
                    console.error(`Error al actualizar cliente ${cliente.id_cliente}:`, err)
                }
            }
        );
    }
    setTimeout(() => {
        conexion.end();
        console.log('Actulización completa y conexión cerrada')
    }, 2000);
})
*/
// Mapa de prefijos internacionales a países (sin '+')
const prefijos = {
  '1': 'Estados Unidos / Canadá',
  '34': 'España',
  '52': 'México',
  '54': 'Argentina',
  '55': 'Brasil',
  '56': 'Chile',
  '57': 'Colombia',
  '58': 'Venezuela',
  '591': 'Bolivia',
  '593': 'Ecuador',
  '595': 'Paraguay',
  '598': 'Uruguay',
  '51': 'Perú'
};

// Función para detectar el país desde el número (sin '+')
function detectar_pais(numero) {
  // Asegurarse de que sea solo números
  if (!/^\d+$/.test(numero)) {
    return 'Número inválido. Solo debe contener dígitos.';
  }

  // Buscar el prefijo más largo que coincida
  const prefijoEncontrado = Object.keys(prefijos)
    .sort((a, b) => b.length - a.length) // Prefijos largos primero
    .find(prefijo => numero.startsWith(prefijo));

  return prefijoEncontrado
    ? `${prefijos[prefijoEncontrado]}`
    : 'Prefijo no reconocido';
}

module.exports = { detectar_pais };