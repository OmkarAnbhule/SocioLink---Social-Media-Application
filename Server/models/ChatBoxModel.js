const mongoose = require('mongoose');


const ChatSchema = new mongoose.Schema({
    User1: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    User2: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: [{
        type: mongoose.Types.ObjectId,
        ref: 'Message'
    }],
    isSenderRead: {
        type: Boolean,
        default: false
    },
    isReceiverRead: {
        type: Boolean,
        default: false
    },
    recent: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('chat', ChatSchema)