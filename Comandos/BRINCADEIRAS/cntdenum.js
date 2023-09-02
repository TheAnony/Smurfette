const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ChannelType } = require("discord.js")
const { QuickDB } = require('quick.db')
const db = new QuickDB();

module.exports = {
    name: "contagem", // Coloque o nome do comando
    description: "『 BRINCADEIRAS 』Inicia a brincadeira de contar.", // Coloque a descrição do comando
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'canal',
            description: `Configura o canal onde iniciará a contagem.`,
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
    ],

    run: async (client, interaction) => {
        let cargos = await db.get(`ArrayCargos.roles`)
        let valoresGerados = [];
        for (let index = 0; index < cargos.length; index++) {
            const element = cargos[index]
            valoresGerados.push(element)
        }
        if (!interaction.member.roles.cache.some(role => valoresGerados.includes(role.id))) return interaction.reply('**VOCÊ NÃO TEM A PERMROLE PARA UTILIZAR ESSE COMANDO!**');

        let channelCount = await db.get(`channelCount`);
        let canal = interaction.options.getChannel('canal')
        if (channelCount === canal.id) return interaction.reply({ content: `**❌ | Ei, esse canal já foi configurado como o canal de contagem!**` }).then((msg) => {
            setTimeout(() => {
                msg.delete();
            }, 10_000);
        })
        if (canal.type !== ChannelType.GuildText || !canal) return interaction.reply({ content: `**❌ | CANAL DE TEXTO INVÁLIDO!**`, ephemeral: true }).then((msg) => {
            setTimeout(() => {
                msg.delete();
            }, 10_000);
        })

        await db.set(`channelCount`, canal.id)
        interaction.reply(`✅ | O canal ${canal} foi configurado com sucesso!`).catch((err) => {
            interaction.reply(`❌ | Ocorreu um erro ao configurar o canal!`)
        });
    }
}