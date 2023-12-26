const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ChannelType, PermissionFlagsBits } = require("discord.js")
const emojis = require('../../emojis.json')
const GuildConfig = require('../../Models/GuildConfig');

module.exports = {
    name: "config-rolestaff", // Coloque o nome do comando
    description: "『 CONFIG 』", // Coloque a descrição do comando
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'adicionar',
            description: '『 CONFIG 』Adicione um cargo para avaliar staff',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'role',
                    description: 'Escolha qual cargo será configurado.',
                    type: ApplicationCommandOptionType.Role,
                    required: true
                }
            ]
        },
        {
            name: 'remover',
            description: 'Remova o cargo de avaliar staff',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'role',
                    description: '『 CONFIG 』Escolha qual cargo será removido.',
                    type: ApplicationCommandOptionType.Role,
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
                    const canal = interaction.options.getRole('role');
    
                    if (guildConfig.roleStaff === canal.id) {
                        await interaction.reply({ ephemeral: true, content: `${emojis.err} | Ei! O cargo ${canal} já está configurado como o cargo de avaliar staff!` })
                        return;
                    }
    
                    guildConfig.roleStaff = canal.id
                    await guildConfig.save();
    
                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Green')
                                .setTitle(`${emojis.checkForTitle} | O cargo ${canal.name} foi configurado com sucesso!`)
                                .setDescription(`> Se deseja remover este cargo, utilize \`/config-rolestaff remover\`!`)
                        ]
                    })
                } break;
    
                case 'remover': {
                    const canal = interaction.options.getRole('role');
    
                    if (!guildConfig.roleStaff === canal.id) {
                        await interaction.reply({ ephemeral: true, content: `${emojis.err} | Ei! O cargo ${canal} não foi configurado como o cargo de avaliar staff!` })
                        return;
                    }
    
                    guildConfig.roleStaff = null
    
                    await guildConfig.save();
    
                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Green')
                                .setTitle(`${emojis.checkForTitle} | O cargo ${canal.name} foi removido com sucesso!`)
                                .setDescription(`> Se deseja adicionar este cargo novamente, utilize \`/config-rolestaff adicionar\`!`)
                        ]
                    })
                } break;
    
                default: break;
            }
        } catch (error) {
            console.log(`ERRO NO CONFIG ROLE STAFF, `, error);
        }
    }
}