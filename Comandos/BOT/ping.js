const { EmbedBuilder, ApplicationCommandType } = require("discord.js")

module.exports = {
  name: "ping",
  description: "『 BOT 』Veja o ping do bot.",
  type: ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    if (interaction.user.id === "492117896672313353") return interaction.reply('Ainda não, B4LACO')

    let ping = Math.abs(client.ws.ping)

    let embed_1 = new EmbedBuilder()
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setDescription(`Olá ${interaction.user}, meu ping está em \`calculando...\`.`)
      .setColor("Random");

    let embed_2 = new EmbedBuilder()
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setDescription(`Olá ${interaction.user}, meu ping está em \`${ping}ms\`.`)
      .setColor("Random");

    interaction.reply({ embeds: [embed_1] }).then(() => {
      setTimeout(() => {
        interaction.editReply({ embeds: [embed_2] })
      }, 2000)
    })
  }
}
