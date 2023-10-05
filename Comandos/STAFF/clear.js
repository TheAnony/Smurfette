const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js")

module.exports = {
  name: "clear", // Coloque o nome do comando
  description: "『 UTILIDADE 』Apaga as mensagens de um canal específico.", // Coloque a descrição do comando
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'quantia-de-mensagens',
      description: `Defina quantas mensagens devem ser apagadas no chat! (limite:100)`,
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],

  run: async (client, interaction) => {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) return interaction.reply({ ephemeral: true, content: `**Você não tem permissão de utilizar este comando!**` })

    const num = interaction.options.getInteger(`quantia-de-mensagens`)

    if (num > 100 || num < 1) return interaction.reply({ ephemeral: true, content: `**Máximo de mensagens ultrapassado! (limite: 100)**` })


    let embedOk = new EmbedBuilder()
      .setColor('Green')
      .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
      .setDescription(`(:white_check_mark:) um total de ${num} mensagens foram apagadas!\n\nReponsável por apagar as mensagens: \`\`${interaction.user.username}\`\``)
      .setTimestamp(Date.now())

    let embedERR = new EmbedBuilder()
      .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
      .setColor('Red')
      .setDescription(`(:x:) Não foi possível apagar ${num} mensagens! Verifique se as mensagens foram enviadas em menos de uma semana.`)
      .setTimestamp(Date.now())

    await interaction.channel.bulkDelete(num).catch((err) => {
      interaction.reply({embeds: [embedERR]})
      setTimeout(() => {
        interaction.deleteReply()
      }, 5000);
    })

    await interaction.reply({ embeds: [embedOk] }).then(() => {
      setTimeout(() => {
        interaction.deleteReply()
      }, 5000);
    }).catch((error) => { interaction.editReply({ embeds: [embedERR] }); console.log(error) })



  }
}