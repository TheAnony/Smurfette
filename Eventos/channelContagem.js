require('../index')

const client = require('../index')
const { QuickDB } = require('quick.db')
const db = new QuickDB()

client.on('messageCreate', async(message) => {
    if (message.author.bot) return;
    let canal = await db.get(`channelCountId`)
    if(!canal) return;
    let numberCount = await db.get(`numberCount_${message.channel.id}`) 
    if (!numberCount) numberCount = 0

    let content = parseInt(message.content.trim())

    if (isNaN(content)) return message.reply({ content: '❌ | Isso não é um número!' }).then(msg => {
        setTimeout( () => {
            msg.delete()
            message.delete()
        }, 5000)
    })

    if (content !== numberCount + 1) return message.reply({ content: `❌ | O número correto é \`${numberCount + 1}\`!` }).then(msg => {
        setTimeout( () => {
            msg.delete()
            message.delete()
        }, 5000)
    })

    await db.set(`numberCount_${message.channel.id}`, content)
    message.react('✅')
})