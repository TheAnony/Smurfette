const { EmbedBuilder, ApplicationCommandType, version } = require("discord.js")
const cpuStat = require('cpu-stat')
const process = require('node:process')

module.exports = {
  name: "bot-info", // Coloque o nome do comando
  description: "『 BOT 』Veja minhas informações!", // Coloque a descrição do comando
  type: ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    const dias = Math.floor(client.uptime / 86400000)
    const horas = Math.floor(client.uptime / 3600000) % 24
    const minutos = Math.floor(client.uptime / 60000) % 60
    const segundos = Math.floor(client.uptime / 1000) % 60

    cpuStat.usagePercent(function (error, percent) {
      const cpu = percent.toFixed(2);

      const memoriaUtilizada = formatBtyes(process.memoryUsage().heapUsed);
      const node = process.version;

      const ping = Math.abs(client.ws.ping)

      let embed = new EmbedBuilder()
        .setTitle(`🤖 | Minhas informações`)
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynaimc: true }) })
        .setColor('DarkBlue')
        .addFields(
          { name: 'Desenvolvedor:', value: 'theanonimooo (430502315108335617)', inline: true },
          { name: 'Meu nome:', value: client.user.tag, inline: true },
          { name: 'Meu ID:', value: client.user.id, inline: true },
          { name: 'Data de criação:', value: `30 de julho de 2023`, inline: true },
          { name: 'Comando de ajuda:', value: '/help-ajuda', inline: true },
          { name: 'Tempo até desde quando iniciei:', value: upTime(dias, horas, minutos, segundos).toString(), inline: true },
          { name: 'Meu ping:', value: ping.toString() + 'ms', inline: true },
          { name: 'CPU sendo utilizada:', value: cpu + '%', inline: true },
          { name: 'Memória sendo utilizada:', value: memoriaUtilizada, inline: true },
          { name: 'Versão do Discord.js:', value: version, inline: true },
          { name: 'Versão do Node:', value: node, inline: true },
        )
      interaction.reply({ embeds: [embed] })
    })

    function upTime(d, h, m, s) {
      let coreDasAntigas = []
      d != 0 ? coreDasAntigas.push(`${d} dia ${d > 1 ? 's' : ''}`) : null
      h != 0 ? coreDasAntigas.push(` ${h} hora${h > 1 ? 's' : ''}`) : null
      m != 0 ? coreDasAntigas.push(` ${m} minuto${m > 1 ? 's' : ''}`) : null
      coreDasAntigas.push(` ${s} segundo${s > 1 ? 's' : ''}.`)
      return coreDasAntigas
    }

    function formatBtyes(a, b) {
      let c = 1024
      d = b || 2
      e = ['B', 'KB', 'MB', 'GB', 'TB']
      f = Math.floor(Math.log(a) / Math.log(c))

      return parseFloat((a / Math.pow(c, f)).toFixed(d)) + '' + e[f]
    }
  }
}
