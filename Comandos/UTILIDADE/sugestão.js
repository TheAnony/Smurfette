const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { QuickDB } = require('quick.db')
const db = new QuickDB();

module.exports = {
  name: "", // Coloque o nome do comando
  description: "『 UTILIDADE 』", // Coloque a descrição do comando
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: '',
      description: ``,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client, interaction) => {

  }
}