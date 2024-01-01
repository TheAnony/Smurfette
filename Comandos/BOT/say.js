const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ChannelType, PermissionFlagsBits } = require("discord.js")
const { QuickDB } = require('quick.db')
const db = new QuickDB();

module.exports = {
  name: "say", // Coloque o nome do comando
  description: "『 BOT 』Faz o bot falar qualquer coisa!", // Coloque a descrição do comando
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'messagem',
      description: `Me faça falar qualquer coisa normalmente!`,
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: 'embed',
      description: `Me faça falar no formato de embed!`,
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: 'canal',
      description: `Escolha um canal!`,
      type: ApplicationCommandOptionType.Channel,
      channelTypes: [ChannelType.GuildText],
      required: false,
    },
  ],

  run: async (client, interaction) => {
    try {
      if (interaction.member.permissions.has(PermissionFlagsBits.ManageMessages) || interaction.user.id === '430502315108335617') {
        let embed_fala = interaction.options.getString("embed");
        let normal_fala = interaction.options.getString("messagem");
        let canal = interaction.options.getChannel("canal") || interaction.channel

        if (!embed_fala && !normal_fala) {
          interaction.reply(`Escreva pelo menos em uma das opções.`)
        } else {
          if (!embed_fala) embed_fala = "⠀";
          if (!normal_fala) normal_fala = "⠀";

          let embed = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(embed_fala);

          let enviarMensagem = function () {
            if (canal.id === interaction.channel.id) return;
            interaction.reply({ content: `Sua mensagem foi enviada!`, ephemeral: true })
          }

          if (embed_fala === "⠀") {
            enviarMensagem();
            canal.send({ content: `${normal_fala}` })
          } else if (normal_fala === "⠀") {
            enviarMensagem();
            canal.send({ embeds: [embed] })
          } else {
            enviarMensagem();
            canal.send({ content: `${normal_fala}`, embeds: [embed] })
          }
        }
      } else {
        return interaction.reply({ content: `**Você não tem permissão de utilizar esse comando! Permissão necessária: \`Gerenciar Mensagens\`**`, ephemeral: true })
      }
    } catch (error) {
      console.log(error);
    }
  }
}