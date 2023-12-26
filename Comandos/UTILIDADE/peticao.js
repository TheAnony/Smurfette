const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const emojis = require('../../emojis.json')
const Petition = require(`../../Models/Peticao`)
const GuildConfig = require('../../Models/GuildConfig');
const { petitionProgressBar } = require('../../utils/petitionProgressBar')

module.exports = {
    name: "peticao", // Coloque o nome do comando
    description: "『 UTILIDADE 』Inicie uma petição", // Coloque a descrição do comando
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'title',
            description: `Me diga o título da petição`,
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'description',
            description: `Me diga a descrição da petição`,
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'goal',
            description: `Me diga a meta de assinaturas (max: 100)`,
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
    ],
    
    run: async (client, interaction) => {
        const petitionGoal = interaction.options.getInteger("goal");
        if(petitionGoal < 5) { 
            interaction.reply(`${emojis.err} | O número mínimo de meta de assinaturas é 5!`) 
            return
        }
        interaction.deferReply();

        try {
            const guildConfig = await GuildConfig.findOne({ guildId: interaction.guild.id });

            if (!guildConfig?.canalDePeticoes) {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setTitle(`${emojis.errForTitle} | Nenhum canal de petições foi configurado!`)
                            .setDescription(`> Por favor, utilize o comando \`config-petition adicionar\` para adicionar um canal de petições!`)
                    ]
                })
                return;
            }

            const petitionChannelSend = client.channels.cache.get(guildConfig.canalDePeticoes)
            const petitionTitle = interaction.options.getString("title");
            const petitionDescription = interaction.options.getString("description");

            let mensagemDeSugestao;

            try {
                mensagemDeSugestao = await petitionChannelSend.send(`${emojis.loading} | Estou criando sua petição... Aguarde, por favor`);
            } catch (error) {
                interaction.editReply(`${emojis.err} | Ocorreu um erro ao criar uma petição para este canal! Por favor, tente novamente.`);
                console.log(error);
                return;
            }

            const newPetition = new Petition({
                title: petitionTitle,
                signatures: 0,
                GuildID: interaction.guild.id,
                signedUsers: [],
                authorId: interaction.user.id,
                goal: petitionGoal,
                progressMessageId: mensagemDeSugestao.id,
                description: petitionDescription
            })
            await newPetition.save();

            const petitionId = newPetition.petitionId
            const buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`sign.${petitionId}.new`)
                    .setLabel(`Assinar Petição`)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("📩"),
                new ButtonBuilder()
                    .setCustomId(`sign.${petitionId}.cancel`)
                    .setLabel(`Cancelar Petição`)
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji("1157663872220680212")
            )

            mensagemDeSugestao.edit({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(petitionTitle)
                        .setDescription(`**${petitionDescription}**\n\n> PROGRESSO:\n> 0/${petitionGoal} assinaturas.`)
                        .setFields([
                            { name: `Barra de progresso:`, value: `${petitionProgressBar(0, petitionGoal)}` }
                        ])
                ], components: [buttons], content: `**Nova petição do ${interaction.user}!**`
            })

            await interaction.editReply(`${emojis.check} | Petição criada com sucesso!`)

            newPetition.progressMessageId = mensagemDeSugestao.id

            /* 
    
            const progressMessageId = progressMessage.send({content: `✍️ PETIÇÃO NOVA!`, embeds: [
                new EmbedBuilder()
                .setTitle(petitionTitle)
                .setDescription(`**${petitionDescription}**\n\n> PROGRESSO:\n> 0/${petitionGoal} assinaturas.`)
            ], components: [button]})
    
            newPetition.progressMessageId = progressMessageId
            newPetition.save();
    
            await interaction.reply(`${emojis.check} | A sua petição foi criada com sucesso! [Veja aqui](https://discord.com/channels/${interaction.guild.id}/1177609603207405598/${progressMessageId})`) */
        } catch (error) {
            console.log(`ERRO NO COMANDO DE PETIÇÃO`, error);
        }
    }
}