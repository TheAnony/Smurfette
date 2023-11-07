const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { QuickDB } = require('quick.db')
const db = new QuickDB();

module.exports = {
  name: "lock-unlock", // Coloque o nome do comando
  description: "『 UTILIDADE 』Bloqueie ou desbloqueie um canal", // Coloque a descrição do comando
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'canal',
      description: `Selecione o canal que deseja bloquear`,
      type: ApplicationCommandOptionType.Channel,
      required: false,
    },
  ],

  run: async (client, interaction) => {
    let cargos = await db.get(`ArrayCargos.roles`)
    let valoresGerados = [];
        for (let index = 0; index < cargos.length; index++) {
          const element = cargos[index]
          valoresGerados.push(element)

        }
    if(!interaction.member.roles.cache.some(role => valoresGerados.includes(role.id))) return interaction.reply('**VOCÊ NÃO TEM A PERMROLE PARA UTILIZAR ESSE COMANDO!**')

    let canal = interaction.options.getChannel('canal') || interaction.channel
    let channelFS = await db.get(`canalFechado_${canal.id}`)

    if(channelFS == true) {
      canal.permissionOverwrites.edit(interaction.guild.id, { SendMessages: true }).then( async() => {
        interaction.reply({ content: `🔓 O canal de texto ${canal} foi bloqueado!`, ephemeral: true})
        canal.send({ content: `🔓 Este canal foi desbloqueado! Utilize \`/lock-unlock\` para bloquear novamente.`})
        await db.set(`canalFechado_${canal.id}`, false)
      })
    } else {
      canal.permissionOverwrites.edit(interaction.guild.id, { SendMessages: false }).then( async() => {
        interaction.reply({ content: `🔒 O canal de texto ${canal} foi desbloqueado!`, ephemeral: true})
        canal.send({ content: `🔒 Este canal foi bloqueado! Utilize novamente \`/lock-unlock\` para desbloquear.`})
        await db.set(`canalFechado_${canal.id}`, true)
    })

}}}