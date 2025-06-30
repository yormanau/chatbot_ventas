
const waitForBaileysInstance = async (provider, maxAttempts = 1000, delay = 500) => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const wa = await provider.getInstance();
        if (wa && wa.ev) return wa;

        console.log(`⏳ Esperando instancia de Baileys... intento ${attempt}`);
        await new Promise(res => setTimeout(res, delay));
    }
    throw new Error('❌ No se pudo obtener la instancia de Baileys después de varios intentos');
};
const escuchar_mensajes = async (provider, bot) => {
    try {
        const wa = await waitForBaileysInstance(provider);
        console.log('✅ Instancia de Baileys lista');
      
        wa.ev.on('messages.upsert', async (msg) => {
            const mensaje = msg.messages?.[0];
            const numero = mensaje?.key?.remoteJid;
            const texto = mensaje?.message?.conversation || mensaje?.message?.extendedTextMessage?.text;
            const esDelBot = mensaje?.key?.fromMe;
        
            if (!texto) return;
            const frase_clave = 'Nos alegra mucho haberte ayudado a llegar al clímax que tanto deseas. Damos por finalizada la conversación.'
    
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

module.exports = escuchar_mensajes;