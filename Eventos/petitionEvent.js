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
    const alvoMessage = await interaction.channel.messages.fetch(alvoPetition.progressMessageId);
    console.log(alvoMessage.embeds[0].description);
    const alvoMessageEmbed = alvoMessage.embeds[0];

    switch (action) {
        case "new": {
            if (alvoPetition.signedUsers.includes(interaction.user.id)) {
                await interaction.editReply(`${emojis.err} | Você já assinou nessa petição!`)
                return;
            }

            alvoPetition.signedUsers.push(interaction.user.id)
            alvoPetition.signatures++

            await alvoPetition.save();

            interaction.editReply(`${emojis.check} | Petição assinada com sucesso!`);

            alvoMessageEmbed.fields[0].value = petitionProgressBar(alvoPetition.signatures, alvoPetition.goal)

            alvoMessage.edit({embeds: [alvoMessageEmbed]})


        } break;

        case "cancel": {

        } break;
        default: break;

    }

})