const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ChannelType } = require("discord.js")
const { QuickDB } = require('quick.db')
const db = new QuickDB();

module.exports = {
    name: "contagem", // Coloque o nome do comando
    description: "『 UTILIDADE 』Inicia a brincadeira de contar.", // Coloque a descrição do comando
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'canal',
            description: `Configura o canal onde iniciará a contagem.`,
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
    ],

    run: async (client, interaction) => {
        let canal = interaction.options.getChannel('canal')
        if (canal.type !== ChannelType.GuildText || !canal) return interaction.reply({ content: `**❌ | CANAL DE TEXTO INVÁLIDO!**`, ephemeral: true })

        await db.set(`channelCount`, canal.id)
        interaction.reply(`✅ | O canal ${canal} foi configurado com sucesso!`).catch((err) => {
            interaction.reply(`❌ | Ocorreu um erro ao configurar o canal!`)
        });
    }
}