const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ChannelType } = require("discord.js")
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
        required: false,
      },
  ],

  run: async (client, interaction) => {
    let cargos = await db.get(`ArrayCargos.roles`)
    let valoresGerados = [];
        for (let index = 0; index < cargos.length; index++) {
          const element = cargos[index]
          valoresGerados.push(element)

        }
    if(!interaction.member.roles.cache.some(role => valoresGerados.includes(role.id))) return interaction.reply('**VOCÊ NÃO TEM A PERMROLE PARA UTILIZAR ESSE COMANDO!**')

        let embed_fala = interaction.options.getString("embed");
        let normal_fala = interaction.options.getString("messagem");
        let canal = interaction.options.getChannel("canal") || canal
        
        if(canal.type !== ChannelType.GuildText) interaction.reply(`**O canal ${canal} não é um canal de texto!**`)
        
        if (!embed_fala && !normal_fala) {
            interaction.reply(`Escreva pelo menos em uma das opções.`)
        } else {
            if (!embed_fala) embed_fala = "⠀";
            if (!normal_fala) normal_fala = "⠀";

            let embed = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(embed_fala);

            if (embed_fala === "⠀") {
                interaction.reply({ content: `Sua mensagem foi enviada!`, ephemeral: true })
                canal.send({ content: `${normal_fala}` })
            } else if (normal_fala === "⠀") {
                interaction.reply({ content: ` Sua mensagem foi enviada!`, ephemeral: true })
                canal.send({ embeds: [embed] })
            } else {
                interaction.reply({ content: ` Sua mensagem foi enviada!`, ephemeral: true })
                canal.send({ content: `${normal_fala}`, embeds: [embed] })
            }
        }
    

  }
}