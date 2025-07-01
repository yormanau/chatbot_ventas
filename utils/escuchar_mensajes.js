
const waitForBaileysInstance = async (provider, delay = 500) => {
    let yaMostroLog = false; // Para asegurarnos de mostrar el log solo una vez

    while (true) {
        const wa = await provider.getInstance();
        if (wa && wa.ev) return wa;

        if (!yaMostroLog) {
            console.log('⏳ Esperando instancia de Baileys...');
            yaMostroLog = true;
        }

        await new Promise(res => setTimeout(res, delay));
    }
};

const escuchar_mensajes = async (provider, bot) => {
    try {
        const wa = await waitForBaileysInstance(provider);
        console.log('✅ Instancia de Baileys lista');
      
        wa.ev.on('messages.upsert', async (msg) => {
            const mensaje = msg.messages?.[0];
            const remoteJid = mensaje?.key?.remoteJid;

            // Ignorar mensajes de grupos
            if (remoteJid?.endsWith('@g.us')) {
                //console.log('🚫 Mensaje de grupo ignorado:', remoteJid);
                return;
            }
            
            const numero = mensaje?.key?.remoteJid;
            const texto = mensaje?.message?.conversation || mensaje?.message?.extendedTextMessage?.text;
            const esDelBot = mensaje?.key?.fromMe;

            /*
            if (texto?.toLowerCase().includes('menu')) {
                console.log('MENÚ DETECTADO');
                try {
                    await wa.sendMessage(numero, {
                        text: '📦 ¿Qué deseas hacer?',
                        footer: 'Selecciona una opción',
                        templateButtons: [
                            { index: 1, quickReplyButton: { displayText: '🛒 Ver productos', id: 'ver_productos' } },
                            { index: 2, quickReplyButton: { displayText: '💬 Hablar con asesor', id: 'hablar_asesor' } },
                            { index: 3, quickReplyButton: { displayText: '📍 Ver ubicación', id: 'ver_ubicacion' } }
                        ]
                    }, { quoted: mensaje });
                } catch (error) {
                    console.error('❌ Error enviando menú:', error);
                }
            }
            */
            //if (!texto) return;
            if (!texto || typeof texto !== 'string') return;
            // ✅ Reaccionar si el usuario dice "gracias"
            if (!esDelBot && texto?.toLowerCase().includes('gracias')) {
                const tiempoPorCaracter = 400; // milisegundos
                const texto = '¡De nada! 😊 Estamos para ayudarte.'
                // Simular "escribiendo" proporcional al texto
                const duracion_escritura = Math.min(texto.length * tiempoPorCaracter, 3000);
                // Reacciona con un emoji ❤️ al mensaje original
                await new Promise(resolve => setTimeout(resolve, 1500))
                await wa.sendMessage(numero, {
                    react: {
                        text: '❤️',
                        key: mensaje.key
                    }
                });
                await new Promise(resolve => setTimeout(resolve, 3000))
                // Responde citando el mensaje original
                await wa.sendPresenceUpdate('composing', numero);
                await new Promise(resolve => setTimeout(resolve, duracion_escritura))
                await wa.sendMessage(numero, {
                    text: texto,
                }, { quoted: mensaje });

                console.log(`✅ Reacción y respuesta enviada al mensaje: "${texto}"`);
            }

            const frase_clave = 'Nos alegra mucho haberte ayudado a llegar al clímax que tanto deseas. 😊 Damos por finalizada la conversación 👋, te esperamos nuevamente'
    
            if (esDelBot && texto === frase_clave) {
                console.log('Activado')
                
                const realBot = await bot;
                const numLimpio = numero.replace('@s.whatsapp.net', '');

                // Accede directamente al Map
                const rawState = realBot.stateHandler.STATE.get(numLimpio);
                console.log('🔍 Estado antes:', rawState);

                // Verifica si es función y la ejecuta
                const parsedState = typeof rawState === 'function' ? rawState() : rawState;
              
                // Modifica el estado localmente
                parsedState.bot_pausado = false;

                // Actualiza directamente el Map
                realBot.stateHandler.STATE.set(numLimpio, parsedState);

                // Verifica el cambio
                const updatedState = realBot.stateHandler.STATE.get(numLimpio);
                console.log('✅ Estado después:', updatedState);
            }
        });
    } catch (err) {
        console.error(err.message)
    }
}

module.exports = {escuchar_mensajes, waitForBaileysInstance};