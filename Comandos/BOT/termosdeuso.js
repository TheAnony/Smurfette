const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder,
    ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js")
const { QuickDB } = require('quick.db')
const db = new QuickDB();
const ms = require('ms')

module.exports = {
    name: "termos-de-uso", // Coloque o nome do comando
    description: "『 BOT 』Fornece o documento dos Termos de Uso.", // Coloque a descrição do comando
    type: ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        let pagAtual = 'pag1'

        let rowPag1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setEmoji("◀️")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true)
                .setCustomId('voltar'),
            new ButtonBuilder()
                .setCustomId("acessarPag2")
                .setEmoji("▶️")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('lido')
                .setEmoji("✅")
                .setStyle(ButtonStyle.Success)
                .setDisabled(true)
        )

        let rowPag2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("voltarPag1")
                .setEmoji("◀️")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("acessarPag3")
                .setEmoji("▶️")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('lido')
                .setEmoji("✅")
                .setStyle(ButtonStyle.Success)
                .setDisabled(true)
        )

        let rowPag3 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('voltarPag2')
                .setEmoji("◀️")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('a')
                .setEmoji("▶️")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('lido')
                .setEmoji("✅")
                .setStyle(ButtonStyle.Success)
        )

        let rowCollEnd = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("buttonAnterior")
                .setEmoji("◀️")
                .setDisabled(true)
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("buttonNext")
                .setEmoji("▶️")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId("buttonLido")
                .setEmoji("✅")
                .setDisabled(true)
                .setStyle(ButtonStyle.Success)
        )

        const embedPag1 = new EmbedBuilder()
            .setAuthor({ name: 'Smurfette', iconURL: client.user.displayAvatarURL({ dynaimc: true }) })
            .setFooter({ text: '📃 | Termos de Uso. Página 1/3' })
            .setTitle('Termos de Uso da Smurfette')
            .setDescription(`_Este documento estabelece os termos de uso para o serviço fornecido pelo bot Smurfette. Ao utilizar os comandos do bot, você concorda em cumprir com os seguintes termos e condições:_
            
            - 1. **Uso Responsável:**
            O bot Smurfette oferece comandos para serem usados livremente pelos usuários. No entanto, o uso indevido de certos comandos, como "/report" e "/reportar-bug", que têm um propósito mais sério, pode resultar em risco de inclusão na lista de banidos ("blacklist"). Isso significa que o autor não poderá acessar os serviços da Smurfette por tempo indeterminado. Caso ocorra tal situação, o usuário tem a opção de entrar em contato com o proprietário do bot para análise da situação.
            
            - 2. **Manipulação ou Tentativa de Dano:**
            Qualquer tentativa de manipular, explorar ou "crashear" o bot Smurfette será tratada com seriedade. Qualquer membro que tente burlar o bot ou cause danos intencionais será imediatamente incluído na blacklist.**`)

        const embedPag2 = new EmbedBuilder()
            .setAuthor({ name: 'Smurfette', iconURL: client.user.displayAvatarURL({ dynaimc: true }) })
            .setFooter({ text: '📃 | Termos de Uso. Página 2/3' })
            .setDescription(`- 3. **Respeito às Normas:**
            Ao utilizar o bot Smurfette, você concorda em respeitar todas as regras, regulamentos e orientações fornecidas pelo bot, bem como pelos administradores dos servidores em que o bot é utilizado.\n\n` +

                `- 4. **Alterações nos Termos:**
            Os termos de uso podem ser atualizados periodicamente. Quaisquer alterações entrarão em vigor assim que forem publicadas.\n\n`+

                `- 5. **Contato:**
            Para discutir questões relacionadas a inclusões na blacklist ou para qualquer dúvida, entre em contato com o proprietário do bot Smurfette ou contate o email: theanonimooo14@gmail.com`)

        const embedPag3 = new EmbedBuilder()
            .setAuthor({ name: 'Smurfette', iconURL: client.user.displayAvatarURL({ dynaimc: true }) })
            .setFooter({ text: '📃 | Termos de Uso. Página 3/3' })
            .setDescription(`Ao usar o bot Smurfette, você confirma ter lido, compreendido e concordado com estes termos de uso. Se você não concordar com os termos descritos, recomendamos que pare de usar o bot imediatamente.

            Para confimar concorda com o documento e compreende que qualquer ação que viole os termos, o sujeito em questão estará sujeito a punição severa, clique no botão verde.

            Agradecemos por escolher usar o bot Smurfette e por respeitar nossos termos de uso.`)

        interaction.reply({ embeds: [embedPag1], components: [rowPag1] }).then(async (msg) => {
            const filter = (i) => i.user.id === interaction.user.id

            const coletor = msg.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: ms('5m') })

            coletor.on('end', () => {
                interaction.editReply({ components: rowCollEnd })
            })

            coletor.on('collect', async (i) => {
                console.log(i.customId)
                switch (i.customId) {
                    case 'acessarPag2':
                        interaction.editReply({ embeds: [embedPag2], components: [rowPag2] })

                        break;

                    case 'voltarPag1':
                        interaction.editReply({ embeds: [embedPag1], components: [rowPag1] })

                        break;

                    case 'acessarPag3':
                        interaction.editReply({ embeds: [embedPag3], components: [rowPag3] })

                        break;

                    case 'voltarPag2':
                        interaction.editReply({ embeds: [embedPag2], components: [rowPag2] })

                        break;

                    case 'lido':
                        let objeto = await db.get(`Users_termosLido.users`)
                        if (objeto.includes(interaction.user.id)) return interaction.followUp({
                            content: `**Você já concordou com os termos de uso!**`, ephemeral: true
                        })
                        
                        await db.push(`Users_termosLido.users`, interaction.user.id),
                            interaction.followUp({ content: `**✅ | Confirmado!**`, ephemeral: true })

                        break;

                    default:
                        break;
                }
            })
        })


    }
}