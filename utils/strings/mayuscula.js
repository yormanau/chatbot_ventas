function mayuscula(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ');
}

module.exports = { mayuscula }