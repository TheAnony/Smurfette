const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder  } = require("discord.js")
const ms = require('ms')

module.exports = {
  name: 'enquete', // Coloque o nome do comando
  description: '『 UTILIDADE 』Cria uma enquete no servidor.', // Coloque a descrição do comando
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'título',
      description: `Qual será o título?`,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'tempo',
      description: `Informe o tempo em s (segundos); m (minutos) ou d (dias)!`,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'opções',
      description: `Informe quantas opções terá a enquete! (min: 2, max: 6)`,
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
    {
      name: 'canal',
      description: `Informe o canal que vai ser enviado!`,
      type: ApplicationCommandOptionType.Channel,
      required: false,
  }
],

  run: async (client, interaction) => {
    let cargos = await db.get(`ArrayCargos.roles`)
    let valoresGerados = [];
        for (let index = 0; index < cargos.length; index++) {
          const element = cargos[index]
          valoresGerados.push(element)

        }
    if(!interaction.member.roles.cache.some(role => valoresGerados.includes(role.id))) return interaction.reply('**VOCÊ NÃO TEM A PERMROLE PARA UTILIZAR ESSE COMANDO!**')

   const canal = interaction.options.getChannel('canal') || interaction.channel;
   const title = interaction.options.getString('título');
   const time = interaction.options.getString('tempo');
   const opções = interaction.options.getNumber('opções');
   const emojis = [
    "<:num0:1135640857761026068>", "<:num1:1135640573773107271>", "<:num2:1135640612184535171>", "<:num3:1135640643872510125>", 
    "<:num4:1135640677099786282>","<:num5:1135640703444209674>", "<:num6:1135640734888890518>", "<:num7:1135640767411519508>",
    "<:num8:1135640799221137448>", "<:num9:1135640831571808396>"
  ]
  
   let time_ms = ms(time)

   if(isNaN(time_ms)) return interaction.reply({ ephemeral: true, content: `A opção tempo está inválida: ${time}` });
   if(opções == 1 || opções > 6) return interaction.reply({ ephemeral: true, content: `O **mínimo de opções é 2** e **máximo de opções é 6 (seis).** Escolha outro número, por favor!`})
   if(canal.type === 4) return interaction.reply({ ephemeral: true, content: `Escolha um canal de texto válido!`})
   let embed = new EmbedBuilder()
   .setAuthor({ name: interaction.author.username, iconUrl: interaction.user.displayAvatarURL({ dynamic: true})})
   .setDescription({})

  }
} 