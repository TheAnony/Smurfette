const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder,
  ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const ms = require('ms');
const { QuickDB } = require('quick.db')
const db = new QuickDB();
const wait = require('node:timers/promises').setTimeout

module.exports = {
  name: "sorteio", // Coloque o nome do comando
  description: "『 SORTEIO 』Crie um sorteio no servidor", // Coloque a descrição do comando
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "prêmio",
      type: ApplicationCommandOptionType.String,
      description: "O que será o prêmio?",
      required: true,
    },
    {
      name: "tempo-sorteio-e-claim",
      type: ApplicationCommandOptionType.String,
      description: "Utilize este modelo: (tempo do sorteio) (tempo de claim). Exemplo: 10 minutos 30 minutos.",
      required: true
    },
    {
      name: "host",
      type: ApplicationCommandOptionType.User,
      description: "Descreva quem será o host (pessoa necessária para marcar para dar claim).",
      required: true,
    },
    {
      name: "quantia-de-ganhadores",
      type: ApplicationCommandOptionType.String,
      description: "Descreva o que será sorteado.",
      required: true,
      choices: [
        { name: '1-ganhador', value: '1' },
        { name: '2-ganhadores', value: '2' },
        { name: '3-ganhadores', value: '3' },
        { name: '4-ganhadores', value: '4' },
        { name: '5-ganhadores', value: '5' },
        { name: '6-ganhadores', value: '6' },
        { name: '7-ganhadores', value: '7' },
        { name: '8-ganhadores', value: '8' },
        { name: '9-ganhadores', value: '9' },
        { name: '10-ganhadores', value: '10' },
      ]
    },
  ],

  run: async (client, interaction) => {
    let cargos = await db.get(`ArrayCargos.roles`)
    let valoresGerados = [];
    for (let index = 0; index < cargos.length; index++) {
      const element = cargos[index]
      valoresGerados.push(element)
    }

    if (!interaction.member.roles.cache.some(
      role => valoresGerados.includes(role.id))
    ) return interaction.reply({ephemeral: true, content: '**VOCÊ NÃO TEM A PERMROLE PARA UTILIZAR ESSE COMANDO!**'})

    let premio = interaction.options.getString("prêmio");
    let host = interaction.options.getUser("host");
    let quantiaWinner = interaction.options.getString("quantia-de-ganhadores");
    let click = [] || 0
    let tempoSorteio = cronos()[0];
    let tempoClaim = cronos()[1]

    const diasSorteio = Math.floor(tempoSorteio / 86400000)
    const horasSorteio = Math.floor(tempoSorteio / 3600000) % 24
    const minutosSorteio = Math.floor(tempoSorteio / 60000) % 60
    const segundosSorteio = Math.floor(tempoSorteio / 1000) % 60

    const diasClaim = Math.floor(tempoClaim / 86400000)
    const horasClaim = Math.floor(tempoClaim / 3600000) % 24
    const minutosClaim = Math.floor(tempoClaim / 60000) % 60
    const segundosClaim = Math.floor(tempoClaim / 1000) % 60

    let button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("botao")
        .setEmoji("🎉")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("cancel")
        .setEmoji("⚪")
        .setLabel('Cancelar')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("reroll")
        .setEmoji("🔁")
        .setLabel('Reroll')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true)
    );
    let embed = new EmbedBuilder()
      .setAuthor({ name: `Novo sorteio!`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setTitle(premio)
      .setDescription(
        `\`Sorteio iniciado pelo:\` ${interaction.user.username}\n` +
        `\`Host (pessoa necessária para dar claim):\` ${host}\n` +
        `\`Quantia de ganhadores:\` ${quantiaWinner}\n` +
        `\`Entradas:\` 0\n\n` +
        `\`Tempo do sorteio:\` ${time(diasSorteio, horasSorteio, minutosSorteio, segundosSorteio)}\n` +
        `\`Tempo de claim:\` ${time(diasClaim, horasClaim, minutosClaim, segundosClaim)}\n` +
        `Clique no botão para participar.\n**Boa sorte!!!**`
      )
      .setTimestamp(Date.now() + tempoSorteio)
      .setFooter({ text: "Data do sorteio:" })
      .setColor("Green");

    let erro = new EmbedBuilder()
      .setColor("Red")
      .setDescription(`Não foi possível promover o soteio!`);

    if (host.bot) return interaction.reply(`**O host não pode ser um bot! Utilize novamente o comando.\n\`Bot mencionado como host: \`${host}**`)

    let mensagem = await interaction.reply({ embeds: [embed], components: [button] }).catch((e) => {
      interaction.editReply({ embeds: [erro] });
      console.log(e)
    });

    const coletor = mensagem.createMessageComponentCollector({ componentType: ComponentType.Button, time: tempoSorteio })

    coletor.on("end", (i) => {
      interaction.editReply({
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setDisabled(true)
              .setCustomId("botao")
              .setEmoji("🎉")
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId("cancel")
              .setEmoji("⚪")
              .setLabel('Cancelar')
              .setStyle(ButtonStyle.Danger)
              .setDisabled(true),
            new ButtonBuilder()
              .setCustomId("reroll")
              .setEmoji("🔁")
              .setLabel('Reroll')
              .setStyle(ButtonStyle.Primary)
          )
        ]
      });
    });

    coletor.on("collect", async (i) => {
      switch (i.customId) {
        case "botao":
          if (click.includes(i.user.id)) return i.reply({ content: `Olá ${i.user}, você já está participando do sorteio!`, ephemeral: true });
          click.push(i.user.id);
          let embed = new EmbedBuilder()
            .setAuthor({ name: `Novo sorteio!`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setTitle(premio)
            .setDescription(
              `\`Sorteio iniciado pelo:\` ${interaction.user.username}\n` +
              `\`Host (pessoa necessária para dar claim):\` ${host}\n` +
              `\`Quantia de ganhadores:\` ${quantiaWinner}\n` +
              `\`Entradas:\` ${click.length}\n\n` +
              `\`Tempo do sorteio:\` ${time(diasSorteio, horasSorteio, minutosSorteio, segundosSorteio)}\n` +
              `\`Tempo de claim:\` ${time(diasClaim, horasClaim, minutosClaim, segundosClaim)}\n` +
              `Clique no botão para participar.\n**Boa sorte!!!**`
            )
            .setTimestamp(Date.now() + tempoSorteio)
            .setFooter({ text: "Data do sorteio:" })
            .setColor("Green");

          interaction.editReply({ embeds: [embed] });

          i.reply({ content: `Olá ${i.user}, você entrou no sorteio.`, ephemeral: true });
          break;

        case "cancel":
          if (i.member.roles.cache.some(role => valoresGerados.includes(role.id))) {
            await i.deferUpdate();
            await interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setDescription(
                    `**INFORMAÇÕES:**\n` +
                    `\`Sorteio iniciado pelo:\` ${interaction.user.username}\n` +
                    `\`Host (pessoa necessária para dar claim):\` ${host}\n` +
                    `\`Quantia de ganhadores:\` ${quantiaWinner}\n` +
                    `\`Entradas:\` ${click.length}\n` +
                    `\`Tempo do sorteio:\` ${time(diasSorteio, horasSorteio, minutosSorteio, segundosSorteio)}\n` +
                    `\`Tempo de claim:\` ${time(diasClaim, horasClaim, minutosClaim, segundosClaim)}\n` +
                    `Clique no botão para participar.\n**Boa sorte!!!**`)
              ], content: `**SORTEIO CANCELADO!**`, components: [
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setDisabled(true)
                    .setCustomId("botao")
                    .setEmoji("🎉")
                    .setStyle(ButtonStyle.Success),
                  new ButtonBuilder()
                    .setCustomId("cancel")
                    .setEmoji("⚪")
                    .setLabel('Cancelar')
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true),
                  new ButtonBuilder()
                    .setCustomId("reroll")
                    .setEmoji("🔁")
                    .setLabel('Reroll')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true)
                )
              ]
            });
            await db.delete(`host`)
            await db.set(`cancelarSorteio`, true)
          }
          break;

        default:
          break;
      }
    });

    setTimeout(async () => {
      if (quantiaWinner == '1') {
        // UM GANHADOR - UM GANHADOR - UM GANHADOR - UM GANHADOR - UM GANHADOR
        if (await db.get(`cancelarSorteio`) == true) return await db.delete(`cancelarSorteio`)

        let ganhador = click[Math.floor(Math.random() * click.length)];

        if (click.length == 0) return interaction.followUp(`\n**SORTEIO CANCELADO!**\nNão houveram participantes no sorteio \`${premio}\`.`);

        interaction.followUp(`**Parabéns <@${ganhador}> você ganhou o sorteio: \`${premio}\`.\nDigite no chat-geral: "${host} claim" para resgatar seu prêmio!**`)
        await db.set(`host`, host.id)
        await db.set(`sorteioIniciado`, true)
        await db.set(`tempoClaim`, tempoClaim)
        await db.set(`ganhadorSorteio`, {
          ganhadores: [ganhador]
        })
        await db.add(`sorteioID`, 1)

        setTimeout(async () => {
          await db.delete(`tempoClaim`)
          await db.delete(`sorteioIniciado`)
        }, tempoClaim);

      } else {
        // MAIS DE UM GANHADOR - MAIS DE UM GANHADOR - MAIS DE UM GANHADOR - MAIS DE UM GANHADOR
        if (await db.get(`cancelarSorteio`) == true) return await db.delete(`cancelarSorteio`)

        let much = parseInt(quantiaWinner)
        if (click.length <= much) return interaction.followUp(`\n**SORTEIO CANCELADO!**\nNão houveram participantes necessários para realizar o sorteio \`${premio}\`.\n\`Mínimo de participantes para este sorteio: ${much + 1}\``);
        let winners = [];
        let w = [];

        while (winners.length < much) {
          let ganhadores = click[Math.floor(Math.random() * click.length)]
          if (!winners.includes(ganhadores)) winners.push(ganhadores);
        }

        winners.forEach(e => {
          w.push(`<@!${e}>`)
        });

        interaction.followUp(`**Parabéns ${w.join(', ')} vocês ganharam o sorteio: \`${premio}\`.\nDigitem no chat-geral: "${host} claim" para resgatarem seu prêmio!**`)
        await db.set(`host`, host.id)
        await db.set(`tempoClaim`, tempoClaim)
        await db.set(`sorteioIniciado`, true)
        await db.set(`ganhadorSorteio`, {
          ganhadores: [winners]
        })
        await db.add(`sorteioID`, 1)

        setTimeout(async () => {
          await db.delete(`tempoClaim`)
          await db.delete(`sorteioIniciado`)
        }, tempoClaim);
      }
    }, tempoSorteio);

    const coll = mensagem.createMessageComponentCollector({ componentType: ComponentType.Button, time: ms('2h') })
    coll.on('end', async (i) => {
      interaction.editReply({
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setDisabled(true)
              .setCustomId("botao")
              .setEmoji("🎉")
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId("cancel")
              .setEmoji("⚪")
              .setLabel('Cancelar')
              .setStyle(ButtonStyle.Danger)
              .setDisabled(true),
            new ButtonBuilder()
              .setCustomId("reroll")
              .setEmoji("🔁")
              .setLabel('Reroll')
              .setStyle(ButtonStyle.Primary)
              .setDisabled(true)
          )
        ]
      });

    })

    // Reroll command
    coll.on("collect", async (i) => {
      if (i.member.roles.cache.some(role => valoresGerados.includes(role.id)) && i.customId === 'reroll') {
        let ganhadores = await db.get(`ganhadorSorteio.ganhadores`)
        if (typeof ganhadores === 'object') ganhadores = ganhadores.flat()
        if (click.length == 0 || !ganhadores) return;
        if (quantiaWinner == '1') {
          let ganhadores = await db.get(`ganhadorSorteio.ganhadores`)
          ganhadores = ganhadores.flat()
          let tripleAgent = click.filter(id => id !== ganhadores[0])
          let newWinner = tripleAgent[Math.floor(Math.random() * tripleAgent.length)]
          await db.set(`host`, host.id)
          await db.set(`tempoClaim`, tempoClaim)
          await db.set(`ganhadorSorteio`, {
            ganhadores: [newWinner]
          })

          await i.deferUpdate()
          await interaction.followUp(`**Novo ganhador: <@${newWinner}>**`)

        } else {
          let ganhadores = await db.get(`ganhadorSorteio.ganhadores`)
          if (typeof ganhadores === 'object') ganhadores = ganhadores.flat()
          let tripleAgent = click.filter(id => !ganhadores.includes(id))
          if (typeof tripleAgent === 'object') tripleAgent = tripleAgent.flat()
          console.log(tripleAgent);
          console.log(ganhadores);
          let newWinners = tripleAgent[Math.floor(Math.random() * tripleAgent.length)]
          let w = [];
          let winners = [];
          let much = parseInt(quantiaWinner)

          while (winners.length < much) {
            let ganhadores = tripleAgent[Math.floor(Math.random() * tripleAgent.length)]
            if (!winners.includes(ganhadores)) winners.push(ganhadores);
          }

          winners.forEach(e => {
            w.push(`<@!${e}>`)
          });

          for (let i = 0; i < ganhadores.length; i++) {
            let newGanha = newWinners[i];
            let ganha = ganhadores.filter(user => !ganhadores.includes(user))
            let novosGanha = ganha[Math.floor(Math.random() * ganha.length)]
            if (!ganhadores.includes(newGanha)) {
              newWinners = [];
              newWinners.push(novosGanha)
            }
          }

          await db.set(`host`, host.id)
          await db.set(`tempoClaim`, tempoClaim)
          await db.set(`ganhadorSorteio`, {
            ganhadores: newWinners
          })

          await i.deferUpdate()
          await interaction.followUp(`**Novos ganhadores: ${w.join(', ')}**`)
        }
      }
    })

    function cronos() {
      let tempSC = interaction.options.getString('tempo-sorteio-e-claim').toLowerCase()
      let tempAlterado = tempSC.trim().split(/ +/g)
      if (tempAlterado.length !== 4) return interaction.reply({ content: `**TEMPO INVÁLIDO!**`, ephemeral: true })
      let tempoS = tempAlterado[0] + tempAlterado[1]
      let tempoC = tempAlterado[2] + tempAlterado[3]
      let time = [];
      let sorteio2Digitos = ms(tempoS.slice(0, 3));
      let sorteio1Digito = ms(tempoS.slice(0, 2));
      let claim2Digitos = ms(tempoC.slice(0, 3));
      let claim1Digito = ms(tempoC.slice(0, 2));

      let condição1 = typeof sorteio2Digitos === 'number' ? time.push(sorteio2Digitos) : typeof sorteio1Digito === 'number' ? time.push(sorteio1Digito) : 'tempo sorteio inválido'
      let condição2 = typeof claim2Digitos === 'number' ? time.push(claim2Digitos) : typeof claim1Digito === 'number' ? time.push(claim1Digito) : 'tempo claim inválido'

      if (condição1 == 'tempo sorteio inválido') {
        return interaction.reply({ content: `[❌] Tempo de sorteio`, ephemeral: true })
      } else if (condição2 == 'tempo claim inválido') {
        return interaction.reply({ content: `[❌] Tempo de claim`, ephemeral: true })
      }

      return time
    }

    function time(d, h, m, s) {
      let coreDasAntigas;
      d != 0 ? coreDasAntigas = (`${d} dia${d > 1 ? 's' : ''}`) : null
      h != 0 ? coreDasAntigas = (` ${h} hor${h > 1 ? 's' : ''}`) : null
      m != 0 ? coreDasAntigas = (` ${m} minuto${m > 1 ? 's' : ''}`) : null
      coreDasAntigas = (`${s} segundo${s > 1 ? 's' : ''}.`)
      return coreDasAntigas
    }
  }
}