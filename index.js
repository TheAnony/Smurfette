const Discord = require("discord.js")
const config = require("./config.json")
const fs = require('fs');
const ms = require('ms');
const { QuickDB } = require('quick.db')
const db = new QuickDB();
const mongoose = require("mongoose");

const client = new Discord.Client({
  intents: [1, 512, 32768, 2, 128,
    Discord.IntentsBitField.Flags.DirectMessages,
    Discord.IntentsBitField.Flags.GuildInvites,
    Discord.IntentsBitField.Flags.GuildMembers,
    Discord.IntentsBitField.Flags.GuildPresences,
    Discord.IntentsBitField.Flags.Guilds,
    Discord.IntentsBitField.Flags.MessageContent,
    Discord.IntentsBitField.Flags.Guilds,
    Discord.IntentsBitField.Flags.GuildMessageReactions,
    Discord.IntentsBitField.Flags.GuildEmojisAndStickers
  ],
  partials: [
    Discord.Partials.User,
    Discord.Partials.Message,
    Discord.Partials.Reaction,
    Discord.Partials.Channel,
    Discord.Partials.GuildMember
  ]
});

module.exports = client

client.on('interactionCreate', (interaction) => {
  if (interaction.type === Discord.InteractionType.ApplicationCommand) {

    const cmd = client.slashCommands.get(interaction.commandName);

    if (!cmd) return interaction.reply(`Error`);

    interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);

    cmd.run(client, interaction).catch((error) => console.log(error.code))
  }
})

client.slashCommands = new Discord.Collection()

require('./handler')(client)

client.login(config.token)

client.on('ready', async () => {
  console.clear();
  console.time('tempo-de-inicializacao-do-bot')
  console.log(`Estou online em ${client.user.username}!`)

  let atividades = [
    `🤖 | 1º Bot oficial da Família Smurf!`,
    `❓ | Precisa de ajuda? Use /help!`,
    `☕ | Nada melhor do que um cafézinho!`,
    `🧎 | Cuidando de ${client.users.cache.filter(member => !member.bot).size} usuários!`,
    `📶 | Atualmente eu tenho 31
     comandos. Que tal experimentar um?!`
  ]
  i = 0;
  setInterval( async() => {
    let atv = await db.get(`atv`)
    if(atv == 'on') return;
    client.user.setActivity(atividades[i++ % atividades.length])
  }, ms('15s'));
  console.timeEnd('tempo-de-inicializacao-do-bot')
})

client.on('ready', async () => {
  console.time('tempo-de-inicializacao-da-database')
  mongoose.set('strictQuery', true);

  await mongoose.connect(config.mongoDB)
  let conectado = await mongoose.connect(config.mongoDB)
  if(conectado) console.log(`Conectado com a database com sucesso!`)
  console.timeEnd('tempo-de-inicializacao-da-database')
})

fs.readdir('./Eventos', (err, file) => {
  file.forEach(event => {
    require(`./Eventos/${event}`)
  })
})