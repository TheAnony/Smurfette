require('../index')
const client = require('../index')
const fs = require("fs")
const pasta = require('../Comandos')

async function reloadSlash(name) {
    const command = client.slashCommands.get(name);
    if(!command) return new Error(`O Comando \`${name}\` não existe!`);
    delete require.cache[require.resolve(`../Comandos/${command.ca}`)]
}

module.exports = { reloadSlash }