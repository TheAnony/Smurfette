const { Schema, model } = require('mongoose');
const { randomUUID } = require('crypto')

let petitionSchema = new Schema({
    petitionId: {
        type: String,
        default: randomUUID
    },

    GuildID: String,
    title: String,
    signatures: Number,
    goal: Number,
    signedUsers: [String],
    authorId: String,
    progressMessageId: String,
    description: String
});

module.exports = model("Petition", petitionSchema)