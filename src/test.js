const { createProvider } = require('@bot-whatsapp/bot')

const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const adapterProvider = createProvider(BaileysProvider)

console.log(Object.getOwnPropertyNames(adapterProvider));
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(adapterProvider)));
console.log(adapterProvider.sendMessage?.toString());
console.log('Propiedades de adapterProvider:');
console.log(Object.getOwnPropertyNames(adapterProvider));
console.log('--- Métodos heredados de su prototipo ---');
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(adapterProvider)));
