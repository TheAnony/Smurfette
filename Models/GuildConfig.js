const { Schema, model } = require('mongoose');

const guildConfigSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },

    canaisDeSugestoesIDs: {
        type: String,
        default: null
    },

    canalModLogsId: {
        type: String,
        default: null
    },

    canalDeSorteioID: {
        type: String,
        default: null
    },

    canalDePeticoes: {
        type: String,
        default: null
    },

    canalDeAvaliarStaff: {
        type: String,
        default: null
    },

    roleStaff: {
        type: String,
        default: null
    },

    chatGeral: {
        type: String,
        default: null
    }
});

module.exports = model('GuildConfig', guildConfigSchema);