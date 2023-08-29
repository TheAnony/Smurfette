const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js")
const ms = require('ms')

module.exports = {
    name: "gerar-numero-aleatorio", // Coloque o nome do comando
    description: "『 UTILIDADE 』Gera um número aleatório com valor inciail e final!", // Coloque a descrição do comando
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'número-mínimo',
            description: `Insira um número mínimo/inicial.`,
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
        {
            name: 'número-máximo',
            description: `Insira um número máximo/final.`,
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
    ],

    run: async (client, interaction) => {
        let min = interaction.options.getInteger('número-mínimo');
        let max = interaction.options.getInteger('número-máximo');
        if (min > max) {
            return interaction.reply({ content: `**Ei, o número ${min} é maior que o número ${max}!**`, ephemeral: true })
        } else if (min == max) return interaction.reply({ content: `**Ei, o número ${min} é igual ao número ${max}!**`, ephemeral: true })

        let button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("botao")
                .setEmoji("🔁")
                .setStyle(ButtonStyle.Success)
                .setLabel('Gerar novo número')
        );

        let embed = new EmbedBuilder()
            .setFooter({ text: `/gerar-numero-aleatorio`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
            .setDescription(`## \`Número gerado:\` ###\n${gerarNumeroAleatorio(min, max)}`)
            .setColor('Green')

        await interaction.reply({
            embeds: [embed], components: [button]
        })

        const filter = (i) => i.user.id === interaction.user.id
        const coletor = interaction.channel.createMessageComponentCollector({ filter, time: ms('2m') });


        coletor.on("end", () => {
            interaction.editReply({
                embeds: [embed], components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId("botao")
                            .setEmoji("🔁")
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel('Gerar novo número')
                            .setDisabled(true)
                    )
            ]
            });
        });


        coletor.on("collect", () => {
            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setFooter({ text: `/gerar-numero-aleatorio`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
                        .setDescription(`## \`Novo número gerado:\` ###\n${gerarNumeroAleatorio(min, max)}`)
                        .setColor('Green')
                ], components: [button]
            })
        })

        function gerarNumeroAleatorio(min, max) {
            const randomDecimal = Math.random();
            const valorAleatorio = min + Math.floor(randomDecimal * (max - min + 1));

            return valorAleatorio;
        }
    }
}