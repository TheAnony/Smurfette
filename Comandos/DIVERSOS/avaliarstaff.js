const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType,
  ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const ms = require('ms')

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
    const staffRoleID = '934896199666905158';
    const channelSend = interaction.guild.channels.cache.get('1132702126754238585');
    const User = interaction.options.getUser('staff')
    const staffer = interaction.guild.members.cache.get(User.id)
    const stars = interaction.options.getString('estrelas')
    const desc = interaction.options.getString('descrição')

    if(User.bot) return interaction.reply({ephemeral: true, content: `**ESTE USUÁRIO É UM BOT!**`})
    if(!staffer.roles.cache.some(role => role.id === staffRoleID)) return interaction.reply({ephemeral: true, content: `**ESTE USUÁRIO NÃO É UM STAFF!**`})
    

    function star() {
        let a = {
            '1-estrela': '⭐ (1/5)',
            '2-estrela': '⭐⭐ (2/5)',
            '3-estrela': '⭐⭐⭐ (3/5)',
            '4-estrela': '⭐⭐⭐⭐ (4/5)',
            '5-estrela': '⭐⭐⭐⭐⭐ (5/5)',
        }

        return a[stars]
    }

    let embed = new EmbedBuilder()
    .setFooter({text: `/avaliar-staff`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 })})
    .setColor('Blurple')
    .setTitle('#Enviado pelo: '+interaction.user.username || interaction.user)
    .setDescription(`### - Staff: ${staffer} (${staffer.id})\n### Total de estrelas: ${star()}\n\n### Descrição:\`\`\`${desc}\`\`\``)

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

    
    await channelSend.send({content: `||${staffer}||`, embeds: [embed], components: [button]}).then( async (msg) => {
       await interaction.reply({ ephemeral: true, content: `Sua avaliação ao staffer ${staffer} foi enviada com sucesso!`})

        const filter = (i) => i.user.id == User.id

        const coletor = channelSend.createMessageComponentCollector({
            filter, max: 1, time: ms('3d'),
          });

         coletor.on("end", async (i) => {
            interaction.editReply({components: [buttonEnd] });
        });

        coletor.on("collect", async (i) => {
            if(i.customId === 'button') {
                channelSend.send({content: `POR FAVOR, ${staffer}, DIGITE SUA RESPOSTA.`, ephemeral: true}).then(() => {

                    let col = channelSend.createMessageCollector({max: 1, time: ms('1h')})

                col.on('end', () => {})

                col.on('collect', resposta => {
                    

                    let embedResposta = new EmbedBuilder()
    .setColor('Green')
    .setTitle('#Respondido pelo: '+interaction.user.username || interaction.user)
    .setDescription(`### - Resposta de ${User} ao ${interaction.user}: \`\`\`${resposta}\`\`\``)

                interaction.reply({embeds: [embedResposta]})
                })
                
                })

    
                
            }
        })
    })
    
  }
}
