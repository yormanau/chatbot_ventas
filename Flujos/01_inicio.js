//Importaciones
const { addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { Mensaje } = require('../utils/strings/mensajesLoader.js')
const { waitForBaileysInstance } = require('../utils/escuchar_mensajes.js')
const adapterProvider = require('../app.js')



const { buscar_numero_celular } = require('../utils/mysql/buscar_celular.js')
const flujo_bienvenida = require('./02_bienvenida.js')
const flujo_registrar = require('./03_registrar.js')
const { mayuscula } = require('../utils/strings/mayuscula.js')
 
const flujo_inicio = addKeyword(EVENTS.WELCOME)
    .addAction(async (ctx, { gotoFlow, state, flowDynamic }) => {
        try {
            const wa = await waitForBaileysInstance(adapterProvider)
            const numero = ctx.from + '@s.whatsapp.net'

            const info = await state.getMyState() || {};
            const pausado = info.bot_pausado || false;

            if (pausado) {
                return;
            }
            
            const numero_celular = ctx.from;
            const usuario = await buscar_numero_celular(numero_celular)
            if (usuario) {
                await state.update({nombres_usuario: mayuscula(usuario.nombres)})
                
                return gotoFlow(flujo_bienvenida)
            } else {

                const duracion_escritura = Math.min(Mensaje('actualizacion.txt').length * 400, 3000);
                await new Promise(resolve => setTimeout(resolve, 1500))
                // Responde citando el mensaje original
                await wa.sendPresenceUpdate('composing', numero);
                await new Promise(resolve => setTimeout(resolve, duracion_escritura))

                await flowDynamic(Mensaje('actualizacion.txt'))
                
                return gotoFlow(flujo_registrar)
            }
        } catch (error) {
            console.log(error)
        }
    })
    
    
    

module.exports = flujo_inicio;