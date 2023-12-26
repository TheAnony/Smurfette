const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const ms = require("ms")
const emoji = require('../../emojis.json');

module.exports = {
  name: "lembrete-remind", // Coloque o nome do comando
  description: "『 UTILIDADE 』Define um lembrete!", // Coloque a descrição do comando
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'tempo',
      description: `Informe em quanto tempo devo lhe avisar sobre o lembrete! (s, m, h ou d)`,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
        name: 'messagem',
        description: `Qual mensagem vai querer que tenha no lembrete?`,
        type: ApplicationCommandOptionType.String,
        required: false,
      },
  ],

  run: async (client, interaction) => {
    if(interaction.user.id !== '430502315108335617') return interaction.reply(`${emoji.err} | Este comando ainda está em manutenção!`)
    let tempo = interaction.options.getString('tempo')
    let messagem = interaction.options.getString('messagem') || `Nenhuma mensagem inserida!`
  }
}

/*
const Discord = require("discord.js")

module.exports = {
    name: "lembrete", // Coloque o nome do comando do arquivo
    aliases: [""], // Coloque sinônimos aqui

    run: async(client, message, args) => {

        let tempo = args[0];
        let lembrete = args.slice(1).join(" ");

        if (!tempo || !lembrete) {
            let embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setDescription(`\`!lembrete [tempo] [lembrete]\``);

            message.reply({ embeds: [embed] })
        } else {
            try {
                let time = ms(tempo);

                let embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle(`Lembrete adicionado!`)
                .setDescription(`> Tempo do lembrete: \`${tempo}\`.\n\n> Mensagem: ${lembrete}.`);

                message.reply({ embeds: [embed] }).then(msg => {
                    setTimeout( () => {
                        message.author.send(`> **Seu lembrete de ${tempo} atrás:**\n\n${lembrete}`).catch(e => { message.channel.send(`> ${message.author} **Seu lembrete de ${tempo} atrás:**\n\n${lembrete}`) });
                    }, time)
                })
            } catch (e) {

                let embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setDescription(`\`!lembrete [tempo] [lembrete]\``);
    
                message.reply({ embeds: [embed] })

            }
        }
        
    }
}
*/