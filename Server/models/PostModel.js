const mongoose = require('mongoose');

const posts = new mongoose.Schema({
	id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref:'User'
	},
	caption: {
		type: String,
	},
	files: {
		type: mongoose.Schema.Types.Mixed,
	},
	filters: {
		type: mongoose.Schema.Types.Mixed,
	},
	location: {
		type: String,
	},
	tags: {
		type: String,
	},
	likeCount: {
		type: Number,
		default: 0
	},
	likedUsers: [{
		type: String,

	}],
	comments: {
		type: mongoose.Schema.Types.Mixed,
	},
	date: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Posts', posts);