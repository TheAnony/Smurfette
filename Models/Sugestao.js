const { Schema, model } = require('mongoose');
const { randomUUID } = require('crypto')

const sugestaoSchema = new Schema({
    sugestaoId: {
        type: String,
        default: randomUUID
    },

    authorId: {
        type: String,
        required: true
    },

    guildId: {
        type: String,
        required: true
    },

    messageId: {
        type: String,
        required: true,
        unique: true
    },

    content: {
        type: String,
        required: true
    },

    status: {
        type: String,
        // "pendente", "aprovado", "rejeitado"
        default: 'pendente'
    },

    upvotes: {
        type: [String],
        default: []
    },

    downvotes: {
        type: [String],
        default: []
    }
}, { timestamps: true })

module.exports = model('Sugestao', sugestaoSchema);