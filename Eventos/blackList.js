require('../index')
const { EmbedBuilder } = require('discord.js')
const client = require('../index')
const { QuickDB } = require('quick.db')
const db = new QuickDB();

/*
const blockedUsers = ['id1', 'id2']
client.on('interactionCreate', (interaction) => {
    if (blockedUsers.includes(interaction.user.id)) return;
})
*/