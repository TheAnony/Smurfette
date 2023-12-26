const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const moment = require('moment-timezone');
const emojis = require('../../emojis.json')

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
        try {

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

            if (link) embed.setImage(link);
            if(img) ["gif", 'png', 'mp4', 'jpg'].includes(img.contentType.split('/')[1]) 
            ? embed.setImage(img.url) 
            : interaction.reply({
                content: `${emojis.err} | O formato do arquivo (\`${img.contentType.split('/')[1]}\`) não é válido! Apenas **png, jpeg, gif ou mp4.**`,
                ephemeral: true,
            })
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
        } catch (error) {
            console.log(`ERRO NO REPORTAR-BUG.js: `, error);
        }
    }
}