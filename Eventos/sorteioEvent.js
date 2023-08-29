require('../index')
const client = require('../index')
const { QuickDB } = require('quick.db')
const db = new QuickDB();

client.on('messageCreate', async (message) => {
    ////////////////// SORTEIO CLAIM - SORTEIO CLAIM - SORTEIO CLAIM - SORTEIO CLAIM
    let autor = message.author
  
    const canal = client.channels.cache.get('1136673955063808140')
    if(message.channel.id !== '921107172316815414') return
  
    let host = await db.get(`host`)
    let g = await db.get(`ganhadorSorteio.ganhadores`)
    let claim = await db.get(`tempoClaim`)
    
    if(!host || !g || !claim) return
  
    let msg1 = message.content.toLowerCase().trim()
    let condição = msg1.startsWith(`<@${host}> `) || msg1.startsWith(`<@!${host}> `)
    let condição2 = msg1.endsWith("claim") || msg1.endsWith("claim!") || msg1.endsWith("claim.")
    let ganhadores = [];
        for (let i = 0; i < g.length; i++) {
          let element = g[i]
          ganhadores.push(element)
        }
      
     if (ganhadores.length == 1) { 
      //////////////// 1 GANHADOR - 1 GANHADOR - 1 GANHADOR- 1 GANHADOR
      if(condição && condição2 && autor.id === ganhadores[0]) {
          canal.send(`O ganhador <@!${ganhadores}> deu claim! Ele já pode resgatar seu prêmio.`)
          await db.delete('host')
          await db.delete(`${`ganhadorSorteio.ganhadores`}`)
          await db.delete(`tempoClaim`)
      }
  
     } else {
      //////////////// MAIS DE UM GANHADOR - MAIS DE UM GANHADOR - MAIS DE UM GANHADOR- MAIS DE UM GANHADOR
      if(condição && condição2 && ganhadores.includes(autor.id)) {
        canal.send(`O ganhador ${autor} deu claim! Ele já pode resgatar seu prêmio.`)
        await db.delete(`${autor.id}`)
      }
     }
  })