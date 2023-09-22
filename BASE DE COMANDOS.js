const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { QuickDB } = require('quick.db')
const db = new QuickDB();
// const emojis = require('../../emojis.json')

module.exports = {
  name: "", // Coloque o nome do comando
  description: "『 UTILIDADE 』", // Coloque a descrição do comando
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: '',
      description: ``,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client, interaction) => {

  }
}

/*
PERMROLE - PERMROLE - PERMROLE
let cargos = await db.get(`ArrayCargos.roles`)
    let valoresGerados = [];
        for (let index = 0; index < cargos.length; index++) {
          const element = cargos[index]
          valoresGerados.push(element)

        }
    if(!interaction.member.roles.cache.some(role => valoresGerados.includes(role.id))) return interaction.reply('**VOCÊ NÃO TEM A PERMROLE PARA UTILIZAR ESSE COMANDO!**')
*/

/*
let button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("botao")
          .setEmoji("🎉")
          .setStyle(ButtonStyle.Success)
      );

const filter = (i) => i.user.id === interaction.user.id
        const coletor = msg.createMessageComponentCollector({ filter, max: 1, time: ms('2m') });

        coletor.on("end", async (i) => {
            // interaction.editReply({ components: [buttonDisabled] });
        });

        coletor.on("collect", async (i) => { })
*/

/*
function wait(tempo) {
  setTimeout(()=>{}, tempo);
}
*/

/* const time = interaction.options.getString('tempo');
let tempo = stringMS(time)
let tempoCompleto = formatTime(tempo) */