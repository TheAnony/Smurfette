const { ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits,
    EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { QuickDB } = require('quick.db')
const db = new QuickDB();
const ms = require('ms')

module.exports = {
    name: "permrole-config", // Coloque o nome do comando
    description: "『 STAFF 』Adicione ou remova cargos que tem permissão de utilizar meus comandos!", // Coloque a descrição do comando
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'configurações',
            description: `Selecione um subcomando.`,
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'set',
                    description: `Registra ou exclui uma permrole setada.`,
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'cargo',
                            description: `Informe qual cargo deseja adicionar/remover.`,
                            type: ApplicationCommandOptionType.Role,
                            required: true,
                        }
                    ]
                },
                {
                    name: 'list',
                    description: `Fornece a lista das permroles ativas.`,
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: 'delete-all',
                    description: `Apaga todas as permroles setadas.`,
                    type: ApplicationCommandOptionType.Subcommand,
                },
            ]
        },
    ],

    run: async (client, interaction) => {
        const subcommand = interaction.options.getSubcommand()
        switch (subcommand) {
            case 'set':
                setPermRole()
                break;

            case 'list':
                listPermRole()
                break;

            case 'delete-all':
                deleteAll()
                break;

            default:
                break;
        }

        async function setPermRole() {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ ephemeral: true, content: `**Você não tem permissão de utilizar este comando!**` })
            const cargo = interaction.options.getRole('cargo')

            let cargos = await db.get(`ArrayCargos.roles`)
            !cargos ? await db.set(`ArrayCargos`, { roles: [] }) : null

            ////// SE TIVER - SE TIVER - SE TIVER
            if (cargos.includes(cargo.id)) {

                await db.pull(`ArrayCargos.roles`, cargo.id)
                let stylwe = await db.get(`ArrayCargos.roles`)
                let valoresGerados = [];
                for (let index = 0; index < stylwe.length; index++) {
                    const element = `<@&${stylwe[index]}>`
                    valoresGerados.push(element)
                }
                interaction.reply(`**O CARGO \`${cargo.name}\` NÃO TEM MAIS PERMISSÃO DE UTILIZAR MEUS COMANDOS!**\n### Lista atual de cargos que tem permissão: \n${valoresGerados.join(`, \n`)}`);

            }
            ////// SE NÃO TIVER - SE NÃO TIVER - SE NÃO TIVER
            if (cargos.includes(cargo.id) == false) {

                await db.push(`ArrayCargos.roles`, cargo.id)
                let stylwe = await db.get(`ArrayCargos.roles`)
                let valoresGerados = [];
                for (let index = 0; index < stylwe.length; index++) {
                    const element = `<@&${stylwe[index]}>`
                    valoresGerados.push(element)
                }
                interaction.reply(`**ADICIONANDO O CARGO \`${cargo.name}\` A LISTA...**\n### Lista atual de cargos que tem permissão: \n${valoresGerados.join(`, \n`)}`)

            }
        }

        async function listPermRole() {
            let stylwe = await db.get(`ArrayCargos.roles`)
            !stylwe ? await db.set(`ArrayCargos`, { roles: [] }) : null

            let valoresGerados = [];
            for (let i = 0; i < stylwe.length; i++) {
                const element = `<@&${stylwe[i]}>, `
                valoresGerados.push(element)
            }

            for (let w = 0; w < valoresGerados.length; w++) {
                valoresGerados[w] = valoresGerados[w].replace(/,\s+/g, ",").replace(/^,|,\s*$/g, "")
            }

            let embed = new EmbedBuilder()
                .setTitle(`Lista da permRole:`)
                .setDescription(`\n${valoresGerados.length == 0 ? `<a:megumiOK:1135637493790822450> Não se preocupe, não está tão vazio comigo aqui!` : valoresGerados.join(", ") /*.replace(/,\s+/g, ",").replace(/^,|,\s*$/g, "")*/}`)
                .setColor('Blue')
            await interaction.reply({ embeds: [embed] })
        }

        async function deleteAll() {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ ephemeral: true, content: `**Você não tem permissão de utilizar este comando!**` })
            let cargos = await db.get(`ArrayCargos.roles`)
            let valoresGerados = [];

            for (let index = 0; index < cargos.length; index++) {
                const element = `<@&${cargos[index]}>,`
                valoresGerados.push(element)
            }

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
                    .setCustomId("confirm")
                    .setEmoji("✅")
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId("cancel")
                    .setEmoji("⛔")
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true)
                    
            )
            interaction.reply({ content: `**VOCÊ REALMENTE DESEJA REALIZAR ESSA AÇÃO?**`, components: [button] }).then(async (msg) => {
                
                const filter = (i) => i.user.id === interaction.user.id
                const coletor = msg.createMessageComponentCollector({
                    filter, max: 1, time: ms('2m')
                });

                coletor.on("end", async (i) => {
                    interaction.editReply({ components: [buttonDisabled] });
                });

                coletor.on("collect", async (i) => {

                    if (i.customId === "confirm") {
                        interaction.editReply({ components: [buttonDisabled] })
                        await db.delete(`ArrayCargos.roles`)

                        await interaction.followUp(`**CARGOS DELETADOS! LISTA ANTIGA:** \n${valoresGerados.join(`, \n`)}`)
                    } else if (i.customId === "cancel") {
                        interaction.editReply({ components: [buttonDisabled] })
                        return interaction.channel.send(`**⛔ COMANDO CANCELADO!**`)
                    }

                });

            })
        }
    }
}