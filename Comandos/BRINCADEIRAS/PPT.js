const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ButtonBuilder,
     ActionRowBuilder, ButtonStyle } = require("discord.js")
const { QuickDB } = require('quick.db')
const db = new QuickDB();
const opções = [
    { name: 'Pedra', emoji: '🪨', ganha: 'Tesoura'  },
    { name: 'Papel', emoji: '📄', ganha: 'Pedra'  },
    { name: 'Tesoura', emoji: '✂️', ganha: 'Papel'  }
]

module.exports = {
  name: "pedra-papel-tesoura", // Coloque o nome do comando
  description: "『 BRINCADEIRAS 』Começa um jogo de pedra papel e tesoura.", // Coloque a descrição do comando
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'usuário',
      description: `Qual usuário deseja jogar junto?`,
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],

  run: async (client, interaction) => {
    //if(interaction.user.id === '1052573925588078596') return interaction.reply(`Já jogou muito`)
    const usuário = interaction.options.getUser('usuário')
    if(interaction.user.id === usuário.id) return interaction.reply({content: `Você não pode jogar pedra papel e tesoura consigo mesmo!`, ephemeral: true})
    if(usuário.bot) return interaction.reply({content: `Você não pode jogar pedra papel e tesoura com um bot!`, ephemeral: true});

    let vezesGanhadasInteraction = await db.get(`vezesGanhadas_${interaction.user.id}_${usuário.id}`)
    let vezesGanhadasUsuário = await db.get(`vezesGanhadas_${usuário.id}_${interaction.user.id}`)

    !vezesGanhadasInteraction ? await db.set(`vezesGanhadas_${interaction.user.id}_${usuário.id}`, 0) : null;
    !vezesGanhadasUsuário ? await db.set(`vezesGanhadas_${usuário.id}_${interaction.user.id}`, 0) : null;

    const embed = new EmbedBuilder()
    .setTitle('🪨📄✂️ | Pedra, papel e tesoura')
    .setDescription(`Turno atual: ${usuário}`)
    .setColor('Yellow')
    .setTimestamp(new Date());

    const buttons = opções.map((c) => {
        return new ButtonBuilder()
        .setCustomId(c.name)
        .setLabel(c.name)
        .setStyle(ButtonStyle.Primary)
        .setEmoji(c.emoji)
    });

    const row = new ActionRowBuilder().addComponents(buttons);

    const reply = await interaction.reply({content: `${usuário}, você foi desafiado a jogar pedra papel e tesoura pelo ${interaction.user}!\nPara participar, clique em algum dos botões abaixo.`, embeds: [embed], components: [row]})

    const collUsuário = await reply.awaitMessageComponent({
        filter: (i) => i.user.id === usuário.id,
        time: 60*1000,
    }).catch(async (err) => {
        embed.setDescription(`Game over! O ${usuário} não deu nenhuma resposta.`);
        await reply.edit({ embeds: [embed], components: []});
    })

    if(!collUsuário) return;

    const usuárioEscolha = opções.find((guiw) => guiw.name === collUsuário.customId);
    // console.log(`O usuário ${usuário} escolheu ${usuárioEscolha.name}. Não utilize a opção ${usuárioEscolha.ganhar}`)

    await collUsuário.reply({ content: `Você escolheu ${usuárioEscolha.name + usuárioEscolha.emoji}`, ephemeral: true });

    embed.setDescription(`Turno atual: ${interaction.user}.`)
    await reply.edit({content: `${interaction.user} agora é seu turno!`, embeds: [embed]});

    const collInteraction = await reply.awaitMessageComponent({
        filter: (i) => i.user.id === interaction.user.id,
        time: 60*1000,
    }).catch(async (err) => {
        embed.setDescription(`Game over! O ${interaction.user} não deu nenhuma resposta.`);
        await reply.edit({ embeds: [embed], components: []});
    })

    if(!collInteraction) return;

    const interactionEscolha = opções.find((c) => c.name === collInteraction.customId);

    let resultado;

    if(usuárioEscolha.ganha === interactionEscolha.name) {
        await db.add(`vezesGanhadas_${usuário.id}_${interaction.user.id}`, 1)
        let Alvaro = await db.get(`vezesGanhadas_${usuário.id}_${interaction.user.id}`)
        let win;
        Alvaro == 1 ? win = `1 vez` : win = `${Alvaro} vezes`
        resultado = `${usuário} ganhou! Ele (a) ganhou ${win} contra o (a) ${interaction.user}`
    }

    if(interactionEscolha.ganha === usuárioEscolha.name) {
        await db.add(`vezesGanhadas_${interaction.user.id}_${usuário.id}`, 1)
        let Colak = await db.get(`vezesGanhadas_${interaction.user.id}_${usuário.id}`)
        let win;
        Colak == 1 ? win = `1 vez` : win = `${Colak} vezes`
        resultado = `${interaction.user} ganhou! Ele (a) ganhou ${win} contra o (a) ${usuário}`
    }
    interactionEscolha.name === usuárioEscolha.name ? resultado = `Empate!` : null
    
    embed.setDescription(`${usuário} escolheu ${usuárioEscolha.name + ' ' + usuárioEscolha.emoji}\n${interaction.user} escolheu ${interactionEscolha.name + interactionEscolha.emoji}\n\n${resultado}`)

    reply.edit({embeds: [embed], components: []})

  }
}