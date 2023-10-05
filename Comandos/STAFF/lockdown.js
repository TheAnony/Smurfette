const { EmbedBuilder, ApplicationCommandType, PermissionFlagsBits, ChannelType } = require("discord.js")
const emojis = require('../../emojis.json')
const { QuickDB } = require('quick.db')
const db = new QuickDB();
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: "lockdown", // Coloque o nome do comando
    description: "『 STAFF 』Bloqueia todos os canais", // Coloque a descrição do comando
    type: ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ ephemeral: true, content: `${emojis.err} | Você não tem permissão de utilizar este comando! Permissão necessária: \`Administrador\`.` });

        let stage = await db.get(`lockdownStage`) || await db.set(`lockdownStage`, 'desativado')
        let tiposDeCanais = [ChannelType.GuildText, ChannelType.GuildVoice, ChannelType.PublicThread, ChannelType.PrivateThread, ChannelType.GuildAnnouncement, ChannelType.AnnouncementThread, ChannelType.GuildDirectory, ChannelType.GuildForum, ChannelType.GuildStageVoice]
        let channelTypeForEmoji = {
            0: emojis.textChannel,
            2: emojis.voiceChannel,
            11: emojis.threadChannel,
            12: emojis.threadChannel,
            5: emojis.serverGuideBadge,
            10: emojis.threadChannel,
            14: emojis.rulesBadge,
            12: emojis.forumBadge,
            13: emojis.stageChannel
        }
        let guildas = interaction.guild.channels.cache.filter(canal => tiposDeCanais.includes(canal.type))
        if (stage == 'desativado') {
            let todosOsCanais = ``;
            for (let channel of guildas) {
                const canal = client.channels.cache.get(channel[0])
                todosOsCanais += `[${emojis.barraOff}] ${canal.name} ${channelTypeForEmoji[canal.type]},\n`
            }

            interaction.reply(todosOsCanais).then((msg) => {
                for (const channel of guildas) {
                    const canal = client.channels.cache.get(channel[0])
                    canal.permissionOverwrites.edit(interaction.guild.id, { SendMessages: false }).then(async () => {
                        wait(2000)
                        todosOsCanais = todosOsCanais.replace(`[${emojis.barraOff}] ${canal.name} ${channelTypeForEmoji[canal.type]},\n`, `[${emojis.barraOn}] ${canal.name} ${channelTypeForEmoji[canal.type]},\n`)
                        todosOsCanais = todosOsCanais.replace(`[${emojis.barraOff}] ${canal.name} ${channelTypeForEmoji[canal.type]},\n`, `[${emojis.barraOn}] ${canal.name} ${channelTypeForEmoji[canal.type]},\n`)
                        interaction.editReply(todosOsCanais)
                        await db.set(`canalFechado_${canal.id}`, true)
                    }).catch((err) => {
                        todosOsCanais = todosOsCanais.replace(`[${emojis.barraOff}] ${canal.name} ${channelTypeForEmoji[canal.type]},\n`, `[${emojis.err}] ${canal.name} ${channelTypeForEmoji[canal.type]},\n`)
                        interaction.editReply(todosOsCanais)
                        console.log(err);
                    })
                }
            })
            await db.set(`lockdownStage`, 'ativado')
        } else if (stage == 'ativado') {
            let todosOsCanais = ``;
            for (let channel of guildas) {
                const canal = client.channels.cache.get(channel[0])
                todosOsCanais += `[${emojis.barraOn}] ${canal.name} ${channelTypeForEmoji[canal.type]},\n`
            }

            interaction.reply(todosOsCanais).then((msg) => {
                for (const channel of guildas) {
                    const canal = client.channels.cache.get(channel[0])
                    canal.permissionOverwrites.edit(interaction.guild.id, { SendMessages: true }).then(async () => {
                        wait(2000)
                        todosOsCanais = todosOsCanais.replace(`[${emojis.barraOn}] ${canal.name} ${channelTypeForEmoji[canal.type]},\n`, `[${emojis.barraOff}] ${canal.name} ${channelTypeForEmoji[canal.type]},\n`)
                        todosOsCanais = todosOsCanais.replace(`[${emojis.barraOn}] ${canal.name} ${channelTypeForEmoji[canal.type]},\n`, `[${emojis.barraOff}] ${canal.name} ${channelTypeForEmoji[canal.type]},\n`)
                        interaction.editReply(todosOsCanais)
                        await db.set(`canalFechado_${canal.id}`, false)
                    }).catch((err) => {
                        todosOsCanais = todosOsCanais.replace(`[${emojis.barraOn}] ${canal.name} ${channelTypeForEmoji[canal.type]},\n`, `[${emojis.err}] ${canal.name} ${channelTypeForEmoji[canal.type]},\n`)
                        interaction.editReply(todosOsCanais)
                        console.log(err);
                    })
                }
            })
            await db.set(`lockdownStage`, 'desativado')
        }
    }
}