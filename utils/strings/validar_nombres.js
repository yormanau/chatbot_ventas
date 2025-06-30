const { mayuscula } = require('./mayuscula.js')

const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/;
function validar_nombres(texto) {
  const entrada = texto.toLowerCase().trim().split(' ', 2);

  if (entrada.length < 2) {
    return { valido: false, mensaje: 'Ingrese nombre y apellido.' };
  }

  const [name, lastName] = entrada;

  const esNombreValido = soloLetras.test(name) && name.length > 2;
  const esApellidoValido = soloLetras.test(lastName) && lastName.length > 1;

  if (!esNombreValido || !esApellidoValido) {
    return { valido: false, mensaje: 'Ingrese nombre y apellido válidos.' };
  }

  const nombres = mayuscula(name) + ' ' + mayuscula(lastName);

  return {
    valido: true,
    nombres,
    name: mayuscula(name),
    lastName: mayuscula(lastName)
  };
}

module.exports = { validar_nombres }