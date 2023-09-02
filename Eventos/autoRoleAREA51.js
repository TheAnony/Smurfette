require('../index')

const client = require('../index')

client.on("guildMemberAdd", (member) => {
    let cargo_autorole = member.guild.roles.cache.get("934896199666905158") // Coloque o ID do cargo
    if (!cargo_autorole) return console.log("❌ | O AUTOROLE não está configurado.");
    if(member.guild.id !== '921107172316815410' && member.bot) return;
  
    member.roles.add(cargo_autorole.id).catch(err => {
      console.log(`❌ Não foi possível adicionar o cargo de autorole no usuário ${member.user.tag}.`)
    })
  })