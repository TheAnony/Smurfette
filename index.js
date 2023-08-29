const Discord = require("discord.js")
const config = require("./config.json")
const client = new Discord.Client({ intents: [
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildEmojisAndStickers,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.DirectMessages,
    Discord.GatewayIntentBits.GuildIntegrations,
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildMessageReactions,
    Discord.GatewayIntentBits.GuildPresences,
    Discord.GatewayIntentBits.GuildModeration,
    Discord.GatewayIntentBits.GuildWebhooks,
    Discord.GatewayIntentBits.GuildScheduledEvents
] });
const ms = require('ms');
const fs = require('fs')
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = client;
client.slashCommands = new Discord.Collection()

require('./handler')(client)

client.login(config.token)

client.on('ready', async () => {

  console.log(`Estou online em ${client.user.username}!`)

  let atividades = [
    `🤖 | 1º Bot oficial da Família Smurf!`,
    `❓ | Precisa de ajuda? Use /help!`,
    `☕ | Nada melhor do que um cafézinho!`,
    `🧎 | Cuidando de ${client.users.cache.filter(member => !member.bot).size} usuários!`,
    `📶 | Atualmente eu tenho 51 comandos. Que tal experimentar um?!`
  ]
  i = 0;
  setInterval(() => {
    client.user.setActivity(atividades[i++ % atividades.length])
  }, ms('15s'));
})

client.on('interactionCreate', (interaction) => {
  if(interaction.user.bot) return;
    
    if(interaction.type === Discord.InteractionType.ApplicationCommand){
        
        const cmd = client.slashCommands.get(interaction.commandName);

      if (!cmd) return interaction.reply(`Error`);

      interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);

      try {
        cmd.run(client, interaction)
      } catch (error) {
       console.log(error)
      }

   }
})

fs.readdir('./Eventos', (err, file) => {
  file.forEach(event => {
    require(`./Eventos/${event}`)
  })
})


