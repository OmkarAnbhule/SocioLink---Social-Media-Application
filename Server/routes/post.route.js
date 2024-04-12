const multer = require('multer');
const postController = require('../controllers/post.controller');
const { router } = require('websocket');
const app = require('express').Router()
const storagePost = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "../src/posts/");
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = guid();
		cb(null, uniqueSuffix + file.originalname)
	}
})

const uploadPost = multer({ storage: storagePost })

app.post('/createPost', uploadPost.array('files'),postController.createPost);
app.post('/get-posts',postController.getAllPost);
app.post('/follow',postController.follow);

module.exports = app