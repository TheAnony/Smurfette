const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const emojis = require('../../emojis.json')
const { pegarDataNow } = require('../../funcoes');
const warningSchema = require('../../Models/SistemaDeWarns');

module.exports = {
    name: "delwarn", // Coloque o nome do comando
    description: "『 MODERAÇÃO 』Delete um warn específico de um membro.", // Coloque a descrição do comando
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'membro',
            description: `Escolha o membro.`,
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'warnid',
            description: 'Informe qual id do warn deseja deletar.',
            type: ApplicationCommandOptionType.Integer,
            required: true,
        }
    ],

    run: async (client, interaction) => {
        const membro = interaction.options.getUser('membro');
        const warnId = interaction.options.getInteger('warnid') - 1;

        await warningSchema.findOne({ GuildID: interaction.guild.id, UserID: membro.id, Username: membro.username }).then(async(data) => {
            if(data) {
                data.Content.splice(warnId, 1);
                data.save();

                interaction.reply({embeds: [
                    new EmbedBuilder()
                    .setColor('Green')
                    .setFooter({ text: membro.username, iconURL: membro.displayAvatarURL({ dynamic: true })})
                    .setDescription(`O warn ${warnId+1} do membro ${membro.username} (${membro.id}) foi deletado com sucesso!`)
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
