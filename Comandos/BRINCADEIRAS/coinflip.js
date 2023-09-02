const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { QuickDB } = require('quick.db')
const db = new QuickDB();
// const emojis = require('../../emojis.json')

module.exports = {
    name: "coinflip", // Coloque o nome do comando
    description: "『 BRINCADEIRAS 』Gire uma moeda e veja se vai cair cara ou coroa!", // Coloque a descrição do comando
    type: ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        let cateto = ['cara', 'coroa'];
        let resposta = cateto[Math.floor(Math.random() * 2)];

        interaction.reply(`**🪙 A moeda foi lançada para o alto e deu...**`).then((msg) => {
            setTimeout(() => {
                switch (resposta) {
                    case 'cara':
                        interaction.editReply(`**🪙 A moeda foi lançada para o alto e deu...**\nCara!`)
                        break;

                    case 'coroa':
                        interaction.editReply(`**🪙 A moeda foi lançada para o alto e deu...**\nCoroa!`)
                        break;

                    default:
                        break;
                }
            }, 2000);
        })
    }
}