const { Schema, model } = require('mongoose');

let sorteiosSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },

    sorteioId: String,

    tempoSorteio: {
        type: Number,
        default: null
    },

    tempoSorteioDefault: {
        type: Number,
        default: null
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