const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const moment = require('moment-timezone');

module.exports = {
    name: "reportar",
    description: "『 Utilidade 』Reporte um bug do bot",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "bug",
            description: "Digite sobre o bug",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "link",
            description: "digite o link de uma imagem do bug",
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: "imagem",
            description: "Envie uma imagem do bug",
            type: ApplicationCommandOptionType.Attachment,
            required: false,
        }
    ],

    run: async (client, interaction) => {
        const bug = interaction.options.getString("bug");
        const link = interaction.options.getString("link");
        const img = interaction.options.getAttachment("imagem");

        const embed = new EmbedBuilder()
            .setColor("#810ce8")
            .setTitle(`❌ | Novo Bug descoberto!`)
            .addFields(
                {
                    name: '⭐ | Denunciante:',
                    value: `\`\`\`${interaction.user.username}\`\`\``,
                    inline: true
                },
                { name: '\u0020', value: `\u0020`, inline: true },
                {
                    name: '🛡️ | Servidor de origem:',
                    value: `\`\`\`${interaction.guild.name}\`\`\``,
                    inline: true
                },
                {
                    name: '🔎 | Bug denunciado:',
                    value: `\`\`\`${bug}\`\`\``
                },
                {
                    name: '🕐 | Data de emissão',
                    value: `\`\`\`${moment().utc().tz('America/Sao_Paulo').format('DD/MM/Y - HH:mm:ss')}\`\`\``,
                },
            )

        link ? embed.setImage(link) : null
        img ? embed.setImage(img) : null

        try {
            const channel = client.channels.cache.get('1134136980163281048');
            await channel.send({ embeds: [embed] });
            await interaction.reply({
                content: "Bug reportado com sucesso!",
                ephemeral: true,
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content:
                    "Houve um erro ao enviar seu relatório. Tente novamente mais tarde.",
                ephemeral: true,
            });
        }
    }
}