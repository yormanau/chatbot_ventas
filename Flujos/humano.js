// flows/humano.js
const { addKeyword } = require('@bot-whatsapp/bot');
const { waitForBaileysInstance } = require('../utils/escuchar_mensajes.js')
const adapterProvider = require('../app.js')

const flujo_humano = addKeyword(['humano', 'asesor', 'hablar con alguien'])
    .addAction(async (ctx, { state, flowDynamic }) => {
        const wa = await waitForBaileysInstance(adapterProvider)
        const numero = ctx.from + '@s.whatsapp.net'
        const duracion_escritura = Math.min('👤 Te atenderá nuestro Abad *El Monje*, escríbele tus inquietudes.'.length * 400, 5000);

        await state.update({ bot_pausado: true });
        await new Promise(resolve => setTimeout(resolve, 1500))
        await wa.sendPresenceUpdate('composing', numero);
        await new Promise(resolve => setTimeout(resolve, duracion_escritura))
        await flowDynamic('👤 Te atenderá nuestro Abad *El Monje*, escríbele tus inquietudes.');
    });

const flujo_activar = addKeyword(['activar bot'])
    .addAction(async (ctx, { state, flowDynamic }) => {
        await state.update({ bot_pausado: false });
        await new Promise(resolve => setTimeout(resolve, 3000))
        await flowDynamic('✅ El bot ha sido reactivado. Puedes continuar.');
    });

module.exports = flujo_humano, flujo_activar;
