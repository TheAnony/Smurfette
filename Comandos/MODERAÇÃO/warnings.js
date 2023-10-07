const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const emojis = require('../../emojis.json')
const { pegarDataNow } = require('../../funcoes');
const warningSchema = require('../../Models/SistemaDeWarns');

module.exports = {
    name: "warnings", // Coloque o nome do comando
    description: "『 MODERAÇÃO 』Veja a auditoria de avisos do membro.", // Coloque a descrição do comando
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'membro',
            description: `Escolha o membro para visualizar os logs dele.`,
            type: ApplicationCommandOptionType.User,
            required: true,
        },
    ],

    run: async (client, interaction) => {
        const membro = interaction.options.getUser('membro');

        await warningSchema.findOne({ GuildID: interaction.guild.id, UserID: membro.id, Username: membro.username }).then(async(data) => {
            if(data || data.Content.length !== 0) {
                interaction.reply({embeds: [
                    new EmbedBuilder()
                    .setColor('Blurple')
                    .setFooter({ text: membro.username, iconURL: membro.displayAvatarURL({ dynamic: true })})
                    .setTitle(`Warns: ${data.QuantiaDeWarns}`)
                    .setDescription(`${data.Content.map((w, i) => 
                            `**${emojis.ID} ${i + 1}:** \`${w.Data}\`\nAutor do aviso: **${w.ModeradorUsername} (${w.ModeradorID})**\nMotivo: **${w.Motivo}**\n\n`
                    ).join(" ")}`)
                ]})
            } else {
                interaction.reply({embeds: [
                    new EmbedBuilder()
                    .setColor('Blurple')
                    .setFooter({ text: membro.username, iconURL: membro.displayAvatarURL({ dynamic: true })})
                    .setDescription(`\`\`\`O usuário ${membro.username} (${membro.id}) não possui warns\`\`\``)
                ]})
            }
        }).catch((err) => {
            console.log(err);
        })
    }
}
