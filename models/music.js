const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    createDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    youtubeEmbedId: {
        type: String,
        unique: true,
        required: true
    },
    instagramId: {
        type: Number,
        unique: true,
        required: true
    }
});

module.exports = mongoose.model('Music', musicSchema);