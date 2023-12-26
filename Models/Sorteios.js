const { Schema, model } = require('mongoose');

let sorteiosSchema = new Schema({
    guildId: {
        type: String,
        require: true
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
        sparse: true,
    },

    ganhadoresNoClaim: {
        type: [String],
        default: [],
        sparse: true,
    },

    authorId: {
        type: String,
    },

    messageId: {
        type: String,
        unique: true,
    },

    hostId: String,

    premio: String,

    quantiaDeGanhadores: String,

    sorteioCancelado: {
        type: Boolean,
        default: false
    }
});

module.exports = model("Sorteios", sorteiosSchema)