const { Schema, model } = require('mongoose');
const { randomUUID } = require('crypto')

let sorteiosSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },
    
    sorteioId: {
        type: String,
        default: randomUUID
    },

    tempoSorteio: {
        type: String,
        default: String || null
    },

    tempoClaim: {
        type: String,
        default: String || null
    },

    ganhadores: {
        type: [String],
        default: []
    },
    authorId: {
        type: String,
    },

    messageId: {
        type: String,
        unique: true,
        required: false
    },
});

module.exports = model("Sorteios", sorteiosSchema)