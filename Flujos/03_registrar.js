//Importaciones
const { addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { Mensaje } = require('../utils/strings/mensajesLoader.js')
const { insertar_cliente } = require('../utils/mysql/insertar_cliente.js')
const { mayuscula } = require('../utils/strings/mayuscula.js')
const { validar_nombres } = require('../utils/strings/validar_nombres.js')
const  flujo_humano  = require('./humano.js')
const { es_numero, extraer_numero } = require('../utils/strings/validar_numero.js')

const flujo_registrar = addKeyword(EVENTS.ACTION)
    .addAnswer(`${Mensaje('no_registrado.txt')}\n\nIndique su edad por favor`)

    // Solicitar edad
    .addAction({capture:true}, 
        async (ctx, { state, flowDynamic, endFlow, fallBack }) => {
            const edad_str = ctx.body.trim().toLowerCase();
            const edad = extraer_numero(edad_str)
            

            if (edad !== null && edad >= 18 && edad < 120) {
                await state.update({edad: parseInt(edad)})
                await new Promise(resolve => setTimeout(resolve, 3000))
                return await flowDynamic(`Ahora dinos ¿De qué ciudad nos escribes?`)
            } else if (edad < 18) {
                await new Promise(resolve => setTimeout(resolve, 3000))
                return endFlow(Mensaje('menor_edad.txt'))
            } else {
                return fallBack('Escriba una edad válida')
            }
            
        }
    )
    // Solicitar ciudad
    .addAction({capture:true}, 
        async (ctx, { state, flowDynamic }) => {
            const ciudad = ctx.body.trim().toLowerCase();
            await state.update({ciudad: ciudad})
            await new Promise(resolve => setTimeout(resolve, 3000))
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
        await new Promise(resolve => setTimeout(resolve, 3000))
        await flowDynamic(`🔔 ¡Ahora sí! *${mayuscula(info.nombres_usuario)}*
 Ya formas parte de los discípulos del monasterio erótico *La Celda Del Monje* 🧘‍♂️💋\n\nIndícanos en qué te podemos ayudar 😏`)
        return gotoFlow(flujo_humano)

    })
   

module.exports = flujo_registrar;