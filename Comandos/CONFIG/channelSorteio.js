const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ChannelType } = require("discord.js")
const emojis = require('../../emojis.json')
const GuildConfig = require('../../Models/GuildConfig');
const Sorteios = require('../../Models/Sorteios')
const { stringMS, formatTime } = require('../../funcoes')
const { QuickDB } = require('quick.db');
const db = new QuickDB;

module.exports = {
    name: "config-sorteio", // Coloque o nome do comando
    description: "『 CONFIG 』", // Coloque a descrição do comando
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'add-channel',
            description: '『 CONFIG 』Adicione um canal de sorteio',
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
            name: 'remove-channel',
            description: '『 CONFIG 』Remova um canal de sorteio',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'canal',
                    description: '『 CONFIG 』Escolha qual canal será configurado.',
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildText],
                    required: true
                }
            ]
        },
        {
            name: 'add-default-time-sorteio',
            description: 'Adicione o tempo padrão de sorteios.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'tempo',
                    description: '『 CONFIG 』Adicione o tempo padrão de sorteios.',
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: 'remove-default-time-sorteio',
            description: 'Remova o tempo padrão de sorteios.',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'add-default-time-claim',
            description: 'Adicione o tempo padrão de claim.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'tempo',
                    description: '『 CONFIG 』Adicione o tempo padrão de claim.',
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: 'remove-default-time-claim',
            description: 'Remova o tempo padrão de claim.',
            type: ApplicationCommandOptionType.Subcommand,
        }
    ],

    run: async (client, interaction) => {
        try {

            let cargos = await db.get(`ArrayCargos.roles`)
            if (!interaction.member.roles.cache.some(role => cargos.includes(role.id))) return interaction.reply({ ephemeral: true, content: `${emojis.err} | **VOCÊ NÃO TEM A PERMROLE PARA UTILIZAR ESSE COMANDO!**` })

            let guildConfig = await GuildConfig.findOne({ guildId: interaction.guild.id });
            let guildSorteio = await Sorteios.findOne({ guildId: interaction.guild.id })

            if (!guildConfig) guildConfig = new GuildConfig({ guildId: interaction.guild.id })
            if (!guildSorteio) guildSorteio = new Sorteios({ guildId: interaction.guild.id })

            const subcomando = interaction.options.getSubcommand();

            switch (subcomando) {
                case 'add-channel': {
                    const canal = interaction.options.getChannel('canal')
                    if (guildConfig.canalDeSorteioID === canal.id) {
                        await interaction.reply({ ephemeral: true, content: `${emojis.err} | Ei! O canal ${canal} já está configurado como o canal de sorteio!` })
                        return;
                    }

                    guildConfig.canalDeSorteioID = canal.id
                    await guildConfig.save();

                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Green')
                                .setTitle(`${emojis.checkForTitle} | O canal ${canal} foi configurado com sucesso!`)
                                .setDescription(`> Se deseja remover este canal, utilize \`/config-sorteio remove-channel\`!`)
                        ]
                    })
                } break;

                case 'remove-channel': {
                    const canal = interaction.options.getChannel('canal')
                    if (guildConfig.canalDeSorteioID === canal.id) {
                        await interaction.reply({ ephemeral: true, content: `${emojis.err} | Ei! O canal ${canal} não está configurado como o canal de sorteio!` })
                        return;
                    }

                    guildConfig.canalDeSorteioID = null
                    await guildConfig.save();

                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Green')
                                .setTitle(`${emojis.checkForTitle} | O canal ${canal} foi removido com sucesso!`)
                                .setDescription(`> Se deseja adicionar novamente este canal, utilize \`/config-sorteio add-channel\`!`)
                        ]
                    })
                } break;

                case 'add-default-time-sorteio': {
                    let tempo = interaction.options.getString('tempo')
                    tempo = stringMS(tempo)
                    if (tempo == 'err') return interaction.reply(`${emojis.err} | Tempo inserido inválido! Por favor, tente novamente`)
                    if (tempo == 'tempo máximo excedido') return interaction.reply(`${emojis.err} | O tempo inserido excedeu o limite! Por favor, utilize um tempo que seja menor do que \`24 dias, 20 horas, 31 minutos e 23 segundos\``)

                    guildSorteio.tempoSorteioDefault = tempo
                    guildSorteio.save();

                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Green')
                                .setTitle(`${emojis.checkForTitle} | O tempo de ${formatTime(tempo)} foi configurado com sucesso!`)
                                .setDescription(`> Se deseja remover este tempo, utilize \`/config-sorteio remove-default-time-sorteio\`!`)
                        ]
                    })
                } break;

                case 'remove-default-time-sorteio': {
                    try {
                        guildSorteio.tempoSorteioDefault = null
                        guildSorteio.save();

                        await interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('Green')
                                    .setTitle(`${emojis.checkForTitle} | O tempo padrão foi removido com sucesso!`)
                                    .setDescription(`> Se deseja adicionar um novo tempo padrão, utilize \`/config-sorteio add-default-time-sorteio\`!`)
                            ]
                        })
                    } catch (error) {
                        await interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('Red')
                                    .setTitle(`${emojis.errForTitle} | Ocorreu um erro ao excluir o tempo padrão!`)
                                    .setDescription(`> Por favor, tente novamente!`)
                            ]
                        })
                    }
                } break;

                case 'add-default-time-claim': {
                    let tempo = interaction.options.getString('tempo')
                    tempo = stringMS(tempo)
                    if (tempo == 'err') return interaction.reply(`${emojis.err} | Tempo inserido inválido! Por favor, tente novamente`)
                    if (tempo == 'tempo máximo excedido') return interaction.reply(`${emojis.err} | O tempo inserido excedeu o limite! Por favor, utilize um tempo que seja menor do que \`24 dias, 20 horas, 31 minutos e 23 segundos\``)

                    guildSorteio.tempoClaimDefault = tempo
                    guildSorteio.save();

                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Green')
                                .setTitle(`${emojis.checkForTitle} | O tempo de ${formatTime(tempo)} foi configurado com sucesso!`)
                                .setDescription(`> Se deseja remover este tempo, utilize \`/config-sorteio remove-default-time-claim\`!`)
                        ]
                    })
                } break;

                case 'remove-default-time-claim': {
                    try {
                        guildSorteio.tempoClaimDefault = null
                        guildSorteio.save();

                        await interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('Green')
                                    .setTitle(`${emojis.checkForTitle} | O tempo padrão foi removido com sucesso!`)
                                    .setDescription(`> Se deseja adicionar um novo tempo, utilize \`/config-sorteio add-default-time-claim\`!`)
                            ]
                        })
                    } catch (error) {
                        await interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('Red')
                                    .setTitle(`${emojis.errForTitle} | Ocorreu um erro ao excluir o tempo padrão!`)
                                    .setDescription(`> Por favor, tente novamente!`)
                            ]
                        })
                    }
                } break;
                default: break;
            }
        } catch (error) {
            console.log(`ERRO NO CONFIGSORTEIO:`, error);
        }
    }
}