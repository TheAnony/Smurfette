const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const emojis = require('../../emojis.json');
const { pegarDataNow } = require('../../funcoes');

module.exports = {
    name: "kick", // Coloque o nome do comando
    description: "『 MODERAÇÃO 』Expulsa um membro.", // Coloque a descrição do comando
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'membro',
            description: `Mencione o membro que deseja expulsar`,
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'motivo',
            description: `Descreva o motivo da expulsão`,
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],

    run: async (client, interaction) => {
        if(!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) return interaction.reply({ephemeral: true, content: `${emojis.err} | Você não tem permissão de utilizar este comando! Permissão necessária: \`Expulsar Membros\`.`});

        const usuario = interaction.options.getUser('membro');
        if(usuario.id === interaction.user.id) return interaction.reply({ephemeral: true, content: `${emojis.err} | Você não pode expulsar a si mesmo (a)!`})
        if(usuario.id === client.user.id) return interaction.reply({ephemeral: true, content: `${emojis.err} | Eu não posso expulsar a mim mesma!`})
        
        const membro = interaction.guild.members.cache.get(usuario.id);
        const motivo = interaction.options.getString('motivo') || 'Indefinido';
    
        const embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle(`✅ | O usuário ${usuario.username} foi expulso com sucesso!`)
        .setDescription(`> Motivo: \`${motivo}\``)
        .setFooter({text: `🕒 | ${pegarDataNow()}`})

        membro.kick(motivo).then(() => {
            interaction.reply({embeds: [embed]});
        }).catch(error => {
            interaction.reply({embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setTitle('❌ | Não foi possível expulsar o membro!')
                .setDescription('> Por favor, tente novamente.')
            ]})
        })

    }
}