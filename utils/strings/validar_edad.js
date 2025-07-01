function es_numero(valor) {
    const regex = /^\d+$/; // Solo dígitos del 0 al 9, al menos uno
    return regex.test(valor);
}
function extraer_numero(texto) {
    const match = texto.match(/\d+/); // busca uno o más dígitos
    return match ? parseInt(match[0]) : null;
}



module.exports = {es_numero, extraer_numero};