require('../index')
const client = require('../index')
const { EmbedBuilder } = require('discord.js')
const Petition = require('../Models/Peticao')
const emojis = require('../emojis.json')
const { petitionProgressBar } = require('../utils/petitionProgressBar');

client.on("interactionCreate", async interaction => {
    if (!interaction.isButton()) return;
    if (interaction.user.bot) return;

    const [type, petitionId, action] = interaction.customId.split('.');
    if (!type || !petitionId || !action) return;
    if (type !== 'sign') return;

    await interaction.deferReply({ ephemeral: true });
    const alvoPetition = await Petition.findOne({ petitionId })
    let alvoMessage = await interaction.channel.messages.fetch(alvoPetition.progressMessageId);
    let alvoMessageEmbed = alvoMessage.embeds[0];

    switch (action) {
        case "new": {
            if (alvoPetition.signedUsers.includes(interaction.user.id)) {
                await interaction.editReply(`${emojis.err} | Você já assinou nessa petição!`)
                return;
            }

            if (interaction.user.id === alvoPetition.authorId) {
                await interaction.editReply(`${emojis.err} | Você não pode assinar na sua própria petição! Seria injusto, não?`)
                return;
            }

            alvoPetition.signedUsers.push(interaction.user.id)
            alvoPetition.signatures++

            await alvoPetition.save();

            interaction.editReply(`${emojis.check} | Petição assinada com sucesso!`);

            if (alvoPetition.goal === alvoPetition.signatures) {
                alvoMessageEmbed.data.color = 0x3cff00;
                alvoMessageEmbed.fields[0].value = petitionProgressBar(alvoPetition.signatures, alvoPetition.goal);
                alvoMessageEmbed.data.title = `${alvoPetition.title} (META ATINGIDA)`
                alvoMessage.components[0].components[0].data.disabled = true
                alvoMessage.components[0].components[1].data.disabled = true
            }

            alvoPetition.goal - alvoPetition.signatures == 1
                ? alvoMessageEmbed.data.description = `**${alvoPetition.description}**\n\n> PROGRESSO:\n> ${alvoPetition.signatures}/${alvoPetition.goal} assinaturas (falta mais um!)`
                : alvoMessageEmbed.data.description = `**${alvoPetition.description}**\n\n> PROGRESSO:\n> ${alvoPetition.signatures}/${alvoPetition.goal} assinaturas`

            alvoMessage.edit({ embeds: [alvoMessageEmbed], components: [alvoMessage.components[0]] })


        } break;

        case "cancel": {
            if (!interaction.memberPermissions.has('Administrator') && interaction.user.id !== alvoPetition.authorId) {
                await interaction.editReply(`${emojis.err} | Você não tem a permissão de \`Administrador!\` ou é dono dessa petição!`)
                return;
            };

            alvoMessageEmbed.data.color = 0xff6161;
            alvoMessageEmbed.fields[0].value = petitionProgressBar(0, alvoPetition.goal);
            alvoMessageEmbed.data.description = `**Petição cancelada!**`
            alvoMessage.components[0].components[0].data.disabled = true
            alvoMessage.components[0].components[1].data.disabled = true

            alvoMessage.edit({ embeds: [alvoMessageEmbed], components: [alvoMessage.components[0]] });

            await interaction.editReply(`${emojis.err} | Petição cancelada com sucesso!`);

        } break;
        default: break;

    }

})