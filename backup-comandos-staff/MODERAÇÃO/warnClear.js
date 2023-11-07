const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const emojis = require('../../emojis.json')
const warningSchema = require('../../Models/SistemaDeWarns');

module.exports = {
    name: "clearwarns", // Coloque o nome do comando
    description: "『 MODERAÇÃO 』Apaga todos os warns de um membro.", // Coloque a descrição do comando
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'membro',
            description: `Escolha o membro para apagar suas warns.`,
            type: ApplicationCommandOptionType.User,
            required: true,
        },
    ],

    run: async (client, interaction) => {
        const membro = interaction.options.getUser('membro');

        await warningSchema.findOne({ GuildID: interaction.guild.id, UserID: membro.id, Username: membro.username }).then(async (data) => {
            if (data.Content.length !== 0) {
                await warningSchema.updateOne({ GuildID: interaction.guild.id, UserID: membro.id, Username: membro.username }, { $set: { Content: [] } });

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Green')
                            .setFooter({ text: membro.username, iconURL: membro.displayAvatarURL({ dynamic: true }) })
                            .setDescription(`Os warns do membro ${membro.username} (${membro.id}) foram deletados com sucesso!`)
                    ]
                })
            } else {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Blurple')
                            .setFooter({ text: membro.username, iconURL: membro.displayAvatarURL({ dynamic: true }) })
                            .setDescription(`\`\`\`O usuário ${membro.username} (${membro.id}) não possui warns\`\`\``)
                    ]
                })
            }
        }).catch((err) => {
            console.log(err);
        })
    }
}
