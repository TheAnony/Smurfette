const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ChannelType } = require("discord.js")
const emojis = require('../../emojis.json')
const GuildConfig = require('../../Models/GuildConfig');

module.exports = {
    name: "config-div", // Coloque o nome do comando
    description: "『 CONFIG 』", // Coloque a descrição do comando
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'adicionar',
            description: '『 CONFIG 』Adicione um canal de divulgações',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'canal',
                    description: 'Escolha qual canal será configurado.',
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildText],
                    required: true
                }
            ]
        },
        {
            name: 'remover',
            description: '『 CONFIG 』Remova um canal de divulgações',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'canal',
                    description: '『 CONFIG 』Escolha o canal que será removido.',
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildText],
                    required: true
                }
            ]
        }
    ],

    run: async (client, interaction) => {
        let guildConfig = await GuildConfig.findOne({ guildId: interaction.guild.id });

        if (!guildConfig) {
            guildConfig = new GuildConfig({ guildId: interaction.guild.id })
        };

        const subcomando = interaction.options.getSubcommand();

        switch (subcomando) {
            case 'adicionar': {
                const canal = interaction.options.getChannel('canal');

                if (guildConfig.canaisDeSugestoesIDs === canal.id) {
                    await interaction.reply({ ephemeral: true, content: `${emojis.err} | Ei! O canal ${canal} já está configurado como o canal de divulgações!` })
                    return;
                }

                guildConfig.canaisDeSugestoesIDs = canal.id
                await guildConfig.save();

                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Green')
                            .setTitle(`${emojis.checkForTitle} | O canal ${canal} foi configurado com sucesso!`)
                            .setDescription(`> Se deseja remover este canal, utilize \`/config-div remover\`!`)
                    ]
                })
            } break;

            case 'remover': {
                const canal = interaction.options.getChannel('canal');

                if (!guildConfig.canaisDeSugestoesIDs === canal.id) {
                    await interaction.reply({ ephemeral: true, content: `${emojis.err} | Ei! O canal ${canal} não está configurado como o canal de divulgações!` })
                    return;
                }

                guildConfig.canaisDeSugestoesIDs = null
                await guildConfig.save();

                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Green')
                            .setTitle(`${emojis.checkForTitle} | O canal ${canal} foi removido com sucesso!`)
                            .setDescription(`> Se deseja adicionar este canal novamente, utilize \`/config-div adicionar\`!`)
                    ]
                })
            } break;

            default: break;
        }
    }
}