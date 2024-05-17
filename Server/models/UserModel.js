const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	name: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	image: {
		type: String,
	},
	followers: [{
		type: String
	}],
	following: [{
		type: String
	}],
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('User', UserSchema);