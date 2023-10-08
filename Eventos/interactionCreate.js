require('../index')
const { EmbedBuilder } = require('discord.js')
const client = require('../index')
const Sugestao = require('../Models/Sugestao')
const emojis = require('../emojis.json')
const { formatarResultados } = require('../utils/formatarResultados')

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton() || !interaction.customId) return;

    try {
        const [type, sugestaoId, action] = interaction.customId.split('.');
        if (!type || !sugestaoId || !action) return;
        if (type !== 'sugestao') return;

        await interaction.deferReply({ ephemeral: true });

        const alvoSugestao = await Sugestao.findOne({ sugestaoId });
        const alvoMessage = await interaction.channel.messages.fetch(alvoSugestao.messageId);
        const alvoMessageEmbed = alvoMessage.embeds[0];

        switch (action) {
            case 'approve': {
                if (!interaction.memberPermissions.has('Administrator')) {
                    await interaction.editReply(`${emojis.err} | Você não tem a permissão de \`Administrador!\``)
                    return;
                }

                alvoSugestao.status = 'approve';

                alvoMessageEmbed.data.color = 0x84e660;
                alvoMessageEmbed.fields[1].value = `${emojis.checkForTitle} Aprovado!`;

                await alvoSugestao.save();

                interaction.editReply(`Sugestão aprovada!`);

                alvoMessage.edit({ embeds: [alvoMessageEmbed], components: [alvoMessage.components[0]] });
            } break;

            case 'reject': {
                if (!interaction.memberPermissions.has('Administrator')) {
                    await interaction.editReply(`${emojis.err} | Você não tem a permissão de \`Administrador!\``)
                    return;
                };

                alvoSugestao.status = 'reject';

                alvoMessageEmbed.data.color = 0xff6161;
                alvoMessageEmbed.fields[1].value = `${emojis.errForTitle} Reprovado!`;

                await alvoSugestao.save();

                interaction.editReply(`Sugestão reprovada!`);

                alvoMessage.edit({ embeds: [alvoMessageEmbed], components: [alvoMessage.components[0]] });
            } break;

            case 'upvote': {
                const jaVotou = alvoSugestao.upvotes.includes(interaction.user.id) || alvoSugestao.downvotes.includes(interaction.user.id);

                if (jaVotou) {
                    await interaction.editReply(`${emojis.err} | Você já votou para esta sugestão!`)
                    return;
                }

                alvoSugestao.upvotes.push(interaction.user.id);

                await alvoSugestao.save();

                interaction.editReply(`${emojis.check} | Enviado upvote com sucesso!`);

                alvoMessageEmbed.fields[2].value = formatarResultados(
                    alvoSugestao.upvotes, alvoSugestao.downvotes
                );

                alvoMessage.edit({
                    embeds: [alvoMessageEmbed]
                });
            } break;

            case 'downvote': {
                const jaVotou = alvoSugestao.upvotes.includes(interaction.user.id) || alvoSugestao.downvotes.includes(interaction.user.id);

                if (jaVotou) {
                    await interaction.editReply(`${emojis.err} | Você já votou para esta sugestão!`)
                    return;
                }

                alvoSugestao.downvotes.push(interaction.user.id);

                await alvoSugestao.save();

                interaction.editReply(`${emojis.check} | Enviado upvote com sucesso!`);

                alvoMessageEmbed.fields[2].value = formatarResultados(
                    alvoSugestao.upvotes, alvoSugestao.downvotes
                );

                alvoMessage.edit({
                    embeds: [alvoMessageEmbed]
                });
            } break;

            default: break;
        }
    } catch (error) {
        console.log(`ERRO NO EVENTO interactionCreate, na parte de sugestão. ${error}`);
    }
})