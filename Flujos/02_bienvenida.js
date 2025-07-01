//Importaciones
const { addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { Mensaje } = require('../utils/strings/mensajesLoader.js')
const  flujo_humano  = require('./humano.js')
const { waitForBaileysInstance } = require('../utils/escuchar_mensajes.js')
const adapterProvider = require('../app.js')

const flujo_bienvenida = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, { state, flowDynamic, gotoFlow }) => {
        const wa = await waitForBaileysInstance(adapterProvider)
        const numero = ctx.from + '@s.whatsapp.net'
        const duracion_escritura = Math.min(Mensaje('bienvenida.txt').length * 400, 5000);
        await new Promise(resolve => setTimeout(resolve, 1500))
        // Responde citando el mensaje original
        await wa.sendPresenceUpdate('composing', numero);
        await new Promise(resolve => setTimeout(resolve, duracion_escritura))
        const info = await state.getMyState()
        await new Promise(resolve => setTimeout(resolve, 3000))
        await flowDynamic(`Hola 👋, *${info.nombres_usuario}* ${Mensaje('bienvenida.txt')}`)
        return gotoFlow(flujo_humano)
    })
module.exports = flujo_bienvenida;