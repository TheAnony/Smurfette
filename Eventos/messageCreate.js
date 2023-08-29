require('../index')
const { EmbedBuilder} = require('discord.js')
const client = require('../index')
const { QuickDB } = require('quick.db')
const db = new QuickDB();
const ms = require('ms')

client.on("messageCreate", message => {
    if(message.author.bot) return; 
    let mencoes = [`<@${client.user.id}>`, `<@!${client.user.id}>`]
  
    mencoes.forEach(element => {
      if (message.content.toLowerCase() === element) {
  
        let embed = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynaimc: true }) })
        .setDescription(`Olá ${message.author}! Utilize \`/help\` para ver meus comandos!`)
        
        message.reply({ embeds: [embed] })
      }
    })
    
})

client.on("messageCreate", async (message) => {
    let autor = message.author;
    if(autor.bot) return;
    let msg = message.content.toLowerCase();
    let respostas = 
      ['Claro!', 'Com toda certeza que sim!', 'Com toda certeza que não!', 'Talvez... Olha lá :eyes:',
      'Não sei... Desculpe :confounded:', 'Sim!', 'Não!', 'Não sei responder, mas eu amo um cafezinho :coffee: :relaxed:',
      'Olha... Eu tenho minhas suspeitas 🤐', 'Negativo!', 'Positivo!', 'Definitivamente sim!', 'Definitivamente não!',
      'Provavelmente que sim!', "Provavelmente que não!", "Bem, minhas fontes dizem que não!", "Bem, minhas fontes dizem que sim!",
      "Não tenho certeza... Talvez?", "Melhor não dizer agora... :face_with_hand_over_mouth:", "Tudo aponta que sim!",
      "Tudo aponta que não", "Isso está além do que eu sei :confounded:", "https://tenor.com/view/smurfette-winking-girl-eye-wink-smile-the-smurfs-gif-26500522"
    ]  
  
    let num = Math.floor(Math.floor(Math.random() * respostas.length))
    if(msg.startsWith('smurfette') && msg.length > 10) {
      message.reply(respostas[num])
    }
  
  
    //////////////// AFK - AFK - AFK- AFK
    let modoAfk = await db.get(`modoAfk_${autor.id}`);
  
    if(modoAfk === true) {
      message.reply(`**${autor} seu AFK foi desativado!**`).then( (msg) => {
        setTimeout(() => {
          msg.delete()
        }, ms('10s'));
      })
      await db.delete(`modoAfk_${autor.id}`)
      await db.delete(`motivoAfk_${autor.id}`)
    }
  
    let userAfk = message.mentions.members.first();
    if (!userAfk) return;
  
    if(userAfk) {
      let afkMode = await db.get(`modoAfk_${userAfk.id}`);
      if(afkMode === true) {
        let afkMotivo = await db.get(`motivoAfk_${userAfk.id}`);
        message.reply(`**${autor} o usuário ${userAfk.user.username} está AFK!**\nMotivo do AFK: **${afkMotivo}**`).then( (msg) => {
          setTimeout(() => {
            msg.delete()
          }, ms('10s'));
        })
      } else return;
    }
  })