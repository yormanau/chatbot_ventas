//Importaciones
const { addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { Mensaje } = require('../utils/strings/mensajesLoader.js')
const { insertar_cliente } = require('../utils/mysql/insertar_cliente.js')
const { mayuscula } = require('../utils/strings/mayuscula.js')
const { validar_nombres } = require('../utils/strings/validar_nombres.js')
const  flujo_humano  = require('./humano.js')
const { es_numero, extraer_numero } = require('../utils/strings/validar_edad.js')
const { waitForBaileysInstance } = require('../utils/escuchar_mensajes.js')
const adapterProvider = require('../app.js')



const flujo_registrar = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, { flowDynamic }) => {
        const wa = await waitForBaileysInstance(adapterProvider)
        const numero = ctx.from + '@s.whatsapp.net'
        const duracion_escritura = Math.min(`${Mensaje('no_registrado.txt')}\n\nIndique su edad por favor`.length * 400, 3000);

        await new Promise(resolve => setTimeout(resolve, 1500))
        // Responde citando el mensaje original
        await wa.sendPresenceUpdate('composing', numero);
        await new Promise(resolve => setTimeout(resolve, duracion_escritura))
        return await flowDynamic(`${Mensaje('no_registrado.txt')}\n\nIndique su edad por favor`)
    })
    //
    // Solicitar edad
    .addAction({capture:true}, 
        async (ctx, { state, flowDynamic, endFlow, fallBack }) => {
            const wa = await waitForBaileysInstance(adapterProvider)
            const numero = ctx.from + '@s.whatsapp.net'
            const duracion_escritura = Math.min(`Ahora dinos ¿De qué ciudad nos escribes?`.length * 400, 3000);

            const edad_str = ctx.body.trim().toLowerCase();
            const edad = extraer_numero(edad_str)
            

            if (edad === null || edad > 120) {
                await wa.sendPresenceUpdate('composing', numero);
                await new Promise(resolve => setTimeout(resolve, duracion_escritura))
                return fallBack('Escriba una edad válida')
            
            } else if (edad < 18) {
                await wa.sendPresenceUpdate('composing', numero);
                await new Promise(resolve => setTimeout(resolve, duracion_escritura))
                return endFlow(Mensaje('menor_edad.txt'))
            } else {
                await state.update({edad: parseInt(edad)})

                // Responde citando el mensaje original
                await wa.sendPresenceUpdate('composing', numero);
                await new Promise(resolve => setTimeout(resolve, duracion_escritura))
                return await flowDynamic(`Ahora dinos ¿De qué ciudad nos escribes?`)
            }
            
        }
    )
    // Solicitar ciudad
    .addAction({capture:true}, 
        async (ctx, { state, flowDynamic }) => {
            const wa = await waitForBaileysInstance(adapterProvider)
            const numero = ctx.from + '@s.whatsapp.net'
            const duracion_escritura = Math.min('Indícanos tú nombre y apellido.'.length * 400, 3000);

            const ciudad = ctx.body.trim().toLowerCase();
            await state.update({ciudad: ciudad})
            await wa.sendPresenceUpdate('composing', numero);
            await new Promise(resolve => setTimeout(resolve, duracion_escritura))
            return await flowDynamic('Indícanos tú nombre y apellido.')
        }
    )
    // Solicitar nombres
    .addAction({capture: true},
        async (ctx, { state, fallBack }) => {
            const respuesta = ctx.body
            const nombres = validar_nombres(respuesta)
            if (nombres.valido) {
                await state.update({nombres_usuario: nombres.nombres})
                return;
            } else {
                await new Promise(resolve => setTimeout(resolve, 3000))
                return fallBack(nombres.mensaje)
            }
            
           
        }
    )
    // Registrar
    .addAction(async (ctx, { state, flowDynamic, gotoFlow }) => {
        const info = await state.getMyState()
        
        try {
            

            const insertar = await insertar_cliente(
                                info.nombres_usuario, 
                                ctx.from,
                                info.edad,
                                info.ciudad);
            if (insertar.insertado) {
                console.log('✅ Cliente insertado:', insertar)
            } else {
                console.log('⚠️', insertar.mensaje);
            }
        } catch (error) {
            console.error('❌ Error al insertar cliente:', error);
        }
        const wa = await waitForBaileysInstance(adapterProvider)
        const numero = ctx.from + '@s.whatsapp.net'
        const duracion_escritura = Math.min(`🔔 ¡Ahora sí! *${mayuscula(info.nombres_usuario)}*
        Ya formas parte de los discípulos del monasterio erótico *La Celda Del Monje* 🧘‍♂️💋\n\nIndícanos en qué te podemos ayudar 😏`.length * 400, 3000);
        await wa.sendPresenceUpdate('composing', numero);
        await new Promise(resolve => setTimeout(resolve, duracion_escritura))
        await flowDynamic(`🔔 ¡Ahora sí! *${mayuscula(info.nombres_usuario)}*
 Ya formas parte de los discípulos del monasterio erótico *La Celda Del Monje* 🧘‍♂️💋\n\nIndícanos en qué te podemos ayudar 😏`)
        return gotoFlow(flujo_humano)

    })
   

module.exports = flujo_registrar;