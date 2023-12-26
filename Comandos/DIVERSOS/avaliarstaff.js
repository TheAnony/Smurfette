const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType,
  ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const ms = require('ms')
const GuildConfig = require('../../Models/GuildConfig');
const emojis = require('../../emojis.json');

module.exports = {
  name: "avaliar-staff", // Coloque o nome do comando
  description: "『 STAFF 』Avalie um staff do servidor.", // Coloque a descrição do comando
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'staff',
      description: `Qual staff deseja avaliar?`,
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'estrelas',
      description: `Dê uma nota de 1 a 5 estrelas para o staff escolhido.`,
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: '⭐', value: '1-estrela' },
        { name: '⭐⭐', value: '2-estrelas' },
        { name: '⭐⭐⭐', value: '3-estrelas' },
        { name: '⭐⭐⭐⭐', value: '4-estrelas' },
        { name: '⭐⭐⭐⭐⭐', value: '5-estrelas' },
      ],
    },
    {
      name: 'descrição',
      description: `Descreva sua experiência com o staff escolhido`,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client, interaction) => {
    try {
      const guildConfig = await GuildConfig.findOne({ guildId: interaction.guild.id });

      if (!guildConfig?.canalDeAvaliarStaff) {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('Red')
              .setTitle(`${emojis.errForTitle} | Nenhum canal de avaliar staff foi configurado!`)
              .setDescription(`> Por favor, utilize o comando \`config-avaliacaostaff adicionar\` para adicionar um canal de avaliar staff!`)
          ]
        })
        return;
      }

      if (!guildConfig?.roleStaff) {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('Red')
              .setTitle(`${emojis.errForTitle} | Nenhum cargo de avaliar staff foi configurado!`)
              .setDescription(`> Por favor, utilize o comando \`config-rolestaff adicionar\` para adicionar um cargo de avaliar staff!`)
          ]
        })
        return;
      }

      const staffRoleID = interaction.guild.roles.cache.get(guildConfig.roleStaff)
      const channelSend = interaction.guild.channels.cache.get(guildConfig.canalDeAvaliarStaff);
      const User = interaction.options.getUser('staff')
      const staffer = interaction.guild.members.cache.get(User.id)
      const stars = interaction.options.getString('estrelas')
      const desc = interaction.options.getString('descrição')

      if (User.bot) return interaction.reply({ ephemeral: true, content: `**ESTE USUÁRIO É UM BOT!**` })
      if (!staffer.roles.cache.some(role => role.id === staffRoleID.id)) return interaction.reply({ ephemeral: true, content: `**ESTE USUÁRIO NÃO É UM STAFF!**` })


      let quantiaDeEstrelas = {
        '1-estrela': '⭐ (1/5)',
        '2-estrelas': '⭐⭐ (2/5)',
        '3-estrelas': '⭐⭐⭐ (3/5)',
        '4-estrelas': '⭐⭐⭐⭐ (4/5)',
        '5-estrelas': '⭐⭐⭐⭐⭐ (5/5)',
      }
      let estrelasDoStaff = quantiaDeEstrelas[stars]


      let embed = new EmbedBuilder()
        .setFooter({ text: `/avaliar-staff`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
        .setColor('Blurple')
        .setTitle(`#Enviado pelo: ${interaction.user.username}`)
        .setDescription(`### - Staff: ${staffer} (${staffer.id})\n### Total de estrelas: ${estrelasDoStaff}\n\n### Descrição:\`\`\`${desc}\`\`\``)

      let button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('button')
          .setLabel('Responder')
          .setEmoji('💬')
          .setStyle(ButtonStyle.Primary)
      )

      let buttonEnd = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('button')
          .setLabel('Respondido!')
          .setEmoji('💬')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true)
      )

      await channelSend.send({ content: `||${staffer}||`, embeds: [embed], components: [button] }).then(async (msg) => {
        await interaction.reply({ ephemeral: true, content: `Sua avaliação ao staffer ${staffer} foi enviada com sucesso!` })

        const coletor = msg.createMessageComponentCollector({
          filter: i => i.user.id === User.id, componentType: ComponentType.Button, max: 1, time: ms('2m')
        });

        coletor.on("end", async (i) => {
          msg.edit({ components: [buttonEnd] });
        });

        coletor.on("collect", async (i) => {
          await i.deferUpdate()
          if (!i.customId === 'button') return;
          channelSend.send(`POR FAVOR ${staffer}, DIGITE SUA RESPOSTA.`).then((mensagemReply) => {

            let coletorDaResposta = channelSend.createMessageCollector({ filter: i => staffer.id === User.id, max: 1, time: ms('1h') })

            coletorDaResposta.on('end', () => { })

            coletorDaResposta.on('collect', resposta => {
              resposta.delete() && mensagemReply.delete();
              msg.reply({
                content: `||${interaction.user}||`, embeds: [
                  new EmbedBuilder()
                    .setColor('Green')
                    .setDescription(`### - Resposta de ${User} ao ${interaction.user}: \`\`\`${resposta}\`\`\``)
                ]
              })
            })

          })
        })
      })
    } catch (error) {
      console.log(`ERRO NO AVALIARSTAFF.js: `, error);
    }
  }
}
