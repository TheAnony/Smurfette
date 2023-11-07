const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const emojis = require('../../emojis.json')
const { pegarDataNow } = require('../../funcoes');
const warningSchema = require('../../Models/SistemaDeWarns');

module.exports = {
    name: "warn", // Coloque o nome do comando
    description: "『 MODERAÇÃO 』Aplique um aviso a um membro.", // Coloque a descrição do comando
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'membro',
            description: `Escolha o membro para ser punido.`,
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'motivo',
            description: `Diga o motivo da punição.`,
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    run: async (client, interaction) => {
        const membro = interaction.options.getUser('membro');
        const motivo = interaction.options.getString('motivo');
        const warnDate = pegarDataNow();

        await warningSchema.findOne({ GuildID: interaction.guild.id, UserID: membro.id, Username: membro.username }).then(async (data) => {
            if (!data) {
                data = new warningSchema({
                    GuildID: interaction.guild.id,
                    UserID: membro.id,
                    Username: membro.username,
                    Content: [{
                        ModeradorID: interaction.user.id,
                        ModeradorUsername: interaction.user.username,
                        Motivo: motivo,
                        Data: warnDate
                    }]
                })
            } else {
                const warnContent = {
                    ModeradorID: interaction.user.id,
                    ModeradorUsername: interaction.user.username,
                    Motivo: motivo,
                    Data: warnDate
                }
                data.Content.push(warnContent)
            }
            data.save();


            let embed = new EmbedBuilder()
                .setColor('Red')
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setTitle('⚠️ | VOCÊ FOI AVISADO!')
                .setFields(
                    {
                        name: `${emojis.staff} | Autor do warn:`,
                        value: `\u2800\u2a65 ${interaction.user.username} (${interaction.user.id})`,
                        inline: true
                    },
                    {
                        name: `✅ | Motivo do warn:`,
                        value: `\u2800\u2a65 \`${motivo}\``,
                        inline: true
                    }
                )
                .setFooter({ text: `🕒 | ${warnDate}` });

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setTitle(`⚠️ | Warn aplicado`)
                        .addFields(
                            {
                                name:
                                    `${membro.bot ? emojis.bot : emojis.user} | ${!membro.bot ? 'Usuário avisado: ' : 'Bot avisado:'}`, value: `\u2800\u2a65 ${!membro.bot ? 'Usuário:' : 'Bot:'} ${membro.username} (${membro.id})\n\u2800\u2a65 Motivo: ${motivo}\n\n`
                            },
                            {
                                name:
                                    `<:DiscordStaff:1134126501672009810> | Autor do warn:`, value: `\u2800\u2a65 Staff: ${interaction.user.username} (${interaction.user.id})`
                            }
                        )
                        .setThumbnail(membro.displayAvatarURL({ dynamic: true, size: 2048 }))
                        .setFooter({ text: `🕒 | ${warnDate}` })
                ]
            })

            try { await membro.send({ embeds: [embed] }) } catch (error) { };
        }).catch((err) => {
            console.log(err);
        })
    }
}
