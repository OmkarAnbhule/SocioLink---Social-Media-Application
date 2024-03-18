const mongoose = require('mongoose');

const posts = new mongoose.Schema({
	id: {
		type: String,
		required: true,
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
	likes: {
		type:mongoose.Schema.Types.Mixed,
	},
	comments:{
		type:mongoose.Schema.Types.Mixed,
	},
	date: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Posts',posts);