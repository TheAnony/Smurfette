const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ComponentBuilder, ButtonStyle, ComponentType } = require("discord.js");
const emojis = require('../../emojis.json');
const GuildConfig = require('../../Models/GuildConfig');
const Sorteios = require('../../Models/Sorteios');
const { formatTime, stringMS } = require('../../funcoes');
const { randomUUID } = require('crypto');

module.exports = {
    name: "newsorteio", // Coloque o nome do comando
    description: "『 SORTEIO 』Crie um sorteio no servidor", // Coloque a descrição do comando
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "prêmio",
            type: ApplicationCommandOptionType.String,
            description: "O que será o prêmio?",
            required: true,
        },
        {
            name: "host",
            type: ApplicationCommandOptionType.User,
            description: "Descreva quem será o host (pessoa necessária para marcar para dar claim).",
            required: true,
        },
        {
            name: "quantia-de-ganhadores",
            type: ApplicationCommandOptionType.String,
            description: "Descreva o que será sorteado.",
            required: true,
            choices: [
                { name: '1-ganhador', value: '1' },
                { name: '2-ganhadores', value: '2' },
                { name: '3-ganhadores', value: '3' },
                { name: '4-ganhadores', value: '4' },
                { name: '5-ganhadores', value: '5' },
                { name: '6-ganhadores', value: '6' },
                { name: '7-ganhadores', value: '7' },
                { name: '8-ganhadores', value: '8' },
                { name: '9-ganhadores', value: '9' },
                { name: '10-ganhadores', value: '10' },
            ]
        },
        {
            name: "tempo-sorteio",
            type: ApplicationCommandOptionType.String,
            description: "Quanto tempo haverá o sorteio? (Ex.: 1 week 10 minutos)",
        },
        {
            name: "tempo-claim",
            type: ApplicationCommandOptionType.String,
            description: "Quanto tempo haverá o claim? (Ex.: 1 week 10 minutos)",
        },
        {
            name: "requesitos-de-cargos",
            type: ApplicationCommandOptionType.String,
            description: "Ex. de cargos: \"1135395825875435631, <@810229985159807078>\"",
        },
        {
            name: "requesitos",
            type: ApplicationCommandOptionType.String,
            description: "Descreva os requisitos para participar.",
        }
    ],

    run: async (client, interaction) => {
        try {
            const guildConfig = await GuildConfig.findOne({ guildId: interaction.guild.id });
            const sorteios = await Sorteios.findOne({ guildId: interaction.guild.id })

            if (!guildConfig.canalDeSorteioID) {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setTitle(`${emojis.errForTitle} | Nenhum canal de sorteio foi configurado!`)
                            .setDescription(`> Por favor, utilize o comando \`/config-sorteios add-channel\` para adicionar um canal de sorteio!`)
                    ]
                })
                return;
            }

            const channelSorteio = client.channels.cache.get(guildConfig.canalDeSorteioID);
            const premio = interaction.options.getString('prêmio');
            const host = interaction.options.getUser("host");
            const quantiaDeGanhadores = interaction.options.getString("quantia-de-ganhadores");
            const requisitosDeCargos = interaction.options.getString('requesitos-de-cargos');
            const requisitos = interaction.options.getString("requisitos");
            let getTempoDeSorteio = interaction.options.getString(`tempo-sorteio`);
            let getTempoDeClaim = interaction.options.getString(`tempo-claim`);
            let TempoDeSorteio_Completo;
            let TempoDeClaim_Completo;
            let entradas = [];

            if (!getTempoDeSorteio && !sorteios.tempoSorteioDefault) {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setTitle(`${emojis.errForTitle} | Nenhum tempo de sorteio e nem padrão foram definidos!`)
                            .setDescription(`> Por favor, use novamente o comando definindo o \`tempo de sorteio\` ou configure o padrão de tempo de sorteio utilizando o comando \`/config-sorteios add-default-tempo-sorteio\``)
                    ]
                })
                return;
            }

            if (!getTempoDeClaim && !sorteios.tempoClaimDefault) {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setTitle(`${emojis.errForTitle} | Nenhum tempo de claim e nem padrão foram definidos!`)
                            .setDescription(`> Por favor, use novamente o comando definindo o \`tempo de claim\` ou configure o padrão de tempo de claim utilizando o comando \`/config-sorteios add-default-tempo-claim\``)
                    ]
                })
                return;
            }

            !getTempoDeSorteio ? getTempoDeSorteio = sorteios.tempoSorteioDefault : getTempoDeSorteio = stringMS(getTempoDeSorteio), TempoDeSorteio_Completo = formatTime(getTempoDeSorteio);
            !getTempoDeClaim ? getTempoDeClaim = sorteios.tempoClaimDefault : getTempoDeClaim = stringMS(getTempoDeClaim), TempoDeClaim_Completo = formatTime(getTempoDeClaim);

            if (getTempoDeSorteio == 'err' || getTempoDeClaim == 'err') {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setTitle(`${emojis.errForTitle} | Há caracteres desconhecidos no tempo definido!`)
                            .setDescription(`> Por favor, use novamente o comando definindo o \`tempo de sorteio ou claim\` de maneira correta`)
                    ]
                })
                return;
            };

            if (getTempoDeSorteio == 'tempo máximo excedido' || getTempoDeClaim == 'tempo máximo excedido') {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setTitle(`${emojis.errForTitle} | Tempo máximo excedido!`)
                            .setDescription(`> Por favor, use novamente o comando definindo o \`tempo de sorteio ou claim\` de maneira correta`)
                    ]
                })
                return;
            };

            if (getTempoDeSorteio < 5000 || getTempoDeClaim < 5000) {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setTitle(`${emojis.errForTitle} | Tempo mínimo não definido`)
                            .setDescription(`> Por favor, use novamente o comando definindo o \`tempo de sorteio ou claim\` de maneira correta (tempo mínimo: 5 segundos)`)
                    ]
                })
                return;
            };

            if (host.bot) {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setTitle(`${emojis.errForTitle} | O host não pode ser um bot!`)
                            .setDescription(`> Por favor, use novamente o comando definindo o \`host\` de maneira correta`)
                    ]
                })
                return;
            }

            let button = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("entrada")
                    .setEmoji("🎉")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("cancelar")
                    .setEmoji("⚪")
                    .setLabel('Cancelar')
                    .setStyle(ButtonStyle.Danger),
            );

            let embed = new EmbedBuilder()
                .setAuthor({ name: `Novo sorteio!`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setTitle(premio)
                .setDescription(
                    `\`Sorteio iniciado pelo:\` ${interaction.user.username}\n` +
                    `\`Host (pessoa necessária para dar claim):\` ${host}\n` +
                    `\`Quantia de ganhadores:\` ${quantiaDeGanhadores}\n` +
                    `\`Entradas:\` 0\n\n` +
                    `\`Tempo do sorteio:\` ${TempoDeSorteio_Completo}\n` +
                    `\`Tempo de claim:\` ${TempoDeClaim_Completo}\n` +
                    `Clique no botão \`🎉\` para participar.\n**Boa sorte!!!**`
                )
                .setTimestamp()
                .setFooter({ text: "Data do sorteio:" })
                .setColor("Green");

            //  errors: ['time']

            let mensagemDoSorteio;

            interaction.deferReply({ ephemeral: true })

            try {
                mensagemDoSorteio = await channelSorteio.send(`${emojis.loading} | Estou criando um sorteio, aguarde...`);
                interaction.editReply(`${emojis.loading} | Estou criando seu sorteio, aguarde, por favor!`);
            } catch (error) {
                mensagemDoSorteio.edit(`${emojis.err} | Ocorreu um erro ao criar uma sorteio para este canal! Por favor, tente novamente.`);
                console.log(error);
                return;
            }
            const idDoSorteio = randomUUID()

            let novoSorteio = new Sorteios({
                guildId: interaction.guild.id,
                sorteioId: idDoSorteio,
                tempoSorteio: getTempoDeSorteio,
                tempoClaim: getTempoDeClaim,
                authorId: interaction.user.id,
                messageId: mensagemDoSorteio.id,
                hostId: host.id,
                premio: premio,
                quantiaDeGanhadores: quantiaDeGanhadores,
            });

            await novoSorteio.save();

            interaction.editReply(`${emojis.check} | Sorteio criado com sucesso! Caso queria \`finalizar\`, \`editar\` ou \`gerar novos ganhadores\`, utilize este ID: \`\`${idDoSorteio}\`\`. E não se preocupe caso perca este ID, ele estará disponível no conteúdo do sorteio também!`);

            mensagemDoSorteio.edit({
                content: `**ID DO SORTEIO: ${idDoSorteio}**`,
                embeds: [embed],
                components: [button]
            })

            const coletorDoSorteio = mensagemDoSorteio.createMessageComponentCollector({ componentType: ComponentType.Button, time: getTempoDeSorteio })

            coletorDoSorteio.on("end", (i) => {
                mensagemDoSorteio.edit({
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId("entrada")
                                .setEmoji("🎉")
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setCustomId("cancelar")
                                .setEmoji("⚪")
                                .setLabel('Cancelar')
                                .setStyle(ButtonStyle.Danger)
                                .setDisabled(true),
                        )
                    ]
                });
            });

            coletorDoSorteio.on("collect", async (i) => {
                switch (i.customId) {
                    case 'entrada': {
                        const participante = i.user
                        if (entradas.includes(participante.id)) return i.reply({ content: `Olá ${participante}, você já está participando do sorteio!`, ephemeral: true });

                        entradas.push(participante.id)
                        i.reply({ content: `Olá ${participante}, você entrou no sorteio!`, ephemeral: true });

                        embed = embed.setDescription(
                            `\`Sorteio iniciado pelo:\` ${interaction.user.username}\n` +
                            `\`Host (pessoa necessária para dar claim):\` ${host}\n` +
                            `\`Quantia de ganhadores:\` ${quantiaDeGanhadores}\n` +
                            `\`Entradas:\` ${entradas.length}\n\n` +
                            `\`Tempo do sorteio:\` ${TempoDeSorteio_Completo}\n` +
                            `\`Tempo de claim:\` ${TempoDeClaim_Completo}\n` +
                            `Clique no botão \`🎉\` para participar.\n**Boa sorte!!!**`
                        )

                        mensagemDoSorteio.edit({ embeds: [embed] })
                    } break;

                    case 'cancelar': {
                        await i.deferUpdate();
                        embed = embed.setDescription(
                            `**INFORMAÇÕES:**\n` +
                            `\`Sorteio iniciado pelo:\` ${interaction.user.username}\n` +
                            `\`Host (pessoa necessária para dar claim):\` ${host}\n` +
                            `\`Quantia de ganhadores:\` ${quantiaDeGanhadores}\n` +
                            `\`Entradas:\` ${entradas.length}\n\n` +
                            `\`Tempo do sorteio:\` ${TempoDeSorteio_Completo}\n` +
                            `\`Tempo de claim:\` ${claimCompleto}\n`)

                        await mensagemDoSorteio.edit({
                            embeds: [embed], content: `**SORTEIO MAMADO!**`, components: [
                                new ActionRowBuilder().addComponents(
                                    new ButtonBuilder()
                                        .setCustomId("entrada")
                                        .setEmoji("🎉")
                                        .setStyle(ButtonStyle.Success)
                                        .setDisabled(true),
                                    new ButtonBuilder()
                                        .setCustomId("cancelar")
                                        .setEmoji("⚪")
                                        .setLabel('Cancelar')
                                        .setStyle(ButtonStyle.Danger)
                                        .setDisabled(true),
                                )
                            ]
                        })
                        novoSorteio.sorteioCancelado = true,
                            await novoSorteio.save();
                    } break;
                    default: break;
                }
            })

            setTimeout(async () => {
                if (novoSorteio.sorteioCancelado == true) return;
                switch (quantiaDeGanhadores) {
                    case '1': {
                        if (entradas.length == 0) {
                            embed = embed.setDescription(
                                `**INFORMAÇÕES:**\n` +
                                `\`Sorteio iniciado pelo:\` ${interaction.user.username}\n` +
                                `\`Host (pessoa necessária para dar claim):\` ${host}\n` +
                                `\`Quantia de ganhadores:\` ${quantiaDeGanhadores}\n` +
                                `\`Entradas:\` ${entradas.length}\n\n` +
                                `\`Tempo do sorteio:\` ${TempoDeSorteio_Completo}\n` +
                                `\`Tempo de claim:\` ${claimCompleto}\n`)

                            mensagemDoSorteio.edit({content: `**SORTEIO CANCELADO!** Não houveram participantes o suficiente para realizar o sorteio.`, embeds: [embed], components: []})

                            await Sorteios.findOneAndRemove({ guildId: interaction.guild.id, sorteioId: idDoSorteio })
                            return;
                        }
                        let ganhadorFinal = entradas[Math.floor(Math.random() * entradas.length)]

                        novoSorteio.ganhadores.push(ganhadorFinal);
                        await novoSorteio.save();

                        mensagemDoSorteio.reply(`**Parabéns <@${ganhadorFinal}> você ganhou o sorteio: \`${premio}\`.\nDigite no chat-geral: "${host} claim" para resgatar seu prêmio!**`)

                        setTimeout(() => {
                            if(novoSorteio.ganhadoresNoClaim) {
                                mensagemDoSorteio.reply(`${emojis.err} | O ganhador ${novoSorteio.ganhadores[0]} não deu claim!`)
                            }
                        }, getTempoDeClaim);

                    } break;

                    default: {} break;
                }
            }, getTempoDeSorteio);

        } catch (error) {
            console.log(`ERRO NO COMANDO DE SORTEIO: /sorteio:`, error);
        }
    }
}