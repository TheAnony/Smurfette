const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { QuickDB } = require('quick.db')
const db = new QuickDB();
// const emojis = require('../../emojis.json')

module.exports = {
  name: "", // Coloque o nome do comando
  description: "『 UTILIDADE 』", // Coloque a descrição do comando
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: '',
      description: ``,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client, interaction) => {

  }
}

/*

const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    name: "embed-criar",
    description: "Crie um embed!",
    type: 1,
    options: [
        {
            name: "channel",
            description: "Escolha o canal para enviar o embed",
            type: 7,
            required: false
        }
    ],
    role_perms: ['981187294927142912'],
    developers_only: false,
    category: 'Administration',
    run: async (client, interaction, config) => {
        const channel = interaction.guild.channels.cache.get(interaction.options.get('channel')?.value || interaction.channel.id);

        if(!channel) return interaction.reply({
            content: `\`❌\`  canal invalido`,
            ephemeral: true
        });

        const embedMain = new EmbedBuilder()
            .setTitle('Embed')
            .setDescription('Selecione uma opção  no menu para editar.')
            .setColor('Blurple');

        let embedToEdit = new EmbedBuilder()
            .setDescription('Me edite!');

        interaction.reply({
            embeds: [
                embedMain,
                embedToEdit
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('embed_builder')
                        .setPlaceholder('Nada Selecionado.')
                        .addOptions(
                            {
                                label: "Autor do Embed",
                                value: "author"
                            },
                            {
                                label: "Titulo do Embed",
                                value: "title"
                            },
                            {
                                label: "Descrição do Embed",
                                value: "desc"
                            },
                            {
                                label: "Footer do Embed",
                                value: "footer"
                            },
                            {
                                label: "Cor do Embed",
                                value: "color"
                            },
                            {
                                label: "Imagem do embed",
                                value: "image"
                            },
                            {
                                label: "Thumbnail do Embed",
                                value: "thumbnail"
                            }
                        )
                ),
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('embed_creator_save')
                        .setLabel('Enviar')
                        .setEmoji('📨')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('embed_creator_restart')
                        .setLabel('Resetar')
                        .setEmoji('🔁')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId('embed_creator_end')
                        .setLabel('Finalizar interação')
                        .setEmoji('🛑')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('embed_creator_help')
                        .setLabel('Ajuda')
                        .setEmoji('ℹ️')
                        .setStyle(ButtonStyle.Primary),
                )
            ],
        });

        const collectorMENU = interaction.channel.createMessageComponentCollector({
            type: ComponentType.StringSelect,
            filter: i => i.user.id === interaction.user.id
        });

        collectorMENU.on('collect', async (i) => {
            if (!i.values) return;

            const ID = i.values[0];

            // Author:
            if (ID === "author") {
                i.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription('Por favor digite o nome do autor do embed nesse canal..')
                            .setColor('Blue')
                            .setFooter({
                                text: "Digite \"cancelar\" Para cancelarar"
                            })
                    ],
                    ephemeral: true
                }).catch(() => { });

                const filter = (m) => m.author.id === i.user.id

                await interaction.channel.awaitMessages({
                    filter: filter,
                    max: 1
                }).then(async (received) => {
                    received.first().delete().catch(() => { });

                    const message = received.first().content.substr(0, 256);

                    if (message === "cancelar") {
                        return i.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription('cancelarado.')
                                    .setColor('Yellow')
                            ]
                        });
                    };

                    embedToEdit.setAuthor({ name: message });

                    i.editReply({
                        content: `\`✅\` o  \`author\` Foi adicionado com sucesso.`,
                        embeds: [],
                        ephemeral: true
                    });

                    return interaction.editReply({ embeds: [embedMain, embedToEdit] }).catch(() => { });
                });
            };

            // Title:
            if (ID === "title") {
                i.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription('Por favor Digite o titulo do Embed nesse chat.')
                            .setColor('Blue')
                            .setFooter({
                                text: "Digite \"cancelar\" Para cancelarar"
                            })
                    ],
                    ephemeral: true
                }).catch(() => { });

                const filter = (m) => m.author.id === i.user.id

                await interaction.channel.awaitMessages({
                    filter: filter,
                    max: 1
                }).then(async (received) => {
                    received.first().delete().catch(() => { });

                    const message = received.first().content.substr(0, 256);

                    if (message === "cancelar") {
                        return i.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription('cancelado.')
                                    .setColor('Yellow')
                            ]
                        });
                    };

                    embedToEdit.setTitle(message);

                    i.editReply({
                        content: `\`✅\`  O  título do embed foi adicionado.`,
                        embeds: [],
                        ephemeral: true
                    });

                    return interaction.editReply({ embeds: [embedMain, embedToEdit] }).catch(() => { });
                });
            };

            // Description:
            if (ID === "desc") {
                i.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription('Por favor escreva a descrição do embed nesse chat')
                            .setColor('Blue')
                            .setFooter({
                                text: "Digite \"cancelar\" para cancelar."
                            })
                    ],
                    ephemeral: true
                }).catch(() => { });

                const filter = (m) => m.author.id === i.user.id

                await interaction.channel.awaitMessages({
                    filter: filter,
                    max: 1
                }).then(async (received) => {
                    received.first().delete().catch(() => { });

                    const message = received.first().content.substr(0, 4096);

                    if (message === "cancelar") {
                        return i.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription('Cancelado.')
                                    .setColor('Yellow')
                            ]
                        });
                    };

                    embedToEdit.setDescription(message);

                    i.editReply({
                        content: `\`✅\` EA descrição do embed foi adicionada com sucesso..`,
                        embeds: [],
                        ephemeral: true
                    });

                    return interaction.editReply({ embeds: [embedMain, embedToEdit] }).catch(() => { });
                });
            };

            // Footer:
            if (ID === "footer") {
                i.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription('Por favor digite nesse chat o Footer do Embed')
                            .setColor('Blue')
                            .setFooter({
                                text: "Digite \"cancelar\" Para cancelar."
                            })
                    ],
                    ephemeral: true
                }).catch(() => { });

                const filter = (m) => m.author.id === i.user.id

                await interaction.channel.awaitMessages({
                    filter: filter,
                    max: 1
                }).then(async (received) => {
                    received.first().delete().catch(() => { });

                    const message = received.first().content.substr(0, 2048);

                    if (message === "cancelar") {
                        return i.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription('Cancelado.')
                                    .setColor('Yellow')
                            ]
                        });
                    };

                    embedToEdit.setFooter({ text: message });

                    i.editReply({
                        content: `\`✅\`  o \`footer#text\` Foi adicionado com sucesso.`,
                        embeds: [],
                        ephemeral: true
                    });

                    return interaction.editReply({ embeds: [embedMain, embedToEdit] }).catch(() => { });
                });
            };

            // Color:
            if (ID === "color") {
                i.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription('Por favor digite o código HEX da cor nesse chat.')
                            .setFooter({
                                text: 'Digite \"cancelar\" Para cancelar | /n/ Observação: Para a API do Discord, é necessário fornecer as cores como "Blue", "Red"... etc. O nome da cor sempre deve começar com uma letra maiúscula.'})
                            .setColor('Blue')
                    ],
                    ephemeral: true
                }).catch(() => { });

                const filter = (m) => m.author.id === i.user.id

                await interaction.channel.awaitMessages({
                    filter: filter,
                    max: 1
                }).then(async (received) => {
                    received.first().delete().catch(() => { });

                    const message = received.first().content.substr(0, 256);

                    if (message === "cancelar") {
                        return i.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription('Cancelado.')
                                    .setColor('Yellow')
                            ]
                        });
                    };

                    try {
                        embedToEdit.setColor(message);
                    } catch (e) {
                        embedToEdit.setColor('Default');
                    };

                    i.editReply({
                        content: `\`✅\` A \`Cor\` do embed foi adicionado com sucesso.`,
                        embeds: [],
                        ephemeral: true
                    });

                    return interaction.editReply({ embeds: [embedMain, embedToEdit] }).catch(() => { });
                });
            };

            // Image:
            if (ID === "image") {
                i.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription('Por favor digite uma url valida para a imagem')
                            .setFooter({
                                text: "Digite cancelar para cancelar essa interação. Observação Certifique-se de que o link comece com \"http://\"Caso contrário não será exibido nada."
                            })
                            .setColor('Blue')
                    ],
                    ephemeral: true
                }).catch(() => { });

                const filter = (m) => m.author.id === i.user.id

                await interaction.channel.awaitMessages({
                    filter: filter,
                    max: 1
                }).then(async (received) => {
                    received.first().delete().catch(() => { });

                    const message = received.first().content.substr(0, 256);

                    if (message === "cancelar") {
                        return i.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription('Cancelado.')
                                    .setColor('Yellow')
                            ]
                        });
                    };

                    try {
                        embedToEdit.setImage(message);
                    } catch (e) {
                        embedToEdit.setImage(null);
                    };

                    i.editReply({
                        content: `\`✅\` a \`Imagem\` do embed  foi adicionada com sucesso`,
                        embeds: [],
                        ephemeral: true
                    });

                    return interaction.editReply({ embeds: [embedMain, embedToEdit] }).catch(() => { });
                });
            };

            // Thumbnail:
            if (ID === "thumbnail") {
                i.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription('Por favor digite o URL da thumbnail valida.')
                            .setFooter({
                                text: "Digite \"cancelar\" Para cancelar.\nImportante:  o início da URL tem que ser \"https://\"! se não o discord ira ignorar."
                            })
                            .setColor('Blue')
                    ],
                    ephemeral: true
                }).catch(() => { });

                const filter = (m) => m.author.id === i.user.id

                await interaction.channel.awaitMessages({
                    filter: filter,
                    max: 1
                }).then(async (received) => {
                    received.first().delete().catch(() => { });

                    const message = received.first().content.substr(0, 256);

                    if (message === "cancelar") {
                        return i.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription('Cancelado.')
                                    .setColor('Yellow')
                            ]
                        });
                    };

                    try {
                        embedToEdit.setThumbnail(message);
                    } catch (e) {
                        embedToEdit.setThumbnail(null);
                    };

                    i.editReply({
                        content: `\`✅\`  a \`thumbnail\` Foi adicionada com sucesso.`,
                        embeds: [],
                        ephemeral: true
                    });

                    return interaction.editReply({ embeds: [embedMain, embedToEdit] }).catch(() => { });
                });
            };
        });

        const collectorBUTTONS = interaction.channel.createMessageComponentCollector({
            type: ComponentType.Button,
            filter: i => i.user.id === interaction.user.id
        });

        collectorBUTTONS.on('collect', async (i) => {
            const ID = i.customId;

            if (ID === "embed_creator_save") {
                channel.send({
                    embeds: [
                        embedToEdit
                    ]
                }).catch(() => { });

                await i.reply({
                    content: `\`✅\` Enviado  veja o canal ${channel}.`,
                    ephemeral: true
                }).catch(() => { });

                interaction.deleteReply();

                return collectorBUTTONS.stop();
            };

            if (ID === "embed_creator_restart") {
                embedToEdit.setAuthor(null);
                embedToEdit.setTitle(null);
                embedToEdit.setDescription("Me edite!");
                embedToEdit.setFooter(null);
                embedToEdit.setColor(null);

                i.reply({
                    content: `\`✅\` Resetado.`,
                    ephemeral: true
                }).catch(() => { });

                return interaction.editReply({ embeds: [embedMain, embedToEdit] }).catch(() => { });
            };

            if (ID === "embed_creator_end") {
                interaction.deleteReply();

                return collectorBUTTONS.stop();
            };

            if (ID === "embed_creator_help") {
                i.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Como criar embed?')
                            .setDescription(`Para criar um embed basta apenas clicar no menu e selecionar a opção desejada.`)
                            .setColor('Blue')
                    ],
                    ephemeral: true
                }).catch(() => { });
            };
        });

    },
};*/

/*
PERMROLE - PERMROLE - PERMROLE
let cargos = await db.get(`ArrayCargos.roles`)
    let valoresGerados = [];
        for (let index = 0; index < cargos.length; index++) {
          const element = cargos[index]
          valoresGerados.push(element)

        }
    if(!interaction.member.roles.cache.some(role => valoresGerados.includes(role.id))) return interaction.reply('**VOCÊ NÃO TEM A PERMROLE PARA UTILIZAR ESSE COMANDO!**')
*/

/*
let button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("botao")
          .setEmoji("🎉")
          .setStyle(ButtonStyle.Success)
      );

const filter = (i) => i.user.id === interaction.user.id
        const coletor = msg.createMessageComponentCollector({ filter, max: 1, time: ms('2m') });

        coletor.on("end", async (i) => {
            // interaction.editReply({ components: [buttonDisabled] });
        });

        coletor.on("collect", async (i) => { })
*/

/*
function wait(tempo) {
  setTimeout(()=>{}, tempo);
}
*/

/* const time = interaction.options.getString('tempo');
let tempo = stringMS(time)
let tempoCompleto = formatTime(tempo) */