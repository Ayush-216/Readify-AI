const mongoose = require('mongoose');

// A single snapshot can be replaced atomically, even while readers are active.
const newsSchema = new mongoose.Schema({
    _id: String,
    articles: { type: [mongoose.Schema.Types.Mixed], default: [] },
    lastUpdated: Date,
    lockUntil: Date,
    lockOwner: String,
}, { versionKey: false });

module.exports = mongoose.model('NewsSnapshot', newsSchema);
