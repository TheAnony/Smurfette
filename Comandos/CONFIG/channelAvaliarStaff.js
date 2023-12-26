const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ChannelType, PermissionFlagsBits } = require("discord.js")
const emojis = require('../../emojis.json')
const GuildConfig = require('../../Models/GuildConfig');

module.exports = {
    name: "config-avaliacaostaff", // Coloque o nome do comando
    description: "『 CONFIG 』", // Coloque a descrição do comando
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'adicionar',
            description: '『 CONFIG 』Adicione um canal de avaliar staff',
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
            description: 'Remova o canal de avaliar staff',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'canal',
                    description: '『 CONFIG 』Escolha qual canal será removido.',
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildText],
                    required: true
                }
            ]
        }
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: `**Você não tem permissão de utilizar esse comando! Permissão necessária: \`Adiministrador\`**`, ephemeral: true })
        try {
            
            let guildConfig = await GuildConfig.findOne({ guildId: interaction.guild.id });
    
            if (!guildConfig) guildConfig = new GuildConfig({ guildId: interaction.guild.id })
    
    
            const subcomando = interaction.options.getSubcommand();
    
            switch (subcomando) {
                case 'adicionar': {
                    const canal = interaction.options.getChannel('canal');
    
                    if (guildConfig.canalDeAvaliarStaff === canal.id) {
                        await interaction.reply({ ephemeral: true, content: `${emojis.err} | Ei! O canal ${canal} já está configurado como o canal de avaliar staff!` })
                        return;
                    }
    
                    guildConfig.canalDeAvaliarStaff = canal.id
                    await guildConfig.save();
    
                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Green')
                                .setTitle(`${emojis.checkForTitle} | O canal ${canal} foi configurado com sucesso!`)
                                .setDescription(`> Se deseja remover este canal, utilize \`/config-avaliacaostaff remover\`!`)
                        ]
                    })
                } break;
    
                case 'remover': {
                    const canal = interaction.options.getChannel('canal');
    
                    if (!guildConfig.canalDeAvaliarStaff === canal.id) {
                        await interaction.reply({ ephemeral: true, content: `${emojis.err} | Ei! O canal ${canal} não foi configurado como o canal de avaliar staff!` })
                        return;
                    }
    
                    guildConfig.canalDeAvaliarStaff = null
    
                    await guildConfig.save();
    
                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Green')
                                .setTitle(`${emojis.checkForTitle} | O canal ${canal} foi removido com sucesso!`)
                                .setDescription(`> Se deseja adicionar este canal novamente, utilize \`/config-avaliacaostaff adicionar\`!`)
                        ]
                    })
                } break;
    
                default: break;
            }
        } catch (error) {
            console.log(`ERRO NO CONFIG AVALIACAO STAFF, `, error);
        }
    }
}