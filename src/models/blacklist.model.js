const monogoose = require('mongoose');

const blacklistTokenSchema = new monogoose.Schema({
    token: {
        type: String,
        required: [true,"token is required to be added in blacklist"],
    }
},

{
    timestamps: true

})

const tokenBlacklistModel = monogoose.model('blacklistTokens', blacklistTokenSchema);

module.exports = tokenBlacklistModel;