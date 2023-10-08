const { Schema, model } = require('mongoose');

const guildConfigSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },

    canaisDeSugestoesIDs: {
        type: [String],
        default: []
    }
});

module.exports = model('GuildConfig', guildConfigSchema);