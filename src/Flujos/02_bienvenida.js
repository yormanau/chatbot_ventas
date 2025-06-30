//Importaciones
const { addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { Mensaje } = require('../utils/strings/mensajesLoader.js')
const  flujo_humano  = require('./humano.js')


const flujo_bienvenida = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, { state, flowDynamic, gotoFlow }) => {
        const info = await state.getMyState()
        await new Promise(resolve => setTimeout(resolve, 3000))
        await flowDynamic(`Hola 👋, *${info.nombres_usuario}* ${Mensaje('bienvenida.txt')}`)
        return gotoFlow(flujo_humano)
    })
module.exports = flujo_bienvenida;