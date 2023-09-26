const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits, ButtonStyle, ActionRowBuilder, ButtonBuilder, ComponentType } = require("discord.js")
const { QuickDB } = require('quick.db')
const db = new QuickDB();
const { PaginationWrapper } = require('djs-button-pages');
const { NextPageButton, PreviousPageButton } = require('@djs-button-pages/presets');
const { stringMS, formatTime, pegarDataNow } = require('../../funções');

module.exports = {
    name: "banimento", // Coloque o nome do comando
    description: "『 MOREDAÇÃO 』", // Coloque a descrição do comando
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'moderation',
            description: `Acessa o painel de moderação.`,
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'ban-permanente',
                    description: `Aplica um banimento parmenente a um membro.`,
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'member-perm',
                            description: `Mencione o membro.`,
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: 'motivo-perm',
                            description: 'Informe o motivo.',
                            type: ApplicationCommandOptionType.String,
                            required: false
                        },
                    ]
                },
                {
                    name: 'unban',
                    description: `Desbane um membro.`,
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'member-unban',
                            description: `Informe o id do membro.`,
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        },
                        {
                            name: 'motivo-unban',
                            description: 'Informe o motivo.',
                            type: ApplicationCommandOptionType.String,
                            required: true
                        },
                    ]
                },
                {
                    name: 'ban-list',
                    description: `Mostra todos os banimentos e seus respectivos punidores.`,
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: 'config-ban-message',
                    description: `Mostra e configura a mensagem de banimento do moderador.`,
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'midia',
                            description: 'Forneça a mídia (png, jpeg, gif etc que deseja como mídia do ban).',
                            type: ApplicationCommandOptionType.Attachment,
                            required: false
                        },
                        {
                            name: 'texto',
                            description: 'Forneça qual mensagem aparecerá na mensagem de ban.',
                            type: ApplicationCommandOptionType.String,
                            required: false
                        },
                        {
                            name: "apagar",
                            type: ApplicationCommandOptionType.String,
                            description: "Escolha qual ação deseja realizar.",
                            required: false,
                            choices: [
                                { name: 'apagar-texto', value: 'apgTexto' },
                                { name: 'apagar-imagem', value: 'apgImagem' },
                                { name: 'apagar-textoEimagem', value: 'apgTextoImagem' },
                            ]
                        }
                    ]
                },
            ]
        },
    ],

    run: async (client, interaction) => {
        /* if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) return interaction.reply({ content: `**Você não tem permissão de utilizar esse comando!**`, ephemeral: true }) */

        const subcommand = interaction.options.getSubcommand();
        const User = interaction.options.getUser('member') || interaction.user.id
        const Member = interaction.guild.members.cache.get(User.id)
        const AuthorUser = interaction.user;
        const AuthorMember = interaction.member;
        const Guild = interaction.guild.id;
        const Channel = client.channels.cache.get('1150047974970380358')

        let button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("confirm")
                .setEmoji("✅")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId("cancel")
                .setEmoji("⛔")
                .setStyle(ButtonStyle.Danger)
        )

        let buttonDisabled = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("confirmDisabled")
                .setEmoji("✅")
                .setStyle(ButtonStyle.Success)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId("cancelDisabled")
                .setEmoji("⛔")
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true)

        )

        let bans = await interaction.guild.bans.fetch()
        let bansGlobal = bans.map(map => {
            return `**Usuário:** ${map.user.username} (${map.user.id})
        **Motivo de banimento:** ${map.reason}`
        })
        let bansForId = bans.map(map => {
            return `${map.user.id}`
        })

        let banCountMod = await db.get(`banCountMod_${AuthorUser.id}`);
        if (!banCountMod) banCountMod = await db.set(`banCountMod_${AuthorUser.id}`, 0);

        switch (subcommand) {
            case 'ban-permanente':
                banPerm();
                break;

            case 'unban':
                unBan();
                break;

            case 'ban-list':
                banList();
                break;

            case 'config-ban-message':
                banMessage();
                break;

            default:
                break;
        };

        async function banPerm() {
            const user = interaction.options.getUser('member-perm');
            const member = interaction.guild.members.cache.get(user.id);
            const motivo = interaction.options.getString('motivo-perm') || 'Indefinido'
            const emojis = require('../../emojis.json')
            const imageBan = await db.get(`messageImageBan_${interaction.user.id}`)
            const textBan = await db.get(`messageTxtBan_${interaction.user.id}`)
            const embedConfirmar = new EmbedBuilder()
                .setColor('Yellow')
                .setTitle(`⭕ | Você deseja realmente banir esse ${!user.bot ? 'usuário' : 'bot'}?`)
                .setFields({
                    name: `${!user.bot ? 'Usuário:' : 'Bot:'} ${member.user.username} (${member.user.id})`,
                    value: `\u2800\u2a65 Motivo do ban: ${motivo}`
                })
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 2048 }))

            /* if (member.id === interaction.user.id) return interaction.reply({ ephemeral: true, content: '**:x: | Você não pode banir a si mesmo!**' }); */
            if (member.id === client.user.id) return interaction.reply({ ephemeral: true, content: `Ei, não posso banir a mim mesma!` })

            interaction.reply({ embeds: [embedConfirmar], components: [button] }).then(async (messagem) => {

                const filter = (i) => i.user.id === interaction.user.id
                const coletor = messagem.createMessageComponentCollector({
                    filter, componentType: ComponentType.Button, max: 1, time: stringMS('3m')
                });

                coletor.on("end", async (i) => {
                    await interaction.editReply({
                        components: [button.setComponents(
                            new ButtonBuilder()
                                .setCustomId("confirmDisabled")
                                .setEmoji("✅")
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setCustomId("cancelDisabled")
                                .setEmoji("⛔")
                                .setStyle(ButtonStyle.Danger)
                                .setDisabled(true)
                        )]
                    });
                });

                coletor.on('collect', async (i) => {
                    await i.deferUpdate();
                    if (i.customId === 'cancel') {
                        await interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('Red')
                                    .setTitle('❌ | Banimento cancelado!')
                                    .setFields({
                                        name: `${!user.bot ? 'usuário' : 'bot'} ${member.user.username} (${member.user.id})`,
                                        value: `\u2800\u2a65 Motivo do ban: ${motivo}`
                                    })
                                    .setFooter({ text: `🕒 | ${pegarDataNow()}` })
                                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                            ],
                            components: [buttonDisabled]
                        })
                        return;
                    }

                    if (imageBan || textBan) {
                        if (imageBan && !textBan) {
                            await interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor('Red')
                                        .setTitle(`Banimento Aplicado`)
                                        .addFields(
                                            {
                                                name:
                                                    `${member.user.bot ? emojis.bot : emojis.user} | ${!member.user.bot ? 'Usuário banido: ' : 'Bot banido:'}`, value: `\u2800\u2a65 ${!member.bot ? 'Usuário:' : 'Bot:'} ${member.user.username} (${member.id})\n\u2800\u2a65 Motivo: ${motivo}\n\n`
                                            },
                                            {
                                                name:
                                                    `<:DiscordStaff:1134126501672009810> | Autor do banimento:`, value: `\u2800\u2a65 Staff: ${interaction.user.username} (${interaction.user.id}) \n\u2800\u2a65 Quantia de bans: **__${banCountMod}__**`
                                            }
                                        )
                                        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                                        .setFooter({ text: `🕒 | ${pegarDataNow()}` })
                                        .setImage(imageBan)
                                ], components: []
                            })
                            let embed = new EmbedBuilder()
                                .setColor('Red')
                                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                .setTitle('⚠️ | VOCÊ FOI BANIDO!')
                                .setFields(
                                    {
                                        name: `${emojis.staff} | Autor do banimento:`,
                                        value: `\u2800\u2a65 ${interaction.user.username} (${interaction.user.id})`,
                                        inline: true
                                    },
                                    {
                                        name: `✅ | Motivo do banimento:`,
                                        value: `\u2800\u2a65 \`${motivo}\``,
                                        inline: true
                                    }
                                )
                                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                                .setFooter({ text: `🕒 | ${pegarDataNow()}` })
                            let embedImage = new EmbedBuilder()
                                .setImage(imageBan)
                                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
                                .setColor('Red')
                            try {
                                await user.send({ embeds: [embed, embedImage] })
                            } catch (error) { }
                        } else if (textBan && !imageBan) {
                            await interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor('Red')
                                        .setTitle(`Banimento Aplicado`)
                                        .addFields(
                                            {
                                                name:
                                                    `${member.user.bot ? emojis.bot : emojis.user} | ${!member.user.bot ? 'Usuário banido: ' : 'Bot banido:'}`, value: `\u2800\u2a65 ${!member.bot ? 'Usuário:' : 'Bot:'} ${member.user.username} (${member.id})\n\u2800\u2a65 Motivo: ${motivo}\n\n`
                                            },
                                            {
                                                name:
                                                    `<:DiscordStaff:1134126501672009810> | Autor do banimento:`, value: `\u2800\u2a65 Staff: ${interaction.user.username} (${interaction.user.id}) \n\u2800\u2a65 Quantia de bans: **__${banCountMod}__**`
                                            },
                                            {
                                                name: `:paperclips: | O (A) ${interaction.user.username} tem um recado:`,
                                                value: `\`\`\`${textBan}\`\`\``
                                            }
                                        )
                                        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                                        .setFooter({ text: `🕒 | ${pegarDataNow()}` })
                                ], components: []
                            })
                            let embed = new EmbedBuilder()
                                .setColor('Red')
                                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                .setTitle('⚠️ | VOCÊ FOI BANIDO!')
                                .setFields(
                                    {
                                        name: `${emojis.staff} | Autor do banimento:`,
                                        value: `\u2800\u2a65 ${interaction.user.username} (${interaction.user.id})`,
                                        inline: true
                                    },
                                    {
                                        name: `✅ | Motivo do banimento:`,
                                        value: `\u2800\u2a65 \`${motivo}\``,
                                        inline: true
                                    }
                                )
                                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                                .setFooter({ text: `🕒 | ${pegarDataNow()}` })
                            let embedImage = new EmbedBuilder()
                                .setDescription(`\`\`\`${textBan}\`\`\``)
                                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
                                .setColor('Red')
                            try {
                                await user.send({ embeds: [embed, embedImage] })
                            } catch (error) { }
                        } else if (textBan && imageBan) {
                            await interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor('Red')
                                        .setTitle(`Banimento Aplicado`)
                                        .addFields(
                                            {
                                                name:
                                                    `${member.user.bot ? emojis.bot : emojis.user} | ${!member.user.bot ? 'Usuário banido: ' : 'Bot banido:'}`, value: `\u2800\u2a65 ${!member.bot ? 'Usuário:' : 'Bot:'} ${member.user.username} (${member.id})\n\u2800\u2a65 Motivo: ${motivo}\n\n`,
                                                inline: true
                                            },
                                            {
                                                name:
                                                    `<:DiscordStaff:1134126501672009810> | Autor do banimento:`, value: `\u2800\u2a65 Staff: ${interaction.user.username} (${interaction.user.id}) \n\u2800\u2a65 Quantia de bans: **__${banCountMod}__**`,
                                                inline: true
                                            },
                                            {
                                                name: `:paperclips: | O (A) \`${interaction.user.username}\` tem um recado:`,
                                                value: `\`\`\`${textBan}\`\`\``
                                            }
                                        )
                                        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                                        .setFooter({ text: `🕒 | ${pegarDataNow()}` })
                                        .setImage(imageBan)
                                ], components: []
                            })
                            let embed = new EmbedBuilder()
                                .setColor('Red')
                                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                .setTitle('⚠️ | VOCÊ FOI BANIDO!')
                                .setFields(
                                    {
                                        name: `${emojis.staff} | Autor do banimento:`,
                                        value: `\u2800\u2a65 ${interaction.user.username} (${interaction.user.id})`,
                                        inline: true
                                    },
                                    {
                                        name: `✅ | Motivo do banimento:`,
                                        value: `\u2800\u2a65 \`${motivo}\``,
                                        inline: true
                                    }
                                )
                                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                                .setFooter({ text: `🕒 | ${pegarDataNow()}` })
                            let embedImage = new EmbedBuilder()
                                .setDescription(`\`\`\`${textBan}\`\`\``)
                                .setImage(imageBan)
                                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
                                .setColor('Red')
                            try {
                                await user.send({ embeds: [embed, embedImage] })
                            } catch (error) { }
                        }
                    } else {
                        await interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('Red')
                                    .setTitle(`Banimento Aplicado`)
                                    .addFields(
                                        {
                                            name:
                                                `${member.user.bot ? emojis.bot : emojis.user} | ${!member.user.bot ? 'Usuário banido: ' : 'Bot banido:'}`, value: `\u2800\u2a65 ${!member.bot ? 'Usuário:' : 'Bot:'} ${member.user.username} (${member.id})\n\u2800\u2a65 Motivo: ${motivo}\n\n`
                                        },
                                        {
                                            name:
                                                `<:DiscordStaff:1134126501672009810> | Autor do banimento:`, value: `\u2800\u2a65 Staff: ${interaction.user.username} (${interaction.user.id}) \n\u2800\u2a65 Quantia de bans: **__${banCountMod}__**`
                                        }
                                    )
                                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                                    .setFooter({ text: `🕒 | ${pegarDataNow()}` })
                            ], components: []
                        })
                        let embed = new EmbedBuilder()
                                .setColor('Red')
                                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                .setTitle('⚠️ | VOCÊ FOI BANIDO!')
                                .setFields(
                                    {
                                        name: `${emojis.staff} | Autor do banimento:`,
                                        value: `\u2800\u2a65 ${interaction.user.username} (${interaction.user.id})`,
                                        inline: true
                                    },
                                    {
                                        name: `✅ | Motivo do banimento:`,
                                        value: `\u2800\u2a65 \`${motivo}\``,
                                        inline: true
                                    }
                                )
                                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                                .setFooter({ text: `🕒 | ${pegarDataNow()}` })
                            try {
                                await user.send({ embeds: [embed] })
                            } catch (error) { }
                    }
                })
            })


            return

            member.ban({ reason: [motivo] }).then(async () => {
                interaction.reply(`✅ | O membro ${user.username} foi banido com sucesso!`)

                if (messageEspecial) {
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Red')
                                .setTitle(`Banimento Aplicado`)
                                .addFields(
                                    {
                                        name:
                                            `${member.user.bot ? emojis.bot : emojis.user} | ${!member.user.bot ? 'Usuário banido: ' : 'Bot banido:'}`, value: `\u2800\u2a65 ${!member.bot ? 'Usuário:' : 'Bot:'} ${member.user.username} (${member.id})\n\u2800\u2a65 Motivo: ${motivo}\n\n`
                                    },
                                    {
                                        name:
                                            `<:DiscordStaff:1134126501672009810> | Autor do banimento:`, value: `\u2800\u2a65 Staff: ${interaction.user.username} (${interaction.user.id}) \n\u2800\u2a65 Quantia de bans: ${banCountMod + 1}`
                                    }
                                )
                                .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                                .setFooter({ text: `🕒 | ${pegarDataNow()}` })
                        ]
                    })
                    await db.add(`banCountMod_${AuthorUser.id}`, 1)
                } else {

                }
            })
        };

        async function unBan() {
            return interaction.reply(`Nada ainda!`)
        };

        async function banList() {
            const embeds = embedsCreate(bansGlobal)
            const buttons = [
                new PreviousPageButton({ custom_id: "prev_page", emoji: "↩️", style: ButtonStyle.Primary }),
                new NextPageButton({ custom_id: "next_page", emoji: "▶️", style: ButtonStyle.Primary }),
            ]

            const paginacao = new PaginationWrapper()
                .setButtons(buttons)
                .setEmbeds(embeds)
                .setFilterOptions({
                    allowedUsers: [interaction.user.id],
                    filterUsers: true
                })

            await paginacao.interactionReply(interaction)

            function embedsCreate(bansArray) {
                let pages = [];
                let currentPage = [];
                let totaldepaginas = 1;
                if (typeof bansArray !== 'object') return;

                for (let i = 0; i < bansArray.length; i++) {
                    currentPage.push(bansArray[i]);

                    if (currentPage.length === 7 || i === bansArray.length - 1) {
                        totaldepaginas++;
                        currentPage = [];
                    };
                };

                for (let i = 0; i < bansArray.length; i++) {
                    currentPage.push(bansArray[i]);

                    if (currentPage.length === 7 || i === bansArray.length - 1) {
                        const embed = new EmbedBuilder()
                            .setTitle(`Lista de usuários banidos:`)
                            .setDescription(`${currentPage.join(`\n\n`)}`)
                            .setColor('DarkButNotBlack')
                            .setFooter({ text: `Página ${pages.length + 1}/${totaldepaginas - 1}` })

                        pages.push(embed);
                        currentPage = [];
                    };
                };
                return pages;
            };
        }

        async function banMessage() {
            const apagar = interaction.options.getString("apagar")
            if (apagar) {
                let texto = await db.get(`messageTxtBan_${interaction.user.id}`)
                let imagem = await db.get(`messageImageBan_${interaction.user.id}`)

                switch (apagar) {
                    case 'apgTexto':
                        if (!texto) return interaction.reply({ ephemeral: true, content: `:x: | Não consigo apagar pois você não configurou nenhum texto!` })

                        interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('Green')
                                    .setTitle('Texto apagado com sucesso!')
                                    .setDescription(`### Texto apagado:\n \`\`\`${texto}\`\`\``)
                                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
                            ]
                        })

                        await db.delete(`messageTxtBan_${interaction.user.id}`)
                        break;

                    case 'apgImagem':
                        if (!imagem) return interaction.reply({ ephemeral: true, content: `:x: | Não consigo apagar pois você não configurou nenhuma imagem!` })

                        interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('Green')
                                    .setTitle('Imagem apagado com sucesso!')
                                    .setDescription(`### Imagem apagada:`)
                                    .setImage(imagem)
                                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
                            ]
                        })

                        await db.delete(`messageImageBan_${interaction.user.id}`)
                        break;

                    case 'apgTextoImagem':
                        if (!texto || !image) return interaction.reply({ ephemeral: true, content: `:x: | Não consigo apagar pois você não configurou nenhuma imagem ou texto!` })
                        interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('Green')
                                    .setTitle('Texto e imagem apagados com sucesso!')
                                    .setDescription(`### Texto apagado:\n \`\`\`${texto}\`\`\`\n### Imagem Apagada:`)
                                    .setImage(imagem)
                                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
                            ]
                        })

                        await db.delete(`messageTxtBan_${interaction.user.id}`)
                        await db.delete(`messageImageBan_${interaction.user.id}`)
                        break;

                    default:
                        break;
                }
                return;
            }

            const image = interaction.options.getAttachment('midia');
            if (image) {
                let resul = image.contentType.endsWith('gif') ? true : image.contentType.endsWith('jpg') ? true : image.contentType.endsWith('jpeg') ? true : image.contentType.endsWith('png') ? true : image.contentType.endsWith('mp4') ? true : false
                if (resul == false) return interaction.reply({ content: `:x: | O formato da mídia é inválida! \`Formatos válidos: gif, jpg, jpeg, png e mp4\`` })
            }
            const msg = interaction.options.getString('texto');
            let msgImage = await db.get(`messageImageBan_${interaction.user.id}`) || 'https://cdn.discordapp.com/attachments/921107172316815414/1154785118221774920/images_17.jpg'
            let msgText = await db.get(`messageTxtBan_${interaction.user.id}`) || 'Nenhuma mensagem definida!'

            if (!image && !msg) {
                let embed = new EmbedBuilder()
                    .setColor('DarkPurple')
                    .setTitle(`Mensagem de ban setada:`)
                    .addFields(
                        {
                            name: 'Texto:',
                            value: `\`\`\`${msgText}\`\`\``
                        },
                        {
                            name: "Mídia:",
                            value: '\u0020'
                        },
                    )
                    .setImage(msgImage)
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })

                interaction.reply({ embeds: [embed] })

            } else if (image && !msg) {
                let embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('Nova imagem definida!')
                    .setImage(`${image.url}`)
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })

                await db.set(`messageImageBan_${interaction.user.id}`, `${image.url}`)
                interaction.reply({ embeds: [embed] })

            } else if (msg && !image) {
                let embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('Novo texto da mensagem definida!')
                    .setDescription(`\`\`\`${msg}\`\`\``)
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })

                await db.set(`messageTxtBan_${interaction.user.id}`, `${msg}`)
                interaction.reply({ embeds: [embed] })

            } else if (image && msg) {
                let embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('Nova imagem e texto definidos!')
                    .setImage(`${image.url}`)
                    .setDescription(`\`\`\`${msg}\`\`\``)
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })

                await db.set(`messageImageBan_${interaction.user.id}`, `${image.url}`)
                await db.set(`messageTxtBan_${interaction.user.id}`, `${msg}`)
                interaction.reply({ embeds: [embed] })
            }
        }
    }
}