const { EmbedBuilder, ApplicationCommandType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const GuildConfig = require('../../Models/GuildConfig');
const Sugestao = require('../../Models/Sugestao');
const emojis = require('../../emojis.json')
const { stringMS } = require('../../funcoes');
const { formatarResultados } = require('../../utils/formatarResultados')

module.exports = {
  name: "sugerir", // Coloque o nome do comando
  description: "『 UTILIDADE 』Faça uma sugestão!", // Coloque a descrição do comando
  type: ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    try {
      const guildConfig = await GuildConfig.findOne({ guildId: interaction.guild.id });
      const channelSugestao = client.channels.cache.get(guildConfig.canaisDeSugestoesIDs)

      if (!guildConfig?.canaisDeSugestoesIDs) {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('Red')
              .setTitle(`${emojis.errForTitle} | Nenhum canal de sugestões foi configurado!`)
              .setDescription(`> Por favor, utilize o comando \`config sugestoes adicionar\` para adicionar um canal de sugestões!`)
          ]
        })
        return;
      }

      const modal = new ModalBuilder()
        .setTitle("Digite sua sugestão")
        .setCustomId(`sugestao-${interaction.user.id}`);

      const textInput = new TextInputBuilder()
        .setCustomId('sugestao-input')
        .setLabel(`O que você gostaria de sugerir?`)
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(1000);

      const actionRow = new ActionRowBuilder().addComponents(textInput);

      modal.addComponents(actionRow);

      await interaction.showModal(modal);

      const filter = (i) => i.customId === `sugestao-${interaction.user.id}`;

      const modalInteraction = await interaction.awaitModalSubmit({ filter, time: stringMS('5min') }).catch((error) => console.log(error));

      await modalInteraction.deferReply({ ephemeral: true });

      let mensagemDeSugestao;

      try {
        mensagemDeSugestao = await channelSugestao.send(`${emojis.loading} | Estou criando sua sugestão... Aguarde, por favor`);
      } catch (error) {
        modalInteraction.editReply(`${emojis.err} | Ocorreu um erro ao criar uma sugestão para este canal! Por favor, tente novamente.`);
        return;
      }

      const textoDeSugestao = modalInteraction.fields.getTextInputValue('sugestao-input');

      const novaSugestao = new Sugestao({
        authorId: interaction.user.id,
        guildId: interaction.guild.id,
        messageId: mensagemDeSugestao.id,
        content: textoDeSugestao
      });

      await novaSugestao.save();

      modalInteraction.editReply(`${emojis.check} | Sugestão criada com sucesso!`);

      const embedDaSugestao = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 256 }) })
        .addFields([
          { name: 'Sugestão', value: textoDeSugestao },
          { name: `Status:`, value: `${emojis.loading} Pendente` },
          { name: 'Votos:', value: formatarResultados() }
        ])
        .setColor('Yellow');

      const upvoteButton = new ButtonBuilder()
        .setEmoji('👍')
        .setLabel('Upvote')
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`sugestao.${novaSugestao.sugestaoId}.upvote`);

      const downvoteButton = new ButtonBuilder()
        .setEmoji('👎')
        .setLabel('Downvote')
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`sugestao.${novaSugestao.sugestaoId}.downvote`);

      const approveButton = new ButtonBuilder()
        .setEmoji(emojis.checkForTitle)
        .setLabel(`Aprovar`)
        .setStyle(ButtonStyle.Success)
        .setCustomId(`sugestao.${novaSugestao.sugestaoId}.approve`);

      const rejectButton = new ButtonBuilder()
        .setEmoji(emojis.errForTitle)
        .setLabel(`Reprovar`)
        .setStyle(ButtonStyle.Danger)
        .setCustomId(`sugestao.${novaSugestao.sugestaoId}.reject`);

      const firstRow = new ActionRowBuilder().addComponents(upvoteButton, downvoteButton);
      const secondRow = new ActionRowBuilder().addComponents(approveButton, rejectButton);

      mensagemDeSugestao.edit({
        content: `${interaction.user} Sugestão criada!`,
        embeds: [embedDaSugestao],
        components: [firstRow, secondRow]
      })
    } catch (error) {
      console.log(`ERRO NO COMANDO DE SUGESTÃO: /suggest`, error);
    }
  }
}