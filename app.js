const { createBot, createProvider, createFlow } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const adapterProvider = createProvider(BaileysProvider)
const MockAdapter = require('@bot-whatsapp/database/mysql')
const { escuchar_mensajes } = require('./utils/escuchar_mensajes.js')
const { syncData } = require('./utils/sheets.js')
module.exports = adapterProvider;
syncData()



// Importar flujos
const flujo_inicio = require('./Flujos/01_inicio.js')
const flujo_bienvenida = require('./Flujos/02_bienvenida.js')
const flujo_registrar = require('./Flujos/03_registrar.js')
const flujo_humano = require('./Flujos/humano.js')
const flujo_activar = require('./Flujos/humano.js')


const main = async () => {
    const adapterDB = new MySQLAdapter({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        port: process.env.PORT,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    })
    const adapterFlow = createFlow([
        flujo_inicio,
        flujo_bienvenida,
        flujo_registrar,
        flujo_humano,
        flujo_activar])

   
    const bot = createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    

    QRPortalWeb({ port: process.env.PORT || 3000 })
   
    escuchar_mensajes(adapterProvider, bot);
}

main()