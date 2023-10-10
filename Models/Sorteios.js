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
        type: Number,
        default: null
    },

    tempoClaimDefault: {
        type: Number,
        default: null
    },

    ganhadores: {
        type: [String],
        default: [],
        unique: true
    },

    ganhadoresNoClaim: {
        type: [String],
        default: [],
        unique: true
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