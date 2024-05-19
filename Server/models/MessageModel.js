const mongoose = require('mongoose');

const Message = new mongoose.Schema({
    sender: {
        type: String,
    },
    receiver: {
        type: String,
    },
    message: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Message', Message);