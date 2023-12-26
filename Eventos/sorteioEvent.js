require('../index')
const client = require('../index')
const { QuickDB } = require('quick.db')
const db = new QuickDB();
const GuildConfig = require('../Models/GuildConfig');
const Sorteios = require('../Models/Sorteios');

client.on('messageCreate', async message => {
    ////////////////// SORTEIO CLAIM - SORTEIO CLAIM - SORTEIO CLAIM - SORTEIO CLAIM
    let autor = message.author
    if(autor.bot) return;

    const guildConfig = await GuildConfig.findOne({ guildId: message.guild.id });
    const sorteios = await Sorteios.findOne({ guildId: message.guild.id })

    const canal = client.channels.cache.get(guildConfig?.canalDeSorteioID);
    if(message.channel.id !== guildConfig.chatGeral) return
  
    let host = await db.get(`host`)
    let g = sorteios.ganhadores
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
      if(condição && condição2 && autor.id === sorteios.ganhadores[0]) {
          canal.send(`O ganhador <@!${sorteios.ganhadores[0]}> deu claim! Ele já pode resgatar seu prêmio.`)
          await db.delete('host')
          sorteios.ganhadoresNoClaim = null
          sorteios.save()
          await db.delete(`tempoClaim`)
      }
  
     } else {
      //////////////// MAIS DE UM GANHADOR - MAIS DE UM GANHADOR - MAIS DE UM GANHADOR- MAIS DE UM GANHADOR
      if(condição && condição2 && sorteios.ganhadores.includes(autor.id)) {
        canal.send(`O ganhador ${autor} deu claim! Ele(a) já pode resgatar seu prêmio.`)
        sorteios.ganhadoresNoClaim = sorteios.ganhadoresNoClaim.filter(id => id !== autor)
        sorteios.save()
      }
     }
  })