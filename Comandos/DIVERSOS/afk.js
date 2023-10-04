const { ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { QuickDB } = require('quick.db')
const db = new QuickDB();

module.exports = {
  name: "afk", // Coloque o nome do comando
  description: "『 UTILIDADES 』Ativa o modo AFK!", // Coloque a descrição do comando
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'motivo',
      description: `Informe o motivo de ativar o modo AFK!`,
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],

  run: async (client, interaction) => {
    let motivo = interaction.options.getString('motivo') || `**Motivo não inserido.**`;

    let afk = await db.get(`modoAfk_${interaction.user.id}`)

    if(afk === true) {
        interaction.reply({ content: `${interaction.user}, seu AFK já está ativado!`, ephemeral: true});
    } else {
        interaction.reply({content: `${interaction.user} modo AFK ativado com sucesso!\nMotivo definido: ${motivo}`, ephemeral: interaction.user.id == '430502315108335617' ? true : false});

        await db.set(`modoAfk_${interaction.user.id}`, true);
        await db.set(`motivoAfk_${interaction.user.id}`, motivo);
    };
  }
}



/*


        let motivo = args.slice(0).join(" ");
        if (!motivo) motivo = "Não especificado.";
        message.reply(`O modo afk foi ativado com sucesso: ${motivo}`).then(msg => {
            db.set(`afk_${message.author.id}`, true);
            db.set(`motivo_afk_${message.author.id}`, motivo)
            db.set(`verificando_afk_${message.author.id}`, message.author.id)
        })          
 */