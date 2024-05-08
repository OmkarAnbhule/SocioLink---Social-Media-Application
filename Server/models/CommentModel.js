const mongoose = require('mongoose');

const comments = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: true
    },
    isReply: {
        type: Boolean,
        default: false
    },
    replyCount: {
        type: Number,
        default: 0
    },
    likeCount: {
        type: Number,
        default: 0
    },
    likedUsers:[{
        type:String,
    }],
    Replies: [this],
    timestamp: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Comment', comments);