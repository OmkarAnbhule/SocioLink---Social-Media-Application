const mongoose = require('mongoose');

const logUsers = new mongoose.Schema({
	log_id: {
		type: mongoose.Types.ObjectId,
		required: true,
		unique: true,
	},
	date: {
		type: Date,
		default: Date.now,
	}
});

module.exports = mongoose.model('Login', logUsers);