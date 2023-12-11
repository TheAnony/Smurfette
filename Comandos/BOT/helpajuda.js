const { EmbedBuilder, ApplicationCommandType, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js")
const emoji = {
  'disponivel': "✅",
  'manutencao': "⏳",
  'indisponivel': "☁️",
  'banido': "💀",
  'wave': "<:GuraWave:1135637456927076482>",
  'permrole': '🛡️'
}
const emojis = require('../../emojis.json')

module.exports = {
  name: "help-ajuda", // Coloque o nome do comando
  description: "『 BOT 』Fornece o painel de ajuda de todos os comandos disponíveis.", // Coloque a descrição do comando
  type: ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    let p = '\u276F';
    let s = '\u27A5';
    let embedInicial = new EmbedBuilder()
      .setAuthor({ name: `Menu de ajuda`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setDescription(
        `**${emoji.wave} Olá, ${interaction.user}. Seja bem-vindo ao meu painel de comandos!\n\n**` +
        `🗞️ Se deseja ver as mais recentes notícias sobre mim, utilize \`/news\`\n\n`)
      .addFields({ name: '\u200B', value: '\u0020' })
      .addFields(
        { name: '\`Legenda emojis:\`', value: `[${emoji.disponivel}] \u21D2 Comando disponível.\n[${emoji.manutencao}] \u21D2 Comando em manutenção/em desenvolvimento.\n[${emoji.indisponivel}] \u21D2 Comando indisponível.\n[${emoji.banido}] \u21D2 Comando banido (com motivo anexado)\n[${emoji.permrole}] \u21D2 Comando que é necessário a permRole para funcionar.` },
        { name: '\u200B', value: '\u0020' },
        { name: '\`Legenda parâmetros:\`', value: `\u276F \`Comando principal\`\n\u27A5 \`Subcomando\``, inline: true },
        { name: '\u0020', value: `\u0020`, inline: true },
        { name: '\`Dica:\`', value: '- _Basta usar os botões para ver as categorias de comandos que tenho no momento!_', inline: true },
      )
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setColor('#3460FF')
      .setFooter({ text: `/help-ajuda`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })

    let embedBot = new EmbedBuilder()
      .setAuthor({ name: `Menu de ajuda, categoria: bot`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setFooter({ text: `/help-ajuda \u2023 Página 1/8`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
      .setColor('#3460FF')
      .setTitle(`- Total de comandos: ${emojis.num9}\n`)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `[${emoji.disponivel}] ${p} \`\`Bot-info:\`\` **Veja minhas informações.**\n\n` +
        `[${emoji.disponivel}] ${p} \`\`Help-ajuda:\`\` **Ei, é o comando que está usando!**\n\n` +
        `[${emoji.disponivel}] ${p} \`\`Politica-de-privacidade:\`\` **Fornece o documento de política de privacidade.**\n\n` +
        `[${emoji.disponivel}] ${p} \`\`Ping:\`\` **Veja o meu ping.**\n\n` +
        `[${emoji.indisponivel}] ${p} \`\`Donate:\`\` **Faça um donate e darei o meu melhor sempre!**\n\n` +
        `[${emoji.disponivel}] ${p} \`\`Termos-de-uso:\`\` **Fornece o documento sobre os meus termos de uso.**\n\n` +
        `[${emoji.disponivel}] ${p} \`\`Reportar-bug:\`\` **Você identificou algum bug em mim? Use esse comando para enviar ao meu criador e ele reparar o bug!**\n\n` +
        `[${emoji.disponivel}] ${p} \`\`Say:\`\` **Faça eu falar algo!**\n\n` +
        `[${emoji.indisponivel}] ${p} \`\`News:\`\` **Veja minhas últimas notícias!**\n\n`
      )

    let embedBrincadeiras = new EmbedBuilder()
      .setAuthor({ name: `Menu de ajuda, categoria: brincadeiras`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setFooter({ text: `/help-ajuda \u2023 Página 2/8`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
      .setColor('#3460FF')
      .setTitle(`- Total de comandos: ${emojis.num3}\n`)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `[${emoji.disponivel}][${emoji.permrole}] ${p} \`\`Contagem:\`\` **Começa uma contagem numeral no canal atual.**\n\n` +
        `[${emoji.disponivel}] ${p} \`\`Cara-coroa:\`\` **Lança uma moeda que dá cara ou coroa.**\n\n` +
        `[${emoji.disponivel}] ${p} \`\`Pedra-papel-tesoura:\`\` **Começa um jogo de pedra, papel e tesoura.**\n\n`
      )


    let embedDiversos = new EmbedBuilder()
      .setAuthor({ name: `Menu de ajuda, categoria: diversos`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setFooter({ text: `/help-ajuda \u2023 Página 3/8`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
      .setColor('#3460FF')
      .setTitle(`- Total de comandos: ${emojis.num2}\n`)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `[${emoji.disponivel}] ${p} \`\`Afk:\`\` **Ativa seu modo AFK! (quando digitar algo no chat, automáticamente irá desativar).**\n\n` +
        `[${emoji.disponivel}] ${p} \`\`Avaliar-staff:\`\` **Sempre tem aquele staff gente fina, né? Avalie um staff dando até 5 estrelas!**\n\n`
      )

    let embedInfo = new EmbedBuilder()
      .setAuthor({ name: `Menu de ajuda, categoria: info`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setFooter({ text: `/help-ajuda \u2023 Página 4/8`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
      .setColor('#3460FF')
      .setTitle(`- Total de comandos: ${emojis.num5}\n`)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `[${emoji.indisponivel}] ${p} \`\`Channel-info:\`\` **Fornece as informações sobre dado canal (texto/voz).**\n\n` +
        `[${emoji.indisponivel}] ${p} \`\`Server-info:\`\` **Fornece as informações sobre a Família Smurf.**\n\n` +
        `[${emoji.indisponivel}] ${p} \`\`User-info:\`\` **Fornece as informações sobre algum membro/bot.**\n\n` +
        `[${emoji.indisponivel}] ${p} \`\`Emoji-info:\`\` **Fornece as informações sobre algum emoji.**\n\n` +
        `[${emoji.indisponivel}] ${p} \`\`Role-info:\`\` **Fornece as informações sobre algum cargo.**\n\n`
      )

    let embedSorteio = new EmbedBuilder()
      .setAuthor({ name: `Menu de ajuda, categoria: sorteio`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setFooter({ text: `/help-ajuda \u2023 Página 5/8`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
      .setColor('#3460FF')
      .setTitle(`- Total de comandos: ${emojis.num2}\n`)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `[${emoji.disponivel}][${emoji.permrole}] ${p} \`\`Sorteio:\`\` **Começa um sorteio.**\n` +
        `[${emoji.indisponivel}][${emoji.permrole}] ${s} \`\`Edit:\`\` **Edita o último sorteio.**\n`
      )

    let embedUtilidade = new EmbedBuilder()
      .setAuthor({ name: `Menu de ajuda, categoria: utilidade`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setFooter({ text: `/help-ajuda \u2023 Página 7/8`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
      .setColor('#3460FF')
      .setTitle(`- Total de comandos: ${emojis.num6}\n`)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `[${emoji.manutencao}] ${p} \`\`Enquete:\`\` **Inicia uma enquete.**\n\n` +
        `[${emoji.indisponivel}] ${p} \`\`Gerador-de-senha:\`\` **Gera uma senha aleatória.**\n\n` +
        `[${emoji.disponivel}] ${p} \`\`Gerar-numero-aleatorio:\`\` **Gera uma número aleatória.**\n\n` +
        `[${emoji.manutencao}] ${p} \`\`Lembrete-remind:\`\` **Cria um lembrete.**\n\n` +
        `[${emoji.indisponivel}] ${p} \`\`Report:\`\` **Reporta um usuário.**\n\n` +
        `[${emoji.indisponivel}] ${p} \`\`Petição:\`\` **Inicia uma petição.**\n\n`
      )

    let embedEnd = new EmbedBuilder()
      .setAuthor({ name: `Menu de ajuda`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setDescription(
        `**${emoji.wave} Olá, ${interaction.user}. O tempo de usar o help acabou! Utilize novamente o comando se deseja continuar navegando.\n\n**`)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setColor('#3460FF')
      .setFooter({ text: `/help-ajuda`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })

    let painel = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("painel_ticket")
        .setPlaceholder("Escolha a página!")
        .addOptions(
          {
            label: "Página 1/6",
            description: "PÁGINA SOBRE BOT [9]",
            value: "pg1"
          },
          {
            label: "Página 2/6",
            description: "PÁGINA SOBRE BRINCADEIRAS [3]",
            value: "pg2"
          },
          {
            label: "Página 3/6",
            description: "PÁGINA SOBRE DIVERSOS [2]",
            value: "pg3"
          },
          {
            label: "Página 4/6",
            description: "PÁGINA SOBRE INFO [5]",
            value: "pg4"
          },
          {
            label: "Página 5/6",
            description: "PÁGINA SOBRE SORTEIO [2]",
            value: "pg5"
          },
          {
            label: "Página 6/6",
            description: "PÁGINA SOBRE UTILIDADE [6]",
            value: "pg6"
          },
        )
    );

    interaction.reply({ embeds: [embedInicial], components: [painel] }).then(async (int) => {
      const filter = (i) => i.user.id === interaction.user.id

      const col = int.createMessageComponentCollector({ filter, time: [1000 * 60 * 5] })

      col.on('end', () => {
        int.edit({ embeds: [embedEnd] })
      })

      col.on('collect', async (coletado) => {
        let valor = coletado.values[0];
        coletado.deferUpdate();

        switch (valor) {
          case 'pg1':
            int.edit({ embeds: [embedBot], components: [painel] })
            break;

          case 'pg2':
            int.edit({ embeds: [embedBrincadeiras], components: [painel] })
            break;

          case 'pg3':
            int.edit({ embeds: [embedDiversos], components: [painel] })
            break;

          case 'pg4':
            int.edit({ embeds: [embedInfo], components: [painel] })
            break;

          case 'pg5':
            int.edit({ embeds: [embedSorteio], components: [painel] })
            break;

          case 'pg6':
            int.edit({ embeds: [embedUtilidade], components: [painel] })
            break;

          default:
            break;
        }
      })
    })
  }
}